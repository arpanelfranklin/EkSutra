import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Moon, 
  Sun, 
  Radio, 
  UserCheck, 
  LogOut, 
  Menu, 
  X,
  ExternalLink,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApiMode } from '../../context/ApiModeContext';

export const Navbar = ({ currentTheme, onToggleTheme, onNavigate, activePage }) => {
  const { user, logout, switchRole } = useAuth();
  const { isLiveMode, toggleApiMode, backendHealth } = useApiMode();
  const [lang, setLang] = useState('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Official Government Utility Bar */}
      <div className="govt-top-bar">
        <div className="govt-top-bar-left">
          <div className="govt-flag-strip" title="National Flag of India">
            <div className="strip-saffron"></div>
            <div className="strip-white"></div>
            <div className="strip-green"></div>
          </div>
          <span>महाराष्ट्र शासन | Government of Maharashtra</span>
        </div>

        <div className="govt-top-bar-right">
          <button 
            className="govt-btn-util"
            onClick={() => setLang(lang === 'EN' ? 'MR' : 'EN')}
            title="Switch Language"
          >
            <Globe size={11} style={{ display: 'inline', marginRight: 4 }} />
            {lang === 'EN' ? 'मराठी' : 'English'}
          </button>

          <div 
            className="mode-pill-toggle live"
            style={{ cursor: 'default' }}
            title="Connected directly to Spring Boot Backend (:8080)"
          >
            <Radio size={12} className="pulse-icon" />
            <span>Live Backend (:8080)</span>
          </div>

          <button 
            className="govt-btn-util"
            onClick={onToggleTheme}
            title="Toggle Dark / Light Theme"
          >
            {currentTheme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
          </button>
        </div>
      </div>

      {/* Main Government Header */}
      <header className="govt-brand-header">
        <div className="govt-brand-left">
          <div className="govt-logo-badge" onClick={() => onNavigate('citizen')} style={{ cursor: 'pointer' }}>
            <img src="/logo.svg" alt="EkSutra Logo" style={{ width: 38, height: 38 }} />
          </div>
          <div className="govt-title-group">
            <h1>
              <span>EkSutra</span>
              <span className="font-marathi" style={{ fontSize: '1.1rem', opacity: 0.85 }}>| एकसूत्र</span>
              <span className="badge-msins">MSInS Interoperability</span>
            </h1>
            <p>
              {lang === 'EN' 
                ? 'Department of Skills, Employment, Entrepreneurship & Innovation' 
                : 'कौशल्य, रोजगार, उद्योजकता आणि नावीन्यता विभाग'}
            </p>
          </div>
        </div>

        {/* Desktop Quick Role & Nav Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Public Portal / Admin Portal Toggle Button */}
          {activePage === 'citizen' ? (
            <button 
              className="btn btn-saffron btn-sm"
              onClick={() => onNavigate('dashboard')}
            >
              <ShieldCheck size={14} />
              <span>Officer Portal</span>
            </button>
          ) : (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('citizen')}
              style={{ background: 'rgba(255,255,255,0.12)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.25)' }}
            >
              <ExternalLink size={14} />
              <span>Citizen View</span>
            </button>
          )}

          {/* Quick Role Switcher for Officer Portal */}
          {user && activePage !== 'citizen' && activePage !== 'login' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: 4, border: '1px solid rgba(184,147,74,0.3)' }}>
              <span style={{ fontSize: '0.74rem', color: '#DDD8CA', fontWeight: 600 }}>Role:</span>
              <button
                className="btn btn-sm"
                style={{
                  padding: '3px 10px',
                  fontSize: '0.74rem',
                  color: user.role === 'AUTHORITY' ? '#1A1916' : '#F6F3EC',
                  borderColor: user.role === 'AUTHORITY' ? 'transparent' : 'rgba(246,243,236,0.3)',
                  background: user.role === 'AUTHORITY' ? 'var(--gold-500)' : 'transparent',
                  fontWeight: 700
                }}
                onClick={() => switchRole('AUTHORITY')}
              >
                Authority
              </button>
              <button
                className="btn btn-sm"
                style={{
                  padding: '3px 10px',
                  fontSize: '0.74rem',
                  color: user.role === 'ADMIN' ? '#1A1916' : '#F6F3EC',
                  borderColor: user.role === 'ADMIN' ? 'transparent' : 'rgba(246,243,236,0.3)',
                  background: user.role === 'ADMIN' ? 'var(--gold-500)' : 'transparent',
                  fontWeight: 700
                }}
                onClick={() => switchRole('ADMIN')}
              >
                Admin
              </button>
            </div>
          )}

          {/* User Profile Badge */}
          {user && activePage !== 'login' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>{user.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 500 }}>{user.role}</div>
              </div>
              <button 
                className="btn btn-outline btn-icon-only btn-sm"
                onClick={() => {
                  logout();
                  onNavigate('login');
                }}
                title="Logout"
                style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            activePage !== 'login' && (
              <button className="btn btn-primary btn-sm" onClick={() => onNavigate('login')}>
                Officer Login
              </button>
            )
          )}
        </div>
      </header>
    </>
  );
};
