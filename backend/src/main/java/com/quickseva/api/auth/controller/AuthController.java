package com.quickseva.api.auth.controller;

import com.quickseva.api.auth.dto.request.DemoLoginRequest;
import com.quickseva.api.auth.dto.response.DemoLoginResponse;
import com.quickseva.api.auth.dto.response.DemoUserResponse;
import com.quickseva.api.auth.service.DemoAuthService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final DemoAuthService demoAuthService;

    public AuthController(DemoAuthService demoAuthService) {
        this.demoAuthService = demoAuthService;
    }

    @PostMapping("/demo-login")
    public DemoLoginResponse login(@Valid @RequestBody DemoLoginRequest request) {
        return demoAuthService.login(request);
    }

    @GetMapping("/me")
    public DemoUserResponse me(Authentication authentication) {
        String role = authentication.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        return demoAuthService.currentUser(authentication.getName(), role);
    }
}
