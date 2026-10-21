package com.sporthub.repository;

import com.sporthub.entity.VetReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VetReviewRepository extends JpaRepository<VetReview, Long> {
    List<VetReview> findByServiceId(Long serviceId);
    List<VetReview> findByDoctorId(Long doctorId);
    List<VetReview> findAllByOrderByCreatedAtDesc();
}

