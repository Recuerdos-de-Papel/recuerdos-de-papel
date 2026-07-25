import { supabase } from '../lib/supabase';
import { Address } from '../types';

export const getAddresses = async (userId: string) => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('userId', userId)
    .order('isPrimary', { ascending: false });

  if (error) throw error;
  return data as Address[];
};

export const getAddressById = async (id: string) => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Address;
};

export const createAddress = async (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('addresses')
    .insert([{ ...address, userId: address.userId }])
    .select()
    .single();

  if (error) throw error;
  return data as Address;
};

export const updateAddress = async (id: string, updates: Partial<Address>) => {
  const { data, error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Address;
};

export const deleteAddress = async (id: string) => {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const setDefaultAddress = async (userId: string, addressId: string) => {
  const { error: resetError } = await supabase
    .from('addresses')
    .update({ isPrimary: false })
    .eq('userId', userId);

  if (resetError) throw resetError;

  const { data, error } = await supabase
    .from('addresses')
    .update({ isPrimary: true })
    .eq('id', addressId)
    .select()
    .single();

  if (error) throw error;
  return data as Address;
};
