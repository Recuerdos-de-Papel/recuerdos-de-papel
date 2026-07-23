import { prisma } from '../modules/admin/services';

export const getPromotions = async () => {
  return prisma.promotion.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPromotionById = async (id: string) => {
  return prisma.promotion.findUnique({
    where: { id },
  });
};

export const createPromotion = async (data: {
  title: string;
  description?: string;
  discount: number;
  code?: string;
  startDate: Date;
  endDate: Date;
}) => {
  return prisma.promotion.create({ data });
};

export const updatePromotion = async (id: string, data: Partial<{
  title: string;
  description: string;
  discount: number;
  code: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}>) => {
  return prisma.promotion.update({
    where: { id },
    data,
  });
};

export const deletePromotion = async (id: string) => {
  return prisma.promotion.update({
    where: { id },
    data: { isActive: false },
  });
};