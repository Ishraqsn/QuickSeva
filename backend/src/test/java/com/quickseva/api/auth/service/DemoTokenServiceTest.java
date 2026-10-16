package com.quickseva.api.auth.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.quickseva.api.config.QuickSevaDemoProperties;
import org.junit.jupiter.api.Test;

class DemoTokenServiceTest {
    private static final QuickSevaDemoProperties DEMO_PROPERTIES = new QuickSevaDemoProperties(
            "123456", "quickseva-test-secret-that-is-long-enough-for-hmac", 12, "5550000001", "5551234567");

    private final DemoTokenService tokenService = new DemoTokenService(DEMO_PROPERTIES);

    @Test
    void verifiesTokenIssuedForDemoPrincipal() {
        String token = tokenService.issue("5551234567", "USER");

        DemoTokenService.DemoPrincipal principal = tokenService.verify(token);

        assertNotNull(principal);
        assertEquals("5551234567", principal.phone());
        assertEquals("USER", principal.role());
    }

    @Test
    void rejectsTamperedToken() {
        String token = tokenService.issue("5551234567", "USER");
        String tamperedToken = token.substring(0, token.length() - 1) + (token.endsWith("A") ? "B" : "A");

        assertNull(tokenService.verify(tamperedToken));
    }

    @Test
    void rejectsMalformedOrBlankToken() {
        assertNull(tokenService.verify("not-a-token"));
        assertNull(tokenService.verify(" "));
        assertNull(tokenService.verify(""));
        assertNull(tokenService.verify(null));
    }
}
