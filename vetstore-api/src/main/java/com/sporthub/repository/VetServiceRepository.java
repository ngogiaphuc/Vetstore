package com.sporthub.repository;

import com.sporthub.entity.VetService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VetServiceRepository extends JpaRepository<VetService, Long> {
    List<VetService> findByStatus(String status);
    List<VetService> findByCategoryAndStatus(String category, String status);
    List<VetService> findByNameContainingIgnoreCase(String name);
}

