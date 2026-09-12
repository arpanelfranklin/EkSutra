package com.example.integration_plateform.config;

import com.example.integration_plateform.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpMethod;
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
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                .requestMatchers("/api/v1/auth/**").permitAll()
                                .requestMatchers("/api/v1/integration/**").permitAll()

                                // Public citizen tracking & verification endpoints
                                .requestMatchers(HttpMethod.GET, "/api/v1/applications/search").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/applications/*/status").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/applications/*/status-history").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/v1/applications/*").permitAll()

                                // Action requests queue viewable by authorities and admins
                                .requestMatchers(HttpMethod.GET, "/api/v1/admin/action-requests").hasAnyRole("AUTHORITY", "ADMIN")

                                // Admin only for reviews/sanctions
                                .requestMatchers(
                                        "/api/v1/admin/**"
                                ).hasRole("ADMIN")

                                // Logged in authorities & admins for full application access
                                .requestMatchers(
                                        "/api/v1/applications/**"
                                ).hasAnyRole("AUTHORITY", "ADMIN")

                                // Dashboards accessible by both authority officers and admins
                                .requestMatchers("/api/v1/dashboard/**")
                                .hasAnyRole("AUTHORITY", "ADMIN")

                                // Actuator telemetry
                                .requestMatchers("/actuator/**")
                                .permitAll()

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

