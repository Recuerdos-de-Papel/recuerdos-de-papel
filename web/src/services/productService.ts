import { apiClient } from '../api/client';
import { Product, Category, Family, Subfamily, PaginatedResponse } from '../types';

// Obtener todos los productos
export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  status?: string;
  subfamilyId?: string;
}): Promise<PaginatedResponse<Product>> => {
  try {
    const response = await apiClient.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

// Obtener producto por ID
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
};

// Obtener categorías
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

// Obtener familias por categoría
export const getFamiliesByCategory = async (categoryId: string): Promise<Family[]> => {
  try {
    const response = await apiClient.get(`/families/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener familias:', error);
    throw error;
  }
};

// Obtener subfamilias por familia
export const getSubfamiliesByFamily = async (familyId: string): Promise<Subfamily[]> => {
  try {
    const response = await apiClient.get(`/subfamilies/family/${familyId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener subfamilias:', error);
    throw error;
  }
};

// Obtener promociones activas
export const getPromotions = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get('/promotions');
    return response.data;
  } catch (error) {
    console.error('Error al obtener promociones:', error);
    throw error;
  }
};

// Obtener flyers activos
export const getFlyers = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get('/flyers');
    return response.data;
  } catch (error) {
    console.error('Error al obtener flyers:', error);
    throw error;
  }
};