import { prisma } from '../modules/admin/services';

export const getAddresses = async (userId: string) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isPrimary: 'desc' },
  });
};

export const getAddressById = async (id: string, userId?: string) => {
  const where: any = { id };
  if (userId) {
    where.userId = userId;
  }
  return prisma.address.findFirst({
    where,
  });
};

export const createAddress = async (data: {
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
  isPrimary?: boolean;
}) => {
  // Si la nueva dirección es primaria, desmarcar las demás
  if (data.isPrimary) {
    await prisma.address.updateMany({
      where: { userId: data.userId },
      data: { isPrimary: false },
    });
  }

  return prisma.address.create({
    data,
  });
};

export const updateAddress = async (id: string, data: Partial<{
  name: string;
  province: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  floor: string;
  apartment: string;
  postalCode: string;
  references: string;
  isPrimary: boolean;
}>) => {
  return prisma.address.update({
    where: { id },
    data,
  });
};

export const deleteAddress = async (id: string) => {
  return prisma.address.delete({
    where: { id },
  });
};

export const setDefaultAddress = async (userId: string, id: string) => {
  // Desmarcar todas las direcciones primarias del usuario
  await prisma.address.updateMany({
    where: { userId },
    data: { isPrimary: false },
  });

  // Marcar la dirección especificada como primaria
  return prisma.address.update({
    where: { id },
    data: { isPrimary: true },
  });
};
