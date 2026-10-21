package com.sporthub.repository;

import com.sporthub.entity.CourtSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourtScheduleRepository
        extends JpaRepository<CourtSchedule, Long> {

    List<CourtSchedule> findByCourtIdOrderByDayOfWeek(Long courtId);

    Optional<CourtSchedule> findByCourtIdAndDayOfWeek(
            Long courtId, Integer dayOfWeek);

    void deleteByCourtId(Long courtId);
}
