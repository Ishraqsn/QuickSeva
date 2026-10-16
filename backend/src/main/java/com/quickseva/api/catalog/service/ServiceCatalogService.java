package com.quickseva.api.catalog.service;

import com.quickseva.api.catalog.dto.response.ServiceOffering;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ServiceCatalogService {
    private final List<ServiceOffering> services = List.of(
            new ServiceOffering("passport-fresh", "Passport Application", "Identity", "🛂", "Ministry of External Affairs", 1500, 299, 54, "25–30 days", true, true, List.of("Aadhaar Card (Front & Back)", "Birth Certificate", "Address Proof", "Passport-size Photo", "Educational Certificate"), "Indian citizen aged 18+. Valid Aadhaar required.", List.of("Fill online application", "Prepare documents", "Review application", "Follow official submission steps", "Track progress")),
            new ServiceOffering("pan-card", "PAN Card", "Identity", "🔖", "NSDL / Income Tax Dept", 107, 149, 27, "7–10 days", true, false, List.of("Aadhaar Card", "Passport Photo", "Signature"), "Any Indian resident. No age restriction. One PAN per person.", List.of("Fill application", "Prepare Aadhaar", "Review details", "Follow official submission steps", "Track progress")),
            new ServiceOffering("income-certificate", "Income Certificate", "Certificates", "💰", "State Revenue Dept", 30, 199, 36, "5–7 days", true, false, List.of("Aadhaar Card", "Income proof", "Ration Card", "Self-declaration"), "Any resident with income. Validity depends on the issuing state.", List.of("Fill income details", "Prepare income proof", "Review application", "Follow official submission steps", "Track progress")),
            new ServiceOffering("gst-registration", "GST Registration", "Business", "🧾", "GSTN / CBIC", 0, 999, 180, "3–7 days", true, false, List.of("PAN Card", "Aadhaar Card", "Business Address Proof", "Bank Statement", "Cancelled Cheque"), "Businesses should confirm eligibility through official guidance.", List.of("Prepare business details", "Prepare documents", "Review application", "Follow official submission steps", "Track progress")),
            new ServiceOffering("voter-id", "Voter ID (EPIC)", "Identity", "🗳️", "Election Commission of India", 0, 149, 27, "15–30 days", false, false, List.of("Aadhaar Card", "Age Proof", "Residence Proof", "Passport Photo"), "Indian citizen aged 18+ residing in the constituency.", List.of("Prepare applicant details", "Prepare proofs", "Review application", "Follow official submission steps", "Track progress")),
            new ServiceOffering("birth-certificate", "Birth Certificate", "Certificates", "👶", "Municipal Corporation", 50, 149, 27, "5–7 days", false, false, List.of("Hospital Discharge Summary", "Parents' Aadhaar", "Marriage Certificate"), "Requirements depend on the local registrar.", List.of("Prepare birth details", "Prepare supporting proof", "Review application", "Follow official submission steps", "Track progress")),
            new ServiceOffering("driving-licence", "Driving Licence", "Identity", "🚗", "Parivahan / State RTO", 400, 249, 45, "21–30 days", false, false, List.of("Aadhaar Card", "Learner's Licence", "Passport Photo", "Medical Certificate"), "Eligibility and test requirements depend on licence type and state.", List.of("Check eligibility", "Prepare application", "Review application", "Follow official submission steps", "Track progress")),
            new ServiceOffering("itr-filing", "ITR Filing", "Tax", "📊", "Income Tax Department", 0, 499, 90, "Varies", true, false, List.of("PAN Card", "Aadhaar", "Form 16", "Bank Statements"), "Filing requirements depend on the person's income and circumstances.", List.of("Collect income details", "Prepare documents", "Review draft", "Follow official submission steps", "Track progress"))
    );

    public List<ServiceOffering> findAll() { return services; }

    public ServiceOffering findById(String id) {
        return services.stream().filter(service -> service.id().equals(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found."));
    }
}
