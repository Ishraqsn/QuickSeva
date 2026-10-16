package com.quickseva.api.catalog.controller;

import com.quickseva.api.catalog.dto.response.ServiceOffering;
import com.quickseva.api.catalog.service.ServiceCatalogService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services")
public class ServiceCatalogController {
    private final ServiceCatalogService catalog;

    public ServiceCatalogController(ServiceCatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping
    public List<ServiceOffering> services() {
        return catalog.findAll();
    }
}
