package com.example.integration_plateform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthorityUserResponse {
    private String id;
    private String username;
    private String role;
    private boolean enabled;
    private String fullName;
    private String department;
}
