import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, XCircle, ArrowRight, ShieldCheck, FileText, Info } from 'lucide-react';
import { api } from '../services/api';
import { ApplicationRecord } from '../types/application';
import { StatusBadge } from '../components/common/StatusBadge';

interface TrackPageProps {
  initialId?: string;
  onNavigate: (tab: string) => void;
}

export const TrackPage: React.FC<TrackPageProps> = ({ initialId, onNavigate }) => {
  const [searchId, setSearchId] = useState(initialId || '');
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<ApplicationRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchId.trim();
    if (!query) {
      setErrorMsg('Please enter a valid Application ID (e.g. APP-10042) or Citizen ID.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const record = await api.getApplicationById(query);
      if (record) {
        setApplication(record);
      } else {
        setApplication(null);
        setErrorMsg(`No application found matching "${query}". Please check the ID.`);
      }
    } catch (err) {
      setErrorMsg('Unable to retrieve application records. Please try again.');
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    if (initialId) {
      setSearchId(initialId);
      handleTrack();
    }
  }, [initialId]);

  return (
    <div style={{ maxWidth: 740, margin: '0 auto' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gov-primary)' }}>
          Track Your Application Status
        </h2>
        <p style={{ color: 'var(--gov-text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
          Enter your Application Reference ID or Citizen Identifier to view the real-time processing status.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="card" style={{ marginBottom: 28 }}>
        <form onSubmit={handleTrack} style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 40, fontSize: '0.96rem' }}
              placeholder="Enter Application ID (e.g. APP-10042) or Citizen ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--gov-text-muted)' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }} disabled={loading}>
            {loading ? 'Searching...' : 'Track Application'}
          </button>
        </form>

        {errorMsg && (
          <p style={{ color: '#dc2626', fontSize: '0.84rem', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Info size={14} />
            <span>{errorMsg}</span>
          </p>
        )}
      </div>

      {/* Results View */}
      {application && (
        <div className="card" style={{ padding: 28 }}>
          {/* Header Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--gov-border)', paddingBottom: 16, marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--gov-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Application Record
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gov-primary)', marginTop: 2 }}>
                {application.applicationId}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--gov-text-secondary)', marginTop: 2 }}>
                Applicant: <strong>{application.applicantName}</strong> &bull; Scheme: <span style={{ fontWeight: 600 }}>{application.schemeCode}</span>
              </p>
            </div>
            <StatusBadge status={application.status} />
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20 }}>
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--gov-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Citizen ID</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, marginTop: 2 }}>{application.citizenId || application.beneficiaryId || 'N/A'}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--gov-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Date of Birth</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, marginTop: 2 }}>{application.dob || application.dateOfBirth || 'N/A'}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--gov-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Consent Granted</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, marginTop: 2, color: application.consentGiven ? '#15803d' : '#64748b' }}>
                {application.consentGiven ? '✓ Yes (Authorized)' : '✗ No (Withheld)'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--gov-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Cross-System Status</div>
              <div style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                marginTop: 2,
                color: application.crossSystemVerification === 'COMPLETED' ? '#15803d' : application.crossSystemVerification === 'FAILED' ? '#b45309' : '#64748b'
              }}>
                {application.crossSystemVerification || (application.consentGiven ? 'COMPLETED' : 'NOT_INITIATED')}
              </div>
            </div>
          </div>

          {/* Correlation ID Pill */}
          {application.correlationId && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--gov-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  EK SUTRA Correlation Trace ID
                </span>
                <div style={{ fontSize: '0.86rem', fontFamily: 'monospace', color: 'var(--gov-primary)', fontWeight: 600, marginTop: 2 }}>
                  {application.correlationId}
                </div>
              </div>
            </div>
          )}

          {/* Participating Systems Breakdown */}
          {application.systems && Array.isArray(application.systems) && application.systems.length > 0 && (
            <div style={{ marginBottom: 24, padding: 14, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--gov-primary)', marginBottom: 10 }}>
                Participating Registry Verification
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                {application.systems.map((sys, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: `1px solid ${sys.eligible ? '#bbf7d0' : '#fecaca'}`,
                      borderRadius: 6,
                      padding: '8px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{sys.system}</span>
                      <div style={{ fontSize: '0.74rem', color: sys.eligible ? '#166534' : '#991b1b' }}>
                        {sys.status}
                      </div>
                    </div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: sys.eligible ? '#15803d' : '#dc2626',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {sys.eligible ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Visual Timeline */}
          <div>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--gov-primary)', marginBottom: 12 }}>
              Application Lifecycle Timeline
            </h4>

            {application.consentGiven ? (
              /* Consent Given Timeline */
              <div className="timeline">
                <div className="timeline-step">
                  <div className="timeline-dot done">
                    <CheckCircle2 size={13} />
                  </div>
                  <div className="timeline-title">Application Received</div>
                  <div className="timeline-desc">Filing submitted and stored in System A registry.</div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-dot done">
                    <CheckCircle2 size={13} />
                  </div>
                  <div className="timeline-title">Citizen Consent Verified</div>
                  <div className="timeline-desc">Explicit consent granted for cross-departmental verification.</div>
                </div>

                <div className="timeline-step">
                  <div className={`timeline-dot ${application.crossSystemVerification === 'FAILED' ? 'skipped' : 'done'}`}>
                    {application.crossSystemVerification === 'FAILED' ? <Clock size={13} /> : <CheckCircle2 size={13} />}
                  </div>
                  <div className="timeline-title" style={{ color: application.crossSystemVerification === 'FAILED' ? '#b45309' : undefined }}>
                    Interoperability Gateway Checks
                  </div>
                  <div className="timeline-desc">
                    {application.crossSystemVerification === 'FAILED'
                      ? 'Automated gateway timed out; pending background synchronization.'
                      : 'Cross-registry records validated across authorized government systems via EK SUTRA.'}
                  </div>
                </div>

                <div className="timeline-step">
                  <div className={`timeline-dot ${application.status === 'ELIGIBILITY_VERIFIED' ? 'done' : 'skipped'}`}>
                    {application.status === 'ELIGIBILITY_VERIFIED' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                  </div>
                  <div className="timeline-title">
                    {application.status === 'ELIGIBILITY_VERIFIED' ? 'Eligibility Verified' : 'Under Review'}
                  </div>
                  <div className="timeline-desc">
                    {application.status === 'ELIGIBILITY_VERIFIED'
                      ? 'Applicant meets criteria and is flagged for administrative sanction.'
                      : 'Application received and queued for review.'}
                  </div>
                </div>
              </div>
            ) : (
              /* Consent Denied Timeline */
              <div className="timeline">
                <div className="timeline-step">
                  <div className="timeline-dot done">
                    <CheckCircle2 size={13} />
                  </div>
                  <div className="timeline-title">Application Received</div>
                  <div className="timeline-desc">Stored in local department registry for manual administrative review.</div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-dot skipped">
                    <Clock size={13} />
                  </div>
                  <div className="timeline-title" style={{ color: '#64748b' }}>Cross-System Verification Not Initiated</div>
                  <div className="timeline-desc">
                    Consent was not provided by the citizen. No external data exchange or automated checks performed.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
