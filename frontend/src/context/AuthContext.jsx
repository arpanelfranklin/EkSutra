import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('eksutra_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('eksutra_token') || null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('eksutra_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('eksutra_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('eksutra_token', token);
    } else {
      localStorage.removeItem('eksutra_token');
    }
  }, [token]);

  const login = async (username, password, portalRole = null) => {
    let res;
    if (portalRole === 'AUTHORITY') {
      res = await api.auth.loginAuthority({ username, password });
    } else if (portalRole === 'ADMIN') {
      res = await api.auth.loginAdmin({ username, password });
    } else {
      res = await api.auth.login({ username, password });
    }

    const cleanRole = (res.role || '').replace('ROLE_', '') || (username.toLowerCase().includes('admin') ? 'ADMIN' : 'AUTHORITY');
    const userData = {
      username: res.username,
      role: cleanRole,
      name: cleanRole === 'ADMIN' ? 'Rajesh Verma (Apex Admin)' : (res.fullName || 'Aditya Jadhav (Verification Officer)'),
      department: cleanRole === 'ADMIN' ? 'Maharashtra State Innovation Society (MSInS)' : (res.department || 'Department of Skills, Employment & Innovation')
    };

    setUser(userData);
    setToken(res.token);
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('eksutra_user');
    localStorage.removeItem('eksutra_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
