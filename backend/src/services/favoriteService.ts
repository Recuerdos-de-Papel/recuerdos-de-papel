import { prisma } from '../modules/admin/services';

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

// Elimina un favorito por userId y productId (no por id del favorito)
// Esto permite que el endpoint DELETE /api/favorites/:productId funcione
export const removeFromFavorites = async (userId: string, productId: string) => {
  return prisma.favorite.deleteMany({
    where: { userId, productId },
  });
};

export const isFavorite = async (userId: string, productId: string) => {
  const favorite = await prisma.favorite.findFirst({
    where: { userId, productId },
  });
  return !!favorite;
};
