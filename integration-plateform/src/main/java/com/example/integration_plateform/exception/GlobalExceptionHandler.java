package com.example.integration_plateform.exception;


import com.example.integration_plateform.filter.CorrelationIdFilter;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.UUID;
@Slf4j
@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException
            (MethodArgumentNotValidException exception,
             HttpServletRequest request) {

        String correlationId =
                request.getHeader(CorrelationIdFilter.CORRELATION_ID);


        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error ->
                        error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("Request validation failed");

        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(400)
                .error("VALIDATION_ERROR")
                .message(message)
                .correlationId(correlationId)
                .build();

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(IntegrationException.class)
    public ResponseEntity<ErrorResponse> handleIntegrationException(
            IntegrationException exception,
            HttpServletRequest request) {

        String correlationId =
                request.getHeader(CorrelationIdFilter.CORRELATION_ID);

        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(exception.getStatus())
                .error(exception.getErrorCode())
                .message(exception.getMessage())
                .correlationId(correlationId)
                .build();

        return ResponseEntity
                .status(exception.getStatus())
                .body(response);
    }

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(
            org.springframework.security.authentication.BadCredentialsException exception,
            HttpServletRequest request) {

        String correlationId = request.getHeader(CorrelationIdFilter.CORRELATION_ID);

        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(401)
                .error("UNAUTHORIZED")
                .message(exception.getMessage())
                .correlationId(correlationId)
                .build();

        return ResponseEntity.status(401).body(response);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            org.springframework.security.access.AccessDeniedException exception,
            HttpServletRequest request) {

        String correlationId = request.getHeader(CorrelationIdFilter.CORRELATION_ID);

        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(403)
                .error("FORBIDDEN")
                .message(exception.getMessage())
                .correlationId(correlationId)
                .build();

        return ResponseEntity.status(403).body(response);
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ErrorResponse> handleClientException(
            RuntimeException exception, HttpServletRequest request) {

        String correlationId = request.getHeader(CorrelationIdFilter.CORRELATION_ID);

        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(400)
                .error("BAD_REQUEST")
                .message(exception.getMessage())
                .correlationId(correlationId)
                .build();

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(org.springframework.web.servlet.resource.NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResourceFoundException(
            org.springframework.web.servlet.resource.NoResourceFoundException exception,
            HttpServletRequest request) {

        String correlationId = request.getHeader(CorrelationIdFilter.CORRELATION_ID);

        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(404)
                .error("NOT_FOUND")
                .message("Endpoint not found: " + request.getRequestURI())
                .correlationId(correlationId)
                .build();

        return ResponseEntity.status(404).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception exception, HttpServletRequest request) {

        String correlationId =
                request.getHeader(CorrelationIdFilter.CORRELATION_ID);

        log.error("Unexpected error occurred", exception);

        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(500)
                .error("INTERNAL_SERVER_ERROR")
                .message("An unexpected error occurred")
                .correlationId(correlationId)
                .build();

        return ResponseEntity
                .internalServerError()
                .body(response);
    }
}
