import { Router } from 'express';
import {
  getOrdersController,
  getOrderByIdController,
  createOrderController,
  updateOrderController,
  cancelOrderController,
} from '../controllers/orderController';
import { auth } from '../middlewares/auth';

const router = Router();

// Protected routes - require authentication
router.use(auth);

// GET /api/orders - Obtener pedidos del usuario
router.get('/', getOrdersController);

// GET /api/orders/:id - Obtener un pedido por ID
router.get('/:id', getOrderByIdController);

// POST /api/orders - Crear un nuevo pedido
router.post('/', createOrderController);

// PATCH /api/orders/:id - Actualizar un pedido
router.patch('/:id', updateOrderController);

// DELETE /api/orders/:id - Cancelar un pedido
router.delete('/:id', cancelOrderController);

export default router;
