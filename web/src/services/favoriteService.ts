import { apiClient } from '../api/client';
import { Favorite } from '../types';

// Obtener favoritos del usuario
export const getFavorites = async (): Promise<Favorite[]> => {
  try {
    const response = await apiClient.get('/favorites');
    return response.data;
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    throw error;
  }
};

// Agregar producto a favoritos
export const addToFavorites = async (productId: string): Promise<Favorite> => {
  try {
    const response = await apiClient.post<Favorite>('/favorites', { productId });
    return response.data;
  } catch (error) {
    console.error('Error al agregar a favoritos:', error);
    throw error;
  }
};

// Eliminar producto de favoritos
export const removeFromFavorites = async (productId: string): Promise<void> => {
  try {
    await apiClient.delete(`/favorites/${productId}`);
  } catch (error) {
    console.error('Error al eliminar de favoritos:', error);
    throw error;
  }
};

// Verificar si un producto está en favoritos
export const isFavorite = async (productId: string): Promise<boolean> => {
  try {
    const response = await apiClient.get(`/favorites/${productId}`);
    return response.data.isFavorite;
  } catch (error) {
    console.error('Error al verificar favorito:', error);
    return false;
  }
};