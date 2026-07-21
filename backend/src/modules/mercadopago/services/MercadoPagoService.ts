import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { env } from '../../../config/env';
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

const client = new MercadoPagoConfig({
  accessToken: env.MERCADO_PAGO_ACCESS_TOKEN || '',
});

const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

const MP_WEBHOOK_SECRET = env.MERCADO_PAGO_WEBHOOK_SECRET || '';

export class MercadoPagoService {
  private static processedPayments = new Set<string>();

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

    const baseUrl = env.CORS_ORIGIN || 'http://localhost:5173';

    const preference = await preferenceClient.create({
      body: {
        items,
        external_reference: order.id,
        notification_url: `${baseUrl}/api/payments/webhook`,
        back_urls: {
          success: `${baseUrl}/pago-exitoso`,
          pending: `${baseUrl}/pago-pendiente`,
          failure: `${baseUrl}/pago-rechazado`,
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
    if (MercadoPagoService.processedPayments.has(paymentId)) {
      return;
    }

    MercadoPagoService.processedPayments.add(paymentId);

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

    await updateOrder(order.id, updateData);
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

    if (order.paymentId && MercadoPagoService.processedPayments.has(order.paymentId)) {
      return;
    }

    const payments = merchantOrder.payments || [];
    if (payments.length > 0) {
      const payment = payments[0];
      const paymentId = String(payment.id || '');

      if (MercadoPagoService.processedPayments.has(paymentId)) {
        return;
      }

      MercadoPagoService.processedPayments.add(paymentId);

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

      await updateOrder(order.id, updateData);
    }
  }

  static async refundPayment(paymentId: string, amount?: number): Promise<RefundResponse> {
    const payment = await paymentClient.get({ id: paymentId });

    if (!payment.id) {
      throw new Error(`Pago ${paymentId} no encontrado`);
    }

    // Use fetch for refund since mercadopago SDK may not have refund method
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
    if (!MP_WEBHOOK_SECRET) {
      return true;
    }

    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', MP_WEBHOOK_SECRET)
      .update(data)
      .digest('hex');

    return signature === expectedSignature;
  }

  private static async findOrderByPaymentId(paymentId: string): Promise<any[]> {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

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