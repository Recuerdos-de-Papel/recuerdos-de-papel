import {
  Product,
  Category,
  Family,
  Subfamily,
  Promotion,
  Flyer,
  AdminOrder,
  Setting,
  AdminLog,
  SalesStats,
  TopProduct,
  TopCategory,
} from '../interfaces';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateFamilyDto,
  UpdateFamilyDto,
  CreateSubfamilyDto,
  UpdateSubfamilyDto,
  CreatePromotionDto,
  UpdatePromotionDto,
  CreateFlyerDto,
  UpdateFlyerDto,
  UpdateOrderStatusDto,
  CreateSettingDto,
  UpdateSettingDto,
} from '../dto';

import { prisma } from '../../../config/prisma';

// Export prisma for reuse across modules
export { prisma };

// Helper to map product from Prisma
const mapProduct = (p: any): Product => ({
  id: p.id,
  subfamilyId: p.subfamilyId,
  name: p.name,
  code: p.code,
  description: p.shortDescription || p.description,
  price: p.normalPrice,
  webPrice: p.webPrice,
  images: p.images ? JSON.parse(p.images) : [],
  isOffer: p.isOffer,
  status: p.status,
  features: p.features ? JSON.parse(p.features) : undefined,
  productionTime: p.productionTime,
  isActive: p.isActive,
  stock: p.stock,
  cost: p.cost,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
  subfamily: p.subfamily ? {
    id: p.subfamily.id,
    name: p.subfamily.name,
    family: p.subfamily.family ? {
      id: p.subfamily.family.id,
      name: p.subfamily.family.name,
      category: p.subfamily.family.category ? {
        id: p.subfamily.family.category.id,
        name: p.subfamily.family.category.name,
      } : undefined,
    } : undefined,
  } : undefined,
});

// Product services
export interface GetProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  status?: string;
  subfamilyId?: string;
}

export const getProducts = async (query?: GetProductsQuery): Promise<{ products: Product[]; total: number }> => {
  const page = Math.max(1, query?.page || 1);
  const limit = Math.min(100, Math.max(1, query?.limit || 20));
  const skip = (page - 1) * limit;

  const where: any = {
    deletedAt: null,
  };

  if (query?.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { code: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query?.isActive !== undefined) {
    where.isActive = query.isActive;
  }

  if (query?.status) {
    where.status = query.status;
  }

  if (query?.subfamilyId) {
    where.subfamilyId = query.subfamilyId;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        subfamily: {
          include: {
            family: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(mapProduct),
    total,
  };
};

export const getProductById = async (id: string): Promise<Product> => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error(`Producto ${id} no encontrado`);
  }

  return mapProduct(product);
};

export const createProduct = async (data: CreateProductDto): Promise<Product> => {
  const product = await prisma.product.create({
    data: {
      subfamilyId: data.subfamilyId,
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      code: data.code,
      shortDescription: data.description,
      description: data.description,
      normalPrice: data.price,
      webPrice: data.webPrice,
      offerPrice: data.isOffer ? data.price * 0.9 : undefined,
      discountPercentage: data.isOffer ? 10 : undefined,
      cost: data.cost ?? 0,
      status: data.status || 'available',
      isFeatured: false,
      isNew: false,
      productionTime: data.productionTime,
      displayOrder: 0,
      labels: undefined,
      images: JSON.stringify(data.images || []),
      features: data.features ? JSON.stringify(data.features) : undefined,
      isOffer: data.isOffer || false,
      isActive: data.isActive ?? true,
      stock: data.stock ?? 0,
    },
  });

  return mapProduct(product);
};

export const updateProduct = async (id: string, data: UpdateProductDto): Promise<Product> => {
  const updateData: any = {};
  
  if (data.subfamilyId !== undefined) updateData.subfamilyId = data.subfamilyId;
  if (data.name !== undefined) {
    updateData.name = data.name;
    updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  if (data.code !== undefined) updateData.code = data.code;
  if (data.description !== undefined) {
    updateData.shortDescription = data.description;
    updateData.description = data.description;
  }
  if (data.price !== undefined) {
    updateData.normalPrice = data.price;
    if (data.isOffer) {
      updateData.offerPrice = data.price * 0.9;
      updateData.discountPercentage = 10;
    }
  }
  if (data.webPrice !== undefined) updateData.webPrice = data.webPrice;
  if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
  if (data.features !== undefined) updateData.features = JSON.stringify(data.features);
  if (data.isOffer !== undefined) updateData.isOffer = data.isOffer;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.productionTime !== undefined) updateData.productionTime = data.productionTime;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.cost !== undefined) updateData.cost = data.cost;

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
  });

  return mapProduct(product);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const updateProductState = async (id: string, isActive: boolean): Promise<Product> => {
  const product = await prisma.product.update({
    where: { id },
    data: { isActive },
  });

  return mapProduct(product);
};

export const updateProductFeatured = async (id: string, isOffer: boolean): Promise<Product> => {
  const product = await prisma.product.update({
    where: { id },
    data: { isOffer },
  });

  return mapProduct(product);
};

// Category services
export const getCategories = async (): Promise<Category[]> => {
  return prisma.category.findMany({
    orderBy: { order: 'asc' },
  });
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error(`Categoría ${id} no encontrada`);
  }

  return category;
};

export const createCategory = async (data: CreateCategoryDto): Promise<Category> => {
  return prisma.category.create({ data });
};

export const updateCategory = async (id: string, data: UpdateCategoryDto): Promise<Category> => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string): Promise<void> => {
  await prisma.category.delete({
    where: { id },
  });
};

// Family services
export const getFamilies = async (): Promise<Family[]> => {
  return prisma.family.findMany({
    orderBy: { order: 'asc' },
  });
};

export const getFamiliesByCategory = async (categoryId: string): Promise<Family[]> => {
  return prisma.family.findMany({
    where: { categoryId },
    orderBy: { order: 'asc' },
  });
};

export const getFamilyById = async (id: string): Promise<Family> => {
  const family = await prisma.family.findUnique({
    where: { id },
  });

  if (!family) {
    throw new Error(`Familia ${id} no encontrada`);
  }

  return family;
};

export const createFamily = async (data: CreateFamilyDto): Promise<Family> => {
  return prisma.family.create({ data });
};

export const updateFamily = async (id: string, data: UpdateFamilyDto): Promise<Family> => {
  return prisma.family.update({
    where: { id },
    data,
  });
};

export const deleteFamily = async (id: string): Promise<void> => {
  await prisma.family.delete({
    where: { id },
  });
};

// Subfamily services
export const getSubfamilies = async (): Promise<Subfamily[]> => {
  return prisma.subfamily.findMany({
    orderBy: { order: 'asc' },
  });
};

export const getSubfamiliesByFamily = async (familyId: string): Promise<Subfamily[]> => {
  return prisma.subfamily.findMany({
    where: { familyId },
    orderBy: { order: 'asc' },
  });
};

export const getSubfamilyById = async (id: string): Promise<Subfamily> => {
  const subfamily = await prisma.subfamily.findUnique({
    where: { id },
  });

  if (!subfamily) {
    throw new Error(`Subfamilia ${id} no encontrada`);
  }

  return subfamily;
};

export const createSubfamily = async (data: CreateSubfamilyDto): Promise<Subfamily> => {
  return prisma.subfamily.create({ data });
};

export const updateSubfamily = async (id: string, data: UpdateSubfamilyDto): Promise<Subfamily> => {
  return prisma.subfamily.update({
    where: { id },
    data,
  });
};

export const deleteSubfamily = async (id: string): Promise<void> => {
  await prisma.subfamily.delete({
    where: { id },
  });
};

// Promotion services
export const getPromotions = async (): Promise<Promotion[]> => {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return promotions.map((p: any) => ({
    ...p,
    isWeb: p.isWeb ?? false,
  }));
};

export const getPromotionById = async (id: string): Promise<Promotion> => {
  const promotion = await prisma.promotion.findUnique({
    where: { id },
  });

  if (!promotion) {
    throw new Error(`Promoción ${id} no encontrada`);
  }

  return {
    ...promotion,
    isWeb: (promotion as any).isWeb ?? false,
  };
};

export const createPromotion = async (data: CreatePromotionDto): Promise<Promotion> => {
  const promotion = await prisma.promotion.create({
    data: {
      ...data,
      isWeb: data.isWeb ?? false,
    } as any,
  });
  return {
    ...promotion,
    isWeb: (promotion as any).isWeb ?? false,
  };
};

export const updatePromotion = async (id: string, data: UpdatePromotionDto): Promise<Promotion> => {
  const promotion = await prisma.promotion.update({
    where: { id },
    data: data as any,
  });
  return {
    ...promotion,
    isWeb: (promotion as any).isWeb ?? false,
  };
};

export const deletePromotion = async (id: string): Promise<void> => {
  await prisma.promotion.delete({
    where: { id },
  });
};

// Flyer services
export const getFlyers = async (): Promise<Flyer[]> => {
  return prisma.flyer.findMany({
    orderBy: { order: 'asc' },
  });
};

export const getFlyerById = async (id: string): Promise<Flyer> => {
  const flyer = await prisma.flyer.findUnique({
    where: { id },
  });

  if (!flyer) {
    throw new Error(`Flyer ${id} no encontrado`);
  }

  return flyer;
};

export const createFlyer = async (data: CreateFlyerDto): Promise<Flyer> => {
  return prisma.flyer.create({ data });
};

export const updateFlyer = async (id: string, data: UpdateFlyerDto): Promise<Flyer> => {
  return prisma.flyer.update({
    where: { id },
    data,
  });
};

export const deleteFlyer = async (id: string): Promise<void> => {
  await prisma.flyer.delete({
    where: { id },
  });
};

// Order services
export const getOrders = async (status?: string): Promise<AdminOrder[]> => {
  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map((o: any) => ({
    ...o,
    merchantOrderId: o.merchantOrderId,
    dateApproved: o.dateApproved,
    items: o.items.map((i: any) => ({
      ...i,
      product: {
        name: i.product.name,
        code: i.product.code,
      },
    })),
  }));
};

export const getOrderById = async (id: string): Promise<AdminOrder> => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error(`Pedido ${id} no encontrado`);
  }

  return {
    ...(order as any),
    merchantOrderId: (order as any).merchantOrderId,
    dateApproved: (order as any).dateApproved,
    items: order.items.map((i: any) => ({
      ...i,
      product: {
        name: i.product.name,
        code: i.product.code,
      },
    })),
  };
};

export const updateOrderStatus = async (id: string, data: UpdateOrderStatusDto): Promise<AdminOrder> => {
  const order = await prisma.order.update({
    where: { id },
    data: {
      status: data.status,
      ...(data.status === 'paid' && { confirmedAt: new Date() }),
      ...(data.status === 'cancelled' && { cancelledAt: new Date() }),
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return {
    ...(order as any),
    merchantOrderId: (order as any).merchantOrderId,
    dateApproved: (order as any).dateApproved,
    items: order.items.map((i: any) => ({
      ...i,
      product: {
        name: i.product.name,
        code: i.product.code,
      },
    })),
  };
};

// Setting services
export const getSettings = async (): Promise<Setting[]> => {
  return prisma.setting.findMany();
};

export const getSettingByKey = async (key: string): Promise<Setting> => {
  const setting = await prisma.setting.findUnique({
    where: { key },
  });

  if (!setting) {
    throw new Error(`Configuración ${key} no encontrada`);
  }

  return setting;
};

export const createSetting = async (data: CreateSettingDto): Promise<Setting> => {
  return prisma.setting.create({ data });
};

export const updateSetting = async (key: string, data: UpdateSettingDto): Promise<Setting> => {
  return prisma.setting.upsert({
    where: { key },
    update: data,
    create: { ...data, key },
  });
};

// Statistics services
export const getSalesStats = async (from?: Date, to?: Date): Promise<SalesStats> => {
  const where: any = {};

  if (from && to) {
    where.createdAt = {
      gte: from,
      lte: to,
    };
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: true,
    },
  });

  const totalSales = orders.reduce(
    (sum: number, order: any) => sum + order.total,
    0
  );
  const totalOrders = orders.length;
  const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

  return {
    totalSales,
    totalOrders,
    averageTicket,
  };
};

export const getTopProducts = async (from?: Date, to?: Date, limit: number = 10): Promise<TopProduct[]> => {
  const where: any = {};

  if (from && to) {
    where.order = {
      createdAt: {
        gte: from,
        lte: to,
      },
    };
  }

  const items = await prisma.orderItem.groupBy({
    by: ['productId'],
    where,
    _sum: {
      quantity: true,
      price: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: limit,
  });

  const products = await prisma.product.findMany({
    where: {
      id: { in: items.map((i: any) => i.productId) },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return items.map((item: any) => {
    const product = products.find((p: any) => p.id === item.productId);
    return {
      productId: item.productId,
      productName: product?.name || 'Producto eliminado',
      totalQuantity: item._sum.quantity || 0,
      totalRevenue: (item._sum.price || 0) * (item._sum.quantity || 0),
    };
  });
};

export const getTopCategories = async (from?: Date, to?: Date, limit: number = 10): Promise<TopCategory[]> => {
  const where: any = {};

  if (from && to) {
    where.order = {
      createdAt: {
        gte: from,
        lte: to,
      },
    };
  }

  const items = await prisma.orderItem.findMany({
    where,
    include: {
      product: {
        include: {
          subfamily: {
            include: {
              family: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const categoryMap = new Map<string, { id: string; name: string; quantity: number; revenue: number }>();

  items.forEach((item: any) => {
    const category = item.product.subfamily?.family?.category;
    if (category) {
      const existing = categoryMap.get(category.id) || {
        id: category.id,
        name: category.name,
        quantity: 0,
        revenue: 0,
      };
      existing.quantity += item.quantity;
      existing.revenue += item.price * item.quantity;
      categoryMap.set(category.id, existing);
    }
  });

  return Array.from(categoryMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
    .map(c => ({
      categoryId: c.id,
      categoryName: c.name,
      totalQuantity: c.quantity,
      totalRevenue: c.revenue,
    }));
};

// Admin Log services
export const createAdminLog = async (data: {
  adminId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<AdminLog> => {
  return prisma.adminLog.create({
    data,
    include: {
      admin: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getAdminLogs = async (limit: number = 100): Promise<AdminLog[]> => {
  return prisma.adminLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      admin: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
};