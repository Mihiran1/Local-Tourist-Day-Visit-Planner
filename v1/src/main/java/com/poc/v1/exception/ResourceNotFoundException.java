package com.poc.v1.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApplicationException{
    public ResourceNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND");
    }
}
