package com.example.integration_plateform.entity;

import com.example.integration_plateform.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user")

public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private Role role;
    private boolean enabled;
    private String fullName;
    private String department;
}
