package com.quickseva.api.auth.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import com.quickseva.api.config.QuickSevaDemoProperties;
import org.springframework.stereotype.Service;

@Service
public class DemoTokenService {
    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DECODER = Base64.getUrlDecoder();

    private final QuickSevaDemoProperties demoProperties;

    public DemoTokenService(QuickSevaDemoProperties demoProperties) {
        this.demoProperties = demoProperties;
    }

    public String issue(String phone, String role) {
        long expiresAt = Instant.now().plusSeconds(demoProperties.tokenHours() * 3600).getEpochSecond();
        String payload = phone + "|" + role + "|" + expiresAt;
        return ENCODER.encodeToString(payload.getBytes(StandardCharsets.UTF_8)) + "." + sign(payload);
    }

    public DemoPrincipal verify(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }
        try {
            String[] parts = token.split("\\.", 2);
            if (parts.length != 2) return null;
            String payload = new String(DECODER.decode(parts[0]), StandardCharsets.UTF_8);
            if (!MessageDigest.isEqual(sign(payload).getBytes(StandardCharsets.US_ASCII), parts[1].getBytes(StandardCharsets.US_ASCII))) return null;
            String[] values = payload.split("\\|", 3);
            if (values.length != 3 || Long.parseLong(values[2]) <= Instant.now().getEpochSecond()) return null;
            if (!values[1].equals("USER") && !values[1].equals("WORKER")) return null;
            return new DemoPrincipal(values[0], values[1]);
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }

    private String sign(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(demoProperties.tokenSecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return ENCODER.encodeToString(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("Could not sign the demo session token", exception);
        }
    }

    public record DemoPrincipal(String phone, String role) {}
}
