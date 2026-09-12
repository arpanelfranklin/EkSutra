export interface ApplicationFormInput {
  fname: string;
  lname: string;
  applicantName?: string;
  citizenId: string;
  beneficiaryId?: string;
  dob: string;
  dateOfBirth?: string;
  schemeCode: string;
  consentGiven: boolean;
}

export interface SystemVerificationResult {
  system: string;
  eligible: boolean;
  status: string;
}

export interface ApplicationRecord {
  id?: string;
  applicationId: string;
  citizenId: string;
  beneficiaryId?: string;
  applicantName: string;
  fname?: string;
  lname?: string;
  dob?: string;
  dateOfBirth?: string;
  schemeCode: string;
  consentGiven: boolean;
  status: 'RECEIVED' | 'ELIGIBILITY_VERIFIED' | 'NOT_ELIGIBLE' | string;
  crossSystemVerification: 'NOT_INITIATED' | 'COMPLETED' | 'FAILED' | string;
  overallEligibility?: boolean | null;
  correlationId?: string;
  systems?: SystemVerificationResult[] | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchemeOption {
  code: string;
  name: string;
  department: string;
  benefit: string;
  category: string;
}
