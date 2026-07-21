// Product DTOs
export interface CreateProductDto {
  subfamilyId: string;
  name: string;
  code?: string;
  description?: string;
  price: number;
  webPrice: number;
  images?: string[];
  isOffer?: boolean;
  status?: 'available' | 'in_production' | 'out_of_stock';
  features?: {
    personalized?: boolean;
    material?: string;
    size?: string;
    printType?: string;
    care?: string;
  };
  productionTime?: string;
  isActive?: boolean;
  stock?: number;
  cost?: number;
}

export interface UpdateProductDto {
  subfamilyId?: string;
  name?: string;
  code?: string;
  description?: string;
  price?: number;
  webPrice?: number;
  images?: string[];
  isOffer?: boolean;
  status?: 'available' | 'in_production' | 'out_of_stock';
  features?: {
    personalized?: boolean;
    material?: string;
    size?: string;
    printType?: string;
    care?: string;
  };
  productionTime?: string;
  isActive?: boolean;
  stock?: number;
  cost?: number;
}

export interface UpdateProductStateDto {
  isActive: boolean;
}

export interface UpdateProductFeaturedDto {
  isOffer: boolean;
}

export interface UpdateProductOrderDto {
  order: number;
}

// Category DTOs
export interface CreateCategoryDto {
  name: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

// Family DTOs
export interface CreateFamilyDto {
  categoryId: string;
  name: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateFamilyDto {
  categoryId?: string;
  name?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

// Subfamily DTOs
export interface CreateSubfamilyDto {
  familyId: string;
  name: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateSubfamilyDto {
  familyId?: string;
  name?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

// Promotion DTOs
export interface CreatePromotionDto {
  title: string;
  description?: string;
  discount: number;
  code?: string;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
  isWeb?: boolean;
}

export interface UpdatePromotionDto {
  title?: string;
  description?: string;
  discount?: number;
  code?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  isWeb?: boolean;
}

// Flyer DTOs
export interface CreateFlyerDto {
  title: string;
  imageUrl: string;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
  order?: number;
}

export interface UpdateFlyerDto {
  title?: string;
  imageUrl?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  order?: number;
}

// Order DTOs
export interface UpdateOrderStatusDto {
  status: 'pending' | 'payment_pending' | 'paid' | 'in_production' | 'ready' | 'shipped' | 'delivered' | 'cancelled' | 'rejected';
}

// Setting DTOs
export interface CreateSettingDto {
  key: string;
  value: string;
  description?: string;
}

export interface UpdateSettingDto {
  value: string;
  description?: string;
}

// Auth DTOs
export interface AdminLoginDto {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
  };
}

// Image upload DTOs
export interface UploadImageResponse {
  url: string;
  path: string;
}

// Statistics DTOs
export interface StatisticsFilterDto {
  from?: Date;
  to?: Date;
  period?: 'day' | 'week' | 'month' | 'year' | 'custom';
}