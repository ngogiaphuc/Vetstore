package com.sporthub.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class AppointmentRequest {
    @NotNull(message = "Vui lòng chọn thú cưng")
    private Long petId;

    private Long doctorId; // Có thể để trống nếu chọn bác sĩ bất kỳ

    @NotNull(message = "Vui lòng chọn gói dịch vụ khám")
    private Long serviceId;

    @NotNull(message = "Vui lòng chọn ngày khám")
    private LocalDate appointmentDate;

    @NotNull(message = "Vui lòng chọn giờ khám")
    private LocalTime appointmentTime;

    private String notes; // Triệu chứng bệnh ban đầu
}

