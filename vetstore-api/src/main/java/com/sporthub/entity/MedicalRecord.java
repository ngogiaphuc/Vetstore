package com.sporthub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_records")
@Getter
@Setter
@NoArgsConstructor
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(columnDefinition = "TEXT")
    private String symptoms; // Triệu chứng lâm sàng

    @Column(nullable = false, length = 255)
    private String diagnosis; // Chẩn đoán bệnh

    @Column(columnDefinition = "TEXT")
    private String treatment; // Hướng điều trị

    @Column(columnDefinition = "TEXT")
    private String prescription; // Đơn thuốc và hướng dẫn sử dụng

    @Column(columnDefinition = "TEXT")
    private String doctorNotes; // Lời dặn chăm sóc tại nhà

    @Column(name = "re_examination_date")
    private LocalDate reExaminationDate; // Ngày tái khám

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}

