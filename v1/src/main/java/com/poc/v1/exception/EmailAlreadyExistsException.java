package com.poc.v1.exception;

import org.springframework.http.HttpStatus;

public class EmailAlreadyExistsException extends ApplicationException{
    public EmailAlreadyExistsException(String message) {
        super(message, HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS");
    }
}
