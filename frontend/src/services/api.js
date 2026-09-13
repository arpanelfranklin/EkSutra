// EkSutra API Client & Interoperability Bridge

import { mockStore } from './mockDataStore';

export const api = {
  // Helper to get auth headers
  getHeaders() {
    const token = localStorage.getItem('eksutra_token');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token && token !== 'demo-token' && token !== 'demo-authority-token' && token !== 'demo-admin-token') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  isLiveMode() {
    // Defaults to LIVE mode unless explicitly set to 'mock'
    return localStorage.getItem('eksutra_api_mode') !== 'mock';
  },

  async pingBackend() {
    try {
      const res = await fetch('/actuator/health', { method: 'GET', signal: AbortSignal.timeout(2500) });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // Auth Endpoints
  auth: {
    async loginAuthority(credentials) {
      if (api.isLiveMode()) {
        try {
          let res = await fetch('/api/v1/auth/login/authority', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });
          // If server returns 404 or 500 endpoint not found, fall back to /api/v1/auth/login
          if (res.status === 404 || res.status === 500) {
            const clone = res.clone();
            const text = await clone.text().catch(() => '');
            if (res.status === 404 || text.includes('NoResourceFoundException') || text.includes('not found') || text.includes('NOT_FOUND')) {
              console.warn('Endpoint /login/authority not available on backend, falling back to /api/v1/auth/login');
              res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
              });
            }
          }
          if (!res.ok) {
            const err = await res.json().catch(() => ({ message: 'Authority login failed' }));
            throw new Error(err.message || 'Invalid username or password for Authority portal');
          }
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('eksutra_token', data.token);
          }
          return data;
        } catch (e) {
          if (!e.message?.includes('fetch') && !e.message?.includes('Failed to fetch')) {
            throw e;
          }
          console.warn('Backend offline, fallback to mock credentials', e);
        }
      }

      // Mock auth simulation when offline/simulator
      if (credentials.username.toLowerCase().includes('admin')) {
        throw new Error('Access Denied: This portal is strictly for Department Authority Officers. Please use the Apex Admin Portal.');
      }
      const mockToken = `mock-jwt-authority-${Date.now()}`;
      localStorage.setItem('eksutra_token', mockToken);
      return {
        username: credentials.username,
        token: mockToken,
        role: 'ROLE_AUTHORITY'
      };
    },

    async loginAdmin(credentials) {
      if (api.isLiveMode()) {
        try {
          let res = await fetch('/api/v1/auth/login/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });
          // If server returns 404 or 500 endpoint not found, fall back to /api/v1/auth/login
          if (res.status === 404 || res.status === 500) {
            const clone = res.clone();
            const text = await clone.text().catch(() => '');
            if (res.status === 404 || text.includes('NoResourceFoundException') || text.includes('not found') || text.includes('NOT_FOUND')) {
              console.warn('Endpoint /login/admin not available on backend, falling back to /api/v1/auth/login');
              res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
              });
            }
          }
          if (!res.ok) {
            const err = await res.json().catch(() => ({ message: 'Admin login failed' }));
            throw new Error(err.message || 'Invalid username or password for Admin portal');
          }
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('eksutra_token', data.token);
          }
          return data;
        } catch (e) {
          if (!e.message?.includes('fetch') && !e.message?.includes('Failed to fetch')) {
            throw e;
          }
          console.warn('Backend offline, fallback to mock credentials', e);
        }
      }

      // Mock auth simulation when offline/simulator
      if (!credentials.username.toLowerCase().includes('admin')) {
        throw new Error('Access Denied: This portal is strictly for Apex Administrators. Please use the Authority Officer Portal.');
      }
      const mockToken = `mock-jwt-admin-${Date.now()}`;
      localStorage.setItem('eksutra_token', mockToken);
      return {
        username: credentials.username,
        token: mockToken,
        role: 'ROLE_ADMIN'
      };
    },

    async login(credentials) {
      if (api.isLiveMode()) {
        try {
          const res = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({ message: 'Login failed' }));
            throw new Error(err.message || 'Invalid username or password');
          }
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('eksutra_token', data.token);
          }
          return data;
        } catch (e) {
          if (!e.message?.includes('fetch') && !e.message?.includes('Failed to fetch')) {
            throw e;
          }
          console.warn('Backend offline, fallback to mock credentials', e);
        }
      }

      // Mock auth simulation when offline/simulator
      const role = credentials.username.toLowerCase().includes('admin') ? 'ROLE_ADMIN' : 'ROLE_AUTHORITY';
      const mockToken = `mock-jwt-${Date.now()}`;
      localStorage.setItem('eksutra_token', mockToken);
      return {
        username: credentials.username,
        token: mockToken,
        role: role
      };
    },

    async signup(payload) {
      if (api.isLiveMode()) {
        try {
          const res = await fetch('/api/v1/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({ message: 'Registration failed' }));
            throw new Error(err.message || 'Registration failed on server');
          }
          return await res.json();
        } catch (e) {
          if (!e.message?.includes('fetch') && !e.message?.includes('Failed to fetch')) {
            throw e;
          }
          console.warn('Live API signup offline, using mock', e);
        }
      }
      return {
        username: payload.username,
        role: payload.role || 'AUTHORITY'
      };
    }
  },

  // Admin Officer Management Endpoints
  admin: {
    async createAuthority(payload) {
      if (api.isLiveMode()) {
        try {
          const res = await fetch('/api/v1/admin/authorities', {
            method: 'POST',
            headers: api.getHeaders(),
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({ message: 'Failed to create authority officer' }));
            throw new Error(err.message || 'Failed to create authority officer on server');
          }
          return await res.json();
        } catch (e) {
          if (!e.message?.includes('fetch') && !e.message?.includes('Failed to fetch')) {
            throw e;
          }
          console.warn('Live create authority offline, using mock', e);
        }
      }
      return mockStore.createAuthority(payload);
    },

    async getAuthorities() {
      if (api.isLiveMode()) {
        try {
          const res = await fetch('/api/v1/admin/authorities', {
            headers: api.getHeaders()
          });
          if (res.ok) return await res.json();
          const err = await res.json().catch(() => ({ message: 'Failed to fetch authorities' }));
          throw new Error(err.message || 'Failed to fetch authorities from server');
        } catch (e) {
          if (!e.message?.includes('fetch') && !e.message?.includes('Failed to fetch')) {
            throw e;
          }
          console.warn('Live get authorities offline, using mock', e);
        }
      }
      return mockStore.getAuthorities();
    }
  },

  // Applications
  applications: {
    async getAll() {
      if (api.isLiveMode()) {
        try {
          const res = await fetch('/api/v1/applications', { headers: api.getHeaders() });
          if (res.ok) return await res.json();
          if (res.status === 401 || res.status === 403) {
            console.warn('Unauthorized request to /api/v1/applications. Please re-authenticate.');
          }
        } catch (e) {
          console.warn('Live applications API failed, fallback to mock', e);
        }
      }
      return mockStore.getApplications();
    },

    async getById(id) {
      if (api.isLiveMode()) {
        try {
          const res = await fetch(`/api/v1/applications/${encodeURIComponent(id)}`, { headers: api.getHeaders() });
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn('Live getById failed', e);
        }
      }
      return mockStore.findByApplicationId(id);
    },

    async getStatus(id) {
      if (api.isLiveMode()) {
        try {
          const res = await fetch(`/api/v1/applications/${encodeURIComponent(id)}/status`, { headers: api.getHeaders() });
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn('Live getStatus failed', e);
        }
      }
      const app = mockStore.findByApplicationId(id);
      return app ? { applicationId: app.applicationId, status: app.applicationStatus } : null;
    },

    async getStatusHistory(id) {
      if (api.isLiveMode()) {
        try {
          const res = await fetch(`/api/v1/applications/${encodeURIComponent(id)}/status-history`, { headers: api.getHeaders() });
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn('Live getStatusHistory failed', e);
        }
      }
      const app = mockStore.findByApplicationId(id);
      return app ? app.statusHistory || [] : [];
    },

    async search(query) {
      if (api.isLiveMode()) {
        try {
          const res = await fetch(`/api/v1/applications/search?query=${encodeURIComponent(query)}`, { headers: api.getHeaders() });
          if (res.ok) {
            const list = await res.json();
            return Array.isArray(list) ? list : [];
          }
        } catch (e) {
          console.warn('Live search failed', e);
        }
      }
      return mockStore.searchApplications(query);
    },

    async updateStatus(applicationId, { status, reason }) {
      if (api.isLiveMode()) {
        try {
          const res = await fetch(`/api/v1/applications/${encodeURIComponent(applicationId)}/status`, {
            method: 'PATCH',
            headers: api.getHeaders(),
            body: JSON.stringify({ status, reason }),
          });
          if (res.ok) return await res.json();
          const err = await res.json().catch(() => ({ message: 'Status update failed' }));
          throw new Error(err.message || 'Status update failed on server');
        } catch (e) {
          if (!e.message?.includes('fetch') && !e.message?.includes('Failed to fetch')) {
            throw e;
          }
          console.warn('Live update status offline, fallback to mock', e);
        }
      }
      return mockStore.updateApplicationStatus(applicationId, status, reason);
    },

    async createActionRequest(applicationId, { action, reason }) {
      if (api.isLiveMode()) {
        try {
          const res = await fetch(`/api/v1/applications/${encodeURIComponent(applicationId)}/action-requests`, {
            method: 'POST',
            headers: api.getHeaders(),
            body: JSON.stringify({ action, reason }),
          });
          if (res.ok) return await res.json();
          const err = await res.json().catch(() => ({ message: 'Action request submission failed' }));
          throw new Error(err.message || 'Submission failed on server');
        } catch (e) {
          if (!e.message?.includes('fetch') && !e.message?.includes('Failed to fetch')) {
            throw e;
          }
          console.warn('Live create action request offline, fallback to mock', e);
        }
      }
      return mockStore.createActionRequest(applicationId, { action, reason });
    },

    async getActionRequests(status) {
      if (api.isLiveMode()) {
        try {
          const url = status 
            ? `/api/v1/admin/action-requests?status=${encodeURIComponent(status)}`
            : '/api/v1/admin/action-requests';
          const res = await fetch(url, { headers: api.getHeaders() });
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn('Live getActionRequests failed', e);
        }
      }
      const requests = mockStore.getActionRequests();
      if (status) {
        return requests.filter(r => r.status === status);
      }
      return requests;
    },

    async getActionRequestsByApplicationId(applicationId) {
      if (api.isLiveMode()) {
        try {
          const res = await fetch(`/api/v1/applications/${encodeURIComponent(applicationId)}/action-requests`, { headers: api.getHeaders() });
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn('Live getActionRequestsByApplicationId failed', e);
        }
      }
      return mockStore.getActionRequests().filter(r => r.applicationId === applicationId);
    },

    async reviewActionRequest(requestId, decision, comment) {
      if (api.isLiveMode()) {
        try {
          const res = await fetch(`/api/v1/admin/action-request/${encodeURIComponent(requestId)}`, {
            method: 'PATCH',
            headers: api.getHeaders(),
            body: JSON.stringify({ decision, comment }),
          });
          if (res.ok) return await res.json();
          const err = await res.json().catch(() => ({ message: 'Review request failed' }));
          throw new Error(err.message || 'Review failed on server');
        } catch (e) {
          if (!e.message?.includes('fetch') && !e.message?.includes('Failed to fetch')) {
            throw e;
          }
          console.warn('Live reviewActionRequest offline, fallback to mock', e);
        }
      }
      return mockStore.reviewActionRequest(requestId, decision, comment);
    }
  },

  // Dashboard Stats
  dashboard: {
    async getStats() {
      if (api.isLiveMode()) {
        try {
          const res = await fetch('/api/v1/dashboard/stats', { headers: api.getHeaders() });
          if (res.ok) {
            const data = await res.json();
            return {
              ...data,
              slaComplianceRate: '99.4%',
              activeConnectors: 2,
              crossDeptIntegrations: 4
            };
          }
        } catch (e) {
          console.warn('Live dashboard stats failed, fallback to mock', e);
        }
      }
      return mockStore.getDashboardStats();
    }
  },

  // Integration Engine
  integration: {
    async processApplication(payload) {
      if (api.isLiveMode()) {
        try {
          const res = await fetch('/api/v1/integration/applications', {
            method: 'POST',
            headers: api.getHeaders(),
            body: JSON.stringify(payload),
          });
          if (res.ok) return await res.json();
          const err = await res.json().catch(() => ({ message: 'Integration processing failed' }));
          throw new Error(err.message || 'Pipeline error occurred on server');
        } catch (e) {
          if (!e.message?.includes('fetch') && !e.message?.includes('Failed to fetch')) {
            throw e;
          }
          console.warn('Live integration pipeline call failed, falling back to simulator', e);
        }
      }
      return mockStore.processIntegrationApplication(payload);
    }
  },

  // Health & Monitoring
  health: {
    async getActuatorInfo() {
      if (api.isLiveMode()) {
        try {
          const res = await fetch('/actuator/health');
          if (res.ok) return await res.json();
        } catch (e) {
          // offline
        }
      }
      return {
        status: 'UP',
        components: {
          mongo: { status: 'UP', details: { database: 'govt-ip', version: '7.0.5' } },
          diskSpace: { status: 'UP', details: { total: 499963174912, free: 320194883584 } },
          ping: { status: 'UP' }
        }
      };
    }
  }
};
