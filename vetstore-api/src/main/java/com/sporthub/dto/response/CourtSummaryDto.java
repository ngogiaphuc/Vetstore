package com.sporthub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CourtSummaryDto {

    private Long id;
    private String name;
    private Long venueId;
    private Long sportId;
}
