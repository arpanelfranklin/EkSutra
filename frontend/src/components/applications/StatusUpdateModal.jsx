import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';

export const StatusUpdateModal = ({ application, onClose, onSuccess }) => {
  const [status, setStatus] = useState(application?.applicationStatus || 'ELIGIBILITY_VERIFIED');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useNotification();

  if (!application) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      addToast('Please specify an audit reason for the status change.', 'warning');
      return;
    }

    try {
      setLoading(true);
      await api.applications.updateStatus(application.applicationId, { status, reason });
      addToast(`Status for ${application.applicationId} updated to ${status}`, 'success');
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={20} color="var(--primary-600)" />
            <h3 style={{ margin: 0 }}>Update Application Status</h3>
          </div>
          <button className="btn btn-outline btn-icon-only btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: '0.84rem' }}>
              <div>Application ID: <strong>{application.applicationId}</strong></div>
              <div>Applicant: <strong>{application.applicantName}</strong></div>
              <div>Current Status: <strong>{application.applicationStatus}</strong></div>
            </div>

            <div className="form-group">
              <label className="form-label">New Application Status</label>
              <select 
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="ELIGIBILITY_VERIFIED">ELIGIBILITY_VERIFIED (Cross-check Passed)</option>
                <option value="ON_HOLD">ON_HOLD (Pending External Clarification)</option>
                <option value="APPROVED">APPROVED (Final Scheme Sanction)</option>
                <option value="REJECTED">REJECTED (Disqualified)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Audit Reason & Justification *</label>
              <textarea 
                className="form-textarea"
                rows={3}
                placeholder="Enter formal justification for audit logs and citizen notification..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Confirm Status Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
