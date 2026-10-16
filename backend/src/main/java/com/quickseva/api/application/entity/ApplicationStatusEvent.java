package com.quickseva.api.application.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "application_status_events")
public class ApplicationStatusEvent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String applicationId;
    private String status;
    private String label;
    private String description;
    private String actorPhone;
    private Instant occurredAt;

    protected ApplicationStatusEvent() {}

    public ApplicationStatusEvent(String applicationId, String status, String label,
                                   String description, String actorPhone, Instant occurredAt) {
        this.applicationId = applicationId; this.status = status; this.label = label;
        this.description = description; this.actorPhone = actorPhone; this.occurredAt = occurredAt;
    }

    public Long getId() { return id; }
    public String getApplicationId() { return applicationId; }
    public String getStatus() { return status; }
    public String getLabel() { return label; }
    public String getDescription() { return description; }
    public String getActorPhone() { return actorPhone; }
    public Instant getOccurredAt() { return occurredAt; }
}
