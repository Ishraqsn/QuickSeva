package com.quickseva.api.auth.dto.response;

import java.util.Map;

public record DemoLoginResponse(String token, String tokenType, Map<String, String> user) {}
