import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ApiModeProvider } from './context/ApiModeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { CitizenPortalPage } from './pages/CitizenPortalPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { IntegrationStudioPage } from './pages/IntegrationStudioPage';
import { ActionRequestsPage } from './pages/ActionRequestsPage';
import { SystemHealthPage } from './pages/SystemHealthPage';
import { LoginPage } from './pages/LoginPage';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activePage, setActivePage] = useState('citizen'); // 'citizen', 'dashboard', 'applications', 'studio', 'requests', 'health', 'login'
  const [theme, setTheme] = useState(() => localStorage.getItem('eksutra_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('eksutra_theme', theme);
  }, [theme]);

  // Magnetic Button Effect Delegation (Respects prefers-reduced-motion)
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const magneticBtns = document.querySelectorAll(
        '.btn-primary, .btn-saffron, .btn-emerald, .btn-magnetic, [data-magnetic="true"]'
      );

      magneticBtns.forEach((btn) => {
        if (btn.disabled) return;
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Attraction threshold (button radius + ~35px)
        const triggerRadius = Math.max(rect.width, rect.height) / 2 + 35;

        if (dist < triggerRadius) {
          const pull = (1 - dist / triggerRadius) * 5; // Max 5px pull
          const moveX = (dx / dist) * pull;
          const moveY = (dy / dist) * pull;

          btn.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0) scale(1.025)`;
          btn.style.transition = 'transform 180ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 180ms ease';
        } else {
          if (btn.style.transform && btn.style.transform.includes('translate3d')) {
            btn.style.transform = '';
            btn.style.transition = 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease';
          }
        }
      });
    };

    const handleMouseLeave = () => {
      const magneticBtns = document.querySelectorAll(
        '.btn-primary, .btn-saffron, .btn-emerald, .btn-magnetic, [data-magnetic="true"]'
      );
      magneticBtns.forEach((btn) => {
        btn.style.transform = '';
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleNavigate = (page) => {
    if (page !== 'citizen' && page !== 'login' && !isAuthenticated) {
      setActivePage('login');
    } else {
      setActivePage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setActivePage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Immediate reactive transitions upon auth state change
  useEffect(() => {
    if (isAuthenticated && activePage === 'login') {
      setActivePage('dashboard');
    }
  }, [isAuthenticated, activePage]);

  useEffect(() => {
    if (!isAuthenticated && activePage !== 'citizen' && activePage !== 'login') {
      setActivePage('login');
    }
  }, [isAuthenticated, activePage]);

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        currentTheme={theme}
        onToggleTheme={toggleTheme}
        onNavigate={handleNavigate}
        activePage={activePage}
      />

      {/* Main View Logic */}
      {activePage === 'citizen' && (
        <CitizenPortalPage onNavigateToOfficer={() => handleNavigate('dashboard')} />
      )}

      {activePage === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateToCitizen={() => handleNavigate('citizen')}
        />
      )}

      {activePage !== 'citizen' && activePage !== 'login' && (
        <div className="admin-layout">
          <Sidebar activePage={activePage} onNavigate={handleNavigate} />
          <main className="admin-main-content">
            {activePage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
            {activePage === 'applications' && <ApplicationsPage onNavigateToStudio={() => handleNavigate('studio')} />}
            {activePage === 'studio' && <IntegrationStudioPage onNavigateToApplications={() => handleNavigate('applications')} />}
            {activePage === 'requests' && <ActionRequestsPage />}
            {activePage === 'health' && <SystemHealthPage />}
          </main>
        </div>
      )}

      {/* Official Government Footer */}
      <footer style={{
        background: 'var(--govt-header-bg)',
        color: '#94A3B8',
        padding: '24px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontSize: '0.8rem',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <strong style={{ color: '#FFFFFF' }}>EkSutra (एकसूत्र) Platform</strong> &bull; Government of Maharashtra
            <div style={{ fontSize: '0.74rem', marginTop: 4 }}>
              Maharashtra State Innovation Society, Department of Skills, Employment, Entrepreneurship and Innovation
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: '0.76rem' }}>
            <span>Single Sign-On</span>
            <span>Canonical Data Standards</span>
            <span>API Interoperability v3.1</span>
            <span>GIGW & W3C Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ApiModeProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </ApiModeProvider>
    </AuthProvider>
  );
}

export default App;
