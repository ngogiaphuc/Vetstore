package com.sporthub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordResponse {
    private Long id;
    private Long appointmentId;
    private String appointmentCode;
    private Long petId;
    private String petName;
    private String petSpecies;
    private Long doctorId;
    private String doctorName;
    private String symptoms;
    private String diagnosis;
    private String treatment;
    private String prescription;
    private String doctorNotes;
    private LocalDate reExaminationDate;
    private LocalDateTime createdAt;
}

