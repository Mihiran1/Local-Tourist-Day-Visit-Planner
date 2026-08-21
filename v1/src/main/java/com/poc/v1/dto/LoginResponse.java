package com.poc.v1.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private final String accessToken;
    private final String email;
    private final String role;
}
