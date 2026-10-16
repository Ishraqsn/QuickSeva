package com.quickseva.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class QuickSevaApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(QuickSevaApiApplication.class, args);
    }
}
