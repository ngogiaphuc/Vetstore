package com.sporthub.service;

import com.sporthub.dto.response.AvailableSlotResponse;
import com.sporthub.entity.CourtPrice;
import com.sporthub.entity.CourtSchedule;
import com.sporthub.entity.TimeSlot;
import com.sporthub.exception.ResourceNotFoundException;
import com.sporthub.repository.CourtPriceRepository;
import com.sporthub.repository.CourtRepository;
import com.sporthub.repository.CourtScheduleRepository;
import com.sporthub.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final CourtRepository courtRepository;
    private final CourtScheduleRepository scheduleRepository;
    private final CourtPriceRepository priceRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Transactional(readOnly = true)
    public List<AvailableSlotResponse> getAvailableSlots(
            Long courtId, Integer dayOfWeek) {

        if (!courtRepository.existsById(courtId)) {
            throw new ResourceNotFoundException(
                    "Không tìm thấy court có id = " + courtId
            );
        }

        Optional<CourtSchedule> scheduleOpt =
                scheduleRepository.findByCourtIdAndDayOfWeek(
                        courtId, dayOfWeek);

        if (scheduleOpt.isEmpty() || !scheduleOpt.get().getIsActive()) {
            return List.of();
        }

        CourtSchedule schedule = scheduleOpt.get();

        List<TimeSlot> allSlots = timeSlotRepository.findAll();

        List<TimeSlot> validSlots = allSlots.stream()
                .filter(slot ->
                        !slot.getStartTime().isBefore(schedule.getOpenTime())
                        && !slot.getEndTime().isAfter(schedule.getCloseTime()))
                .filter(slot -> "ACTIVE".equals(slot.getStatus()))
                .toList();

        List<CourtPrice> prices = priceRepository
                .findByCourtIdOrderByDayOfWeekAscTimeSlotStartTimeAsc(courtId);

        Map<Long, CourtPrice> priceBySlot = prices.stream()
                .filter(p -> p.getDayOfWeek() == null
                        || p.getDayOfWeek().equals(dayOfWeek))
                .collect(Collectors.toMap(
                        p -> p.getTimeSlot().getId(),
                        p -> p,
                        (existing, replacement) ->
                                replacement.getDayOfWeek() != null
                                        ? replacement : existing
                ));

        List<AvailableSlotResponse> result = new ArrayList<>();

        for (TimeSlot slot : validSlots) {

            CourtPrice courtPrice = priceBySlot.get(slot.getId());

            BigDecimal price = courtPrice != null
                    ? courtPrice.getPrice() : null;

            boolean available = courtPrice != null
                    && "ACTIVE".equals(courtPrice.getStatus());

            result.add(new AvailableSlotResponse(
                    slot.getId(),
                    slot.getStartTime(),
                    slot.getEndTime(),
                    price,
                    available
            ));
        }

        return result;
    }
}
