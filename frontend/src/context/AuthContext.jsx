import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('eksutra_user');
    return savedUser ? JSON.parse(savedUser) : {
      username: 'aditya_authority',
      role: 'AUTHORITY',
      name: 'Aditya Jadhav (Officer)',
      department: 'Department of Skills, Employment & Innovation'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('eksutra_token') || 'demo-token');

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

  const login = async (username, password) => {
    const res = await api.auth.login({ username, password });
    const userData = {
      username: res.username,
      role: res.role ? res.role.replace('ROLE_', '') : (username.toLowerCase().includes('admin') ? 'ADMIN' : 'AUTHORITY'),
      name: username.toLowerCase().includes('admin') ? 'Rajesh Verma (Admin)' : 'Pooja Patil (Verification Officer)',
      department: username.toLowerCase().includes('admin') ? 'Maharashtra State Innovation Society (MSInS)' : 'Skill Development & Entrepreneurship'
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

  const switchRole = (newRole) => {
    if (newRole === 'ADMIN') {
      const adminUser = {
        username: 'msins_admin',
        role: 'ADMIN',
        name: 'Dr. Suresh Khade (Chief Admin)',
        department: 'Maharashtra State Innovation Society'
      };
      setUser(adminUser);
      setToken('demo-admin-token');
    } else {
      const authUser = {
        username: 'aditya_authority',
        role: 'AUTHORITY',
        name: 'Aditya Jadhav (Verification Officer)',
        department: 'Dept of Skills & Employment'
      };
      setUser(authUser);
      setToken('demo-authority-token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, switchRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
