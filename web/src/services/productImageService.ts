import { supabase } from '../lib/supabase';
import { ProductImage } from '../types';

export const uploadProductImage = async (productId: string, file: File) => {
  const fileName = `${productId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);
  
  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);
  
  const { data: imageData, error: insertError } = await supabase
    .from('product_images')
    .insert([{
      productId,
      url: urlData.publicUrl,
      isPrimary: false,
      order: 0,
    }])
    .select()
    .single();
  
  if (insertError) throw insertError;
  return imageData as ProductImage;
};

export const deleteProductImage = async (id: string) => {
  const { data: image, error: fetchError } = await supabase
    .from('product_images')
    .select('url')
    .eq('id', id)
    .single();
  
  if (fetchError) throw fetchError;
  
  const url = new URL(image.url);
  const path = url.pathname.split('/').slice(3).join('/');
  
  const { error: storageError } = await supabase.storage
    .from('product-images')
    .remove([path]);
  
  if (storageError) throw storageError;
  
  const { error: deleteError } = await supabase
    .from('product_images')
    .delete()
    .eq('id', id);
  
  if (deleteError) throw deleteError;
};

export const setPrimaryImage = async (productId: string, imageId: string) => {
  const { error: resetError } = await supabase
    .from('product_images')
    .update({ isPrimary: false })
    .eq('productId', productId);
  
  if (resetError) throw resetError;
  
  const { data, error } = await supabase
    .from('product_images')
    .update({ isPrimary: true })
    .eq('id', imageId)
    .select()
    .single();
  
  if (error) throw error;
  return data as ProductImage;
};

export const updateImageOrder = async (imageId: string, order: number) => {
  const { data, error } = await supabase
    .from('product_images')
    .update({ order })
    .eq('id', imageId)
    .select()
    .single();
  
  if (error) throw error;
  return data as ProductImage;
};