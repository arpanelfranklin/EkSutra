import React from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  GitFork, 
  CheckSquare, 
  Activity, 
  Globe, 
  HelpCircle,
  Database,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ activePage, onNavigate }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const menuItems = [
    { id: 'dashboard', label: 'Interoperability Dashboard', icon: LayoutDashboard, role: 'ALL' },
    { id: 'applications', label: 'Applications Registry', icon: FileSpreadsheet, role: 'ALL' },
    { id: 'studio', label: 'Pipeline & Integration Studio', icon: GitFork, role: 'ALL' },
    { id: 'requests', label: 'Action Requests Queue', icon: CheckSquare, role: 'ALL', badge: '2 Pending' },
    { id: 'health', label: 'Telemetry & Connectors', icon: Activity, role: 'ALL' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-nav">
        <div className="sidebar-section-title">Workflow & Middleware</div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span className="badge badge-on_hold" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="sidebar-section-title" style={{ marginTop: 20 }}>Connected Registries</div>
        <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald-500)' }}></span>
            <span>Maha-Citizen (REST)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald-500)' }}></span>
            <span>MSInS Registry (XML)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald-500)' }}></span>
            <span>MongoDB Data Store</span>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          <button
            className="sidebar-link"
            onClick={() => onNavigate('citizen')}
            style={{ width: '100%', border: 'none', background: 'var(--bg-subtle)', textAlign: 'left', cursor: 'pointer' }}
          >
            <Globe size={18} />
            <span>Citizen Public Portal</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
