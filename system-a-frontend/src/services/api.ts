import { ApplicationFormInput, ApplicationRecord, SchemeOption } from '../types/application';

export const SCHEMES: SchemeOption[] = [
  {
    code: 'MSINS-STARTUP-2026',
    name: 'Maharashtra Innovation & Startup Seed Grant',
    department: 'Skill Development & Entrepreneurship',
    benefit: '₹5,00,000 Seed Capital & Incubation Support',
    category: 'Innovation',
  },
  {
    code: 'PMKVY-MAHA-SKILL',
    name: 'PMKVY State Technical Skill Certification',
    department: 'Technical Education & Employment',
    benefit: '100% Fee Subsidy + Job Apprenticeship Placement',
    category: 'Education',
  },
  {
    code: 'CMEGP-EMPLOY-01',
    name: 'Chief Minister Employment Generation Scheme',
    department: 'Industries & Trade Department',
    benefit: '25% Capital Subsidy for Micro-Enterprises',
    category: 'Employment',
  },
  {
    code: 'MAHA-FARM-SOLAR',
    name: 'Solar Feeder Agriculture Pump Subsidy',
    department: 'Energy & Rural Development',
    benefit: '90% Subsidy on 5HP High-Efficiency Solar Pumps',
    category: 'Agriculture',
  },
];

const LOCAL_STORAGE_KEY = 'system_a_applications';
const API_BASE = import.meta.env.VITE_SYSTEM_A_API_URL || 'http://localhost:8081';

function getLocalStore(): ApplicationRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveToLocalStore(app: ApplicationRecord) {
  try {
    const store = getLocalStore();
    const idx = store.findIndex((a) => a.applicationId === app.applicationId);
    if (idx >= 0) {
      store[idx] = app;
    } else {
      store.unshift(app);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export const api = {
  async submitApplication(input: ApplicationFormInput): Promise<ApplicationRecord> {
    const trimmedCitizenId = (input.citizenId || input.beneficiaryId || '').trim();
    const trimmedFname = (input.fname || '').trim();
    const trimmedLname = (input.lname || '').trim();
    const fullName = (input.applicantName || `${trimmedFname} ${trimmedLname}`).trim();

    // Prepare complete payload compatible with both System A & EK SUTRA standards
    const payload = {
      fname: trimmedFname || (fullName.split(' ')[0] || 'Citizen'),
      lname: trimmedLname || (fullName.split(' ').length > 1 ? fullName.split(' ').slice(1).join(' ') : (trimmedFname || 'Citizen')),
      applicantName: fullName,
      beneficiaryId: trimmedCitizenId,
      citizenId: trimmedCitizenId,
      dob: input.dob || input.dateOfBirth,
      dateOfBirth: input.dob || input.dateOfBirth,
      schemeCode: input.schemeCode,
      consentGiven: Boolean(input.consentGiven),
    };

    let response: Response;
    try {
      // Primary direct request to System A backend on port 8081
      response = await fetch(`${API_BASE}/api/v1/application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (networkErr) {
      // Fallback to relative proxy path if direct CORS/network is blocked
      try {
        response = await fetch('/api/v1/application', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (fallbackErr) {
        throw new Error(
          `Unable to reach System A backend at ${API_BASE}/api/v1/application. Please check that the System A service on port 8081 is running.`
        );
      }
    }

    if (!response.ok) {
      let errorDetail = `Submission rejected by System A (HTTP ${response.status} ${response.statusText})`;
      try {
        const errJson = await response.json();
        if (errJson.message || errJson.error) {
          errorDetail = errJson.message || errJson.error;
        }
      } catch (e) {
        // use default errorDetail
      }
      throw new Error(errorDetail);
    }

    const record: ApplicationRecord = await response.json();
    saveToLocalStore(record);
    return record;
  },

  async getApplicationById(applicationId: string): Promise<ApplicationRecord | null> {
    const query = encodeURIComponent(applicationId.trim());
    try {
      let res: Response;
      try {
        res = await fetch(`${API_BASE}/api/v1/applications/${query}`);
      } catch (err) {
        res = await fetch(`/api/v1/applications/${query}`);
      }

      if (res.ok) {
        const record: ApplicationRecord = await res.json();
        saveToLocalStore(record);
        return record;
      }
    } catch (err) {
      console.warn('Live backend lookup failed, checking local client storage', err);
    }

    const store = getLocalStore();
    const match = store.find(
      (a) =>
        a.applicationId.toLowerCase() === applicationId.trim().toLowerCase() ||
        a.citizenId.toLowerCase() === applicationId.trim().toLowerCase()
    );
    return match || null;
  },

  async getAllApplications(): Promise<ApplicationRecord[]> {
    try {
      let res: Response;
      try {
        res = await fetch(`${API_BASE}/api/v1/applications`);
      } catch (err) {
        res = await fetch('/api/v1/applications');
      }

      if (res.ok) {
        const records: ApplicationRecord[] = await res.json();
        records.forEach(saveToLocalStore);
        return records;
      }
    } catch (e) {
      // Return cached local entries
    }
    return getLocalStore();
  },
};
