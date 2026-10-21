package com.sporthub.seeder;

import com.sporthub.entity.TimeSlot;
import com.sporthub.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component
@Order(3)
@RequiredArgsConstructor
@Slf4j
public class TimeSlotSeeder implements CommandLineRunner {

    private final TimeSlotRepository timeSlotRepository;

    @Override
    public void run(String... args) {

        if (timeSlotRepository.count() > 0) {
            log.info("TimeSlots already seeded, skipping.");
            return;
        }

        log.info("Seeding standard time slots...");

        for (int hour = 6; hour < 23; hour++) {

            TimeSlot slot = new TimeSlot();
            slot.setStartTime(LocalTime.of(hour, 0));
            slot.setEndTime(LocalTime.of(hour + 1, 0));
            slot.setStatus("ACTIVE");

            timeSlotRepository.save(slot);
        }

        log.info("Seeded {} time slots (06:00 - 23:00).",
                timeSlotRepository.count());
    }
}
