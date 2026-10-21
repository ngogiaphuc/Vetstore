package com.sporthub.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CourtPriceRequest {

    @NotNull(message = "timeSlotId không được để trống")
    @Schema(example = "1")
    private Long timeSlotId;

    @Min(value = 1, message = "dayOfWeek phải từ 1 đến 7")
    @Max(value = 7, message = "dayOfWeek phải từ 1 đến 7")
    @Schema(example = "1")
    private Integer dayOfWeek;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.00", message = "Giá phải >= 0")
    @Schema(example = "80000.00")
    private BigDecimal price;

    @Schema(type = "string", example = "2026-09-01")
    private LocalDate effectiveFrom;

    @Schema(type = "string", example = "2026-12-31")
    private LocalDate effectiveTo;
}
