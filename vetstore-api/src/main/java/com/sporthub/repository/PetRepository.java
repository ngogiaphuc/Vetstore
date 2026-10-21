package com.sporthub.repository;

import com.sporthub.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByOwnerId(Long ownerId);
    List<Pet> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
}

