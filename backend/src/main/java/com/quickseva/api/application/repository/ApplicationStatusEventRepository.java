package com.quickseva.api.application.repository;

import com.quickseva.api.application.entity.ApplicationStatusEvent;
import java.util.List;
import java.util.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationStatusEventRepository extends JpaRepository<ApplicationStatusEvent, Long> {
    List<ApplicationStatusEvent> findByApplicationIdOrderByOccurredAtAsc(String applicationId);

    List<ApplicationStatusEvent> findByApplicationIdInOrderByOccurredAtAsc(Collection<String> applicationIds);
}
