package com.example.integration_plateform.config;

import com.example.integration_plateform.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
        AuthenticationConfiguration configuration)
        throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(
                        auth -> auth
                                .requestMatchers("/api/v1/auth/**").permitAll()
                                .requestMatchers("/api/v1/integration/**").permitAll()

                                // Public citizen tracking endpoints
                                .requestMatchers(HttpMethod.GET, "/api/v1/applications/{applicationId}").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/applications/{applicationId}/status").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/applications/{applicationId}/status-history").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/applications/search").permitAll()

                                // Admin actions: PATCH only for ADMIN, GET action requests for both
                                .requestMatchers(HttpMethod.PATCH, "/api/v1/admin/**").hasRole("ADMIN")
                                .requestMatchers("/api/v1/admin/**").hasAnyRole("ADMIN", "AUTHORITY")

                                // Dashboards (accessible to both ADMIN and AUTHORITY)
                                .requestMatchers("/api/v1/dashboard/**").hasAnyRole("ADMIN", "AUTHORITY")

                                // Logged in authorities & admins for application actions and management
                                .requestMatchers("/api/v1/applications/**").hasAnyRole("AUTHORITY", "ADMIN")

                                // Actuator
                                .requestMatchers("/actuator/**").permitAll()

                                // Everything else
                                .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
        ;
        return http.build();
    }

}

