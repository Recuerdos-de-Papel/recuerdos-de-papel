// Tipos comunes
export type ProductStatus = 'available' | 'in_production' | 'out_of_stock';
export type ProductState = 'active' | 'inactive';
export type ProductLabel = 'offer' | 'new' | 'bestseller' | 'web_exclusive' | 'limited_edition' | 'custom';
export type UserRole = 'customer' | 'admin';
export type OrderStatus = 'pending' | 'payment_pending' | 'paid' | 'in_production' | 'ready' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type DeliveryMethod = 'pickup' | 'local_delivery' | 'interior_shipping';
export type MerchantOrderStatus = 'pending' | 'approved' | 'rejected';

// Status labels for display
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  payment_pending: 'Pago Pendiente',
  paid: 'Pago Aprobado',
  in_production: 'En Producción',
  ready: 'Listo',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

// Delivery method labels
export const DELIVERY_METHOD_LABELS: Record<DeliveryMethod, string> = {
  pickup: 'Retiro en Local',
  local_delivery: 'Entrega Córdoba Capital',
  interior_shipping: 'Envío Interior',
};

// Categoría
export interface Category {
  id: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Familia
export interface Family {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Subcategoría
export interface Subcategory {
  id: string;
  familyId: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Imagen de producto
export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isPrimary: boolean;
  order: number;
  createdAt: string;
}

// Producto
export interface Product {
  id: string;
  subfamilyId: string;
  categoryId: string;
  subcategoryId: string;
  name: string;
  slug: string;
  code?: string;
  shortDescription?: string;
  description?: string;
  normalPrice: number;
  webPrice: number;
  offerPrice?: number;
  discountPercentage?: number;
  cost: number;
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  productionTime?: string;
  displayOrder: number;
  labels?: string;
  isActive: boolean;
  stock: number;
  deletedAt?: string;
  images?: ProductImage[];
  category?: Category;
  subcategory?: Subcategory;
  brand?: string;
  createdAt: string;
  updatedAt: string;
}

// Usuario
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Dirección
export interface Address {
  id: string;
  userId: string;
  name: string;
  province: string;
  city: string;
  neighborhood?: string;
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  postalCode?: string;
  references?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

// Item de orden
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
  createdAt: string;
}

// Orden
export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  subtotal: number;
  discount: number;
  total: number;
  shippingCost: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address?: string;
  notes?: string;
  paymentId?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  merchantOrderId?: string;
  dateApproved?: string | null;
  confirmedAt?: string;
  cancelledAt?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Promoción
export interface Promotion {
  id: string;
  title: string;
  description?: string;
  discount: number;
  code?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isWeb: boolean;
  createdAt: string;
  updatedAt: string;
}

// Flyer
export interface Flyer {
  id: string;
  title: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Favorito
export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  createdAt: string;
}

// Configuración
export interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Log de administrador
export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filtros de productos
export interface ProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isOffer?: boolean;
  minPrice?: number;
  maxPrice?: number;
}