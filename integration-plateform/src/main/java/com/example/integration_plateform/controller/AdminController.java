package com.example.integration_plateform.controller;

import com.example.integration_plateform.dto.AuthorityUserResponse;
import com.example.integration_plateform.dto.CreateAuthorityRequest;
import com.example.integration_plateform.dto.ReviewActionRequest;
import com.example.integration_plateform.entity.ApplicationActionRequest;
import com.example.integration_plateform.model.RequestStatus;
import com.example.integration_plateform.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(
        value = "/api/v1/admin",
        produces = MediaType.APPLICATION_JSON_VALUE
)
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/action-requests")
    public List<ApplicationActionRequest> getActionRequests(
            @RequestParam(required = false) RequestStatus status
    ) {
        return adminService.getActionRequests(status);
    }

    @PatchMapping(
            value = "/action-request/{requestId}",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApplicationActionRequest> reviewRequest (
            @PathVariable String requestId,
            @Valid @RequestBody ReviewActionRequest reviewActionRequest
    ){
        return ResponseEntity.ok(
                adminService.reviewRequest(
                        requestId,
                        reviewActionRequest
                )
        );
    }

    @PostMapping(
            value = "/authorities",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthorityUserResponse> createAuthority(
            @Valid @RequestBody CreateAuthorityRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(adminService.createAuthority(request));
    }

    @GetMapping("/authorities")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AuthorityUserResponse> getAuthorities() {
        return adminService.getAuthorities();
    }
}
