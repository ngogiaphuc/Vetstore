package com.sporthub.repository;

import com.sporthub.entity.Court;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CourtRepository
        extends JpaRepository<Court, Long> {

    @Query("""
            SELECT c FROM Court c
            JOIN FETCH c.venue
            JOIN FETCH c.sport
            WHERE (:keyword IS NULL OR :keyword = ''
                   OR LOWER(c.name) LIKE LOWER(CONCAT('%%', :keyword, '%%'))
                   OR LOWER(c.description) LIKE LOWER(CONCAT('%%', :keyword, '%%')))
            AND (:sportId IS NULL OR c.sport.id = :sportId)
            AND (:venueId IS NULL OR c.venue.id = :venueId)
            AND (:status IS NULL OR c.status = :status)
            """)
    Page<Court> search(
            @Param("keyword") String keyword,
            @Param("sportId") Long sportId,
            @Param("venueId") Long venueId,
            @Param("status") String status,
            Pageable pageable);

    @Query("""
            SELECT c FROM Court c
            JOIN FETCH c.venue
            JOIN FETCH c.sport
            WHERE c.venue.owner.id = :ownerId
            AND (:keyword IS NULL OR :keyword = ''
                 OR LOWER(c.name) LIKE LOWER(CONCAT('%%', :keyword, '%%'))
                 OR LOWER(c.description) LIKE LOWER(CONCAT('%%', :keyword, '%%')))
            AND (:sportId IS NULL OR c.sport.id = :sportId)
            AND (:venueId IS NULL OR c.venue.id = :venueId)
            AND (:status IS NULL OR c.status = :status)
            """)
    Page<Court> searchByOwner(
            @Param("ownerId") Long ownerId,
            @Param("keyword") String keyword,
            @Param("sportId") Long sportId,
            @Param("venueId") Long venueId,
            @Param("status") String status,
            Pageable pageable);
}
