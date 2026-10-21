package com.sporthub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalTime;

@Getter
@AllArgsConstructor
public class TimeSlotResponse {

    private Long id;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
}
