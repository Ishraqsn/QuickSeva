package com.quickseva.api.auth.service;

import com.quickseva.api.auth.dto.request.DemoLoginRequest;
import com.quickseva.api.auth.dto.response.DemoLoginResponse;
import com.quickseva.api.auth.dto.response.DemoUserResponse;
import com.quickseva.api.config.QuickSevaDemoProperties;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DemoAuthService {
    private final DemoTokenService tokens;
    private final QuickSevaDemoProperties demoProperties;

    public DemoAuthService(DemoTokenService tokens, QuickSevaDemoProperties demoProperties) {
        this.tokens = tokens;
        this.demoProperties = demoProperties;
    }

    public DemoLoginResponse login(DemoLoginRequest request) {
        if (!demoProperties.otp().equals(request.code())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Use the demo code shown in the app.");
        }
        String role = "WORKER".equalsIgnoreCase(request.role()) ? "WORKER" : "USER";
        if ("WORKER".equals(role) && !demoProperties.workerPhone().equals(request.phone())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Use the configured fictional worker demo account.");
        }
        if ("USER".equals(role) && !demoProperties.userPhone().equals(request.phone())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Use the configured fictional user demo account.");
        }
        String token = tokens.issue(request.phone(), role);
        return new DemoLoginResponse(token, "Bearer", Map.of("phone", request.phone(), "role", role));
    }

    public DemoUserResponse currentUser(String phone, String role) {
        return new DemoUserResponse(phone, role);
    }
}
