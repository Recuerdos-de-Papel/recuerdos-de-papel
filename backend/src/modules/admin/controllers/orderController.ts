import { Request, Response, NextFunction } from 'express';
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../services';
import {
  updateOrderStatusSchema,
} from '../validators';
import { createAdminLog } from '../services';

// Valid state transitions
const validTransitions: Record<string, string[]> = {
  pending: ['payment_pending', 'cancelled'],
  payment_pending: ['paid', 'payment_rejected', 'cancelled'],
  paid: ['in_production', 'cancelled'],
  in_production: ['ready', 'cancelled'],
  ready: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
  rejected: [],
};

// GET /api/admin/orders - Obtener todos los pedidos con filtro por estado
export const getOrdersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const orders = await getOrders(status as string | undefined);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/orders/:id - Obtener un pedido por ID
export const getOrderByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);
    res.json(order);
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

// PATCH /api/admin/orders/:id/status - Cambiar estado de un pedido
export const updateOrderStatusController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = updateOrderStatusSchema.parse(req.body);

    // Get current order to check state transition
    const currentOrder = await getOrderById(id);
    const currentStatus = currentOrder.status;

    // Validate state transition
    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        error: `Transición de estado inválida: ${currentStatus} -> ${status}`,
        validTransitions: validTransitions[currentStatus],
      });
    }

    const order = await updateOrderStatus(id, { status });

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'change_order_status',
      entityType: 'order',
      entityId: order.id,
      description: `Pedido ${id} cambiado de ${currentStatus} a ${status}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(order);
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};