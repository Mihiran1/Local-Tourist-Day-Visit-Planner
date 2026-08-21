package com.poc.v1.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ErrorResponse {

    private final LocalDateTime timestamp;
    private final int status;
    private final String errorCode;
    private final String message;
    private final String path;
}
