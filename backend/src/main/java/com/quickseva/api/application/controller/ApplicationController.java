package com.quickseva.api.application.controller;

import com.quickseva.api.application.dto.request.CreateApplicationRequest;
import com.quickseva.api.application.dto.request.StatusUpdateRequest;
import com.quickseva.api.application.dto.response.ApplicationResponse;
import com.quickseva.api.application.dto.response.HistoryItem;
import com.quickseva.api.application.dto.response.TimelineItem;
import com.quickseva.api.application.service.ApplicationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping("/api")
public class ApplicationController {
    private final ApplicationService applications;

    public ApplicationController(ApplicationService applications) {
        this.applications = applications;
    }

    @GetMapping("/applications")
    public List<ApplicationResponse> myApplications(Authentication authentication) {
        return applications.myApplications(authentication.getName());
    }

    @PostMapping("/applications")
    public ApplicationResponse create(@Valid @RequestBody CreateApplicationRequest request,
                                      Authentication authentication) {
        return applications.create(request, authentication.getName());
    }

    @PostMapping("/applications/{id}/submit")
    public ApplicationResponse submitDraft(
            @PathVariable @Pattern(regexp = "^[A-Za-z0-9-]{1,40}$") String id,
            Authentication authentication) {
        return applications.submitDraft(id, authentication.getName());
    }

    @GetMapping("/applications/{id}")
    public ApplicationResponse application(
            @PathVariable @Pattern(regexp = "^[A-Za-z0-9-]{1,40}$") String id,
            Authentication authentication) {
        return applications.application(id, authentication.getName());
    }

    @GetMapping("/applications/{id}/timeline")
    public List<TimelineItem> timeline(
            @PathVariable @Pattern(regexp = "^[A-Za-z0-9-]{1,40}$") String id,
            Authentication authentication) {
        return applications.timeline(id, authentication.getName());
    }

    @GetMapping("/applications/{id}/history")
    public List<HistoryItem> history(
            @PathVariable @Pattern(regexp = "^[A-Za-z0-9-]{1,40}$") String id,
            Authentication authentication) {
        return applications.history(id, authentication.getName());
    }

    @GetMapping("/worker/applications")
    public List<ApplicationResponse> workerQueue(@RequestParam(required = false) String status) {
        return applications.workerQueue(status);
    }

    @PatchMapping("/worker/applications/{id}/status")
    public ApplicationResponse updateStatus(
            @PathVariable @Pattern(regexp = "^[A-Za-z0-9-]{1,40}$") String id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return applications.updateStatus(id, request);
    }
}
