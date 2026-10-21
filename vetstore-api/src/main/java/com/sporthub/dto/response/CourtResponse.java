package com.sporthub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CourtResponse {

    private Long id;
    private Long venueId;
    private String venueName;
    private Long sportId;
    private String sportName;
    private String name;
    private String description;
    private String imageUrl;
    private String courtType;
    private Integer capacity;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
