import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Initialize Supabase client for storage operations
// Uses SERVICE_ROLE_KEY for admin access to upload files
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabaseAdmin: any = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Upload a file to Supabase Storage
 * @param bucket - The storage bucket name (e.g., 'product-images')
 * @param fileBuffer - The file buffer
 * @param fileName - The original file name
 * @param mimeType - The MIME type of the file
 * @returns The public URL of the uploaded file
 */
export const uploadToStorage = async (
  bucket: string,
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> => {
  if (!supabaseAdmin) {
    throw new Error(
      'Supabase client not initialized. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
    );
  }

  // Generate a unique filename to avoid collisions
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
  const uniqueFileName = `${randomUUID()}${fileExtension}`;

  // Upload to Supabase Storage
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(uniqueFileName, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }

  // Get the public URL
  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(uniqueFileName);

  return publicUrlData.publicUrl;
};

/**
 * Upload multiple files to Supabase Storage
 * @param bucket - The storage bucket name
 * @param files - Array of { buffer, originalName, mimeType }
 * @returns Array of public URLs
 */
export const uploadMultipleToStorage = async (
  bucket: string,
  files: Array<{
    buffer: Buffer;
    originalName: string;
    mimeType: string;
  }>
): Promise<string[]> => {
  const urls: string[] = [];

  for (const file of files) {
    const url = await uploadToStorage(
      bucket,
      file.buffer,
      file.originalName,
      file.mimeType
    );
    urls.push(url);
  }

  return urls;
};

/**
 * Delete a file from Supabase Storage by URL
 * @param bucket - The storage bucket name
 * @param fileUrl - The public URL of the file to delete
 */
export const deleteFromStorage = async (bucket: string, fileUrl: string): Promise<void> => {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized.');
  }

  // Extract the file path from the URL
  const urlParts = fileUrl.split(`/storage/v1/object/public/${bucket}/`);
  if (urlParts.length < 2) {
    throw new Error('Invalid file URL format');
  }

  const filePath = urlParts[1];

  const { error } = await supabaseAdmin.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
};
