package com.quickseva.api.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record DemoLoginRequest(
        @NotBlank @Pattern(regexp = "^[0-9]{10}$", message = "Enter a 10-digit demo mobile number") String phone,
        @NotBlank @Pattern(regexp = "^[0-9]{6}$", message = "Enter the 6-digit demo code") String code,
        @NotBlank @Pattern(regexp = "^(USER|WORKER)$", flags = Pattern.Flag.CASE_INSENSITIVE,
                message = "Role must be USER or WORKER") @Size(max = 6) String role) {}
