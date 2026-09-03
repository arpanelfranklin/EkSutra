import React, { useState } from 'react';
import { X, Send, AlertTriangle } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';

export const ActionRequestModal = ({ application, onClose, onSuccess }) => {
  const [action, setAction] = useState('APPROVE');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useNotification();

  if (!application) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      addToast('Please provide an official recommendation reason.', 'warning');
      return;
    }

    try {
      setLoading(true);
      await api.applications.createActionRequest(application.applicationId, { action, reason });
      addToast(`Action request (${action}) submitted for ${application.applicationId}`, 'success');
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to submit action request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Send size={20} color="var(--saffron-500)" />
            <h3 style={{ margin: 0 }}>Submit Authority Action Request</h3>
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
              <div>Scheme: <strong>{application.schemeCode}</strong></div>
            </div>

            <div className="form-group">
              <label className="form-label">Recommended Action</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  className={`btn ${action === 'APPROVE' ? 'btn-emerald' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => setAction('APPROVE')}
                >
                  Recommend Approval
                </button>
                <button
                  type="button"
                  className={`btn ${action === 'REJECT' ? 'btn-danger' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => setAction('REJECT')}
                >
                  Recommend Rejection
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Recommendation Remarks / Verification Notes *</label>
              <textarea 
                className="form-textarea"
                rows={3}
                placeholder="Detail verification results, physical inspection status, or eligibility rationale for the Apex Admin review..."
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
            <button type="submit" className="btn btn-saffron" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit to Admin Queue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
