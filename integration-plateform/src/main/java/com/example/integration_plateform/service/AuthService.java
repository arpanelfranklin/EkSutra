package com.example.integration_plateform.service;

import com.example.integration_plateform.dto.LoginRequest;
import com.example.integration_plateform.dto.LoginResponse;
import com.example.integration_plateform.dto.SignupRequest;
import com.example.integration_plateform.dto.SignupResponse;
import com.example.integration_plateform.entity.User;
import com.example.integration_plateform.repository.UserRepository;
import com.example.integration_plateform.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public SignupResponse signup(SignupRequest request) {
        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException(
                    "Username already exists" + request.getUsername()
            );
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .fullName(request.getFullName())
                .department(request.getDepartment())
                .enabled(true)
                .build();
        User savedUser = userRepository.save(user);
        return SignupResponse.builder()
                .username(savedUser.getUsername())
                .role(savedUser.getRole().name())
                .build();

    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication =
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                ));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        String fullName = (user != null && user.getFullName() != null && !user.getFullName().isBlank())
                ? user.getFullName()
                : formatDisplayName(userDetails.getUsername());

        String department = (user != null && user.getDepartment() != null && !user.getDepartment().isBlank())
                ? user.getDepartment()
                : (role.contains("ADMIN") ? "Maharashtra State Innovation Society (MSInS)" : "Skill Development & Entrepreneurship");

        return LoginResponse.builder()
                .username(userDetails.getUsername())
                .token(token)
                .role(role)
                .fullName(fullName)
                .department(department)
                .build();
    }

    private String formatDisplayName(String username) {
        if (username == null || username.isBlank()) return "Verification Officer";
        String[] parts = username.split("[._-]");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                sb.append(Character.toUpperCase(part.charAt(0)))
                  .append(part.substring(1).toLowerCase())
                  .append(" ");
            }
        }
        return sb.toString().trim();
    }

}
