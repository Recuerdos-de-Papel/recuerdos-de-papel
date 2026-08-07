import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_URL no está definida');
}

// Crear instancia de Axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para agregar token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Manejo de errores 401 (No autorizado)
    if (error.response?.status === 401) {
      // Limpiar token y redirigir a login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    
    // Manejo de errores 403 (Prohibido)
    if (error.response?.status === 403) {
      console.error('Acceso prohibido');
    }
    
    // Manejo de errores 500 (Error del servidor)
    if (error.response?.status === 500) {
      console.error('Error del servidor');
    }
    
    return Promise.reject(error);
  }
);

// Funciones auxiliares
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const setUser = (user: any): void => {
  localStorage.setItem('auth_user', JSON.stringify(user));
};

export const getUser = (): any => {
  const user = localStorage.getItem('auth_user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem('auth_user');
};

export const logout = (): void => {
  removeAuthToken();
  removeUser();
};