import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const formatOfficerName = (username, fullName, role) => {
  if (fullName && fullName.trim()) {
    return fullName;
  }
  if (!username) {
    return role === 'ADMIN' ? 'System Administrator' : 'Verification Officer';
  }
  return username
    .split(/[._-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem('eksutra_token');
    if (saved && !saved.startsWith('demo-') && !saved.startsWith('mock-')) {
      return saved;
    }
    localStorage.removeItem('eksutra_token');
    return null;
  });

  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('eksutra_token');
    const savedUser = localStorage.getItem('eksutra_user');
    if (savedToken && !savedToken.startsWith('demo-') && !savedToken.startsWith('mock-') && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && (parsed.name?.includes('Aditya Jadhav') || parsed.name?.includes('Rajesh Verma'))) {
          parsed.name = formatOfficerName(parsed.username, null, parsed.role);
          localStorage.setItem('eksutra_user', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    localStorage.removeItem('eksutra_user');
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('eksutra_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('eksutra_user');
    }
  }, [user]);

  useEffect(() => {
    if (token && !token.startsWith('demo-') && !token.startsWith('mock-')) {
      localStorage.setItem('eksutra_token', token);
    } else {
      localStorage.removeItem('eksutra_token');
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await api.auth.login({ username, password });
    const roleClean = res.role ? res.role.replace('ROLE_', '') : (username.toLowerCase().includes('admin') ? 'ADMIN' : 'AUTHORITY');
    const officerName = formatOfficerName(res.username || username, res.fullName, roleClean);
    const departmentName = res.department || (roleClean === 'ADMIN' ? 'Maharashtra State Innovation Society (MSInS)' : 'Skill Development & Entrepreneurship');
    const userData = {
      username: res.username || username,
      role: roleClean,
      name: officerName,
      department: departmentName
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

  const switchRole = async (newRole) => {
    const targetUser = newRole === 'ADMIN' ? 'admin' : 'aditya_authority';
    try {
      await login(targetUser, 'password123');
    } catch (e) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, switchRole, isAuthenticated: !!user && !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
