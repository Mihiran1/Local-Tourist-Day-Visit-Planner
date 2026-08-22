"use client";

import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

// User ගේ විස්තර වලට අදාළ Type එක
interface User {
  email: string;
  role: string;
}

// Context එකේ තියෙන දේවල් මොනවාද කියලා Type කරනවා
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

// 1. Context එක හැදීම
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Provider Component එක - මෙයා තමයි දත්ත බෙදන්නේ
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // App එක Refresh කරද්දී LocalStorage එකේ Token එකක් තියෙනවද බලලා User ව ලොග් කරනවා
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login ෆන්ක්ෂන් එක
  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData)); // User ගේ විස්තරත් සේව් කරනවා (නම පෙන්නන්න වගේ දේවල් වලට)
    setUser(userData);
  };

  // Logout ෆන්ක්ෂන් එක
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook එක - වෙන Components වලට ලේසියෙන්ම මේ දත්ත ගන්න
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
