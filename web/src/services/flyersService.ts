import { supabase } from '../lib/supabase';
import type { Flyer } from '../types';

// Obtener flyers activos
export const getFlyers = async (): Promise<Flyer[]> => {
  const { data, error } = await supabase
    .from('flyers')
    .select('*')
    .eq('isActive', true)
    .order('order', { ascending: true });

  if (error) throw error;
  return data as Flyer[];
};

// Obtener flyer por ID
export const getFlyerById = async (id: string): Promise<Flyer> => {
  const { data, error } = await supabase
    .from('flyers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Flyer;
};

// Crear flyer
export const createFlyer = async (flyer: Omit<Flyer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Flyer> => {
  const { data, error } = await supabase
    .from('flyers')
    .insert([flyer])
    .select()
    .single();

  if (error) throw error;
  return data as Flyer;
};

// Actualizar flyer
export const updateFlyer = async (id: string, updates: Partial<Flyer>): Promise<Flyer> => {
  const { data, error } = await supabase
    .from('flyers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Flyer;
};

// Eliminar flyer
export const deleteFlyer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('flyers')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Activar/Desactivar flyer
export const toggleFlyerStatus = async (id: string, isActive: boolean): Promise<Flyer> => {
  const { data, error } = await supabase
    .from('flyers')
    .update({ isActive })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Flyer;
};
