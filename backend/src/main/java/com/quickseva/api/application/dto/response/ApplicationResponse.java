package com.quickseva.api.application.dto.response;

import java.time.Instant;
import java.util.List;

public record ApplicationResponse(
        String id,
        String serviceId,
        String serviceName,
        String emoji,
        String status,
        String applicantName,
        Integer totalFee,
        Instant createdAt,
        Instant submittedAt,
        Instant sla,
        List<TimelineItem> tracking) {}
