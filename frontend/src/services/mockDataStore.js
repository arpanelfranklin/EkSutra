// EkSutra — High-Fidelity Mock Data Store & Offline Engine

export const INITIAL_SCHEMES = [
  {
    code: 'MSINS-STARTUP-2026',
    title: 'Maharashtra Startup Innovation Seed Grant',
    titleMr: 'महाराष्ट्र स्टार्टअप इनोव्हेशन सीड ग्रँट',
    department: 'Maharashtra State Innovation Society (MSInS)',
    description: 'Financial grant & incubation support up to ₹15 Lakhs for innovative early-stage startups registered in Maharashtra.',
    eligibility: 'DPIIT/MSInS registered entity with Maharashtra headquarters and age < 45.',
    category: 'Innovation',
    icon: 'Rocket'
  },
  {
    code: 'PMKVY-MAHA-SKILL',
    title: 'Pramod Mahajan Kaushalya Vikas Abhiyan',
    titleMr: 'प्रमोद महाजन कौशल्य विकास अभियान',
    department: 'Department of Skills, Employment & Innovation',
    description: 'Free vocational, AI, and industrial technical training with guaranteed placement linkage across 36 districts.',
    eligibility: 'Maharashtra domicile, minimum 10th pass, age 18-35.',
    category: 'Skills',
    icon: 'GraduationCap'
  },
  {
    code: 'CMEGP-EMPLOY-01',
    title: 'Chief Minister Employment Generation Programme',
    titleMr: 'मुख्यमंत्री रोजगार निर्मिती कार्यक्रम (CMEGP)',
    department: 'Directorate of Industries & Employment Exchange',
    description: 'Credit-linked subsidy project loans up to ₹50 Lakhs for micro-enterprises and self-employment ventures.',
    eligibility: 'Age 18-45, educational qualification 7th pass or higher.',
    category: 'Employment',
    icon: 'Briefcase'
  },
  {
    code: 'MAHA-FARM-SOLAR',
    title: 'Mukhyamantri Saur Krushi Vahini Yojana',
    titleMr: 'मुख्यमंत्री सौर कृषी वाहिनी योजना',
    department: 'Department of Energy & Agriculture',
    description: 'Day-time reliable solar power feeder subsidy and pump electrification for agricultural farmers.',
    eligibility: 'Registered 7/12 land extract in Maharashtra with existing power connection.',
    category: 'Agriculture',
    icon: 'Sun'
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 'rec-101',
    applicationId: 'MH-MSINS-2026-00892',
    citizenId: 'MH-CIT-98234123',
    applicantName: 'Tanvi Shinde',
    dateOfBirth: '1996-04-14',
    schemeCode: 'MSINS-STARTUP-2026',
    correlationId: 'eks-trace-8f92a10c-33b1-4200',
    overallEligibility: true,
    applicationStatus: 'APPROVED',
    systems: [
      { system: 'SYSTEM-B (Maha-Citizen REST)', eligible: true, status: 'ELIGIBLE - Domicile & Age Verified' },
      { system: 'SYSTEM-C (MSInS Registry XML)', eligible: true, status: 'ELIGIBLE - DPIIT Certificate Valid' }
    ],
    statusHistory: [
      { oldStatus: null, newStatus: 'ELIGIBILITY_VERIFIED', changedBy: 'System Engine', reason: 'Automated 2-System Verification Passed', timestamp: '2026-08-28T09:15:00Z' },
      { oldStatus: 'ELIGIBILITY_VERIFIED', newStatus: 'APPROVED', changedBy: 'admin_officer', reason: 'Board review completed and approved for grant disbursal', timestamp: '2026-08-29T14:30:00Z' }
    ],
    createdAt: '2026-08-28T09:15:00Z',
    updatedAt: '2026-08-29T14:30:00Z'
  },
  {
    id: 'rec-102',
    applicationId: 'MH-SKILL-2026-01452',
    citizenId: 'MH-CIT-48910234',
    applicantName: 'Aditya Rajesh Jadhav',
    dateOfBirth: '2001-11-20',
    schemeCode: 'PMKVY-MAHA-SKILL',
    correlationId: 'eks-trace-1a3b5c7d-99f0-1122',
    overallEligibility: true,
    applicationStatus: 'ELIGIBILITY_VERIFIED',
    systems: [
      { system: 'SYSTEM-B (Maha-Citizen REST)', eligible: true, status: 'ELIGIBLE - Age 24 within permissible limit' },
      { system: 'SYSTEM-C (MSInS Registry XML)', eligible: true, status: 'ELIGIBLE - No active concurrent scheme enrollment' }
    ],
    statusHistory: [
      { oldStatus: null, newStatus: 'ELIGIBILITY_VERIFIED', changedBy: 'System Engine', reason: 'Cross-department verification successful', timestamp: '2026-09-01T10:20:00Z' }
    ],
    createdAt: '2026-09-01T10:20:00Z',
    updatedAt: '2026-09-01T10:20:00Z'
  },
  {
    id: 'rec-103',
    applicationId: 'MH-CMEGP-2026-00431',
    citizenId: 'MH-CIT-11029384',
    applicantName: 'Suresh Baban Patil',
    dateOfBirth: '1985-07-09',
    schemeCode: 'CMEGP-EMPLOY-01',
    correlationId: 'eks-trace-44dd22ee-aa88-7711',
    overallEligibility: false,
    applicationStatus: 'ON_HOLD',
    systems: [
      { system: 'SYSTEM-B (Maha-Citizen REST)', eligible: true, status: 'ELIGIBLE - Domicile Match' },
      { system: 'SYSTEM-C (MSInS Registry XML)', eligible: false, status: 'INELIGIBLE - Prior Bank Subsidy Pending NOC' }
    ],
    statusHistory: [
      { oldStatus: null, newStatus: 'ON_HOLD', changedBy: 'System Engine', reason: 'Discrepancy in System C Financial NOC', timestamp: '2026-09-01T14:45:00Z' }
    ],
    createdAt: '2026-09-01T14:45:00Z',
    updatedAt: '2026-09-01T14:45:00Z'
  },
  {
    id: 'rec-104',
    applicationId: 'MH-SOLAR-2026-09120',
    citizenId: 'MH-CIT-77881122',
    applicantName: 'Anandi Ganesh Deshmukh',
    dateOfBirth: '1978-02-18',
    schemeCode: 'MAHA-FARM-SOLAR',
    correlationId: 'eks-trace-99bb11aa-33ff-5566',
    overallEligibility: false,
    applicationStatus: 'REJECTED',
    systems: [
      { system: 'SYSTEM-B (Maha-Citizen REST)', eligible: false, status: 'INELIGIBLE - Land parcel outside feeder grid' },
      { system: 'SYSTEM-C (MSInS Registry XML)', eligible: true, status: 'ELIGIBLE - Solar quota available' }
    ],
    statusHistory: [
      { oldStatus: null, newStatus: 'REJECTED', changedBy: 'authority_officer', reason: 'Feeder distance threshold exceeded (System B)', timestamp: '2026-08-30T11:10:00Z' }
    ],
    createdAt: '2026-08-30T08:00:00Z',
    updatedAt: '2026-08-30T11:10:00Z'
  }
];

export const INITIAL_ACTION_REQUESTS = [
  {
    id: 'req-201',
    applicationId: 'MH-SKILL-2026-01452',
    actionType: 'APPROVE',
    status: 'PENDING',
    reason: 'Verified candidate credentials & training batch allocation at Pune centre.',
    requestedBy: 'authority_officer',
    requestedAt: '2026-09-01T12:00:00Z',
    reviewedBy: null,
    reviewComment: null,
    reviewedAt: null
  },
  {
    id: 'req-202',
    applicationId: 'MH-CMEGP-2026-00431',
    actionType: 'REJECT',
    status: 'PENDING',
    reason: 'NOC certificate from District Industries Centre not submitted within deadline.',
    requestedBy: 'authority_officer',
    requestedAt: '2026-09-02T09:30:00Z',
    reviewedBy: null,
    reviewComment: null,
    reviewedAt: null
  }
];

// Local Storage Helper
const STORAGE_KEYS = {
  APPLICATIONS: 'eksutra_mock_applications',
  REQUESTS: 'eksutra_mock_action_requests'
};

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export class MockDataStore {
  constructor() {
    this.applications = loadFromStorage(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    this.actionRequests = loadFromStorage(STORAGE_KEYS.REQUESTS, INITIAL_ACTION_REQUESTS);
  }

  getApplications() {
    return [...this.applications];
  }

  findByApplicationId(appId) {
    return this.applications.find(a => a.applicationId.toLowerCase() === appId.toLowerCase() || a.id === appId);
  }

  searchApplications(query) {
    if (!query) return this.getApplications();
    const q = query.toLowerCase();
    return this.applications.filter(a =>
      a.applicationId.toLowerCase().includes(q) ||
      a.citizenId.toLowerCase().includes(q) ||
      a.applicantName.toLowerCase().includes(q) ||
      a.schemeCode.toLowerCase().includes(q)
    );
  }

  updateApplicationStatus(appId, newStatus, reason, changedBy = 'admin_officer') {
    const index = this.applications.findIndex(a => a.applicationId === appId);
    if (index === -1) throw new Error('Application not found');

    const app = this.applications[index];
    const oldStatus = app.applicationStatus;
    app.applicationStatus = newStatus;
    app.updatedAt = new Date().toISOString();
    app.statusHistory = app.statusHistory || [];
    app.statusHistory.push({
      oldStatus,
      newStatus,
      changedBy,
      reason: reason || 'Status updated via administrative console',
      timestamp: new Date().toISOString()
    });

    this.applications[index] = { ...app };
    saveToStorage(STORAGE_KEYS.APPLICATIONS, this.applications);
    return this.applications[index];
  }

  createActionRequest(appId, { action, reason }, requestedBy = 'authority_officer') {
    const app = this.findByApplicationId(appId);
    if (!app) throw new Error('Application not found');
    if (app.applicationStatus === 'APPROVED' || app.applicationStatus === 'REJECTED') {
      throw new Error('Application is already in final state');
    }

    const newReq = {
      id: `req-${Date.now()}`,
      applicationId: appId,
      actionType: action,
      status: 'PENDING',
      reason,
      requestedBy,
      requestedAt: new Date().toISOString(),
      reviewedBy: null,
      reviewComment: null,
      reviewedAt: null
    };

    this.actionRequests.unshift(newReq);
    saveToStorage(STORAGE_KEYS.REQUESTS, this.actionRequests);
    return newReq;
  }

  getActionRequests() {
    return [...this.actionRequests];
  }

  reviewActionRequest(requestId, decision, comment, reviewedBy = 'admin_officer') {
    const index = this.actionRequests.findIndex(r => r.id === requestId);
    if (index === -1) throw new Error('Request not found');

    const req = this.actionRequests[index];
    req.status = decision;
    req.reviewedBy = reviewedBy;
    req.reviewComment = comment;
    req.reviewedAt = new Date().toISOString();

    if (decision === 'APPROVED') {
      const targetStatus = req.actionType === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      this.updateApplicationStatus(req.applicationId, targetStatus, `Approved Action Request: ${comment}`, reviewedBy);
    }

    this.actionRequests[index] = { ...req };
    saveToStorage(STORAGE_KEYS.REQUESTS, this.actionRequests);
    return this.actionRequests[index];
  }

  processIntegrationApplication(payload) {
    const correlationId = `eks-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 8)}`;
    
    // Simulate multi-system business rules
    const bEligible = payload.dob ? (new Date().getFullYear() - new Date(payload.dob).getFullYear()) >= 18 : true;
    const cEligible = !payload.fname.toLowerCase().includes('ineligible') && !payload.lname.toLowerCase().includes('fail');
    
    const sysBResult = {
      system: 'SYSTEM-B (Maha-Citizen REST)',
      eligible: bEligible,
      status: bEligible ? 'ELIGIBLE - Domicile & Age Validated' : 'INELIGIBLE - Age Requirement Not Met'
    };

    const sysCResult = {
      system: 'SYSTEM-C (MSInS Registry XML)',
      eligible: cEligible,
      status: cEligible ? 'ELIGIBLE - Verification Passed in Registry' : 'INELIGIBLE - Concurrent Subsidy Conflict'
    };

    const systems = [sysBResult, sysCResult];
    const overallEligible = sysBResult.eligible && sysCResult.eligible;
    const initialStatus = overallEligible ? 'ELIGIBILITY_VERIFIED' : 'ON_HOLD';

    const newApp = {
      id: `rec-${Date.now()}`,
      applicationId: payload.applicationId || `MH-GEN-${Math.floor(10000 + Math.random() * 90000)}`,
      citizenId: payload.beneficiaryId || `MH-CIT-${Math.floor(10000000 + Math.random() * 90000000)}`,
      applicantName: `${payload.fname} ${payload.lname}`.trim(),
      dateOfBirth: payload.dob,
      schemeCode: payload.schemeCode,
      correlationId,
      overallEligibility: overallEligible,
      applicationStatus: initialStatus,
      systems,
      statusHistory: [
        {
          oldStatus: null,
          newStatus: initialStatus,
          changedBy: 'EkSutra Integration Engine',
          reason: overallEligible ? 'All downstream systems verified successfully' : 'One or more systems flagged eligibility rules',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.applications.unshift(newApp);
    saveToStorage(STORAGE_KEYS.APPLICATIONS, this.applications);

    return {
      applicationId: newApp.applicationId,
      citizenId: newApp.citizenId,
      correlationId: newApp.correlationId,
      eligible: overallEligible,
      systems: newApp.systems
    };
  }

  getDashboardStats() {
    return {
      totalApplications: this.applications.length,
      eligibilityVerified: this.applications.filter(a => a.applicationStatus === 'ELIGIBILITY_VERIFIED').length,
      onHold: this.applications.filter(a => a.applicationStatus === 'ON_HOLD').length,
      approved: this.applications.filter(a => a.applicationStatus === 'APPROVED').length,
      rejected: this.applications.filter(a => a.applicationStatus === 'REJECTED').length,
      slaComplianceRate: '99.4%',
      activeConnectors: 2,
      crossDeptIntegrations: 4
    };
  }

  resetDemoData() {
    this.applications = [...INITIAL_APPLICATIONS];
    this.actionRequests = [...INITIAL_ACTION_REQUESTS];
    saveToStorage(STORAGE_KEYS.APPLICATIONS, this.applications);
    saveToStorage(STORAGE_KEYS.REQUESTS, this.actionRequests);
  }
}

export const mockStore = new MockDataStore();
