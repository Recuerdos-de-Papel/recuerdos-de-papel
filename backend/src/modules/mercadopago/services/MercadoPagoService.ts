import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { env } from '../../../config/env';
import { prisma } from '../../../config/prisma';
import {
  getOrderById,
  updateOrder,
} from '../../../services/orderService';
import {
  CreatePreferenceDto,
  MercadoPagoPreference,
  PaymentResponse,
  RefundResponse,
  PaymentStatus,
  PaymentMethod,
} from '../types';

if (!env.MERCADO_PAGO_ACCESS_TOKEN) {
  throw new Error('MERCADO_PAGO_ACCESS_TOKEN es requerido');
}

const client = new MercadoPagoConfig({
  accessToken: env.MERCADO_PAGO_ACCESS_TOKEN,
});

const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

if (env.NODE_ENV === 'production' && !env.MERCADO_PAGO_WEBHOOK_SECRET) {
  throw new Error('MERCADO_PAGO_WEBHOOK_SECRET es requerido en producción');
}

export class MercadoPagoService {
  private static async isPaymentProcessed(paymentId: string): Promise<boolean> {
    const existing = await prisma.paymentIdempotency.findUnique({
      where: { paymentId },
    });
    return existing !== null;
  }

  private static async markPaymentAsProcessed(paymentId: string, orderId: string): Promise<void> {
    await prisma.paymentIdempotency.create({
      data: {
        paymentId,
        orderId,
      },
    });
  }

  static async createPreference(data: CreatePreferenceDto): Promise<MercadoPagoPreference> {
    const order = await getOrderById(data.orderId);

    if (order.paymentId && order.paymentStatus === 'approved') {
      throw new Error(`El pedido ${data.orderId} ya está pagado`);
    }

    const items = order.items.map(item => ({
      id: item.productId,
      title: `Producto ${item.productId}`,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: 'ARS',
    }));

    const frontendUrl = env.CORS_ORIGIN;
    const backendUrl = env.BACKEND_URL;

    const preference = await preferenceClient.create({
      body: {
        items,
        external_reference: order.id,
        notification_url: `${backendUrl}/api/payments/webhook`,
        back_urls: {
          success: `${frontendUrl}/pago-exitoso`,
          pending: `${frontendUrl}/pago-pendiente`,
          failure: `${frontendUrl}/pago-rechazado`,
        },
        auto_return: 'approved',
      },
    });

    await updateOrder(order.id, {
      paymentId: preference.id,
      status: 'payment_pending',
    });

    return {
      id: preference.id || '',
      init_point: preference.init_point || '',
      sandbox_init_point: preference.sandbox_init_point || '',
    };
  }

  static async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    const payment = await paymentClient.get({ id: paymentId });

    return {
      id: String(payment.id || ''),
      status: (payment.status as PaymentStatus) || 'pending',
      payment_method: (payment.payment_method_id as PaymentMethod) || 'account_money',
      date_approved: payment.date_approved || null,
      transaction_amount: payment.transaction_amount || 0,
    };
  }

  static async processWebhook(
    paymentId: string,
    merchantOrderId: string,
    status: PaymentStatus,
    paymentMethod: PaymentMethod,
    dateApproved: string | null
  ): Promise<void> {
    if (await MercadoPagoService.isPaymentProcessed(paymentId)) {
      return;
    }

    const orders = await MercadoPagoService.findOrderByPaymentId(paymentId);
    
    if (!orders || orders.length === 0) {
      return;
    }

    const order = orders[0];

    const updateData: {
      paymentId: string;
      paymentStatus: PaymentStatus;
      merchantOrderId?: string;
      paymentMethod?: string;
      dateApproved?: Date | null;
      status: 'payment_pending' | 'paid' | 'in_production';
    } = {
      paymentId,
      paymentStatus: status,
      status: status === 'approved' ? 'paid' : 'payment_pending',
    };

    if (merchantOrderId) {
      updateData.merchantOrderId = merchantOrderId;
    }

    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }

    if (dateApproved) {
      updateData.dateApproved = new Date(dateApproved);
    }

    if (status === 'approved') {
      await prisma.$transaction(async (tx) => {
        const orderWithItems = await tx.order.findUnique({
          where: { id: order.id },
          include: {
            items: true,
          },
        });

        if (!orderWithItems) {
          throw new Error('Pedido no encontrado');
        }

        for (const item of orderWithItems.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Producto ${item.productId} no encontrado}`);
          }

          if (product.stock < item.quantity) {
            throw new Error(`Stock insuficiente para ${product.name}`);
          }

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        await tx.order.update({
          where: { id: order.id },
          data: updateData,
        });
      });
    } else {
      await updateOrder(order.id, updateData);
    }

    await MercadoPagoService.markPaymentAsProcessed(paymentId, order.id);
  }

  static async processMerchantOrder(merchantOrderId: string): Promise<void> {
    const response = await fetch(
      `https://api.mercadopago.com/merchant_orders/${merchantOrderId}`,
      {
        headers: {
          Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return;
    }

    const merchantOrder = await response.json() as {
      external_reference?: string;
      payments?: Array<{
        id?: number;
        status?: string;
        date_approved?: string;
        payment_method_id?: string;
      }>;
    };
    const externalReference = merchantOrder.external_reference;

    if (!externalReference) {
      return;
    }

    const order = await getOrderById(externalReference);

    if (order.paymentId && await MercadoPagoService.isPaymentProcessed(order.paymentId)) {
      return;
    }

    const payments = merchantOrder.payments || [];
    if (payments.length > 0) {
      const payment = payments[0];
      const paymentId = String(payment.id || '');

      if (await MercadoPagoService.isPaymentProcessed(paymentId)) {
        return;
      }

      const updateData: {
        paymentId: string;
        paymentStatus: PaymentStatus;
        merchantOrderId: string;
        paymentMethod?: string;
        dateApproved?: Date | null;
        status: 'payment_pending' | 'paid' | 'in_production';
      } = {
        paymentId,
        paymentStatus: (payment.status as PaymentStatus) || 'pending',
        merchantOrderId,
        status: payment.status === 'approved' ? 'paid' : 'payment_pending',
      };

      if (payment.date_approved) {
        updateData.dateApproved = new Date(payment.date_approved);
      }

      if (payment.payment_method_id) {
        updateData.paymentMethod = payment.payment_method_id;
      }

      if (payment.status === 'approved') {
        await prisma.$transaction(async (tx) => {
          const orderWithItems = await tx.order.findUnique({
            where: { id: order.id },
            include: {
              items: true,
            },
          });

          if (!orderWithItems) {
            throw new Error('Pedido no encontrado');
          }

          for (const item of orderWithItems.items) {
            const product = await tx.product.findUnique({
              where: { id: item.productId },
            });

            if (!product) {
              throw new Error(`Producto ${item.productId} no encontrado}`);
            }

            if (product.stock < item.quantity) {
              throw new Error(`Stock insuficiente para ${product.name}`);
            }

            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
          }

          await tx.order.update({
            where: { id: order.id },
            data: updateData,
          });
        });
      } else {
        await updateOrder(order.id, updateData);
      }

      await MercadoPagoService.markPaymentAsProcessed(paymentId, order.id);
    }
  }

  static async refundPayment(paymentId: string, amount?: number): Promise<RefundResponse> {
    const payment = await paymentClient.get({ id: paymentId });

    if (!payment.id) {
      throw new Error(`Pago ${paymentId} no encontrado`);
    }

    const refundResponse = await fetch(
      `https://api.mercadopago.com/payments/${paymentId}/refunds`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: amount ? JSON.stringify({ amount }) : undefined,
      }
    );

    if (!refundResponse.ok) {
      throw new Error('Error al procesar la devolución');
    }

    const refund = await refundResponse.json() as {
      id?: string;
      payment_id?: string;
      amount?: number;
      status?: string;
    };

    return {
      id: refund.id || '',
      payment_id: refund.payment_id || '',
      amount: refund.amount || 0,
      status: refund.status || 'refunded',
    };
  }

  static async validateWebhookSignature(signature: string, data: string): Promise<boolean> {
    if (!env.MERCADO_PAGO_WEBHOOK_SECRET) {
      return false;
    }

    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', env.MERCADO_PAGO_WEBHOOK_SECRET)
      .update(data)
      .digest('hex');

    return signature === expectedSignature;
  }

  public static async findOrderByPaymentId(paymentId: string): Promise<any[]> {
    const { prisma } = await import('../../../modules/admin/services');

    return prisma.order.findMany({
      where: {
        OR: [
          { paymentId: paymentId },
          { merchantOrderId: paymentId },
        ],
      },
    });
  }
}