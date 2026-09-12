package com.example.integration_plateform.service;

import com.example.integration_plateform.dto.AuthorityUserResponse;
import com.example.integration_plateform.dto.CreateAuthorityRequest;
import com.example.integration_plateform.dto.ReviewActionRequest;
import com.example.integration_plateform.entity.ApplicationActionRequest;
import com.example.integration_plateform.entity.User;
import com.example.integration_plateform.model.ActionType;
import com.example.integration_plateform.model.ApplicationStatus;
import com.example.integration_plateform.model.RequestStatus;
import com.example.integration_plateform.model.Role;
import com.example.integration_plateform.repository.ApplicationActionRequestRepository;
import com.example.integration_plateform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ApplicationActionRequestRepository requestRepository;
    private final ApplicationStatusService applicationStatusService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ApplicationActionRequest reviewRequest(
            String requestId,
            ReviewActionRequest review
    ) {

        ApplicationActionRequest actionRequest =
                requestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Action request not found: "
                                                + requestId
                                )
                        );

        /*
         * Only PENDING requests can be reviewed.
         */
        if (actionRequest.getStatus()
                != RequestStatus.PENDING) {

            throw new IllegalStateException(
                    "Request has already been reviewed"
            );
        }

        /*
         * Prevent the same person who created the request
         * from reviewing it.
         */
        String admin =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        if (admin.equals(actionRequest.getRequestedBy())) {

            throw new IllegalStateException(
                    "The requester cannot review their own request"
            );
        }

        /*
         * If admin REJECTS the action request,
         * the application status does NOT change.
         */
        if (review.getDecision()
                == RequestStatus.REJECTED) {

            actionRequest.setStatus(
                    RequestStatus.REJECTED
            );

            actionRequest.setReviewedBy(admin);

            actionRequest.setReviewComment(
                    review.getComment()
            );

            actionRequest.setReviewedAt(
                    LocalDateTime.now()
            );

            return requestRepository.save(actionRequest);
        }

        /*
         * If admin APPROVES the action request,
         * determine the actual application status.
         */
        ApplicationStatus newStatus =
                switch (actionRequest.getActionType()) {

                    case APPROVE ->
                            ApplicationStatus.APPROVED;

                    case REJECT ->
                            ApplicationStatus.REJECTED;

                    case ON_HOLD ->
                            ApplicationStatus.ON_HOLD;
                };

        /*
         * Change application status.
         *
         * This also creates StatusHistory.
         */
        applicationStatusService.updateStatus(
                actionRequest.getApplicationId(),
                newStatus,
                review.getComment()
        );

        /*
         * Mark action request as approved.
         */
        actionRequest.setStatus(
                RequestStatus.APPROVED
        );

        actionRequest.setReviewedBy(admin);

        actionRequest.setReviewComment(
                review.getComment()
        );

        actionRequest.setReviewedAt(
                LocalDateTime.now()
        );

        return requestRepository.save(actionRequest);
    }

    public List<ApplicationActionRequest> getActionRequests(RequestStatus status) {
        if (status != null) {
            return requestRepository.findByStatus(status);
        }
        return requestRepository.findAll();
    }

    public AuthorityUserResponse createAuthority(CreateAuthorityRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + request.getUsername());
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.AUTHORITY)
                .fullName(request.getFullName() != null && !request.getFullName().isBlank() ? request.getFullName() : request.getUsername())
                .department(request.getDepartment() != null && !request.getDepartment().isBlank() ? request.getDepartment() : "Department of Skills & Innovation")
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        return AuthorityUserResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .role(savedUser.getRole().name())
                .fullName(savedUser.getFullName())
                .department(savedUser.getDepartment())
                .enabled(savedUser.isEnabled())
                .build();
    }

    public List<AuthorityUserResponse> getAuthorities() {
        return userRepository.findByRole(Role.AUTHORITY).stream()
                .map(user -> AuthorityUserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .role(user.getRole().name())
                        .fullName(user.getFullName())
                        .department(user.getDepartment())
                        .enabled(user.isEnabled())
                        .build())
                .toList();
    }
}