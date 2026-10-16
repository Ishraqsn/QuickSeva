package com.quickseva.api.application.repository;

import com.quickseva.api.application.entity.ServiceApplication;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

public interface ServiceApplicationRepository extends JpaRepository<ServiceApplication, String> {
    List<ServiceApplication> findByOwnerPhoneOrderByCreatedAtDesc(String ownerPhone);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select application from ServiceApplication application where application.id = :id")
    Optional<ServiceApplication> findByIdForUpdate(@Param("id") String id);
}
