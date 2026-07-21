import { Request, Response, NextFunction } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  cancelOrder,
} from '../services/orderService';
import { OrderNotFoundError, OrderCannotCancelError } from '../types/order';

export const getOrdersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const orders = await getOrders(userId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const order = await getOrderById(id, userId);
    res.json(order);
  } catch (error) {
    if (error instanceof OrderNotFoundError) {
      return res.status(404).json({ error: error.message, code: error.code });
    }
    next(error);
  }
};

export const createOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { items, ...orderData } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    const order = await createOrder(
      { ...orderData, userId },
      items
    );

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const order = await updateOrder(id, updates);
    res.json(order);
  } catch (error) {
    if (error instanceof OrderNotFoundError) {
      return res.status(404).json({ error: error.message, code: error.code });
    }
    next(error);
  }
};

export const cancelOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const order = await cancelOrder(id);
    res.json(order);
  } catch (error) {
    if (error instanceof OrderNotFoundError) {
      return res.status(404).json({ error: error.message, code: error.code });
    }
    if (error instanceof OrderCannotCancelError) {
      return res.status(400).json({ error: error.message, code: error.code });
    }
    next(error);
  }
};
