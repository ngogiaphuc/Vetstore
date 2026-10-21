package com.sporthub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "vet_services")
@Getter
@Setter
@NoArgsConstructor
public class VetService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 30;

    @Column(nullable = false, length = 50)
    private String category; // EXAMINATION (Khám), VACCINATION (Tiêm chủng), SURGERY (Phẫu thuật), SPA_GROOMING (Spa & Cắt tỉa), DENTAL (Nha khoa)

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE
}

