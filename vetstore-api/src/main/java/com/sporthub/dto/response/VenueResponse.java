package com.sporthub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@AllArgsConstructor
public class VenueResponse {

    private Long id;
    private Long ownerId;
    private String ownerUsername;
    private String name;
    private String description;
    private String imageUrl;
    private String address;
    private String ward;
    private String district;
    private String city;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String phone;
    private LocalTime openTime;
    private LocalTime closeTime;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
