package com.sporthub.repository;

import com.sporthub.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalTime;
import java.util.Optional;

public interface TimeSlotRepository
        extends JpaRepository<TimeSlot, Long> {

    Optional<TimeSlot> findByStartTimeAndEndTime(
            LocalTime startTime, LocalTime endTime);
}
