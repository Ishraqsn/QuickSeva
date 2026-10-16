package com.quickseva.api.application.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "service_applications")
public class ServiceApplication {
    @Id
    private String id;
    @Column(nullable = false, length = 20)
    private String ownerPhone;
    @Column(nullable = false, length = 64)
    private String serviceId;
    @Column(nullable = false, length = 120)
    private String serviceName;
    @Column(nullable = false, length = 32)
    private String status;
    @Column(nullable = false, length = 120)
    private String applicantName;
    @Column(length = 12000)
    private String formDataJson;
    private Integer totalFee;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant submittedAt;

    protected ServiceApplication() {}

    public ServiceApplication(String id, String ownerPhone, String serviceId, String serviceName,
                              String status, String applicantName, String formDataJson, Integer totalFee,
                              Instant now, Instant submittedAt) {
        this.id = id; this.ownerPhone = ownerPhone; this.serviceId = serviceId; this.serviceName = serviceName;
        this.status = status; this.applicantName = applicantName; this.formDataJson = formDataJson;
        this.totalFee = totalFee; this.createdAt = now; this.updatedAt = now; this.submittedAt = submittedAt;
    }

    public void updateStatus(String status, Instant at) { this.status = status; this.updatedAt = at; }
    public void markSubmitted(Instant at) { if (this.submittedAt == null) this.submittedAt = at; }
    public String getId() { return id; }
    public String getOwnerPhone() { return ownerPhone; }
    public String getServiceId() { return serviceId; }
    public String getServiceName() { return serviceName; }
    public String getStatus() { return status; }
    public String getApplicantName() { return applicantName; }
    public String getFormDataJson() { return formDataJson; }
    public Integer getTotalFee() { return totalFee; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public Instant getSubmittedAt() { return submittedAt; }
}
