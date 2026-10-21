package com.sporthub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetResponse {
    private Long id;
    private String name;
    private String species;
    private String breed;
    private Integer age;
    private Double weight;
    private String gender;
    private String notes;
    private String imageUrl;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
}

