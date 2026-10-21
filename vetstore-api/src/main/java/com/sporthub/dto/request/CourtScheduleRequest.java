package com.sporthub.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class CourtScheduleRequest {

    @NotNull(message = "dayOfWeek không được để trống")
    @Min(value = 1, message = "dayOfWeek phải từ 1 đến 7")
    @Max(value = 7, message = "dayOfWeek phải từ 1 đến 7")
    @Schema(example = "1", description = "1: Thứ 2, 7: Chủ Nhật")
    private Integer dayOfWeek;

    @NotNull(message = "openTime không được để trống")
    @Schema(type = "string", example = "06:00:00", description = "Giờ mở cửa (HH:mm:ss)")
    private LocalTime openTime;

    @NotNull(message = "closeTime không được để trống")
    @Schema(type = "string", example = "22:00:00", description = "Giờ đóng cửa (HH:mm:ss)")
    private LocalTime closeTime;

    @Schema(example = "true")
    private Boolean isActive = true;
}
