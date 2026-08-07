// Tipos basados en la auditoría del APK

// Producto
export interface Product {
  id: string;
  subfamilyId: string;
  name: string;
  code?: string;
  description?: string;
  price: number;
  webPrice: number;
  images: string[];
  isOffer: boolean;
  status: string;
  isActive: boolean;
  stock: number;
  cost?: number;
  order: number;
  subfamily?: Subfamily;
}

// Categoría
export interface Category {
  id: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
}

// Familia
export interface Family {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
}

// Subfamilia
export interface Subfamily {
  id: string;
  familyId: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
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
}

// Pedido
export interface Order {
  id: string;
  status: string;
  deliveryMethod: string;
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
  paymentStatus?: string;
  dateApproved?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Item de pedido
export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  productName: string;
  productCode?: string;
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
}

// Favorito
export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
}

// Usuario
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Carrito
export interface CartItem {
  product: Product;
  quantity: number;
}

// Configuración
export interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string;
}

// Respuestas de API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Estados de pedido
export type OrderStatus = 
  | 'pending'
  | 'payment_pending'
  | 'paid'
  | 'in_production'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// Métodos de entrega
export type DeliveryMethod = 'pickup' | 'local_delivery' | 'interior_shipping';