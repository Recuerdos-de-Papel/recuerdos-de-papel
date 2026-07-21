import { supabase } from '../lib/supabase';
import type { Product, Category, Subcategory, ProductFilters, PaginatedResponse } from '../types';

// Obtener productos activos con filtros
export const getProducts = async (
  page = 1,
  limit = 12,
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> => {
  let query = supabase
    .from('products')
    .select(`*, category:categories(*), subcategory:subcategories(*), images:product_images(*)`)
    .eq('isActive', true);

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
  }

  if (filters?.category) {
    query = query.eq('categoryId', filters.category);
  }

  if (filters?.subcategory) {
    query = query.eq('subcategoryId', filters.subcategory);
  }

  if (filters?.isFeatured !== undefined) {
    query = query.eq('isFeatured', filters.isFeatured);
  }

  if (filters?.isOffer !== undefined) {
    query = query.eq('labels', 'offer');
  }

  if (filters?.minPrice !== undefined) {
    query = query.gte('webPrice', filters.minPrice);
  }

  if (filters?.maxPrice !== undefined) {
    query = query.lte('webPrice', filters.maxPrice);
  }

  const { data, error, count } = await query
    .order('displayOrder', { ascending: false })
    .order('createdAt', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;

  return {
    data: data as Product[] || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
};

// Obtener producto por ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select(`*, category:categories(*), subcategory:subcategories(*), images:product_images(*)`)
    .eq('id', id)
    .eq('isActive', true)
    .single();

  if (error) throw error;
  return data as Product;
};

// Obtener producto por slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select(`*, category:categories(*), subcategory:subcategories(*), images:product_images(*)`)
    .eq('slug', slug)
    .eq('isActive', true)
    .single();

  if (error) throw error;
  return data as Product;
};

// Obtener categorías
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('isActive', true)
    .order('order', { ascending: true });

  if (error) throw error;
  return data as Category[];
};

// Obtener subcategorías
export const getSubcategories = async (categoryId?: string): Promise<Subcategory[]> => {
  let query = supabase
    .from('subcategories')
    .select('*')
    .eq('isActive', true)
    .order('order', { ascending: true });

  if (categoryId) {
    query = query.eq('categoryId', categoryId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Subcategory[];
};

// Obtener productos relacionados
export const getRelatedProducts = async (
  categoryId: string,
  excludeId: string,
  limit = 8
): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`*, category:categories(*), subcategory:subcategories(*), images:product_images(*)`)
    .eq('categoryId', categoryId)
    .eq('isActive', true)
    .neq('id', excludeId)
    .order('createdAt', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Product[];
};

// Crear producto
export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};

// Actualizar producto
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};

// Eliminar producto
export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};