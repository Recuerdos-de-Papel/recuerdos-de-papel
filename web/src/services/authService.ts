import { apiClient } from '../api/client';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';

// Login
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Registro
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// Obtener perfil
export const getProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
};

// Actualizar perfil
export const updateProfile = async (data: { name: string; email: string; phone?: string }): Promise<User> => {
  try {
    const response = await apiClient.put<User>('/auth/profile', data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
};
