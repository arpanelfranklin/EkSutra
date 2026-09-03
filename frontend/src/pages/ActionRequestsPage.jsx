import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Send, 
  FileText, 
  MessageSquare,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const ActionRequestsPage = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null); // { request, decision: 'APPROVED'|'REJECTED', comment: '' }

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await api.applications.getActionRequests();
      setRequests(data || []);
    } catch (err) {
      addToast('Failed to load action requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModal.comment.trim()) {
      addToast('Please provide an official review comment.', 'warning');
      return;
    }

    try {
      await api.applications.reviewActionRequest(reviewModal.request.id, reviewModal.decision, reviewModal.comment);
      addToast(`Action Request marked as ${reviewModal.decision}`, 'success');
      setReviewModal(null);
      loadRequests();
    } catch (err) {
      addToast(err.message || 'Review failed', 'error');
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2>Workflow Action Requests & Approvals Queue</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Authority recommendations requiring Apex Admin sanction and audit compliance.
          </p>
        </div>

        <button className="btn btn-outline btn-sm" onClick={loadRequests}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Role guidance banner */}
      <div className="card" style={{ marginBottom: 24, padding: '14px 20px', background: 'var(--bg-subtle)', borderLeft: '4px solid var(--primary-500)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong>Workflow Hierarchy:</strong> Department <code>AUTHORITY</code> officers submit recommendations &rarr; Apex <code>ADMIN</code> reviews and grants final state sanctions.
          </div>
          <span className="badge badge-role">Current User: {user?.role}</span>
        </div>
      </div>

      {/* Requests List */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckSquare size={18} />
            <div className="card-title">Pending & Historical Action Requests</div>
          </div>
          <span className="badge badge-scheme">{requests.length} Requests</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {requests.length > 0 ? (
            requests.map((req) => (
              <div 
                key={req.id} 
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--primary-600)' }}>{req.applicationId}</strong>
                    <span className={`badge ${req.actionType === 'APPROVE' ? 'badge-verified' : 'badge-rejected'}`}>
                      Action: {req.actionType}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>

                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {req.requestedAt ? new Date(req.requestedAt).toLocaleString() : 'Recent'}
                  </span>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 8, fontSize: '0.84rem' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <strong>Authority Remarks:</strong> "{req.reason}"
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Submitted by: <strong>{req.requestedBy}</strong>
                  </div>
                </div>

                {req.reviewedBy && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: 10, borderRadius: 8, fontSize: '0.82rem' }}>
                    <div><strong>Admin Review Decision:</strong> {req.status} &bull; Reviewed by <strong>{req.reviewedBy}</strong></div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>Comment: "{req.reviewComment}"</div>
                  </div>
                )}

                {/* Admin Actions */}
                {user?.role === 'ADMIN' && req.status === 'PENDING' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setReviewModal({ request: req, decision: 'REJECTED', comment: '' })}
                    >
                      <XCircle size={14} />
                      <span>Reject Request</span>
                    </button>
                    <button
                      className="btn btn-emerald btn-sm"
                      onClick={() => setReviewModal({ request: req, decision: 'APPROVED', comment: '' })}
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve & Update Status</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
              No action requests in queue.
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="modal-overlay" onClick={() => setReviewModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Admin Review Decision: {reviewModal.decision}</h3>
              <button className="btn btn-outline btn-icon-only btn-sm" onClick={() => setReviewModal(null)}>
                <XCircle size={16} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                  You are reviewing request for application <strong>{reviewModal.request.applicationId}</strong>.
                  Granting this decision will automatically update the master application status and log an immutable audit record.
                </p>

                <div className="form-group">
                  <label className="form-label">Admin Sanction Comments / Approval Justification *</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Enter formal sanction remarks..."
                    value={reviewModal.comment}
                    onChange={(e) => setReviewModal({ ...reviewModal, comment: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setReviewModal(null)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn ${reviewModal.decision === 'APPROVED' ? 'btn-emerald' : 'btn-danger'}`}
                >
                  Confirm {reviewModal.decision}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
