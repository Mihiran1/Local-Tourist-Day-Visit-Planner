package com.poc.v1.exception;

import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends ApplicationException {
    public InvalidCredentialsException(String message) {
        super(message, HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS");
    }
}
