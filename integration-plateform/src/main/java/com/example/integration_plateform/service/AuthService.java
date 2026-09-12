package com.example.integration_plateform.service;

import com.example.integration_plateform.dto.LoginRequest;
import com.example.integration_plateform.dto.LoginResponse;
import com.example.integration_plateform.dto.SignupRequest;
import com.example.integration_plateform.dto.SignupResponse;
import com.example.integration_plateform.entity.User;
import com.example.integration_plateform.model.Role;
import com.example.integration_plateform.repository.UserRepository;
import com.example.integration_plateform.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
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
        throw new UnsupportedOperationException(
                "Public self-registration is disabled. Authority officers must be provisioned by an Apex Administrator."
        );
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication =
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                ));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);
        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        return new LoginResponse(
                userDetails.getUsername(),
                token,
                role
        );
    }

    public LoginResponse loginAuthority(LoginRequest request) {
        LoginResponse response = login(request);
        if (!"ROLE_AUTHORITY".equalsIgnoreCase(response.getRole()) && !"AUTHORITY".equalsIgnoreCase(response.getRole())) {
            throw new BadCredentialsException(
                    "Access Denied: This portal is strictly for Department Authority Officers. Your account has administrative privileges; please use the Apex Admin portal."
            );
        }
        return response;
    }

    public LoginResponse loginAdmin(LoginRequest request) {
        LoginResponse response = login(request);
        if (!"ROLE_ADMIN".equalsIgnoreCase(response.getRole()) && !"ADMIN".equalsIgnoreCase(response.getRole())) {
            throw new BadCredentialsException(
                    "Access Denied: This portal is strictly for Apex Administrators. Your account has authority verification privileges; please use the Authority Officer portal."
            );
        }
        return response;
    }
}
