import { supabase } from '../lib/supabase';
import type { Product, Category, Family, Subfamily, ProductFilters, PaginatedResponse } from '../types';

// Obtener productos activos con filtros
export const getProducts = async (
  page = 1,
  limit = 12,
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> => {
  // Build base query for count
  let countQuery = supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('isActive', true);

  // Build data query
  let dataQuery = supabase
    .from('products')
    .select(`
      *,
      subfamily:subfamilies(
        id,
        name,
        family:families(
          id,
          name,
          category:categories(
            id,
            name
          )
        )
      )
    `)
    .eq('isActive', true);

  if (filters?.search && filters.search.trim() !== '') {
    const searchFilter = `name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`;
    countQuery = countQuery.or(searchFilter);
    dataQuery = dataQuery.or(searchFilter);
  }

  if (filters?.category && filters.category.trim() !== '') {
    countQuery = countQuery.eq('subfamily.family.categoryId', filters.category);
    dataQuery = dataQuery.eq('subfamily.family.categoryId', filters.category);
  }

  if (filters?.family && filters.family.trim() !== '') {
    countQuery = countQuery.eq('subfamily.family.id', filters.family);
    dataQuery = dataQuery.eq('subfamily.family.id', filters.family);
  }

  if (filters?.subfamily && filters.subfamily.trim() !== '') {
    countQuery = countQuery.eq('subfamilyId', filters.subfamily);
    dataQuery = dataQuery.eq('subfamilyId', filters.subfamily);
  }

  if (filters?.isFeatured !== undefined) {
    countQuery = countQuery.eq('isFeatured', filters.isFeatured);
    dataQuery = dataQuery.eq('isFeatured', filters.isFeatured);
  }

  if (filters?.isOffer !== undefined) {
    countQuery = countQuery.eq('isOffer', filters.isOffer);
    dataQuery = dataQuery.eq('isOffer', filters.isOffer);
  }

  if (filters?.minPrice !== undefined) {
    countQuery = countQuery.gte('webPrice', filters.minPrice);
    dataQuery = dataQuery.gte('webPrice', filters.minPrice);
  }

  if (filters?.maxPrice !== undefined) {
    countQuery = countQuery.lte('webPrice', filters.maxPrice);
    dataQuery = dataQuery.lte('webPrice', filters.maxPrice);
  }

  // Execute count query
  const { count, error: countError } = await countQuery;
  if (countError) throw countError;

  // Execute data query with pagination
  const { data, error } = await dataQuery
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
    .select(`
      *,
      subfamily:subfamilies(
        id,
        name,
        family:families(
          id,
          name,
          category:categories(
            id,
            name
          )
        )
      )
    `)
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
    .select(`
      *,
      subfamily:subfamilies(
        id,
        name,
        family:families(
          id,
          name,
          category:categories(
            id,
            name
          )
        )
      )
    `)
    .eq('slug', slug)
    .eq('isActive', true)
    .single();

  if (error) throw error;
  return data as Product;
};

// Obtener categorías activas
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('isActive', true)
    .order('order', { ascending: true });

  if (error) throw error;
  return data as Category[];
};

// Obtener familias por categoría
export const getFamiliesByCategory = async (categoryId: string): Promise<Family[]> => {
  let query = supabase
    .from('families')
    .select('*')
    .eq('isActive', true)
    .order('order', { ascending: true });

  if (categoryId) {
    query = query.eq('categoryId', categoryId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Family[];
};

// Obtener subfamilias por familia
export const getSubfamiliesByFamily = async (familyId: string): Promise<Subfamily[]> => {
  let query = supabase
    .from('subfamilies')
    .select('*')
    .eq('isActive', true)
    .order('order', { ascending: true });

  if (familyId) {
    query = query.eq('familyId', familyId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Subfamily[];
};

// Obtener productos relacionados
export const getRelatedProducts = async (
  subfamilyId: string,
  excludeId: string,
  limit = 8
): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      subfamily:subfamilies(
        id,
        name,
        family:families(
          id,
          name,
          category:categories(
            id,
            name
          )
        )
      )
    `)
    .eq('subfamilyId', subfamilyId)
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

// Eliminar producto (borrado lógico)
export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({ deletedAt: new Date().toISOString(), isActive: false })
    .eq('id', id);

  if (error) throw error;
};