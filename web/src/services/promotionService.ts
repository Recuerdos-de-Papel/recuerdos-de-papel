import { supabase } from '../lib/supabase';
import { Promotion } from '../types';

export const getPromotions = async () => {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('isActive', true)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data as Promotion[];
};

export const getPromotionById = async (id: string) => {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Promotion;
};

export const createPromotion = async (promotion: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('promotions')
    .insert([promotion])
    .select()
    .single();

  if (error) throw error;
  return data as Promotion;
};

export const updatePromotion = async (id: string, updates: Partial<Promotion>) => {
  const { data, error } = await supabase
    .from('promotions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Promotion;
};

export const deletePromotion = async (id: string) => {
  const { error } = await supabase
    .from('promotions')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const togglePromotionStatus = async (id: string, isActive: boolean) => {
  const { data, error } = await supabase
    .from('promotions')
    .update({ isActive })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Promotion;
};