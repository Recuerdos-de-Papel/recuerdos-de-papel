import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFavorites = async (userId: string) => {
  return prisma.favorite.findMany({
    where: { userId },
    include: {
      product: true,
    },
  });
};

export const addToFavorites = async (userId: string, productId: string) => {
  return prisma.favorite.create({
    data: { userId, productId },
  });
};

export const removeFromFavorites = async (id: string) => {
  return prisma.favorite.delete({
    where: { id },
  });
};

export const isFavorite = async (userId: string, productId: string) => {
  const favorite = await prisma.favorite.findFirst({
    where: { userId, productId },
  });
  return !!favorite;
};