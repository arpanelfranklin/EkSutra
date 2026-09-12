package com.example.integration_plateform.config;

import com.example.integration_plateform.entity.User;
import com.example.integration_plateform.model.Role;
import com.example.integration_plateform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUserIfNotExists("aditya_authority", "password123", Role.AUTHORITY, "Aditya Jadhav", "Department of Skills, Employment & Innovation");
        seedUserIfNotExists("msins_admin", "password123", Role.ADMIN, "Rajesh Verma", "Maharashtra State Innovation Society (MSInS)");
    }

    private void seedUserIfNotExists(String username, String rawPassword, Role role, String fullName, String department) {
        if (!userRepository.existsByUsername(username)) {
            User user = User.builder()
                    .username(username)
                    .password(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .fullName(fullName)
                    .department(department)
                    .enabled(true)
                    .build();
            userRepository.save(user);
            log.info("Default seed user '{}' ({}) successfully created.", username, role);
        }
    }
}
