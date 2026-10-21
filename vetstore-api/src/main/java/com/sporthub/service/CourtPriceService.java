package com.sporthub.service;

import com.sporthub.dto.request.CourtPriceRequest;
import com.sporthub.dto.response.CourtPriceResponse;
import com.sporthub.entity.Court;
import com.sporthub.entity.CourtPrice;
import com.sporthub.entity.TimeSlot;
import com.sporthub.exception.ConflictException;
import com.sporthub.exception.ForbiddenException;
import com.sporthub.exception.ResourceNotFoundException;
import com.sporthub.repository.CourtPriceRepository;
import com.sporthub.repository.CourtRepository;
import com.sporthub.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourtPriceService {

    private final CourtPriceRepository priceRepository;
    private final CourtRepository courtRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Transactional(readOnly = true)
    public List<CourtPriceResponse> getPrices(Long courtId) {

        if (!courtRepository.existsById(courtId)) {
            throw new ResourceNotFoundException(
                    "Không tìm thấy court có id = " + courtId
            );
        }

        return priceRepository
                .findByCourtIdOrderByDayOfWeekAscTimeSlotStartTimeAsc(courtId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<CourtPriceResponse> updatePrices(
            Long ownerId, Long courtId,
            List<CourtPriceRequest> requests) {

        Court court = courtRepository.findById(courtId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy court có id = " + courtId
                        )
                );

        if (!court.getVenue().getOwner().getId().equals(ownerId)) {
            throw new ForbiddenException(
                    "Bạn không có quyền cập nhật giá của court này"
            );
        }

        priceRepository.deleteByCourtId(courtId);
        priceRepository.flush();

        List<CourtPrice> prices = requests.stream()
                .map(req -> {

                    TimeSlot timeSlot = timeSlotRepository
                            .findById(req.getTimeSlotId())
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Không tìm thấy time slot có id = "
                                                    + req.getTimeSlotId()
                                    )
                            );

                    CourtPrice price = new CourtPrice();
                    price.setCourt(court);
                    price.setTimeSlot(timeSlot);
                    price.setDayOfWeek(req.getDayOfWeek());
                    price.setPrice(req.getPrice());
                    price.setEffectiveFrom(req.getEffectiveFrom());
                    price.setEffectiveTo(req.getEffectiveTo());

                    return price;
                })
                .toList();

        return priceRepository.saveAll(prices)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private CourtPriceResponse toResponse(CourtPrice p) {

        return new CourtPriceResponse(
                p.getId(),
                p.getCourt().getId(),
                p.getTimeSlot().getId(),
                p.getTimeSlot().getStartTime(),
                p.getTimeSlot().getEndTime(),
                p.getDayOfWeek(),
                p.getPrice(),
                p.getEffectiveFrom(),
                p.getEffectiveTo(),
                p.getStatus(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
