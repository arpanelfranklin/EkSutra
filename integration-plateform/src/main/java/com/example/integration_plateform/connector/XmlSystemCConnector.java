package com.example.integration_plateform.connector;

import com.example.integration_plateform.context.CorrelationContext;
import com.example.integration_plateform.dto.SystemCEligibilityRequest;
import com.example.integration_plateform.dto.SystemCEligibilityResponse;
import com.example.integration_plateform.exception.IntegrationException;
import com.example.integration_plateform.mapper.ApplicationMapper;
import com.example.integration_plateform.model.CanonicalApplication;
import com.example.integration_plateform.model.CanonicalEligibilityResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;


@Component
@Slf4j

public class XmlSystemCConnector implements SystemCConnector {

    private final RestClient systemCRestClient;
    private final ApplicationMapper applicationMapper;

    public XmlSystemCConnector(
            @Qualifier("systemCRestClient") RestClient systemCRestClient,
            ApplicationMapper applicationMapper
    ) {
        this.systemCRestClient = systemCRestClient;
        this.applicationMapper = applicationMapper;
    }

    @Override
    public CanonicalEligibilityResponse checkEligibility(
            CanonicalApplication application
    ) {

        SystemCEligibilityRequest request =
                new SystemCEligibilityRequest(
                        application.getApplicationId(),
                        application.getCitizenId(),
                        application.getApplicantName(),
                        application.getDateOfBirth().toString(),
                        application.getSchemeCode()
                );

        log.info("Sending XML request to System C: {}", request);

        try {
            SystemCEligibilityResponse response =
                    systemCRestClient
                            .post()
                            .uri("/legacy/api/eligibility")
                            .contentType(MediaType.APPLICATION_XML)
                            .accept(MediaType.APPLICATION_XML)
                            .header(
                                    "X-Correlation-ID",
                                    CorrelationContext.get()
                            )
                            .body(request)
                            .retrieve()
                            .body(SystemCEligibilityResponse.class);

            log.info("Received XML response from System C: {}", response);

            return applicationMapper.systemCtoCanonical(response);
        } catch (ResourceAccessException e) {
            log.error("Failed to connect to System C", e);
            throw new IntegrationException(
                    "SYSTEM_C_UNAVAILABLE",
                    "System C is currently unavailable",
                    503
            );
        }
    }
}
