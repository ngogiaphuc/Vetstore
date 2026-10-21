package com.sporthub.service;

import com.sporthub.dto.request.CourtScheduleRequest;
import com.sporthub.dto.response.CourtScheduleResponse;
import com.sporthub.entity.Court;
import com.sporthub.entity.CourtSchedule;
import com.sporthub.exception.ConflictException;
import com.sporthub.exception.ForbiddenException;
import com.sporthub.exception.ResourceNotFoundException;
import com.sporthub.repository.CourtRepository;
import com.sporthub.repository.CourtScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CourtScheduleService {

    private final CourtScheduleRepository scheduleRepository;
    private final CourtRepository courtRepository;

    @Transactional(readOnly = true)
    public List<CourtScheduleResponse> getSchedules(Long courtId) {

        if (!courtRepository.existsById(courtId)) {
            throw new ResourceNotFoundException(
                    "Không tìm thấy court có id = " + courtId
            );
        }

        return scheduleRepository
                .findByCourtIdOrderByDayOfWeek(courtId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<CourtScheduleResponse> updateSchedules(
            Long ownerId, Long courtId,
            List<CourtScheduleRequest> requests) {

        Court court = courtRepository.findById(courtId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy court có id = " + courtId
                        )
                );

        if (!court.getVenue().getOwner().getId().equals(ownerId)) {
            throw new ForbiddenException(
                    "Bạn không có quyền cập nhật schedule của court này"
            );
        }

        Set<Integer> seenDays = new HashSet<>();

        for (CourtScheduleRequest req : requests) {

            if (!req.getOpenTime().isBefore(req.getCloseTime())) {
                throw new ConflictException(
                        "openTime phải nhỏ hơn closeTime (dayOfWeek = "
                                + req.getDayOfWeek() + ")"
                );
            }

            if (!seenDays.add(req.getDayOfWeek())) {
                throw new ConflictException(
                        "dayOfWeek bị trùng: " + req.getDayOfWeek()
                );
            }
        }

        scheduleRepository.deleteByCourtId(courtId);
        scheduleRepository.flush();

        List<CourtSchedule> schedules = requests.stream()
                .map(req -> {
                    CourtSchedule schedule = new CourtSchedule();
                    schedule.setCourt(court);
                    schedule.setDayOfWeek(req.getDayOfWeek());
                    schedule.setOpenTime(req.getOpenTime());
                    schedule.setCloseTime(req.getCloseTime());
                    schedule.setIsActive(
                            req.getIsActive() != null
                                    ? req.getIsActive() : true);
                    return schedule;
                })
                .toList();

        return scheduleRepository.saveAll(schedules)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private CourtScheduleResponse toResponse(CourtSchedule s) {

        return new CourtScheduleResponse(
                s.getId(),
                s.getCourt().getId(),
                s.getDayOfWeek(),
                s.getOpenTime(),
                s.getCloseTime(),
                s.getIsActive(),
                s.getCreatedAt(),
                s.getUpdatedAt()
        );
    }
}
