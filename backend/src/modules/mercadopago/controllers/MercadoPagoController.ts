import { Request, Response, NextFunction } from 'express';
import { MercadoPagoService } from '../services/MercadoPagoService';
import {
  getOrderById,
  updateOrder,
} from '../../../services/orderService';
import { PaymentStatus, OrderStatus } from '../../../types/order';
import { env } from '../../../config/env';

export class MercadoPagoController {
  static async createPreference(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      if (!orderId) {
        return res.status(400).json({ error: 'orderId es requerido' });
      }

      // Verify order belongs to user
      await getOrderById(orderId, userId);

      const preference = await MercadoPagoService.createPreference({ orderId });

      res.json({
        preferenceId: preference.id,
        initPoint: preference.init_point,
        sandboxInitPoint: preference.sandbox_init_point,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('ya está pagado')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  static async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['x-mercadopago-signature'] as string;
      const body = JSON.stringify(req.body);

      // Validate signature (optional if webhook secret not configured)
      const isValid = await MercadoPagoService.validateWebhookSignature(signature, body);
      if (!isValid) {
        return res.status(401).json({ error: 'Firma inválida' });
      }

      const { type, data, topic } = req.body;

      // Handle different webhook types
      if (type === 'payment.created' || type === 'payment.updated') {
        const paymentId = data?.id;
        if (paymentId) {
          // Get payment details from Mercado Pago
          const paymentResponse = await fetch(
            `https://api.mercadopago.com/payments/${paymentId}`,
            {
              headers: {
                Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
              },
            }
          );

          if (paymentResponse.ok) {
            const paymentData = await paymentResponse.json() as {
              status?: string;
              payment_method_id?: string;
              date_approved?: string;
              merchant_account_id?: string;
            };

            // Find order by external_reference
            const orders = await MercadoPagoService['findOrderByPaymentId'](String(paymentId));
            
            if (orders && orders.length > 0) {
              const order = orders[0];
              const updateData: {
                paymentId: string;
                paymentStatus: PaymentStatus;
                paymentMethod?: string;
                status: OrderStatus;
                dateApproved?: Date | null;
              } = {
                paymentId: String(paymentId),
                paymentStatus: (paymentData.status as PaymentStatus) || 'pending',
                status: paymentData.status === 'approved' ? 'paid' : 'payment_pending',
              };

              if (paymentData.payment_method_id) {
                updateData.paymentMethod = paymentData.payment_method_id;
              }

              if (paymentData.date_approved) {
                updateData.dateApproved = new Date(paymentData.date_approved);
              }

              await updateOrder(order.id, updateData);
            }
          }
        }
      } else if (type === 'merchant_order' || topic === 'merchant_order') {
        const merchantOrderId = data?.id;
        if (merchantOrderId) {
          await MercadoPagoService.processMerchantOrder(String(merchantOrderId));
        }
      }

      res.status(200).json({ received: true });
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.params;

      if (!paymentId) {
        return res.status(400).json({ error: 'paymentId es requerido' });
      }

      const payment = await MercadoPagoService.getPaymentStatus(paymentId);

      // Update order if needed
      const orders = await MercadoPagoService['findOrderByPaymentId'](paymentId);
      if (orders && orders.length > 0) {
        const order = orders[0];
        const updateData: {
          paymentStatus: PaymentStatus;
          paymentMethod?: string;
          status: OrderStatus;
          dateApproved?: Date | null;
        } = {
          paymentStatus: payment.status,
          status: payment.status === 'approved' ? 'paid' : 'payment_pending',
        };

        if (payment.payment_method) {
          updateData.paymentMethod = payment.payment_method;
        }

        if (payment.date_approved) {
          updateData.dateApproved = new Date(payment.date_approved);
        }

        await updateOrder(order.id, updateData);
      }

      res.json(payment);
    } catch (error) {
      next(error);
    }
  }

  static async refund(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId, amount } = req.body;

      if (!paymentId) {
        return res.status(400).json({ error: 'paymentId es requerido' });
      }

      const refund = await MercadoPagoService.refundPayment(paymentId, amount);

      res.json(refund);
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }
}