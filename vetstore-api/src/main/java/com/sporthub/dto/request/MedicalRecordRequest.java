package com.sporthub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MedicalRecordRequest {
    @NotNull(message = "Lịch hẹn không được để trống")
    private Long appointmentId;

    private String symptoms;

    @NotBlank(message = "Chẩn đoán không được để trống")
    private String diagnosis;

    private String treatment;
    private String prescription;
    private String doctorNotes;
    private LocalDate reExaminationDate;
}

