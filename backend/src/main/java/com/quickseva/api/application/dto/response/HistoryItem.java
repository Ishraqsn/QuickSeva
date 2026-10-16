package com.quickseva.api.application.dto.response;

import java.time.Instant;

public record HistoryItem(String status, String label, String description, Instant occurredAt) {}
