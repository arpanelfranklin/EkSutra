import React, { useState } from 'react';
import { ShieldCheck, Lock, User, KeyRound, AlertCircle, Building2, Crown, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const LoginPage = ({ onLoginSuccess, onNavigateToCitizen }) => {
  const { login } = useAuth();
  const { addToast } = useNotification();
  const [portalRole, setPortalRole] = useState('AUTHORITY'); // 'AUTHORITY' | 'ADMIN'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTabChange = (role) => {
    setPortalRole(role);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both your official username and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(username.trim(), password.trim(), portalRole);
      addToast(`Welcome, ${user.name || user.username}! Authenticated as ${user.role}.`, 'success');
      onLoginSuccess();
    } catch (err) {
      const msg = err.message || 'Authentication failed. Please verify your credentials.';
      setErrorMessage(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const isAuthority = portalRole === 'AUTHORITY';

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        {/* Government Emblem & Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex',
            marginBottom: 12,
            padding: 10,
            background: 'var(--bg-subtle)',
            borderRadius: 14,
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <img src="/logo.svg" alt="EkSutra Logo" style={{ width: 48, height: 48 }} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
            EkSutra Officer Portal
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
            महाराष्ट्र शासन &bull; Executive Interoperability Gateway
          </p>
        </div>

        {/* Separate Login Tabs: Authority vs Admin */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
          background: 'var(--bg-subtle)',
          padding: 4,
          borderRadius: 10,
          border: '1px solid var(--border-subtle)',
          marginBottom: 20
        }}>
          <button
            type="button"
            style={{
              padding: '10px 8px',
              borderRadius: 8,
              border: isAuthority ? '1px solid var(--gold-500)' : '1px solid transparent',
              background: isAuthority ? 'var(--bg-surface)' : 'transparent',
              fontWeight: isAuthority ? 700 : 500,
              color: isAuthority ? 'var(--gold-800)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
              boxShadow: isAuthority ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
            onClick={() => handleTabChange('AUTHORITY')}
          >
            <ShieldCheck size={16} color={isAuthority ? 'var(--gold-600)' : 'currentColor'} />
            <span>Authority Officer</span>
          </button>

          <button
            type="button"
            style={{
              padding: '10px 8px',
              borderRadius: 8,
              border: !isAuthority ? '1px solid var(--forest-600)' : '1px solid transparent',
              background: !isAuthority ? 'var(--bg-surface)' : 'transparent',
              fontWeight: !isAuthority ? 700 : 500,
              color: !isAuthority ? 'var(--forest-800)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
              boxShadow: !isAuthority ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
            onClick={() => handleTabChange('ADMIN')}
          >
            <Crown size={16} color={!isAuthority ? 'var(--forest-700)' : 'currentColor'} />
            <span>Apex Admin</span>
          </button>
        </div>

        {/* Scope Context Banner */}
        <div style={{
          background: isAuthority ? 'var(--gold-50)' : 'var(--forest-50)',
          borderLeft: isAuthority ? '3px solid var(--gold-500)' : '3px solid var(--forest-700)',
          borderRadius: 6,
          padding: '10px 14px',
          marginBottom: 20,
          fontSize: '0.78rem',
          color: isAuthority ? 'var(--gold-900)' : 'var(--forest-900)',
          lineHeight: 1.45
        }}>
          <strong>{isAuthority ? 'Department Authority Access:' : 'MSInS State Admin Access:'}</strong>{' '}
          {isAuthority
            ? 'Departmental officers reviewing citizen applications and submitting action recommendations.'
            : 'Apex administrative personnel with sanction powers, status override, and officer creation privileges.'}
        </div>

        {/* Error Notification Callout */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            background: 'var(--rose-50)',
            border: '1px solid var(--rose-200)',
            color: 'var(--rose-800)',
            padding: '10px 14px',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: '0.82rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Credentials Form (Clean & Empty by default) */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.84rem' }}>
              {isAuthority ? 'Officer Username' : 'Administrator Username'}
            </label>
            <div className="search-bar-wrapper">
              <User size={16} className="search-icon-pos" />
              <input
                type="text"
                className="search-bar-input"
                placeholder={isAuthority ? 'Enter authority username' : 'Enter admin username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.84rem' }}>
              Secret Password
            </label>
            <div className="search-bar-wrapper">
              <Lock size={16} className="search-icon-pos" />
              <input
                type="password"
                className="search-bar-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`btn ${isAuthority ? 'btn-saffron' : 'btn-emerald'} btn-lg`}
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}
          >
            <KeyRound size={18} />
            <span>
              {loading
                ? 'Verifying Credentials...'
                : (isAuthority ? 'Sign In as Authority Officer' : 'Sign In as Apex Administrator')}
            </span>
          </button>
        </form>

        {/* Security & Access Notice */}
        <div style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 14 }}>
            Official Government of Maharashtra System &bull; Unauthorized access is prohibited and subject to legal prosecution under the IT Act.
          </p>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onNavigateToCitizen}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <ArrowLeft size={14} />
            <span>Return to Public Citizen Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
