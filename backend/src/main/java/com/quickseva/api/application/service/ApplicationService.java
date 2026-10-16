package com.quickseva.api.application.service;

import com.quickseva.api.application.dto.request.CreateApplicationRequest;
import com.quickseva.api.application.dto.request.StatusUpdateRequest;
import com.quickseva.api.application.dto.response.ApplicationResponse;
import com.quickseva.api.application.dto.response.HistoryItem;
import com.quickseva.api.application.dto.response.TimelineItem;
import com.quickseva.api.application.entity.ApplicationStatusEvent;
import com.quickseva.api.application.entity.ServiceApplication;
import com.quickseva.api.application.repository.ApplicationStatusEventRepository;
import com.quickseva.api.application.repository.ServiceApplicationRepository;
import com.quickseva.api.catalog.dto.response.ServiceOffering;
import com.quickseva.api.catalog.service.ServiceCatalogService;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ApplicationService {
    private static final List<StatusStep> PIPELINE = List.of(
            new StatusStep("submitted", "Submitted", "Application received. You can follow its progress here."),
            new StatusStep("under_review", "Under Review", "The demo service team is reviewing the application."),
            new StatusStep("verification", "Verification", "A demo verification step is in progress."),
            new StatusStep("govt_processing", "Govt Processing", "Illustrative status only; no government portal is connected."),
            new StatusStep("dispatched", "Dispatched", "Illustrative dispatch update."),
            new StatusStep("completed", "Completed", "The demo application flow is complete."));
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("MMM d, h:mm a", Locale.ENGLISH)
            .withZone(ZoneId.systemDefault());

    private final ServiceCatalogService catalog;
    private final ServiceApplicationRepository applications;
    private final ApplicationStatusEventRepository events;

    public ApplicationService(ServiceCatalogService catalog, ServiceApplicationRepository applications,
                              ApplicationStatusEventRepository events) {
        this.catalog = catalog;
        this.applications = applications;
        this.events = events;
    }

    public List<ApplicationResponse> myApplications(String ownerPhone) {
        return responses(applications.findByOwnerPhoneOrderByCreatedAtDesc(ownerPhone));
    }

    @Transactional
    public ApplicationResponse create(CreateApplicationRequest request, String ownerPhone) {
        ServiceOffering service = catalog.findById(request.serviceId());
        Instant now = Instant.now();
        String id = "SVO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
        String status = request.submit() ? "submitted" : "draft";
        Instant submittedAt = request.submit() ? now : null;
        // Request details are intentionally discarded: this demo must not retain identity data.
        ServiceApplication application = new ServiceApplication(id, ownerPhone, service.id(), service.name(), status,
                "Demo Applicant", null, service.govtFee() + service.platFee() + service.gst(), now, submittedAt);
        applications.save(application);
        events.save(new ApplicationStatusEvent(id, status, request.submit() ? "Submitted" : "Draft saved",
                request.submit() ? "Application received in this demo." : "Draft saved in this demo.", "DEMO_USER", now));
        return response(application);
    }

    @Transactional
    public ApplicationResponse submitDraft(String id, String ownerPhone) {
        ServiceApplication application = findOwnedForUpdate(id, ownerPhone);
        if (!"draft".equals(application.getStatus())) {
            throw conflict("Only a draft can be submitted.");
        }

        Instant now = Instant.now();
        application.updateStatus("submitted", now);
        application.markSubmitted(now);
        applications.save(application);
        events.save(new ApplicationStatusEvent(id, "submitted", "Submitted", PIPELINE.getFirst().description(), "DEMO_USER", now));
        return response(application);
    }

    public ApplicationResponse application(String id, String ownerPhone) {
        return response(findOwned(id, ownerPhone));
    }

    public List<TimelineItem> timeline(String id, String ownerPhone) {
        return application(id, ownerPhone).tracking();
    }

    public List<HistoryItem> history(String id, String ownerPhone) {
        ServiceApplication application = findOwned(id, ownerPhone);
        return events.findByApplicationIdOrderByOccurredAtAsc(application.getId()).stream()
                .map(event -> new HistoryItem(event.getStatus(), event.getLabel(), event.getDescription(), event.getOccurredAt()))
                .toList();
    }

    public List<ApplicationResponse> workerQueue(String status) {
        if (status != null && !knownStatus(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown demo application status.");
        }
        List<ServiceApplication> queue = applications.findAll().stream()
                .filter(application -> status == null ? !"draft".equals(application.getStatus())
                        : application.getStatus().equalsIgnoreCase(status))
                .sorted((first, second) -> second.getCreatedAt().compareTo(first.getCreatedAt()))
                .toList();
        return responses(queue);
    }

    @Transactional
    public ApplicationResponse updateStatus(String id, StatusUpdateRequest request) {
        String status = request.status().toLowerCase(Locale.ROOT);
        ServiceApplication application = applications.findByIdForUpdate(id).orElseThrow(this::notFound);
        int current = indexOf(application.getStatus());
        int next = indexOf(status);
        if (next < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown demo application status.");
        }
        if (current < 0) {
            throw conflict("Draft applications must be submitted by their owner first.");
        }
        if (next != current + 1) {
            throw conflict("Status must advance one step at a time.");
        }

        Instant now = Instant.now();
        application.updateStatus(status, now);
        applications.save(application);
        StatusStep step = PIPELINE.get(next);
        // Fixed copy ensures free-text status notes are not retained.
        events.save(new ApplicationStatusEvent(id, status, step.label(), step.description(), "DEMO_WORKER", now));
        return response(application);
    }

    private ServiceApplication findOwnedForUpdate(String id, String ownerPhone) {
        ServiceApplication application = applications.findByIdForUpdate(id).orElseThrow(this::notFound);
        if (!application.getOwnerPhone().equals(ownerPhone)) {
            throw notFound();
        }
        return application;
    }

    private ServiceApplication findOwned(String id, String ownerPhone) {
        ServiceApplication application = applications.findById(id).orElseThrow(this::notFound);
        if (!application.getOwnerPhone().equals(ownerPhone)) {
            throw notFound();
        }
        return application;
    }

    private ResponseStatusException notFound() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found.");
    }

    private ResponseStatusException conflict(String message) {
        return new ResponseStatusException(HttpStatus.CONFLICT, message);
    }

    private int indexOf(String status) {
        for (int index = 0; index < PIPELINE.size(); index++) {
            if (PIPELINE.get(index).status().equals(status)) {
                return index;
            }
        }
        return -1;
    }

    private boolean knownStatus(String status) {
        return indexOf(status.toLowerCase(Locale.ROOT)) >= 0 || "draft".equalsIgnoreCase(status);
    }

    private ApplicationResponse response(ServiceApplication application) {
        ServiceOffering service = catalog.findById(application.getServiceId());
        List<ApplicationStatusEvent> history = events.findByApplicationIdOrderByOccurredAtAsc(application.getId());
        return response(application, service, history);
    }

    private List<ApplicationResponse> responses(List<ServiceApplication> applicationList) {
        if (applicationList.isEmpty()) {
            return List.of();
        }

        List<String> applicationIds = applicationList.stream().map(ServiceApplication::getId).toList();
        Map<String, List<ApplicationStatusEvent>> historyByApplication = new HashMap<>();
        events.findByApplicationIdInOrderByOccurredAtAsc(applicationIds)
                .forEach(event -> historyByApplication.computeIfAbsent(event.getApplicationId(), ignored -> new ArrayList<>())
                        .add(event));
        return applicationList.stream()
                .map(application -> response(application, catalog.findById(application.getServiceId()),
                        historyByApplication.getOrDefault(application.getId(), List.of())))
                .toList();
    }

    private ApplicationResponse response(ServiceApplication application, ServiceOffering service,
                                         List<ApplicationStatusEvent> history) {
        Map<String, ApplicationStatusEvent> eventsByStatus = new LinkedHashMap<>();
        history.forEach(event -> eventsByStatus.put(event.getStatus(), event));
        int activeIndex = indexOf(application.getStatus());
        List<TimelineItem> tracking = new ArrayList<>();
        for (int index = 0; index < PIPELINE.size(); index++) {
            StatusStep step = PIPELINE.get(index);
            ApplicationStatusEvent event = eventsByStatus.get(step.status());
            boolean done = event != null && index < activeIndex;
            boolean active = event != null && index == activeIndex;
            String date = event == null ? "Expected update" : DATE.format(event.getOccurredAt());
            String description = event == null ? step.description() : event.getDescription();
            tracking.add(new TimelineItem(step.label(), description, date, done, active));
        }
        Instant sla = application.getSubmittedAt() == null
                ? null
                : application.getSubmittedAt().plusSeconds(30L * 24 * 3600);
        return new ApplicationResponse(application.getId(), service.id(), service.name(), service.emoji(),
                application.getStatus(), application.getApplicantName(), application.getTotalFee(),
                application.getCreatedAt(), application.getSubmittedAt(), sla, tracking);
    }

    private record StatusStep(String status, String label, String description) {}
}
