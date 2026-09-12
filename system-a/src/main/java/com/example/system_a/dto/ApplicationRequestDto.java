package com.example.system_a.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationRequestDto {
    private String applicationId;

    @JsonAlias({"citizenId", "beneficiaryIdentifier", "aadhaar"})
    private String beneficiaryId;

    private String citizenId;

    private String fname;
    private String lname;

    @JsonAlias({"fullName", "name"})
    private String applicantName;

    @JsonAlias({"dateOfBirth", "birthDate"})
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dob;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    private String schemeCode;
    private boolean consentGiven;
}
