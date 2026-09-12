package com.example.integration_plateform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SystemAApplicationRequest {

    @NotBlank
    private String applicationId;
    @NotBlank
    private String beneficiaryId;
    @NotBlank
    private String fname;
    @NotBlank
    private String lname;
    @NotNull
    private LocalDate dob;
    @NotBlank
    private String schemeCode;
    @NotNull
    private boolean consentGiven;
}
