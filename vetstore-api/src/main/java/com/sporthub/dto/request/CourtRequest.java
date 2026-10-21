package com.sporthub.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourtRequest {

    @NotNull(message = "venueId không được để trống")
    @Schema(example = "1")
    private Long venueId;

    @NotNull(message = "sportId không được để trống")
    @Schema(example = "1")
    private Long sportId;

    @NotBlank(message = "Tên sân không được để trống")
    @Size(max = 150)
    @Schema(example = "Sân Cầu Lông Số 1")
    private String name;

    @Schema(example = "Sân thảm PVC tiêu chuẩn thi đấu")
    private String description;

    @Size(max = 500)
    @Schema(example = "https://example.com/images/court1.jpg")
    private String imageUrl;

    @Size(max = 100)
    @Schema(example = "Cầu lông thảm gỗ")
    private String courtType;

    @Schema(example = "4")
    private Integer capacity;
}
