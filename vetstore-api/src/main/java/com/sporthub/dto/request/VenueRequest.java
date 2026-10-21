package com.sporthub.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalTime;

@Getter
@Setter
public class VenueRequest {

    @NotBlank(message = "Tên venue không được để trống")
    @Size(max = 200)
    @Schema(example = "Sân Thể Thao Rạch Miễu")
    private String name;

    @Schema(example = "Cụm sân cầu lông và bóng đá cỏ nhân tạo")
    private String description;

    @Size(max = 500)
    @Schema(example = "https://example.com/images/venue1.jpg")
    private String imageUrl;

    @NotBlank(message = "Địa chỉ không được để trống")
    @Size(max = 255)
    @Schema(example = "1 Hoa Hoa, Phường 7")
    private String address;

    @Size(max = 100)
    @Schema(example = "Phường 7")
    private String ward;

    @Size(max = 100)
    @Schema(example = "Phú Nhuận")
    private String district;

    @Size(max = 100)
    @Schema(example = "Hồ Chí Minh")
    private String city;

    @Schema(example = "10.793")
    private BigDecimal latitude;

    @Schema(example = "106.689")
    private BigDecimal longitude;

    @Size(max = 20)
    @Schema(example = "0909123456")
    private String phone;

    @Schema(type = "string", example = "06:00:00", description = "Giờ mở cửa (HH:mm:ss)")
    private LocalTime openTime;

    @Schema(type = "string", example = "22:00:00", description = "Giờ đóng cửa (HH:mm:ss)")
    private LocalTime closeTime;
}
