package com.sporthub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalTime;

@Getter
@AllArgsConstructor
public class AvailableSlotResponse {

    private Long timeSlotId;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal price;
    private boolean available;
}
