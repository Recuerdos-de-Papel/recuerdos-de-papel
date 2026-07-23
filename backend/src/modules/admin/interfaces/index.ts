// Product interfaces
export interface Product {
  id: string;
  subfamilyId: string;
  name: string;
  code: string | null;
  description: string | null;
  price: number;
  webPrice: number;
  images: string[];
  isOffer: boolean;
  status: 'available' | 'in_production' | 'out_of_stock';
  features?: ProductFeatures;
  productionTime: string | null;
  isActive: boolean;
  stock: number;
  cost: number | null;
  createdAt: Date;
  updatedAt: Date;
  subfamily?: {
    id: string;
    name: string;
    family?: {
      id: string;
      name: string;
      category?: {
        id: string;
        name: string;
      };
    };
  };
}

export interface ProductFeatures {
  personalized?: boolean;
  material?: string;
  size?: string;
  printType?: string;
  care?: string;
}

// Category interfaces
export interface Category {
  id: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Family (Subcategory) interfaces
export interface Family {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Subfamily (Subcategory) interfaces
export interface Subfamily {
  id: string;
  familyId: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Promotion interfaces
export interface Promotion {
  id: string;
  title: string;
  description: string | null;
  discount: number;
  code: string | null;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isWeb: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Flyer interfaces
export interface Flyer {
  id: string;
  title: string;
  imageUrl: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order interfaces
export type AdminOrderStatus = 'pending' | 'payment_pending' | 'paid' | 'in_production' | 'ready' | 'shipped' | 'delivered' | 'cancelled' | 'rejected';

export interface AdminOrder {
  id: string;
  userId: string;
  status: string;
  deliveryMethod: string;
  subtotal: number;
  discount: number;
  total: number;
  shippingCost: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string | null;
  notes: string | null;
  paymentId: string | null;
  paymentStatus: string | null;
  merchantOrderId: string | null;
  dateApproved: Date | null;
  confirmedAt: Date | null;
  cancelledAt: Date | null;
  items: AdminOrderItem[];
  user: {
    name: string;
    email: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  product: {
    name: string;
    code: string | null;
  } | null;
}

// Setting interfaces
export interface Setting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Admin Log interfaces
export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  description: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  admin: {
    name: string;
    email: string;
  } | null;
  createdAt: Date;
}

// Statistics interfaces
export interface SalesStats {
  totalSales: number;
  totalOrders: number;
  averageTicket: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface TopCategory {
  categoryId: string;
  categoryName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface DateFilter {
  from?: Date;
  to?: Date;
}