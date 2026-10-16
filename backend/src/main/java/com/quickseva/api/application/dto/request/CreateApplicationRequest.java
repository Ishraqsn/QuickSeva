package com.quickseva.api.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Map;

public record CreateApplicationRequest(
        @NotBlank @Size(max = 64) String serviceId,
        @NotBlank @Size(max = 120) String applicantName,
        @Size(max = 30) Map<@Size(max = 60) String, @Size(max = 500) String> formData,
        boolean submit) {}
