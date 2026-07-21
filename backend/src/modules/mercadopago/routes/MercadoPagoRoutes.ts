import { Router } from 'express';
import { MercadoPagoController } from '../controllers/MercadoPagoController';
import { auth } from '../../../middlewares/auth';

const router = Router();

// POST /api/payments/create-preference - Crear preferencia de pago (requires auth)
router.post('/create-preference', auth, MercadoPagoController.createPreference);

// POST /api/payments/webhook - Webhook de Mercado Pago (no auth required)
router.post('/webhook', MercadoPagoController.webhook);

// GET /api/payments/status/:paymentId - Consultar estado de pago (requires auth)
router.get('/status/:paymentId', auth, MercadoPagoController.getPaymentStatus);

// POST /api/payments/refund - Procesar devolución (requires auth)
router.post('/refund', auth, MercadoPagoController.refund);

export default router;
