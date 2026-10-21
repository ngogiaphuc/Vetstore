package com.sporthub.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleLoginRequest {
    @NotBlank(message = "Email không được để trống")
    private String email;

    private String name;
    private String avatarUrl;
    private String idToken;
}

