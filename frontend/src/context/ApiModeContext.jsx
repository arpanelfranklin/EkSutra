import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const ApiModeContext = createContext(null);

export const ApiModeProvider = ({ children }) => {
  const [isLiveMode, setIsLiveMode] = useState(() => {
    const saved = localStorage.getItem('eksutra_api_mode');
    return saved !== null ? saved === 'live' : true;
  });

  const [backendHealth, setBackendHealth] = useState({
    checked: false,
    isOnline: false,
    lastChecked: null
  });

  const checkHealth = async () => {
    const online = await api.pingBackend();
    setBackendHealth({
      checked: true,
      isOnline: online,
      lastChecked: new Date()
    });
    return online;
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const toggleApiMode = () => {
    const nextMode = !isLiveMode;
    setIsLiveMode(nextMode);
    localStorage.setItem('eksutra_api_mode', nextMode ? 'live' : 'mock');
  };

  return (
    <ApiModeContext.Provider value={{
      isLiveMode,
      toggleApiMode,
      backendHealth,
      checkHealth
    }}>
      {children}
    </ApiModeContext.Provider>
  );
};

export const useApiMode = () => useContext(ApiModeContext);
