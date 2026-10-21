"use client";

import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

// Type definition for a user's details
interface User {
  email: string;
  role: string;
}

// Type definition for all values exposed by the Auth context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

// 1. Create the Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to safely read the stored user from localStorage on initial render
function getInitialUser(): User | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  if (token && storedUser) {
    try { return JSON.parse(storedUser); } catch { return null; }
  }
  return null;
}

// 2. Provider component — responsible for sharing auth state with child components
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Use a lazy initializer to read localStorage once on mount, avoiding setState-in-effect
  const [user, setUser] = useState<User | null>(getInitialUser);

  // Login function — saves the token and user data to localStorage
  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData)); // Also save user details for display purposes
    setUser(userData);
  };

  // Logout function — clears auth state and localStorage
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

// 3. Custom hook — allows other components to easily access auth data
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
