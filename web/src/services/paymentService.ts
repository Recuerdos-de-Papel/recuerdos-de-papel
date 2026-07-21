import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL no está configurada. Verifica .env');
}

export const createPreference = async (orderId: string) => {
  const { data, error } = await fetch(`${API_URL}/api/payments/create-preference`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
    },
    body: JSON.stringify({ orderId }),
  }).then(res => res.json());

  if (error) throw error;
  return data;
};

export const getPaymentStatus = async (paymentId: string) => {
  const { data, error } = await fetch(`${API_URL}/api/payments/status/${paymentId}`, {
    headers: {
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
    },
  }).then(res => res.json());

  if (error) throw error;
  return data;
};

export const refundPayment = async (paymentId: string, amount?: number) => {
  const { data, error } = await fetch(`${API_URL}/api/payments/refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
    },
    body: JSON.stringify({ paymentId, amount }),
  }).then(res => res.json());

  if (error) throw error;
  return data;
};