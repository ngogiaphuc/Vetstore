package com.sporthub.repository;

import com.sporthub.entity.Venue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VenueRepository
        extends JpaRepository<Venue, Long> {

    Page<Venue> findByOwnerId(Long ownerId, Pageable pageable);

    boolean existsByIdAndOwnerId(Long id, Long ownerId);

    @Query("""
            SELECT v FROM Venue v
            JOIN FETCH v.owner
            WHERE (:keyword IS NULL OR :keyword = ''
                   OR LOWER(v.name) LIKE LOWER(CONCAT('%%', :keyword, '%%'))
                   OR LOWER(v.address) LIKE LOWER(CONCAT('%%', :keyword, '%%')))
            AND (:city IS NULL OR :city = '' OR LOWER(v.city) = LOWER(:city))
            AND (:district IS NULL OR :district = '' OR LOWER(v.district) = LOWER(:district))
            AND (:status IS NULL OR v.status = :status)
            """)
    Page<Venue> search(
            @Param("keyword") String keyword,
            @Param("city") String city,
            @Param("district") String district,
            @Param("status") String status,
            Pageable pageable);
}
