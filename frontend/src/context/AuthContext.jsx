import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const raw = localStorage.getItem('hseq_demo_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getStoredUser);

  useEffect(() => {
    if (!currentUser) {
      localStorage.removeItem('hseq_demo_user');
      return;
    }
    localStorage.setItem('hseq_demo_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const login = (email, password) => {
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!user) return false;
    setCurrentUser(user);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = useMemo(() => ({ currentUser, login, logout }), [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

