import { apiClient } from '../api/client';

// Crear preferencia de pago en Mercado Pago
export const createPaymentPreference = async (orderData: {
  orderId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>;
  total: number;
  customerEmail: string;
}): Promise<{ preferenceId: string; initPoint: string }> => {
  try {
    const response = await apiClient.post('/payments/create-preference', orderData);
    return response.data;
  } catch (error) {
    console.error('Error al crear preferencia de pago:', error);
    throw error;
  }
};

// Consultar estado de pago
export const getPaymentStatus = async (paymentId: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/payments/status/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error al consultar estado de pago:', error);
    throw error;
  }
};