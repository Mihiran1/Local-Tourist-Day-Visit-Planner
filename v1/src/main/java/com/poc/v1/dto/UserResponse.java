package com.poc.v1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UserResponse {
    private final Long id;
    private final String firstName;
    private final String lastName;
    private final String phone;
    private final String email;
}
