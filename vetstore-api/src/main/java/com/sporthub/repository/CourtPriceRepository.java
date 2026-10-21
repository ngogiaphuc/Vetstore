package com.sporthub.repository;

import com.sporthub.entity.CourtPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourtPriceRepository
        extends JpaRepository<CourtPrice, Long> {

    List<CourtPrice> findByCourtIdOrderByDayOfWeekAscTimeSlotStartTimeAsc(
            Long courtId);

    Optional<CourtPrice> findByCourtIdAndTimeSlotIdAndDayOfWeek(
            Long courtId, Long timeSlotId, Integer dayOfWeek);

    void deleteByCourtId(Long courtId);
}
