package com.example.integration_plateform.controller;

import com.example.integration_plateform.dto.LoginRequest;
import com.example.integration_plateform.dto.LoginResponse;
import com.example.integration_plateform.dto.SignupRequest;
import com.example.integration_plateform.dto.SignupResponse;
import com.example.integration_plateform.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(
        value = "/api/v1/auth",
        produces = MediaType.APPLICATION_JSON_VALUE
)
public class AuthController {

    private final AuthService authService;

    @PostMapping(
            value = "/signup",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest signupRequest) {
        SignupResponse response = authService.signup(signupRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping(
            value = "/login",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(
            value = "/login/authority",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<LoginResponse> loginAuthority(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.loginAuthority(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(
            value = "/login/admin",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<LoginResponse> loginAdmin(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.loginAdmin(request);
        return ResponseEntity.ok(response);
    }
}
