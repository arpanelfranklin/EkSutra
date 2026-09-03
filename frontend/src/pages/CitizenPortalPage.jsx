import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  GraduationCap, 
  Rocket, 
  Briefcase, 
  Sun, 
  ShieldCheck, 
  Sparkles,
  Building2,
  FileCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { INITIAL_SCHEMES, mockStore } from '../services/mockDataStore';
import { StatusBadge } from '../components/common/StatusBadge';
import { useNotification } from '../context/NotificationContext';

export const CitizenPortalPage = ({ onNavigateToOfficer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const { addToast } = useNotification();

  const handleTrack = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      addToast('Please enter an Application ID (e.g. MH-MSINS-2026-00892) or Citizen ID.', 'warning');
      return;
    }

    const res = mockStore.searchApplications(searchQuery.trim());
    if (res && res.length > 0) {
      setTrackedResult(res[0]);
      addToast('Application record found across Maharashtra Interoperability Gateway.', 'success');
    } else {
      setTrackedResult(null);
      addToast('No application found with the provided identifier.', 'error');
    }
    setHasSearched(true);
  };

  const filteredSchemes = selectedCategory === 'ALL'
    ? INITIAL_SCHEMES
    : INITIAL_SCHEMES.filter(s => s.category.toUpperCase() === selectedCategory.toUpperCase());

  const getSchemeIcon = (iconName) => {
    switch (iconName) {
      case 'Rocket': return <Rocket size={24} />;
      case 'GraduationCap': return <GraduationCap size={24} />;
      case 'Briefcase': return <Briefcase size={24} />;
      case 'Sun': return <Sun size={24} />;
      default: return <Sparkles size={24} />;
    }
  };

  return (
    <div className="portal-layout">
      <main className="page-body">
        {/* Civic Hero Banner */}
        <section className="citizen-hero-banner">
          <div className="citizen-hero-content">
            <div className="citizen-hero-badge">
              <ShieldCheck size={14} />
              <span>Government of Maharashtra &bull; Unified Single Window Interoperability</span>
            </div>
            <h1 className="citizen-hero-title">
              Unified Citizen Scheme & Services Gateway
            </h1>
            <p className="citizen-hero-desc">
              One central portal to access welfare schemes across Skills Development, Employment Exchange, Startup Innovation, and Agriculture. Eliminate redundant submissions with automated cross-department verification.
            </p>

            {/* Quick Track Application Form */}
            <form onSubmit={handleTrack} className="citizen-tracker-box">
              <Search size={20} color="var(--text-muted)" />
              <input 
                type="text"
                className="citizen-tracker-input"
                placeholder="Track Application (e.g. MH-MSINS-2026-00892 or Citizen ID)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Track Status
              </button>
            </form>

            <div style={{ display: 'flex', gap: 12, marginTop: 14, fontSize: '0.78rem', color: '#E2E8F0' }}>
              <span>Try Demo IDs:</span>
              <button 
                type="button" 
                onClick={() => { setSearchQuery('MH-MSINS-2026-00892'); }}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#FFF', padding: '2px 8px', borderRadius: 4, cursor: 'pointer' }}
              >
                MH-MSINS-2026-00892 (Approved)
              </button>
              <button 
                type="button" 
                onClick={() => { setSearchQuery('MH-CMEGP-2026-00431'); }}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#FFF', padding: '2px 8px', borderRadius: 4, cursor: 'pointer' }}
              >
                MH-CMEGP-2026-00431 (On Hold)
              </button>
            </div>
          </div>
        </section>

        {/* Tracking Result Banner */}
        {hasSearched && (
          <div className="card" style={{ marginBottom: 32, border: '2px solid var(--primary-500)' }}>
            {trackedResult ? (
              <div>
                <div className="card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h3 style={{ margin: 0 }}>Application Status: {trackedResult.applicationId}</h3>
                      <StatusBadge status={trackedResult.applicationStatus} />
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Beneficiary: <strong>{trackedResult.applicantName}</strong> &bull; Scheme: <span className="badge badge-scheme">{trackedResult.schemeCode}</span>
                    </p>
                  </div>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => { setTrackedResult(null); setHasSearched(false); setSearchQuery(''); }}
                  >
                    Clear Track
                  </button>
                </div>

                <div className="timeline-container">
                  {trackedResult.statusHistory?.map((hist, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-dot completed">
                        <CheckCircle2 size={12} />
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <strong>{hist.newStatus}</strong>
                          <span style={{ color: 'var(--text-muted)' }}>{new Date(hist.timestamp).toLocaleString()}</span>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{hist.reason}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Verified By: {hist.changedBy}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 8, fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Federated Verification: <strong>Maha-Citizen REST</strong> & <strong>MSInS XML Registry</strong></span>
                  <span className="badge badge-verified">Interoperable Match</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: 24, textAlign: 'center' }}>
                <AlertCircle size={36} color="var(--rose-500)" style={{ margin: '0 auto 12px auto' }} />
                <h4>No Record Found</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                  No application matched identifier "{searchQuery}". Please verify your reference number.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Scheme Directory Header & Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2>Integrated Schemes & Public Services</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Explore Maharashtra State Innovation Society and allied department welfare programs.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {['ALL', 'INNOVATION', 'SKILLS', 'EMPLOYMENT', 'AGRICULTURE'].map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="schemes-grid">
          {filteredSchemes.map((scheme) => (
            <div key={scheme.code} className="scheme-card">
              <div>
                <div className="scheme-card-icon">
                  {getSchemeIcon(scheme.icon)}
                </div>
                <div className="scheme-dept-tag">{scheme.department}</div>
                <h3 className="scheme-card-title">{scheme.title}</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--primary-600)', marginBottom: 8 }} className="font-marathi">
                  {scheme.titleMr}
                </div>
                <p className="scheme-card-desc">{scheme.description}</p>
                
                <div style={{ background: 'var(--bg-subtle)', padding: '8px 12px', borderRadius: 6, fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                  <strong>Eligibility:</strong> {scheme.eligibility}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-scheme">{scheme.code}</span>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={onNavigateToOfficer}
                >
                  <span>Apply / Verify</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Department Mission & Leadership Vision */}
        <section className="dignitary-section">
          <div className="card" style={{ padding: 28 }}>
            <div className="card-header" style={{ marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Leadership & Departmental Vision</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Maharashtra State Innovation Society (MSInS), Department of Skills, Employment, Entrepreneurship & Innovation
                </p>
              </div>
              <span className="badge badge-msins">Govt of Maharashtra</span>
            </div>

            <div className="dignitary-grid">
              <div className="dignitary-card">
                <div className="dignitary-avatar" style={{ background: '#E0E7FF' }}>
                  CM
                </div>
                <div className="dignitary-details">
                  <h4>Hon'ble Chief Minister</h4>
                  <p>Government of Maharashtra</p>
                  <p style={{ fontSize: '0.74rem', color: 'var(--primary-600)', marginTop: 4 }}>Visionary Leadership for Digital Maharashtra</p>
                </div>
              </div>

              <div className="dignitary-card">
                <div className="dignitary-avatar" style={{ background: '#FEF3C7' }}>
                  MS
                </div>
                <div className="dignitary-details">
                  <h4>Hon'ble Minister</h4>
                  <p>Skills, Employment, Entrepreneurship & Innovation</p>
                  <p style={{ fontSize: '0.74rem', color: 'var(--saffron-600)', marginTop: 4 }}>Empowering Youth & Innovation Ecosystem</p>
                </div>
              </div>

              <div className="dignitary-card">
                <div className="dignitary-avatar" style={{ background: '#D1FAE5' }}>
                  CEO
                </div>
                <div className="dignitary-details">
                  <h4>CEO & Mission Director</h4>
                  <p>Maharashtra State Innovation Society (MSInS)</p>
                  <p style={{ fontSize: '0.74rem', color: 'var(--emerald-600)', marginTop: 4 }}>Standards-based Digital Interoperability</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, padding: 18, background: 'var(--bg-subtle)', borderRadius: 10, borderLeft: '4px solid var(--primary-500)' }}>
              <h4 style={{ fontSize: '0.92rem', marginBottom: 6 }}>Interoperability Mission Statement:</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                "To eliminate administrative silos across departmental databases, enabling secure, consent-based, and standards-compliant data exchange. EkSutra empowers Maharashtra's citizens with a unified, transparent single-window delivery experience while equipping officers with holistic cross-departmental intelligence."
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
