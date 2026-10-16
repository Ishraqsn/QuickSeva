package com.quickseva.api.config;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/** Validated configuration for the fictional demo login and signed session tokens. */
@Validated
@ConfigurationProperties(prefix = "quickseva.demo")
public record QuickSevaDemoProperties(
        @NotBlank @Pattern(regexp = "^[0-9]{6}$") String otp,
        @NotBlank @Size(min = 32, max = 256) String tokenSecret,
        @Min(1) @Max(24) long tokenHours,
        @NotBlank @Pattern(regexp = "^[0-9]{10}$") String workerPhone,
        @NotBlank @Pattern(regexp = "^[0-9]{10}$") String userPhone) {}
