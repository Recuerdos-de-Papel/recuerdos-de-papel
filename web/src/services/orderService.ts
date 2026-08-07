import { apiClient } from '../api/client';
import { Order, Address, PaginatedResponse } from '../types';

// Obtener pedidos del usuario
export const getOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PaginatedResponse<Order>> => {
  try {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw error;
  }
};

// Obtener pedido por ID
export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    throw error;
  }
};

// Crear pedido
export const createOrder = async (orderData: {
  deliveryMethod: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  subtotal: number;
  total: number;
  discount?: number;
  shippingCost?: number;
  address?: string;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}): Promise<Order> => {
  try {
    const response = await apiClient.post<Order>('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
};

// Obtener direcciones del usuario
export const getAddresses = async (): Promise<Address[]> => {
  try {
    const response = await apiClient.get('/addresses');
    return response.data;
  } catch (error) {
    console.error('Error al obtener direcciones:', error);
    throw error;
  }
};

// Crear dirección
export const createAddress = async (addressData: Partial<Address>): Promise<Address> => {
  try {
    const response = await apiClient.post<Address>('/addresses', addressData);
    return response.data;
  } catch (error) {
    console.error('Error al crear dirección:', error);
    throw error;
  }
};

// Actualizar dirección
export const updateAddress = async (id: string, addressData: Partial<Address>): Promise<Address> => {
  try {
    const response = await apiClient.put<Address>(`/addresses/${id}`, addressData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar dirección:', error);
    throw error;
  }
};

// Eliminar dirección
export const deleteAddress = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/addresses/${id}`);
  } catch (error) {
    console.error('Error al eliminar dirección:', error);
    throw error;
  }
};