package com.blackcode.pos_be.exception;

public class InvalidJwtException extends RuntimeException{
    public InvalidJwtException(String message, Throwable cause) {
        super(message, cause);
    }
}
