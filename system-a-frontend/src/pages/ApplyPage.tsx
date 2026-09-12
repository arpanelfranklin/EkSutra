import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Info, 
  Loader2, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { SCHEMES, api } from '../services/api';
import { ApplicationFormInput, ApplicationRecord } from '../types/application';

interface ApplyPageProps {
  preselectedScheme?: string;
  onSuccess: (record: ApplicationRecord) => void;
}

export const ApplyPage: React.FC<ApplyPageProps> = ({ preselectedScheme, onSuccess }) => {
  const [formData, setFormData] = useState<ApplicationFormInput>({
    fname: 'Rahul',
    lname: 'Sharma',
    applicantName: 'Rahul Sharma',
    citizenId: 'CIT-10042',
    beneficiaryId: 'CIT-10042',
    dob: '2002-04-12',
    dateOfBirth: '2002-04-12',
    schemeCode: preselectedScheme || SCHEMES[0].code,
    consentGiven: true, // Default to true for seamless citizen flow
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedScheme) {
      setFormData((prev) => ({ ...prev, schemeCode: preselectedScheme }));
    }
  }, [preselectedScheme]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.fname.trim()) {
      errs.fname = 'First name is required.';
    }
    if (!formData.lname.trim()) {
      errs.lname = 'Last name is required.';
    }
    if (!formData.citizenId.trim()) {
      errs.citizenId = 'Citizen ID / Beneficiary Identifier is required.';
    }
    if (!formData.dob) {
      errs.dob = 'Date of birth is required.';
    }
    if (!formData.schemeCode) {
      errs.schemeCode = 'Please select a welfare scheme.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload: ApplicationFormInput = {
        fname: formData.fname.trim(),
        lname: formData.lname.trim(),
        applicantName: `${formData.fname.trim()} ${formData.lname.trim()}`.trim(),
        citizenId: formData.citizenId.trim(),
        beneficiaryId: formData.citizenId.trim(),
        dob: formData.dob,
        dateOfBirth: formData.dob,
        schemeCode: formData.schemeCode,
        consentGiven: formData.consentGiven,
      };

      const record = await api.submitApplication(payload);
      setIsSubmitting(false);
      onSuccess(record);
    } catch (err: any) {
      setIsSubmitting(false);
      setServerError(err.message || 'Unable to submit application to System A backend.');
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gov-primary)' }}>
          Government Scheme Application Form
        </h2>
        <p style={{ color: 'var(--gov-text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
          Please complete all required citizen particulars to submit your application directly to System A (Department of Citizen Services).
        </p>
      </div>

      {serverError && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 8,
          padding: '14px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          color: '#991b1b'
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ fontSize: '0.92rem' }}>Submission Failed</strong>
            <p style={{ fontSize: '0.86rem', marginTop: 2 }}>{serverError}</p>
          </div>
        </div>
      )}

      {isSubmitting ? (
        /* Real-time Submitting State */
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: 16, background: 'var(--gov-primary-light)', borderRadius: '50%', marginBottom: 16 }}>
            <Loader2 size={36} className="spin" color="var(--gov-primary)" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gov-primary)', marginBottom: 8 }}>
            Submitting to System A (Port 8081)...
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--gov-text-secondary)', maxWidth: 440, margin: '0 auto' }}>
            {formData.consentGiven
              ? 'Sending application to System A and executing cross-system verification via EK SUTRA middleware...'
              : 'Recording application in System A local registry without external data verification...'}
          </p>
        </div>
      ) : (
        /* The Application Form */
        <form onSubmit={handleSubmit} className="card">
          {/* Name Fields: First & Last Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">
                First Name <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rahul"
                value={formData.fname}
                onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
              />
              {errors.fname && <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: 4 }}>{errors.fname}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Last Name <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sharma"
                value={formData.lname}
                onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
              />
              {errors.lname && <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: 4 }}>{errors.lname}</p>}
            </div>
          </div>

          {/* Citizen ID / Beneficiary Identifier */}
          <div className="form-group">
            <label className="form-label">
              Citizen ID / Beneficiary Identifier <span className="req">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CIT-10042 or 12-digit Aadhaar"
              value={formData.citizenId}
              onChange={(e) => setFormData({ ...formData, citizenId: e.target.value, beneficiaryId: e.target.value })}
            />
            {errors.citizenId && <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: 4 }}>{errors.citizenId}</p>}
            <p className="form-hint">Unique citizen reference identifier used for cross-departmental verification.</p>
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label className="form-label">
              Date of Birth <span className="req">*</span>
            </label>
            <input
              type="date"
              className="form-input"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value, dateOfBirth: e.target.value })}
            />
            {errors.dob && <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: 4 }}>{errors.dob}</p>}
          </div>

          {/* Scheme Selection */}
          <div className="form-group">
            <label className="form-label">
              Welfare / Innovation Scheme <span className="req">*</span>
            </label>
            <select
              className="form-select"
              value={formData.schemeCode}
              onChange={(e) => setFormData({ ...formData, schemeCode: e.target.value })}
            >
              {SCHEMES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
            {errors.schemeCode && <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: 4 }}>{errors.schemeCode}</p>}
          </div>

          {/* ⭐ Data Verification Consent ⭐ */}
          <div className={`consent-card ${formData.consentGiven ? 'checked' : ''}`}>
            <div className="consent-header">
              <ShieldCheck size={18} color={formData.consentGiven ? '#15803d' : '#0f2d59'} />
              <span>Data Verification Consent (Voluntary)</span>
            </div>

            <label className="consent-checkbox-row">
              <input
                type="checkbox"
                className="consent-checkbox"
                checked={formData.consentGiven}
                onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
              />
              <span className="consent-text">
                I consent to the use and verification of my information across authorized government systems (System B & System C via EK SUTRA) for determining my eligibility for this scheme.
              </span>
            </label>

            <div className="consent-subtext">
              <Info size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
              <strong>Important Notice:</strong> If unchecked, your application will only be filed locally with System A without cross-system verification.
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--gov-border)' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ minWidth: 220 }}
            >
              <Send size={16} />
              <span>Submit to System A</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
