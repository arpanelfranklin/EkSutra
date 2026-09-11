import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const ApplicationForm = ({ scheme, onClose }) => {
  const [formData, setFormData] = useState({
    applicationId: '',
    fname: '',
    lname: '',
    dob: '',
    schemeCode: scheme?.code || '',
  });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!consent) {
      setErrorMsg('Please provide consent to proceed. / कृपया सहमति दें।');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const payload = { ...formData };
      if (!payload.applicationId.trim()) delete payload.applicationId;

      const res = await api.integration.processApplication(payload);
      setResult(res);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again. / कुछ गलत हो गया।');
    }
  };

  return (
    <div style={overlayStyle}>
      <div className="card" style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>Apply for Scheme / योजना हेतु आवेदन</h3>
            {scheme && (
              <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {scheme.title}
              </p>
            )}
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle2 size={40} color="var(--emerald-600, #059669)" style={{ margin: '0 auto 12px' }} />
            <h4>Application Submitted / आवेदन जमा हो गया</h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Application ID / आवेदन आईडी: <strong>{result?.applicationId}</strong>
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Eligibility: {result?.eligible ? 'Verified ✅' : 'Under Review ⏳'}
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 12 }}>
              Done / पूर्ण
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
            <Field label="Application ID (optional)" labelHi="आवेदन आईडी (वैकल्पिक)">
              <input
                name="applicationId"
                value={formData.applicationId}
                onChange={handleChange}
                placeholder="Leave blank to auto-generate"
                style={inputStyle}
              />
            </Field>

            <div style={{ display: 'flex', gap: 12 }}>
              <Field label="First Name" labelHi="पहला नाम">
                <input name="fname" value={formData.fname} onChange={handleChange} required style={inputStyle} />
              </Field>
              <Field label="Last Name" labelHi="अंतिम नाम">
                <input name="lname" value={formData.lname} onChange={handleChange} required style={inputStyle} />
              </Field>
            </div>

            <Field label="Date of Birth" labelHi="जन्म तिथि">
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required style={inputStyle} />
            </Field>

            <Field label="Scheme Code" labelHi="योजना कोड">
              <input name="schemeCode" value={formData.schemeCode} onChange={handleChange} required style={inputStyle} />
            </Field>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem' }}>
              <input
                id="consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <label htmlFor="consent">
                <ShieldCheck size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                I consent to verification of my information
                <br />
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  मैं अपनी जानकारी के सत्यापन के लिए सहमति देता/देती हूँ
                </span>
              </label>
            </div>

            {errorMsg && <p style={{ color: '#DC2626', fontSize: '0.82rem' }}>{errorMsg}</p>}

            <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
              {status === 'loading' ? 'Submitting... / जमा हो रहा है...' : 'Submit Application / आवेदन जमा करें'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, labelHi, children }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>
      {label} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.74rem' }}>{labelHi}</span>
    </label>
    {children}
  </div>
);

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle = {
  width: '100%',
  maxWidth: 480,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const inputStyle = {
  padding: '10px 12px',
  border: '1px solid var(--border-subtle, #d0d5dd)',
  borderRadius: 8,
  fontSize: 14,
};