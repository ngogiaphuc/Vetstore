package com.sporthub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "pets")
@Getter
@Setter
@NoArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String species; // Chó, Mèo, Chim, Thỏ, Khác

    @Column(length = 100)
    private String breed; // Giống loài (ví dụ: Corgi, Poodle, Mèo Ta, Mèo Ba Tư...)

    private Integer age; // Tuổi (hoặc tháng)

    private Double weight; // Cân nặng (kg)

    @Column(length = 20)
    private String gender; // Đực, Cái

    @Column(columnDefinition = "TEXT")
    private String notes; // Tiền sử bệnh, dị ứng

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

