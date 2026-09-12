package com.example.system_a.service;

import com.example.system_a.dto.ApplicationRequestDto;
import com.example.system_a.entity.Application;
import com.example.system_a.repository.systemARepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class systemAService {
    private final systemARepository systemARepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String EKSUTRA_URL = "http://localhost:8080/api/v1/integration/applications";

    public List<Application> findAll() {
        return systemARepository.findAll();
    }

    public Optional<Application> findByApplicationId(String applicationId) {
        if (applicationId == null || applicationId.isBlank()) {
            return Optional.empty();
        }
        String trimmed = applicationId.trim();
        Optional<Application> byAppId = systemARepository.findByApplicationId(trimmed);
        if (byAppId.isPresent()) {
            return byAppId;
        }
        return systemARepository.findByCitizenId(trimmed);
    }

    public Application addApplication(Application application) {
        if (application.getCreatedAt() == null) {
            application.setCreatedAt(LocalDateTime.now());
        }
        application.setUpdatedAt(LocalDateTime.now());
        return systemARepository.save(application);
    }

    public Application processApplication(ApplicationRequestDto dto) {
        String appId = dto.getApplicationId();
        if (appId == null || appId.isBlank()) {
            appId = "APP-" + (10000 + new Random().nextInt(90000));
        }

        // Resolve citizen / beneficiary ID
        String citizenId = dto.getBeneficiaryId();
        if (citizenId == null || citizenId.isBlank()) {
            citizenId = dto.getCitizenId();
        }
        if (citizenId == null || citizenId.isBlank()) {
            citizenId = "CIT-" + (10000 + new Random().nextInt(90000));
        }
        citizenId = citizenId.trim();

        // Resolve first name, last name, and full applicant name
        String fname = dto.getFname() != null ? dto.getFname().trim() : "";
        String lname = dto.getLname() != null ? dto.getLname().trim() : "";

        if (fname.isEmpty() && dto.getApplicantName() != null && !dto.getApplicantName().isBlank()) {
            String[] parts = dto.getApplicantName().trim().split("\\s+", 2);
            fname = parts[0];
            lname = parts.length > 1 ? parts[1].trim() : "";
        }

        if (fname.isEmpty()) {
            fname = "Citizen";
        }
        // Ensure lname is not blank for downstream EK SUTRA validation
        if (lname.isEmpty()) {
            lname = fname;
        }

        String fullName = dto.getApplicantName() != null && !dto.getApplicantName().isBlank()
                ? dto.getApplicantName().trim()
                : (lname.equalsIgnoreCase(fname) ? fname : (fname + " " + lname)).trim();

        // Resolve Date of Birth
        LocalDate dob = dto.getDob();
        if (dob == null) {
            dob = dto.getDateOfBirth();
        }
        if (dob == null) {
            dob = LocalDate.of(2000, 1, 1);
        }

        String schemeCode = dto.getSchemeCode() != null && !dto.getSchemeCode().isBlank()
                ? dto.getSchemeCode().trim()
                : "MSINS-STARTUP-2026";

        Application app = Application.builder()
                .applicationId(appId)
                .citizenId(citizenId)
                .applicantName(fullName)
                .fname(fname)
                .lname(lname)
                .dob(dob)
                .schemeCode(schemeCode)
                .consentGiven(dto.isConsentGiven())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        if (dto.isConsentGiven()) {

            // Citizen GRANTED consent → Send to EK SUTRA middleware
            try {

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                Map<String, Object> payload = new HashMap<>();

                payload.put("applicationId", appId);
                payload.put("beneficiaryId", citizenId);
                payload.put("fname", fname);
                payload.put("lname", lname);
                payload.put("dob", dob.toString());
                payload.put("schemeCode", schemeCode);
                payload.put("consentGiven", dto.isConsentGiven());

                HttpEntity<Map<String, Object>> request =
                        new HttpEntity<>(payload, headers);

                Map<?, ?> response =
                        restTemplate.postForObject(
                                EKSUTRA_URL,
                                request,
                                Map.class
                        );

                if (response != null) {

                    Object eligible = response.get("eligible");
                    boolean isEligible = eligible instanceof Boolean ? (Boolean) eligible : true;

                    app.setStatus(isEligible ? "ELIGIBILITY_VERIFIED" : "NOT_ELIGIBLE");
                    app.setCrossSystemVerification("COMPLETED");
                    app.setOverallEligibility(isEligible);

                    app.setCorrelationId(
                            (String) response.get("correlationId")
                    );

                    app.setSystems(response.get("systems"));

                }

            } catch (Exception e) {

                // EK SUTRA communication issue or down
                app.setStatus("RECEIVED");
                app.setCrossSystemVerification("FAILED");
                app.setOverallEligibility(null);

                app.setCorrelationId(
                        "EKS-ERR-" +
                                UUID.randomUUID()
                                        .toString()
                                        .substring(0, 8)
                );

                e.printStackTrace();
            }

        } else {
            // Citizen DENIED consent -> Keep in System A only, NO external verification
            app.setStatus("RECEIVED");
            app.setCrossSystemVerification("NOT_INITIATED");
            app.setOverallEligibility(null);
            app.setCorrelationId(null);
            app.setSystems(null);
        }

        return systemARepository.save(app);
    }
}
