package com.sporthub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@AllArgsConstructor
public class CourtPriceResponse {

    private Long id;
    private Long courtId;
    private Long timeSlotId;
    private LocalTime slotStartTime;
    private LocalTime slotEndTime;
    private Integer dayOfWeek;
    private BigDecimal price;
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
