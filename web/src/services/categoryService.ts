import { supabase } from '../lib/supabase';
import { Category } from '../types';

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order');
  
  if (error) throw error;
  return data as Category[];
};

export const getCategoryByIdFromDB = async (id: string) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Category;
};

export const createCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single();
  
  if (error) throw error;
  return data as Category;
};

export const updateCategory = async (id: string, updates: Partial<Category>) => {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Category;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const toggleCategoryStatus = async (id: string, isActive: boolean) => {
  const { data, error } = await supabase
    .from('categories')
    .update({ isActive })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Category;
};