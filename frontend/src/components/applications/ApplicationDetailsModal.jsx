import React, { useState } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  CreditCard, 
  FileCode, 
  GitBranch, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Server,
  Layers,
  ShieldCheck,
  Send
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useAuth } from '../../context/AuthContext';

export const ApplicationDetailsModal = ({ application, onClose, onOpenStatusModal, onOpenActionModal }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'canonical', 'audit'

  if (!application) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-dialog-large" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{application.applicationId}</h3>
              <StatusBadge status={application.applicationStatus} />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Citizen ID: <strong style={{ color: 'var(--text-primary)' }}>{application.citizenId}</strong> &bull; Scheme: <span className="badge badge-scheme">{application.schemeCode}</span>
            </p>
          </div>
          <button className="btn btn-outline btn-icon-only btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 24px', background: 'var(--bg-subtle)' }}>
          <button
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '0', borderBottom: 'none', padding: '10px 16px', fontSize: '0.82rem' }}
            onClick={() => setActiveTab('overview')}
          >
            Overview & Verification
          </button>
          <button
            className={`btn ${activeTab === 'canonical' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '0', borderBottom: 'none', padding: '10px 16px', fontSize: '0.82rem' }}
            onClick={() => setActiveTab('canonical')}
          >
            Canonical Data Model (JSON)
          </button>
          <button
            className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '0', borderBottom: 'none', padding: '10px 16px', fontSize: '0.82rem' }}
            onClick={() => setActiveTab('audit')}
          >
            Status Audit Trail ({application.statusHistory?.length || 0})
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeTab === 'overview' && (
            <div>
              {/* Correlation Header */}
              <div className="correlation-badge-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GitBranch size={16} color="var(--primary-500)" />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Transaction Correlation ID:</span>
                  <span className="correlation-id-text">{application.correlationId || 'eks-auto-generated'}</span>
                </div>
                <span className="badge badge-scheme">X-Correlation-ID</span>
              </div>

              {/* Citizen Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24, background: 'var(--bg-subtle)', padding: 16, border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Applicant Full Name</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{application.applicantName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Date of Birth</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{application.dateOfBirth || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Overall Eligibility</div>
                  <div style={{ marginTop: 4 }}>
                    <StatusBadge status={application.overallEligibility ? 'ELIGIBLE' : 'INELIGIBLE'} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Submission Timestamp</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {application.createdAt ? new Date(application.createdAt).toLocaleString() : 'Recent'}
                  </div>
                </div>
              </div>

              {/* Multi-System Verification Results */}
              <h4 style={{ fontSize: '0.92rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Server size={16} />
                <span>Cross-Departmental Interoperability Checks</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {application.systems && application.systems.length > 0 ? (
                  application.systems.map((sys, idx) => (
                    <div 
                      key={idx} 
                      style={{
                        padding: '14px 16px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {sys.eligible ? (
                          <CheckCircle size={20} color="var(--emerald-500)" />
                        ) : (
                          <AlertCircle size={20} color="var(--rose-500)" />
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{sys.system}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{sys.status}</div>
                        </div>
                      </div>
                      <StatusBadge status={sys.eligible ? 'ELIGIBLE' : 'INELIGIBLE'} />
                    </div>
                  ))
                ) : (
                  <div style={{ padding: 16, background: 'var(--bg-subtle)', borderRadius: 8, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    No multi-system verification logs attached.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'canonical' && (
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                Normalized canonical data model generated by EkSutra middleware layer for cross-registry interoperability:
              </p>
              <div className="code-viewer-panel">
                <div className="code-viewer-header">
                  <span>CanonicalApplication.json</span>
                  <span>Schema v3.1</span>
                </div>
                <div className="code-viewer-content">
                  {JSON.stringify({
                    applicationId: application.applicationId,
                    citizenId: application.citizenId,
                    applicantName: application.applicantName,
                    dateOfBirth: application.dateOfBirth,
                    schemeCode: application.schemeCode,
                    correlationId: application.correlationId,
                    overallEligibility: application.overallEligibility,
                    applicationStatus: application.applicationStatus,
                    downstreamSystems: application.systems
                  }, null, 2)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="timeline-container">
              {application.statusHistory && application.statusHistory.length > 0 ? (
                application.statusHistory.map((history, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-dot completed">
                      <CheckCircle size={12} />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <strong style={{ color: 'var(--text-primary)' }}>
                          Status: <StatusBadge status={history.newStatus} />
                        </strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {history.timestamp ? new Date(history.timestamp).toLocaleString() : 'Just now'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                        {history.reason || 'No description provided.'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        Officer / Trigger: <strong>{history.changedBy || 'System Engine'}</strong>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>No audit history records available.</div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>

          {/* Authority action request trigger */}
          {user?.role === 'AUTHORITY' && application.applicationStatus !== 'APPROVED' && application.applicationStatus !== 'REJECTED' && (
            <button 
              className="btn btn-saffron"
              onClick={() => {
                onClose();
                onOpenActionModal(application);
              }}
            >
              <Send size={14} />
              <span>Submit Action Request</span>
            </button>
          )}

          {/* Admin status update trigger */}
          {user?.role === 'ADMIN' && (
            <button 
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onOpenStatusModal(application);
              }}
            >
              <ShieldCheck size={14} />
              <span>Update Status Workflow</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
