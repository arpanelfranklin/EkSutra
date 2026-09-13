package com.example.integration_plateform.connector;

import com.example.integration_plateform.context.CorrelationContext;
import com.example.integration_plateform.dto.SystemBEligibilityRequest;
import com.example.integration_plateform.dto.SystemBEligibilityResponse;
import com.example.integration_plateform.exception.IntegrationException;
import com.example.integration_plateform.mapper.ApplicationMapper;
import com.example.integration_plateform.model.CanonicalApplication;
import com.example.integration_plateform.model.CanonicalEligibilityResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

@Component

public class RestSystemBConnector implements SystemBConnector {

    private final RestClient systemBRestClient;
    private final ApplicationMapper applicationMapper;

    public RestSystemBConnector(
            @Qualifier("systemBRestClient") RestClient systemBRestClient,
            ApplicationMapper applicationMapper) {
        this.systemBRestClient = systemBRestClient;
        this.applicationMapper = applicationMapper;
    }


    @Override
    public CanonicalEligibilityResponse checkEligibility(CanonicalApplication request){
        {
            try{
                String correlationId = CorrelationContext.get();
                if (correlationId == null || correlationId.isBlank()) {
                    correlationId = java.util.UUID.randomUUID().toString();
                }
                System.out.println(
                        "Sending correlation ID to System B: " + correlationId
                );
                SystemBEligibilityRequest requestBody =
                        SystemBEligibilityRequest.builder()
                                .requestId(request.getApplicationId())
                                .citizenId(request.getCitizenId())
                                .fullName(request.getApplicantName())
                                .dateOfBirth(request.getDateOfBirth())
                                .scheme(request.getSchemeCode())
                                .build();
                SystemBEligibilityResponse response = systemBRestClient
                        .post()
                        .uri("/api/v1/eligibility/check")
                        .header("X-Correlation-ID", correlationId)
                        .body(requestBody)
                        .retrieve()
                        .body(SystemBEligibilityResponse.class);
                return applicationMapper.systemBtoCanonical(response);
            } catch (ResourceAccessException e){
                throw new IntegrationException(
                        "SYSTEM_B_UNAVAILABLE",
                        "System B is currently unavailable",
                        503
                );
            }
        }
    }

}
