package com.sporthub.controller;

import com.sporthub.dto.response.AvailableSlotResponse;
import com.sporthub.dto.response.CourtPriceResponse;
import com.sporthub.dto.response.CourtScheduleResponse;
import com.sporthub.dto.response.TimeSlotResponse;
import com.sporthub.entity.TimeSlot;
import com.sporthub.repository.TimeSlotRepository;
import com.sporthub.service.AvailabilityService;
import com.sporthub.service.CourtPriceService;
import com.sporthub.service.CourtScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PublicCourtDataController {

    private final CourtScheduleService scheduleService;
    private final CourtPriceService priceService;
    private final AvailabilityService availabilityService;
    private final TimeSlotRepository timeSlotRepository;

    @GetMapping("/courts/{id}/schedule")
    public ResponseEntity<List<CourtScheduleResponse>> getSchedule(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                scheduleService.getSchedules(id)
        );
    }

    @GetMapping("/courts/{id}/prices")
    public ResponseEntity<List<CourtPriceResponse>> getPrices(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                priceService.getPrices(id)
        );
    }

    @GetMapping("/courts/{id}/availability")
    public ResponseEntity<List<AvailableSlotResponse>> getAvailability(
            @PathVariable Long id,

            @RequestParam
            Integer dayOfWeek) {

        return ResponseEntity.ok(
                availabilityService.getAvailableSlots(id, dayOfWeek)
        );
    }

    @GetMapping("/time-slots")
    public ResponseEntity<List<TimeSlotResponse>> getTimeSlots() {

        List<TimeSlotResponse> slots = timeSlotRepository.findAll()
                .stream()
                .map(this::toTimeSlotResponse)
                .toList();

        return ResponseEntity.ok(slots);
    }

    private TimeSlotResponse toTimeSlotResponse(TimeSlot slot) {

        return new TimeSlotResponse(
                slot.getId(),
                slot.getStartTime(),
                slot.getEndTime(),
                slot.getStatus()
        );
    }
}
