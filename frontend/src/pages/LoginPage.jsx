import React, { useState } from 'react';
import { ShieldCheck, Lock, User, KeyRound, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const LoginPage = ({ onLoginSuccess, onNavigateToCitizen }) => {
  const { login } = useAuth();
  const { addToast } = useNotification();
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('aditya_authority');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('AUTHORITY');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login(username, password);
      addToast(`Welcome back, ${user?.name || username}!`, 'success');
      onLoginSuccess();
    } catch (err) {
      addToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole) => {
    try {
      setLoading(true);
      const demoUser = demoRole === 'ADMIN' ? 'admin' : 'aditya_authority';
      const user = await login(demoUser, 'password123');
      addToast(`Logged in as official ${user?.name || demoRole}!`, 'success');
      onLoginSuccess();
    } catch (err) {
      addToast(err.message || 'Quick login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Logo and Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', marginBottom: 14, padding: 10, background: 'var(--bg-subtle)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
            <img src="/logo.svg" alt="EkSutra" style={{ width: 52, height: 52 }} />
          </div>
          <h2 style={{ fontSize: '1.45rem', marginBottom: 6 }}>EkSutra Officer Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
            Government of Maharashtra &bull; Executive Interoperability Gateway
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Official Username</label>
            <div className="search-bar-wrapper">
              <User size={16} className="search-icon-pos" />
              <input
                type="text"
                className="search-bar-input"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="search-bar-wrapper">
              <Lock size={16} className="search-icon-pos" />
              <input
                type="password"
                className="search-bar-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}
          >
            <ShieldCheck size={18} />
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
          </button>
        </form>

        {/* Quick Demo Login Preset Buttons */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10, justifyContent: 'center', fontWeight: 600 }}>
            <Sparkles size={14} color="var(--gold-500)" />
            <span>1-Click Evaluator & Demo Access:</span>
          </div>
          <div className="auth-demo-grid">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickDemo('AUTHORITY')}
            >
              Authority Officer
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickDemo('ADMIN')}
            >
              Apex Admin (MSInS)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onNavigateToCitizen}
            style={{ width: '100%' }}
          >
            <span>Switch to Public Citizen Portal &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
