import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, setAuthToken, setUser, getUser, logout as apiLogout, getAuthToken } from '../api/client';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay sesión activa al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      const savedUser = getUser();
      
      if (token && savedUser) {
        setUserState(savedUser);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Guardar token y usuario
      setAuthToken(token);
      setUser(user);
      setUserState(user);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      const { token, user } = response.data;
      
      // Guardar token y usuario
      setAuthToken(token);
      setUser(user);
      setUserState(user);
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    setUserState(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    setUserState(updatedUser);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};