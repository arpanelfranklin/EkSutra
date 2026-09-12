import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  FileText, 
  RotateCcw,
  Check,
  X,
  Copy,
  AlertTriangle,
  Server,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { ApplicationRecord } from '../types/application';
import { StatusBadge } from '../components/common/StatusBadge';

interface SubmissionResultPageProps {
  record: ApplicationRecord;
  onNavigate: (tab: string, preselectedId?: string) => void;
}

export const SubmissionResultPage: React.FC<SubmissionResultPageProps> = ({ record, onNavigate }) => {
  const [copiedAppId, setCopiedAppId] = useState(false);
  const [copiedCorrelationId, setCopiedCorrelationId] = useState(false);

  const isConsented = record.consentGiven;
  const isVerified = record.crossSystemVerification === 'COMPLETED';
  const isFailed = record.crossSystemVerification === 'FAILED';
  const isEligible = record.overallEligibility === true;

  const copyToClipboard = (text: string, type: 'app' | 'corr') => {
    navigator.clipboard.writeText(text);
    if (type === 'app') {
      setCopiedAppId(true);
      setTimeout(() => setCopiedAppId(false), 2000);
    } else {
      setCopiedCorrelationId(true);
      setTimeout(() => setCopiedCorrelationId(false), 2000);
    }
  };

  const formattedDate = record.createdAt
    ? new Date(record.createdAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'medium',
      })
    : new Date().toLocaleString();

  return (
    <div style={{ maxWidth: 740, margin: '0 auto' }}>
      {/* Top Banner Card */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '36px 32px',
          marginBottom: 24,
          borderTop: isEligible && isVerified
            ? '6px solid #15803d'
            : isFailed
            ? '6px solid #b45309'
            : !isConsented
            ? '6px solid #475569'
            : '6px solid #dc2626',
        }}
      >
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: isEligible && isVerified
              ? '#f0fdf4'
              : isFailed
              ? '#fffbeb'
              : !isConsented
              ? '#f1f5f9'
              : '#fef2f2',
            color: isEligible && isVerified
              ? '#15803d'
              : isFailed
              ? '#b45309'
              : !isConsented
              ? '#475569'
              : '#dc2626',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          {isEligible && isVerified ? (
            <CheckCircle2 size={40} />
          ) : isFailed ? (
            <AlertTriangle size={40} />
          ) : !isConsented ? (
            <FileText size={40} />
          ) : (
            <X size={40} />
          )}
        </div>

        <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--gov-primary)', marginBottom: 6 }}>
          {isEligible && isVerified
            ? 'Application Verified & Submitted ✓'
            : isFailed
            ? 'Application Recorded (Verification Deferred)'
            : !isConsented
            ? 'Application Filed Locally (System A)'
            : 'Application Submitted (Ineligible)'}
        </h2>
        <p style={{ color: 'var(--gov-text-secondary)', fontSize: '0.9rem', maxWidth: 520, margin: '0 auto' }}>
          {isEligible && isVerified
            ? 'Live validation response received from System A and authorized registries via EK SUTRA.'
            : isFailed
            ? 'Your application is safely stored in System A. Cross-system integration was deferred due to gateway timeout.'
            : !isConsented
            ? 'Stored in System A internal registry. Cross-departmental checks were withheld per citizen consent decision.'
            : 'Application processed by System A, but criteria requirements were not met.'}
        </p>

        {/* Real Live Data Grid */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid var(--gov-border)',
            borderRadius: 8,
            padding: '22px 24px',
            margin: '28px 0',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Header Row: Real Application Reference ID & Status Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf2f7', paddingBottom: 14 }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--gov-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                System A Reference ID
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--gov-primary)', fontFamily: 'monospace' }}>
                  {record.applicationId}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(record.applicationId, 'app')}
                  title="Copy Application ID"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--gov-border)',
                    borderRadius: 4,
                    padding: '3px 8px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    color: copiedAppId ? '#15803d' : 'var(--gov-text-secondary)',
                  }}
                >
                  <Copy size={12} />
                  <span>{copiedAppId ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <StatusBadge status={record.status} />
          </div>

          {/* Citizen Details Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, borderBottom: '1px solid #edf2f7', paddingBottom: 14 }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--gov-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Applicant Name
              </span>
              <div style={{ fontSize: '0.96rem', fontWeight: 700, marginTop: 2 }}>
                {record.applicantName || `${record.fname || ''} ${record.lname || ''}`.trim() || 'Citizen'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--gov-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Citizen ID / Identifier
              </span>
              <div style={{ fontSize: '0.96rem', fontWeight: 600, marginTop: 2 }}>
                {record.citizenId || record.beneficiaryId || 'N/A'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--gov-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Date of Birth
              </span>
              <div style={{ fontSize: '0.96rem', fontWeight: 600, marginTop: 2 }}>
                {record.dob || record.dateOfBirth || 'N/A'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--gov-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Submitted At
              </span>
              <div style={{ fontSize: '0.88rem', color: 'var(--gov-text-secondary)', marginTop: 2 }}>
                {formattedDate}
              </div>
            </div>
          </div>

          {/* Scheme Row */}
          <div style={{ borderBottom: '1px solid #edf2f7', paddingBottom: 14 }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--gov-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Applied Scheme Code
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gov-secondary)', marginTop: 2 }}>
              {record.schemeCode}
            </div>
          </div>

          {/* Interoperability & Audit Data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--gov-text-secondary)', fontWeight: 600 }}>
                Citizen Consent:
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: isConsented ? '#15803d' : '#64748b', fontWeight: 700, fontSize: '0.88rem' }}>
                {isConsented ? <Check size={16} /> : <X size={16} />}
                {isConsented ? 'Granted (Cross-System Authorized)' : 'Not Provided'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--gov-text-secondary)', fontWeight: 600 }}>
                Gateway Verification:
              </span>
              <span style={{
                fontWeight: 700,
                fontSize: '0.88rem',
                color: isVerified ? '#15803d' : isFailed ? '#b45309' : '#64748b'
              }}>
                {record.crossSystemVerification || (isConsented ? 'COMPLETED' : 'NOT_INITIATED')}
              </span>
            </div>

            {record.overallEligibility !== undefined && record.overallEligibility !== null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--gov-text-secondary)', fontWeight: 600 }}>
                  Eligibility Evaluation:
                </span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: isEligible ? '#15803d' : '#dc2626',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}>
                  {isEligible ? <CheckCircle2 size={16} /> : <X size={16} />}
                  {isEligible ? 'Verified Eligible' : 'Ineligible'}
                </span>
              </div>
            )}

            {/* Real Correlation ID from EK SUTRA */}
            {record.correlationId && (
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 4
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gov-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    EK SUTRA Correlation ID (Trace Reference)
                  </div>
                  <div style={{ fontSize: '0.86rem', fontFamily: 'monospace', color: 'var(--gov-primary)', fontWeight: 600, marginTop: 2 }}>
                    {record.correlationId}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(record.correlationId || '', 'corr')}
                  title="Copy Correlation ID"
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--gov-border)',
                    borderRadius: 4,
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    color: copiedCorrelationId ? '#15803d' : 'var(--gov-text-secondary)',
                  }}
                >
                  <Copy size={12} />
                  <span>{copiedCorrelationId ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Real Participating Systems Verification Breakdown */}
          {record.systems && Array.isArray(record.systems) && record.systems.length > 0 && (
            <div style={{ marginTop: 8, paddingTop: 14, borderTop: '1px solid #edf2f7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', fontWeight: 700, color: 'var(--gov-primary)', marginBottom: 10 }}>
                <Layers size={16} />
                <span>Participating Government Systems Verification Breakdown</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                {record.systems.map((sys, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: sys.eligible ? '#f0fdf4' : '#fef2f2',
                      border: `1px solid ${sys.eligible ? '#bbf7d0' : '#fecaca'}`,
                      borderRadius: 6,
                      padding: '10px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gov-primary)' }}>
                        {sys.system}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: sys.eligible ? '#166534' : '#991b1b', marginTop: 2 }}>
                        Status: <strong>{sys.status || (sys.eligible ? 'VERIFIED' : 'UNCONFIRMED')}</strong>
                      </div>
                    </div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: sys.eligible ? '#15803d' : '#dc2626',
                      color: '#ffffff',
                    }}>
                      {sys.eligible ? <Check size={14} /> : <X size={14} />}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isConsented && (
            <div style={{ background: '#f1f5f9', borderLeft: '3px solid #64748b', padding: '10px 14px', borderRadius: 6, fontSize: '0.84rem', color: '#475569', marginTop: 6 }}>
              Your application has been submitted to System A. Cross-system eligibility verification was not initiated because consent was not provided.
            </div>
          )}

          {isFailed && (
            <div style={{ background: '#fffbeb', borderLeft: '3px solid #b45309', padding: '10px 14px', borderRadius: 6, fontSize: '0.84rem', color: '#92400e', marginTop: 6 }}>
              The application was saved to System A, but the automated cross-system verification gateway timed out. It has been queued for background reconciliation.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('track', record.applicationId)}
          >
            <Search size={16} />
            <span>Track This Application</span>
          </button>

          <button
            className="btn btn-outline btn-lg"
            onClick={() => onNavigate('apply')}
          >
            <RotateCcw size={16} />
            <span>Apply for Another Scheme</span>
          </button>
        </div>
      </div>
    </div>
  );
};
