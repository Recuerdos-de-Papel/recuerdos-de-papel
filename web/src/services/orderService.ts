import { supabase } from '../lib/supabase';
import { Order } from '../types';

export const getOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Order[];
};

export const getOrderById = async (id: string, userId?: string) => {
  let query = supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .eq('id', id);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.single();

  if (error) throw error;
  return data as Order;
};

export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'items'>, items: { productId: string; quantity: number; price: number }[]) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ ...order, user_id: order.userId }])
    .select()
    .single();

  if (error) throw error;

  const orderId = data.id;
  const orderItems = items.map(item => ({ ...item, order_id: orderId }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return data as Order;
};

export const updateOrder = async (id: string, updates: Partial<Order>) => {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
};

export const deleteOrder = async (id: string) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const cancelOrder = async (id: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', id);

  if (error) throw error;
};
