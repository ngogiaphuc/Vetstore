package com.sporthub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResponse {
    private Long id;
    private String appointmentCode;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private Long petId;
    private String petName;
    private String petSpecies;
    private Long doctorId;
    private String doctorName;
    private Long serviceId;
    private String serviceName;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status;
    private String notes;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private LocalDateTime createdAt;
}

