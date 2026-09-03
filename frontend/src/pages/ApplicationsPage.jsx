import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  ShieldCheck, 
  Send, 
  FileSpreadsheet, 
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { ApplicationDetailsModal } from '../components/applications/ApplicationDetailsModal';
import { StatusUpdateModal } from '../components/applications/StatusUpdateModal';
import { ActionRequestModal } from '../components/applications/ActionRequestModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const ApplicationsPage = ({ onNavigateToStudio }) => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [schemeFilter, setSchemeFilter] = useState('ALL');

  // Modals
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusModalApp, setStatusModalApp] = useState(null);
  const [actionModalApp, setActionModalApp] = useState(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      let data;
      if (searchQuery.trim()) {
        data = await api.applications.search(searchQuery.trim());
      } else {
        data = await api.applications.getAll();
      }
      setApplications(data || []);
    } catch (err) {
      addToast('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadApplications();
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'ALL' || app.applicationStatus === statusFilter;
    const matchesScheme = schemeFilter === 'ALL' || app.schemeCode === schemeFilter;
    return matchesStatus && matchesScheme;
  });

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2>Applications Master Registry</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Unified view of all citizen welfare applications across Maharashtra state schemes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm" onClick={loadApplications}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={onNavigateToStudio}>
            <Plus size={14} />
            <span>New Application Pipeline</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar-wrapper" style={{ minWidth: 260 }}>
            <Search size={16} className="search-icon-pos" />
            <input
              type="text"
              className="search-bar-input"
              placeholder="Search by App ID, Citizen ID, Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={15} color="var(--text-muted)" />
            <select
              className="form-select"
              style={{ width: 170, padding: '8px 12px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ELIGIBILITY_VERIFIED">Verified</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              className="form-select"
              style={{ width: 200, padding: '8px 12px' }}
              value={schemeFilter}
              onChange={(e) => setSchemeFilter(e.target.value)}
            >
              <option value="ALL">All Scheme Codes</option>
              <option value="MSINS-STARTUP-2026">MSINS-STARTUP-2026</option>
              <option value="PMKVY-MAHA-SKILL">PMKVY-MAHA-SKILL</option>
              <option value="CMEGP-EMPLOY-01">CMEGP-EMPLOY-01</option>
              <option value="MAHA-FARM-SOLAR">MAHA-FARM-SOLAR</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            Apply Filters
          </button>
        </form>
      </div>

      {/* Applications Data Table */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileSpreadsheet size={18} />
            <div className="card-title">Registry Records ({filteredApps.length})</div>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Logged in as <strong>{user?.role || 'OFFICER'}</strong>
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Citizen ID</th>
                <th>Applicant Name</th>
                <th>DOB</th>
                <th>Scheme Code</th>
                <th>Status</th>
                <th>Interoperable Match</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app.id || app.applicationId}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                      {app.applicationId}
                    </td>
                    <td>{app.citizenId}</td>
                    <td style={{ fontWeight: 600 }}>{app.applicantName}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{app.dateOfBirth || 'N/A'}</td>
                    <td>
                      <span className="badge badge-scheme">{app.schemeCode}</span>
                    </td>
                    <td>
                      <StatusBadge status={app.applicationStatus} />
                    </td>
                    <td>
                      <StatusBadge status={app.overallEligibility ? 'ELIGIBLE' : 'INELIGIBLE'} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setSelectedApp(app)}
                          title="Inspect Details"
                        >
                          <Eye size={13} />
                          <span>Inspect</span>
                        </button>

                        {user?.role === 'AUTHORITY' && app.applicationStatus !== 'APPROVED' && app.applicationStatus !== 'REJECTED' && (
                          <button
                            className="btn btn-saffron btn-sm"
                            onClick={() => setActionModalApp(app)}
                            title="Submit Action Request"
                          >
                            <Send size={13} />
                            <span>Action</span>
                          </button>
                        )}

                        {user?.role === 'ADMIN' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setStatusModalApp(app)}
                            title="Update Status"
                          >
                            <ShieldCheck size={13} />
                            <span>Status</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                    No applications matched your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedApp && (
        <ApplicationDetailsModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onOpenStatusModal={(app) => {
            setSelectedApp(null);
            setStatusModalApp(app);
          }}
          onOpenActionModal={(app) => {
            setSelectedApp(null);
            setActionModalApp(app);
          }}
        />
      )}

      {statusModalApp && (
        <StatusUpdateModal
          application={statusModalApp}
          onClose={() => setStatusModalApp(null)}
          onSuccess={loadApplications}
        />
      )}

      {actionModalApp && (
        <ActionRequestModal
          application={actionModalApp}
          onClose={() => setActionModalApp(null)}
          onSuccess={loadApplications}
        />
      )}
    </div>
  );
};
