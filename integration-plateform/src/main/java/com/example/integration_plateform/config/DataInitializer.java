package com.example.integration_plateform.config;

import com.example.integration_plateform.entity.User;
import com.example.integration_plateform.model.ApplicationRecord;
import com.example.integration_plateform.model.ApplicationStatus;
import com.example.integration_plateform.model.IntegrationSystemResult;
import com.example.integration_plateform.model.Role;
import com.example.integration_plateform.model.StatusHistory;
import com.example.integration_plateform.repository.ApplicationRepository;
import com.example.integration_plateform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedInitialApplicationsIfEmpty();
    }

    private void seedUsers() {
        createOrUpdateUser("admin", "password123", Role.ADMIN, "System Administrator", "State Innovation Society (MSInS)");
        createOrUpdateUser("msins_admin", "password123", Role.ADMIN, "MSInS Director", "Maharashtra State Innovation Society");
        createOrUpdateUser("aditya_authority", "password123", Role.AUTHORITY, "Aditya RS", "Skill Development & Entrepreneurship");
        createOrUpdateUser("authority1", "password123", Role.AUTHORITY, "Authority Officer 1", "District Verification Cell");
    }

    private void createOrUpdateUser(String username, String rawPassword, Role role, String fullName, String department) {
        User user = userRepository.findByUsername(username)
                .orElse(User.builder().username(username).role(role).enabled(true).build());
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setFullName(fullName);
        user.setDepartment(department);
        user.setEnabled(true);
        userRepository.save(user);
        log.info("Provisioned verified account: {} ({}) with role: {}", username, fullName, role);
    }

    private void seedInitialApplicationsIfEmpty() {
        if (applicationRepository.findByApplicationId("MH-MSINS-2026-00892").isEmpty()) {
            log.info("Seeding initial live applications in MongoDB 'integration-system.application'...");

            ApplicationRecord app1 = ApplicationRecord.builder()
                    .applicationId("MH-MSINS-2026-00892")
                    .citizenId("MH-CIT-98234123")
                    .applicantName("Tanvi Shinde")
                    .dateOfBirth(LocalDate.of(1996, 4, 14))
                    .schemeCode("MSINS-STARTUP-2026")
                    .correlationId("eks-trace-init-001")
                    .overallEligibility(true)
                    .applicationStatus(ApplicationStatus.APPROVED)
                    .systems(List.of(
                            IntegrationSystemResult.builder().system("SYSTEM-B").eligible(true).status("VERIFIED").build(),
                            IntegrationSystemResult.builder().system("SYSTEM-C").eligible(true).status("VERIFIED").build()
                    ))
                    .createdAt(LocalDateTime.now().minusDays(2))
                    .updatedAt(LocalDateTime.now().minusDays(1))
                    .statusHistory(List.of(
                            StatusHistory.builder().status(ApplicationStatus.ELIGIBILITY_VERIFIED).changedBy("SYSTEM").changedAt(LocalDateTime.now().minusDays(2)).reason("All checks verified").build(),
                            StatusHistory.builder().status(ApplicationStatus.APPROVED).changedBy("msins_admin").changedAt(LocalDateTime.now().minusDays(1)).reason("All eligibility conditions satisfied").build()
                    ))
                    .build();

            ApplicationRecord app2 = ApplicationRecord.builder()
                    .applicationId("MH-MSINS-2026-00893")
                    .citizenId("MH-CIT-44120987")
                    .applicantName("Rohan Deshpande")
                    .dateOfBirth(LocalDate.of(1998, 9, 28))
                    .schemeCode("MSINS-STARTUP-2026")
                    .correlationId("eks-trace-init-002")
                    .overallEligibility(true)
                    .applicationStatus(ApplicationStatus.ELIGIBILITY_VERIFIED)
                    .systems(List.of(
                            IntegrationSystemResult.builder().system("SYSTEM-B").eligible(true).status("VERIFIED").build(),
                            IntegrationSystemResult.builder().system("SYSTEM-C").eligible(true).status("VERIFIED").build()
                    ))
                    .createdAt(LocalDateTime.now().minusHours(18))
                    .updatedAt(LocalDateTime.now().minusHours(18))
                    .build();

            ApplicationRecord app3 = ApplicationRecord.builder()
                    .applicationId("MH-CMEGP-2026-00104")
                    .citizenId("MH-CIT-77123456")
                    .applicantName("Suresh Patil")
                    .dateOfBirth(LocalDate.of(1991, 11, 10))
                    .schemeCode("CMEGP-EMPLOY-01")
                    .correlationId("eks-trace-init-003")
                    .overallEligibility(true)
                    .applicationStatus(ApplicationStatus.ON_HOLD)
                    .systems(List.of(
                            IntegrationSystemResult.builder().system("SYSTEM-B").eligible(true).status("VERIFIED").build(),
                            IntegrationSystemResult.builder().system("SYSTEM-C").eligible(true).status("VERIFIED").build()
                    ))
                    .createdAt(LocalDateTime.now().minusHours(6))
                    .updatedAt(LocalDateTime.now().minusHours(2))
                    .statusHistory(List.of(
                            StatusHistory.builder().status(ApplicationStatus.ELIGIBILITY_VERIFIED).changedBy("SYSTEM").changedAt(LocalDateTime.now().minusHours(6)).reason("Verified").build(),
                            StatusHistory.builder().status(ApplicationStatus.ON_HOLD).changedBy("aditya_authority").changedAt(LocalDateTime.now().minusHours(2)).reason("Awaiting additional GST documents").build()
                    ))
                    .build();

            applicationRepository.saveAll(List.of(app1, app2, app3));
            log.info("Successfully seeded initial applications into MongoDB.");
        }
    }
}
