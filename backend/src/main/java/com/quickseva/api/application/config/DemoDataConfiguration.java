package com.quickseva.api.application.config;

import com.quickseva.api.application.entity.ApplicationStatusEvent;
import com.quickseva.api.application.entity.ServiceApplication;
import com.quickseva.api.application.repository.ApplicationStatusEventRepository;
import com.quickseva.api.application.repository.ServiceApplicationRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DemoDataConfiguration {
    @Bean
    CommandLineRunner seedDemoApplication(ServiceApplicationRepository applications,
                                          ApplicationStatusEventRepository events) {
        return args -> {
            String id = "SVO-DEMO-001";
            if (applications.existsById(id)) return;

            Instant submitted = Instant.now().minus(2, ChronoUnit.DAYS);
            ServiceApplication sample = new ServiceApplication(
                    id, "5551234567", "passport-fresh", "Passport Application", "verification",
                    "Demo Applicant", null, 1853,
                    submitted, submitted);
            applications.save(sample);
            events.save(new ApplicationStatusEvent(id, "submitted", "Submitted",
                    "Sample request created for the QuickSeva walkthrough.", "5550000001", submitted));
            events.save(new ApplicationStatusEvent(id, "under_review", "Under Review",
                    "A demo worker reviewed the sample request.", "5550000001", submitted.plus(1, ChronoUnit.DAYS)));
            events.save(new ApplicationStatusEvent(id, "verification", "Verification",
                    "Illustrative status only; no identity or government verification occurred.", "5550000001", submitted.plus(2, ChronoUnit.DAYS)));
        };
    }
}
