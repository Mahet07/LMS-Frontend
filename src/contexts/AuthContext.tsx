// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export type UserRole = 'admin' | 'instructor' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth`;

  // 🔹 Load user and token from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // 🔹 LOGIN
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = res.data;

      const loggedInUser: User = { ...user, token };
      setUser(loggedInUser);
      setToken(token);

      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', token);

      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  // 🔹 SIGNUP
// 🔹 SIGNUP (FIXED)
const signup = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
  try {
    const res = await axios.post(`${API_URL}/signup`, { email, password, name, role });

    // ✅ Extract correct fields
    const { token, user } = res.data;

    const newUser: User = { ...user, token };
    setUser(newUser);
    setToken(token);

    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', token);

    return true;
  } catch (err) {
    console.error('Signup error:', err);
    return false;
  }
};


  // 🔹 LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
