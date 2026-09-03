import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(4);
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <CheckCircle2 size={18} color="#10B981" />,
    warning: <AlertTriangle size={18} color="#F59E0B" />,
    error: <AlertCircle size={18} color="#F43F5E" />,
    info: <Info size={18} color="#6366F1" />
  };

  return (
    <NotificationContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 400
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 8,
              background: 'var(--bg-surface-elevated, #FFFFFF)',
              color: 'var(--text-primary, #0F172A)',
              boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.2))',
              border: '1px solid var(--border-medium, #E2E8F0)',
              animation: 'fadeIn 200ms ease-out',
              fontSize: '0.86rem',
              fontWeight: 500
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {icons[toast.type] || icons.info}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted, #64748B)',
                cursor: 'pointer',
                display: 'flex',
                padding: 2
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
