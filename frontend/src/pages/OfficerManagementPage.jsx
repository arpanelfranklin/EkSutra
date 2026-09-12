import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  ShieldCheck, 
  Users, 
  RefreshCw, 
  Lock, 
  User, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const OfficerManagementPage = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    department: 'Department of Skills, Employment & Innovation',
    password: ''
  });

  const loadOfficers = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAuthorities();
      setOfficers(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to load authority officers list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfficers();
  }, []);

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      addToast('Username and password are required', 'warning');
      return;
    }
    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const newOfficer = await api.admin.createAuthority({
        username: formData.username.trim(),
        fullName: formData.fullName.trim() || formData.username.trim(),
        department: formData.department.trim(),
        password: formData.password
      });

      addToast(`Authority Officer '${newOfficer.username}' successfully registered!`, 'success');
      setFormData({
        username: '',
        fullName: '',
        department: 'Department of Skills, Employment & Innovation',
        password: ''
      });
      loadOfficers();
    } catch (err) {
      addToast(err.message || 'Failed to create authority account', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="page-body">
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <AlertCircle size={48} color="var(--rose-500)" style={{ margin: '0 auto 16px auto' }} />
          <h3>Access Restricted</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            This portal section is strictly reserved for MSInS Apex Administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2>Officer & Authority Management</h2>
            <span className="badge badge-verified">Apex Admin Clearance</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: 4 }}>
            Provision and manage Department Verification Authority officer credentials. Public self-signup is disabled.
          </p>
        </div>

        <button className="btn btn-outline btn-sm" onClick={loadOfficers}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          <span>Refresh Roster</span>
        </button>
      </div>

      {/* Security Governance Notice */}
      <div className="card" style={{ marginBottom: 24, padding: '14px 20px', background: 'var(--bg-subtle)', borderLeft: '4px solid var(--primary-600)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: '0.84rem' }}>
            <strong>Institutional Provisioning Protocol:</strong> Department Authority Officers cannot self-register. Only Apex Administrators have the mandate to provision accounts for scheme verification personnel.
          </div>
          <span className="badge badge-scheme">ISO 27001 & GIGW Compliant</span>
        </div>
      </div>

      {/* Grid: Create Officer Form + Registered Officers Roster */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: 24 }}>
        {/* Left: Provision Authority Officer Form */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <UserPlus size={18} color="var(--primary-600)" />
              <div>
                <div className="card-title">Register Authority Officer</div>
                <div className="card-subtitle">Create verified officer credentials</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreateOfficer}>
            <div className="form-group">
              <label className="form-label">Official Username *</label>
              <div className="search-bar-wrapper">
                <User size={16} className="search-icon-pos" />
                <input
                  type="text"
                  className="search-bar-input"
                  placeholder="e.g. aditya_pune, shinde_officer"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Officer Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Smt. Tanvi Shinde"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Department *</label>
              <select
                className="form-select"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              >
                <option value="Department of Skills, Employment & Innovation">Department of Skills, Employment & Innovation</option>
                <option value="Directorate of Vocational Education & Skills">Directorate of Vocational Education & Skills</option>
                <option value="Chief Minister Employment Exchange (CMEGP)">Chief Minister Employment Exchange (CMEGP)</option>
                <option value="Maharashtra State Innovation Society (MSInS)">Maharashtra State Innovation Society (MSInS)</option>
                <option value="Agriculture & Solar Feeder Registry">Agriculture & Solar Feeder Registry</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Password * (min. 6 characters)</label>
              <div className="search-bar-wrapper" style={{ position: 'relative' }}>
                <Lock size={16} className="search-icon-pos" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="search-bar-input"
                  placeholder="Enter initial password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)'
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 8 }}
              disabled={submitting}
            >
              <UserPlus size={16} />
              <span>{submitting ? 'Creating Authority Account...' : 'Provision Authority Officer'}</span>
            </button>
          </form>
        </div>

        {/* Right: Existing Authority Officers Table */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users size={18} />
              <div>
                <div className="card-title">Provisioned Authority Officers ({officers.length})</div>
                <div className="card-subtitle">Active departmental verification officers in Maharashtra</div>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Officer Username</th>
                  <th>Full Name</th>
                  <th>Department / Directorate</th>
                  <th>Assigned Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {officers.length > 0 ? (
                  officers.map((officer) => (
                    <tr key={officer.id || officer.username}>
                      <td style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                        {officer.username}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {officer.fullName || officer.username}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {officer.department || 'Skills & Innovation'}
                      </td>
                      <td>
                        <span className="badge badge-role">
                          {officer.role}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-verified">
                          <CheckCircle2 size={12} />
                          <span>Active</span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                      No authority officers registered yet. Use the form on the left to provision an account.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
