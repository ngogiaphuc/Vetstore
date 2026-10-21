package com.sporthub.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "Username không được để trống")
    @Schema(example = "admin")
    private String username;

    @NotBlank(message = "Password không được để trống")
    @Schema(example = "Admin123!")
    private String password;
}
