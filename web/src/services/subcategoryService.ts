import { supabase } from '../lib/supabase';
import { Subcategory } from '../types';

export const getSubcategoriesFromDB = async (categoryId?: string) => {
  let query = supabase
    .from('subcategories')
    .select('*')
    .order('order');
  
  if (categoryId) {
    query = query.eq('categoryId', categoryId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as Subcategory[];
};

export const getSubcategoryById = async (id: string) => {
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Subcategory;
};

export const createSubcategory = async (subcategory: Omit<Subcategory, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('subcategories')
    .insert([subcategory])
    .select()
    .single();
  
  if (error) throw error;
  return data as Subcategory;
};

export const updateSubcategory = async (id: string, updates: Partial<Subcategory>) => {
  const { data, error } = await supabase
    .from('subcategories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Subcategory;
};

export const deleteSubcategory = async (id: string) => {
  const { error } = await supabase
    .from('subcategories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};