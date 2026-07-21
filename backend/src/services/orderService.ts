import { PrismaClient } from '@prisma/client';
import {
  Order,
  CreateOrderDto,
  CreateOrderItemDto,
  UpdateOrderDto,
  OrderStatus,
  OrderNotFoundError,
  OrderCannotCancelError,
} from '../types/order';

const prisma = new PrismaClient();

const mapPrismaOrderToOrder = (prismaOrder: any): Order => ({
  id: prismaOrder.id,
  userId: prismaOrder.userId,
  status: prismaOrder.status as OrderStatus,
  deliveryMethod: prismaOrder.deliveryMethod as any,
  subtotal: prismaOrder.subtotal,
  discount: prismaOrder.discount,
  total: prismaOrder.total,
  shippingCost: prismaOrder.shippingCost,
  customerName: prismaOrder.customerName,
  customerPhone: prismaOrder.customerPhone,
  customerEmail: prismaOrder.customerEmail,
  address: prismaOrder.address || undefined,
  notes: prismaOrder.notes || undefined,
  paymentId: prismaOrder.paymentId || undefined,
  paymentStatus: prismaOrder.paymentStatus as any || undefined,
  paymentMethod: prismaOrder.paymentMethod || undefined,
  merchantOrderId: prismaOrder.merchantOrderId || undefined,
  confirmedAt: prismaOrder.confirmedAt || undefined,
  cancelledAt: prismaOrder.cancelledAt || undefined,
  items: prismaOrder.items.map((item: any) => ({
    id: item.id,
    orderId: item.orderId,
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
    createdAt: item.createdAt,
  })),
  createdAt: prismaOrder.createdAt,
  updatedAt: prismaOrder.updatedAt,
});

export const getOrders = async (userId: string): Promise<Order[]> => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map(mapPrismaOrderToOrder);
};

export const getOrderById = async (id: string, userId?: string): Promise<Order> => {
  const order = await prisma.order.findFirst({
    where: userId ? { id, userId } : { id },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new OrderNotFoundError(id);
  }

  return mapPrismaOrderToOrder(order);
};

export const createOrder = async (
  orderData: CreateOrderDto,
  items: CreateOrderItemDto[]
): Promise<Order> => {
  const order = await prisma.order.create({
    data: {
      ...orderData,
      items: {
        create: items,
      },
    },
    include: {
      items: true,
    },
  });

  return mapPrismaOrderToOrder(order);
};

export const updateOrder = async (id: string, updates: UpdateOrderDto): Promise<Order> => {
  const order = await prisma.order.update({
    where: { id },
    data: updates,
    include: {
      items: true,
    },
  });

  return mapPrismaOrderToOrder(order);
};

export const cancelOrder = async (id: string): Promise<Order> => {
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    throw new OrderNotFoundError(id);
  }

  // Solo se puede cancelar si está en estado pending o payment_pending
  if (order.status !== 'pending' && order.status !== 'payment_pending') {
    throw new OrderCannotCancelError(order.status as OrderStatus);
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      status: 'cancelled',
      cancelledAt: new Date(),
    },
    include: {
      items: true,
    },
  });

  return mapPrismaOrderToOrder(updatedOrder);
};

export const deleteOrder = async (id: string): Promise<void> => {
  await prisma.order.delete({
    where: { id },
  });
};