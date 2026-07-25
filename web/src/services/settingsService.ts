import { supabase } from '../lib/supabase';
import type { Setting } from '../types';

// Obtener todas las configuraciones
export const getSettings = async (): Promise<Setting[]> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .order('key', { ascending: true });

  if (error) throw error;
  return data as Setting[];
};

// Obtener configuración por clave
export const getSettingByKey = async (key: string): Promise<Setting> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', key)
    .single();

  if (error) throw error;
  return data as Setting;
};

// Obtener múltiples configuraciones por claves
export const getSettingsByKeys = async (keys: string[]): Promise<Setting[]> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .in('key', keys);

  if (error) throw error;
  return data as Setting[];
};

// Crear configuración
export const createSetting = async (setting: Omit<Setting, 'id' | 'createdAt' | 'updatedAt'>): Promise<Setting> => {
  const { data, error } = await supabase
    .from('settings')
    .insert([setting])
    .select()
    .single();

  if (error) throw error;
  return data as Setting;
};

// Actualizar configuración por clave
export const updateSetting = async (key: string, value: string, description?: string): Promise<Setting> => {
  const updates: Partial<Setting> = { value };
  if (description !== undefined) {
    updates.description = description;
  }

  const { data, error } = await supabase
    .from('settings')
    .update(updates)
    .eq('key', key)
    .select()
    .single();

  if (error) throw error;
  return data as Setting;
};

// Upsert configuración (crea o actualiza)
export const upsertSetting = async (key: string, value: string, description?: string): Promise<Setting> => {
  const { data, error } = await supabase
    .from('settings')
    .upsert([{ key, value, description }])
    .select()
    .single();

  if (error) throw error;
  return data as Setting;
};

// Eliminar configuración
export const deleteSetting = async (key: string): Promise<void> => {
  const { error } = await supabase
    .from('settings')
    .delete()
    .eq('key', key);

  if (error) throw error;
};

// Helper: Obtener el logo del negocio
export const getLogo = async (): Promise<string | null> => {
  try {
    const setting = await getSettingByKey('logo');
    return setting?.value || null;
  } catch {
    return null;
  }
};

// Helper: Obtener el banner principal
export const getBanner = async (): Promise<string | null> => {
  try {
    const setting = await getSettingByKey('banner');
    return setting?.value || null;
  } catch {
    return null;
  }
};

// Helper: Obtener el WhatsApp del negocio
export const getWhatsApp = async (): Promise<string | null> => {
  try {
    const setting = await getSettingByKey('whatsapp');
    return setting?.value || null;
  } catch {
    return null;
  }
};

// Helper: Obtener redes sociales
export const getSocialLinks = async (): Promise<Record<string, string>> => {
  const keys = ['facebook', 'instagram', 'twitter', 'tiktok', 'youtube'];
  const settings = await getSettingsByKeys(keys);
  const result: Record<string, string> = {};
  settings.forEach(s => {
    result[s.key] = s.value;
  });
  return result;
};

// Helper: Obtener información del negocio
export const getBusinessInfo = async (): Promise<Record<string, string>> => {
  const keys = ['business_name', 'business_email', 'business_phone', 'business_address'];
  const settings = await getSettingsByKeys(keys);
  const result: Record<string, string> = {};
  settings.forEach(s => {
    result[s.key] = s.value;
  });
  return result;
};
