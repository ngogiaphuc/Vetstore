package com.sporthub.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PetRequest {
    @NotBlank(message = "Tên thú cưng không được để trống")
    private String name;

    @NotBlank(message = "Loài thú cưng không được để trống")
    private String species; // Chó, Mèo, Thỏ...

    private String breed;
    private Integer age;
    private Double weight;
    private String gender;
    private String notes;
    private String imageUrl;
}

