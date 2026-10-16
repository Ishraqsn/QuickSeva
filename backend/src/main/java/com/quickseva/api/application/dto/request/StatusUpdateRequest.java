package com.quickseva.api.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record StatusUpdateRequest(
        @NotBlank @Pattern(regexp = "^[a-zA-Z_]{3,32}$") String status,
        @Size(max = 240) String description) {}
