import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  GitFork, 
  ArrowUpRight, 
  FileText, 
  Activity, 
  RefreshCw,
  Eye,
  Filter
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { ApplicationDetailsModal } from '../components/applications/ApplicationDetailsModal';
import { StatusUpdateModal } from '../components/applications/StatusUpdateModal';
import { ActionRequestModal } from '../components/applications/ActionRequestModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const DashboardPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [stats, setStats] = useState({
    totalApplications: 0,
    eligibilityVerified: 0,
    onHold: 0,
    approved: 0,
    rejected: 0,
    slaComplianceRate: '99.4%'
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusModalApp, setStatusModalApp] = useState(null);
  const [actionModalApp, setActionModalApp] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, appsData] = await Promise.all([
        api.dashboard.getStats(),
        api.applications.getAll()
      ]);
      setStats(statsData || {});
      setRecentApplications((appsData || []).slice(0, 6));
    } catch (err) {
      addToast('Failed to load dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="page-body">
      {/* Dashboard Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2>Interoperability & Workflow Overview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Government of Maharashtra &bull; Real-time Federated Middleware Monitoring
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm" onClick={loadData} title="Refresh Data">
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('studio')}>
            <GitFork size={14} />
            <span>Open Pipeline Studio</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Ingested Applications"
          value={stats.totalApplications || 0}
          icon={FileText}
          trend="+4.8% this week"
          trendType="positive"
          accentColor="var(--primary-600)"
          bgColor="var(--primary-50)"
        />
        <StatCard
          title="Cross-System Verified"
          value={stats.eligibilityVerified || 0}
          icon={CheckCircle2}
          trend="Automated 2-way match"
          trendType="positive"
          accentColor="var(--emerald-600)"
          bgColor="var(--emerald-light)"
        />
        <StatCard
          title="Under Review / On Hold"
          value={stats.onHold || 0}
          icon={Clock}
          trend="Requires officer action"
          trendType="neutral"
          accentColor="var(--amber-600)"
          bgColor="var(--amber-light)"
        />
        <StatCard
          title="Final Approved Sanctions"
          value={stats.approved || 0}
          icon={CheckCircle}
          trend="Disbursal ready"
          trendType="positive"
          accentColor="var(--emerald-600)"
          bgColor="var(--emerald-light)"
        />
        <StatCard
          title="SLA Compliance Rate"
          value={stats.slaComplianceRate || '99.4%'}
          icon={Activity}
          trend="Target: >98.0%"
          trendType="positive"
          accentColor="var(--cyan-600)"
          bgColor="var(--cyan-light)"
        />
      </div>

      {/* Grid: Departmental Activity Chart + Quick Launch Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Department Volume Breakdown */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Cross-Department Application Volume</div>
              <div className="card-subtitle">Throughput across integrated state departments</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { name: 'Maharashtra State Innovation Society (MSInS)', count: 42, pct: 85, color: 'var(--primary-500)' },
              { name: 'Directorate of Vocational Education & Skills', count: 38, pct: 76, color: 'var(--emerald-500)' },
              { name: 'Chief Minister Employment Exchange (CMEGP)', count: 29, pct: 58, color: 'var(--amber-500)' },
              { name: 'Agriculture & Solar Feeder Registry', count: 18, pct: 36, color: 'var(--cyan-500)' }
            ].map((dept, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{dept.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{dept.count} apps ({dept.pct}%)</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${dept.pct}%`, background: dept.color, borderRadius: 4, transition: 'width 1s ease' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Architecture Quick Visual Card */}
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-subtle) 100%)' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Interoperability Middleware Flow</div>
              <div className="card-subtitle">Automated Canonical Data Normalization</div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('studio')}>
              Launch Studio
            </button>
          </div>

          <div style={{ padding: 12, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: '0.8rem', lineHeight: 1.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-primary)', fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald-500)' }}></span>
              <span>System A (Intake) &rarr; Canonical Transformer &rarr; Multi-Registry Validation</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              EkSutra unifies disparate data structures from legacy XML endpoints and RESTful microservices into a single Canonical Application Model, with zero data duplication.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <span className="badge badge-scheme">REST: System B</span>
              <span className="badge badge-scheme">XML: System C</span>
              <span className="badge badge-verified">Zero-Copy Schema</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Ingested Applications</div>
            <div className="card-subtitle">Latest records processed by EkSutra integration pipeline</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('applications')}>
            View All Applications
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Citizen ID</th>
                <th>Applicant Name</th>
                <th>Scheme Code</th>
                <th>Status</th>
                <th>Eligibility</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app) => (
                <tr key={app.id || app.applicationId}>
                  <td style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                    {app.applicationId}
                  </td>
                  <td>{app.citizenId}</td>
                  <td style={{ fontWeight: 600 }}>{app.applicantName}</td>
                  <td>
                    <span className="badge badge-scheme">{app.schemeCode}</span>
                  </td>
                  <td>
                    <StatusBadge status={app.applicationStatus} />
                  </td>
                  <td>
                    <StatusBadge status={app.overallEligibility ? 'ELIGIBLE' : 'INELIGIBLE'} />
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                  </td>
                  <td>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedApp(app)}
                      title="View Details"
                    >
                      <Eye size={13} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
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
          onSuccess={loadData}
        />
      )}

      {actionModalApp && (
        <ActionRequestModal
          application={actionModalApp}
          onClose={() => setActionModalApp(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};
