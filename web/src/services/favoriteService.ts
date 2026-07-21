import { supabase } from '../lib/supabase';
import { Favorite } from '../types';

export const getFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data as Favorite[];
};

export const addToFavorites = async (userId: string, productId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, product_id: productId }])
    .select()
    .single();

  if (error) throw error;
  return data as Favorite;
};

export const removeFromFavorites = async (id: string) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const isFavorite = async (userId: string, productId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (error) return false;
  return !!data;
};

export const removeFavoriteByProduct = async (userId: string, productId: string) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
};
