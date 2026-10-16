package com.quickseva.api.catalog.dto.response;

import java.util.List;

public record ServiceOffering(
        String id, String name, String cat, String emoji, String dept,
        int govtFee, int platFee, int gst, String days, boolean popular,
        boolean tatkal, List<String> docs, String eligibility, List<String> steps) {}
