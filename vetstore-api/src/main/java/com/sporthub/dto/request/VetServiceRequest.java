package com.sporthub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class VetServiceRequest {
    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String name;

    private String description;

    @NotNull(message = "Giá dịch vụ không được để trống")
    private BigDecimal price;

    private Integer durationMinutes = 30;

    @NotBlank(message = "Phân loại không được để trống")
    private String category;

    private String imageUrl;
    private String status = "ACTIVE";
}

