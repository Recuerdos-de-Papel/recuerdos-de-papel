import { z } from 'zod';

// Product validators
export const createProductSchema = z.object({
  subfamilyId: z.string().uuid('ID de subfamilia inválido'),
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive('El precio debe ser positivo'),
  webPrice: z.number().positive('El precio web debe ser positivo'),
  images: z.array(z.string()).optional(),
  isOffer: z.boolean().optional(),
  status: z.enum(['available', 'in_production', 'out_of_stock']).optional(),
  features: z.object({
    personalized: z.boolean().optional(),
    material: z.string().optional(),
    size: z.string().optional(),
    printType: z.string().optional(),
    care: z.string().optional(),
  }).optional(),
  productionTime: z.string().optional(),
  isActive: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
  cost: z.number().positive().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const updateProductStateSchema = z.object({
  isActive: z.boolean(),
});

export const updateProductFeaturedSchema = z.object({
  isOffer: z.boolean(),
});

export const updateProductOrderSchema = z.object({
  order: z.number().int().min(0),
});

// Category validators
export const createCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Family validators
export const createFamilySchema = z.object({
  categoryId: z.string().uuid('ID de categoría inválido'),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateFamilySchema = createFamilySchema.partial();

// Subfamily validators
export const createSubfamilySchema = z.object({
  familyId: z.string().uuid('ID de familia inválido'),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateSubfamilySchema = createSubfamilySchema.partial();

// Promotion validators
export const createPromotionSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  discount: z.number().min(0).max(100, 'El descuento debe estar entre 0 y 100'),
  code: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isActive: z.boolean().optional(),
  isWeb: z.boolean().optional(),
});

export const updatePromotionSchema = createPromotionSchema.partial();

// Flyer validators
export const createFlyerSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  imageUrl: z.string().url('URL de imagen inválida'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export const updateFlyerSchema = createFlyerSchema.partial();

// Order validators
export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'payment_pending', 'paid', 'in_production', 'ready', 'shipped', 'delivered', 'cancelled', 'rejected']),
});

// Setting validators
export const createSettingSchema = z.object({
  key: z.string().min(1, 'La clave es requerida'),
  value: z.string().min(1, 'El valor es requerido'),
  description: z.string().optional(),
});

export const updateSettingSchema = z.object({
  value: z.string().min(1, 'El valor es requerido'),
  description: z.string().optional(),
});

// Auth validators
export const adminLoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const adminRegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(1, 'El nombre es requerido'),
});

// Statistics validators
export const statisticsFilterSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  period: z.enum(['day', 'week', 'month', 'year', 'custom']).optional(),
});

// Image upload validators
export const uploadImageSchema = z.object({
  filename: z.string().min(1, 'El nombre del archivo es requerido'),
  contentType: z.string().min(1, 'El tipo de contenido es requerido'),
});