import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { INITIAL_SCHEMES } from '../services/mockDataStore';
import { api } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { useNotification } from '../context/NotificationContext';

export const CitizenPortalPage = ({ onNavigateToOfficer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [heroIndex, setHeroIndex] = useState(0);
  const { addToast } = useNotification();

  const heroImages = [
    '/hero_sahyadri_1.jpg',
    '/hero_sahyadri_2.jpg',
    '/hero_sahyadri_3.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selectedCategory, hasSearched]);

  const handleTrack = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      addToast('Please enter an Application ID (e.g. MH-MSINS-2026-00892) or Citizen ID.', 'warning');
      return;
    }

    try {
      let match = null;
      // 1. Try search API
      const searchResults = await api.applications.search(query);
      if (searchResults && searchResults.length > 0) {
        match = searchResults[0];
      } else {
        // 2. Try direct ID lookup
        const directApp = await api.applications.getById(query);
        if (directApp && directApp.applicationId) {
          match = directApp;
        }
      }

      if (match) {
        setTrackedResult(match);
        addToast('Application record found across Maharashtra Interoperability Gateway.', 'success');
      } else {
        setTrackedResult(null);
        addToast('No application found with the provided identifier.', 'error');
      }
    } catch (err) {
      setTrackedResult(null);
      addToast(err.message || 'No application found with the provided identifier.', 'error');
    }
    setHasSearched(true);
  };

  const filteredSchemes = selectedCategory === 'ALL'
    ? INITIAL_SCHEMES
    : INITIAL_SCHEMES.filter(s => s.category.toUpperCase() === selectedCategory.toUpperCase());

  const getSchemeIcon = (iconName) => {
    switch (iconName) {
      case 'Rocket': return <Rocket size={22} />;
      case 'GraduationCap': return <GraduationCap size={22} />;
      case 'Briefcase': return <Briefcase size={22} />;
      case 'Sun': return <Sun size={22} />;
      default: return <Sparkles size={22} />;
    }
  };

  return (
    <div className="portal-layout">
      <main className="page-body">
        {/* Sahyadri Image-Led Institutional Hero Banner */}
        <section className="citizen-hero-section scroll-reveal">
          <div 
            className="hero-slider-bg" 
            style={{ backgroundImage: `url(${heroImages[heroIndex]})` }}
          />
          <div className="hero-overlay-gradient" />

          <div className="citizen-hero-content">
            <div className="citizen-hero-badge">
              <ShieldCheck size={14} color="var(--gold-400)" />
              <span>महाराष्ट्र शासन &bull; Government of Maharashtra Single Window Gateway</span>
            </div>
            <h1 className="citizen-hero-title">
              Unified Citizen Services & Interoperability Gateway
            </h1>
            <p className="citizen-hero-desc">
              Access Maharashtra State Innovation Society and allied department welfare programs through a single, standards-compliant digital gateway. Zero redundant paper submissions with instant cross-department verification.
            </p>

            {/* Quick Track Application Form */}
            <form onSubmit={handleTrack} className="citizen-tracker-box">
              <Search size={20} color="var(--stone-600)" />
              <input 
                type="text"
                className="citizen-tracker-input"
                placeholder="Track Application (e.g. MH-MSINS-2026-00892 or Citizen ID)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-saffron">
                Track Status
              </button>
            </form>

            <div style={{ display: 'flex', gap: 12, marginTop: 16, fontSize: '0.78rem', color: '#DDD8CA', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Try Demo Reference IDs:</span>
              <button 
                type="button" 
                onClick={() => { setSearchQuery('MH-MSINS-2026-00892'); }}
                style={{ background: 'rgba(246,243,236,0.15)', border: '1px solid rgba(184,147,74,0.4)', color: '#F6F3EC', padding: '3px 10px', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' }}
              >
                MH-MSINS-2026-00892 (Approved)
              </button>
              <button 
                type="button" 
                onClick={() => { setSearchQuery('MH-CMEGP-2026-00431'); }}
                style={{ background: 'rgba(246,243,236,0.15)', border: '1px solid rgba(184,147,74,0.4)', color: '#F6F3EC', padding: '3px 10px', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' }}
              >
                MH-CMEGP-2026-00431 (On Hold)
              </button>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="hero-slider-controls">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                className={`slider-dot ${heroIndex === idx ? 'active' : ''}`}
                onClick={() => setHeroIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Tracking Result Banner */}
        {hasSearched && (
          <div className="card scroll-reveal" style={{ marginBottom: 36, border: '2px solid var(--gold-500)' }}>
            {trackedResult ? (
              <div>
                <div className="card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <h3 style={{ margin: 0 }}>Application Status: {trackedResult.applicationId}</h3>
                      <StatusBadge status={trackedResult.applicationStatus} />
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      Beneficiary: <strong>{trackedResult.applicantName}</strong> &bull; Scheme: <span className="badge badge-scheme">{trackedResult.schemeCode}</span>
                    </p>
                  </div>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => { setTrackedResult(null); setHasSearched(false); setSearchQuery(''); }}
                  >
                    Clear Search
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
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 4 }}>Verified By: {hist.changedBy}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16, padding: '12px 18px', background: 'var(--bg-subtle)', borderRadius: 6, fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Federated Verification: <strong>Maha-Citizen REST API</strong> & <strong>MSInS XML Registry</strong></span>
                  <span className="badge badge-verified">Interoperable Match</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: 28, textAlign: 'center' }}>
                <AlertCircle size={36} color="var(--terracotta-600)" style={{ margin: '0 auto 12px auto' }} />
                <h4>No Record Found</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                  No application matched identifier "{searchQuery}". Please check your application reference number.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Scheme Directory Header & Filter Tabs */}
        <div className="scroll-reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gold-700)', letterSpacing: '0.05em', marginBottom: 4 }}>
              Institutional Programs & Services
            </div>
            <h2 style={{ fontSize: '1.6rem', margin: 0 }}>Integrated Welfare Schemes</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: 4 }}>
              Explore schemes across Maharashtra State Innovation Society (MSInS) and partner departments.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
          {filteredSchemes.map((scheme, idx) => (
            <div key={scheme.code} className={`scheme-card scroll-reveal reveal-delay-${(idx % 4) + 1}`}>
              <div>
                <div className="scheme-card-icon">
                  {getSchemeIcon(scheme.icon)}
                </div>
                <div className="scheme-dept-tag">{scheme.department}</div>
                <h3 className="scheme-card-title">{scheme.title}</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--gold-700)', marginBottom: 8 }} className="font-marathi">
                  {scheme.titleMr}
                </div>
                <p className="scheme-card-desc">{scheme.description}</p>
                
                <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 6, fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 18, borderLeft: '3px solid var(--gold-500)' }}>
                  <strong>Eligibility:</strong> {scheme.eligibility}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
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
        <section className="dignitary-section scroll-reveal">
          <div className="card" style={{ padding: 32, borderTop: '3px solid var(--gold-500)' }}>
            <div className="card-header" style={{ marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Leadership & Institutional Vision</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Maharashtra State Innovation Society (MSInS), Department of Skills, Employment, Entrepreneurship & Innovation
                </p>
              </div>
              <span className="badge badge-msins">Govt of Maharashtra</span>
            </div>

            <div className="dignitary-grid">
              <div className="dignitary-card scroll-reveal reveal-delay-1">
                <div className="dignitary-avatar">
                  CM
                </div>
                <div className="dignitary-details">
                  <h4>Hon'ble Chief Minister</h4>
                  <p>Government of Maharashtra</p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--gold-700)', marginTop: 4, fontWeight: 600 }}>Visionary Governance for Digital Maharashtra</p>
                </div>
              </div>

              <div className="dignitary-card scroll-reveal reveal-delay-2">
                <div className="dignitary-avatar">
                  MS
                </div>
                <div className="dignitary-details">
                  <h4>Hon'ble Minister</h4>
                  <p>Skills, Employment, Entrepreneurship & Innovation</p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--gold-700)', marginTop: 4, fontWeight: 600 }}>Empowering Youth & Innovation Ecosystem</p>
                </div>
              </div>

              <div className="dignitary-card scroll-reveal reveal-delay-3">
                <div className="dignitary-avatar">
                  CEO
                </div>
                <div className="dignitary-details">
                  <h4>CEO & Mission Director</h4>
                  <p>Maharashtra State Innovation Society (MSInS)</p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--forest-700)', marginTop: 4, fontWeight: 600 }}>Standards-based Data Interoperability</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 28, padding: 22, background: 'var(--bg-subtle)', borderRadius: 8, borderLeft: '4px solid var(--forest-800)' }}>
              <h4 style={{ fontSize: '0.94rem', marginBottom: 6, color: 'var(--text-primary)' }}>Interoperability Mission Statement:</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                "To eliminate administrative silos across departmental databases, enabling secure, consent-based, and standards-compliant data exchange. EkSutra empowers Maharashtra's citizens with a unified, transparent single-window delivery experience while equipping officers with holistic cross-departmental intelligence."
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
