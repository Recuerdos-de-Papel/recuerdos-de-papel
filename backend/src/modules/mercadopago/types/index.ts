export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'prepaid_card' | 'account_money' | 'ticket' | 'atm' | 'cash' | 'digital_wallet';

export interface MercadoPagoPreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
}

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export interface CreatePreferenceDto {
  orderId: string;
}

export interface PaymentResponse {
  id: string;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  date_approved: string | null;
  transaction_amount: number;
}

export interface RefundResponse {
  id: string;
  payment_id: string;
  amount: number;
  status: string;
}

export class MercadoPagoError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'MercadoPagoError';
  }
}

export class InvalidWebhookSignatureError extends MercadoPagoError {
  constructor() {
    super('Firma de webhook inválida', 'INVALID_WEBHOOK_SIGNATURE');
  }
}

export class PaymentNotFoundError extends MercadoPagoError {
  constructor(id: string) {
    super(`Pago ${id} no encontrado`, 'PAYMENT_NOT_FOUND');
  }
}

export class OrderAlreadyPaidError extends MercadoPagoError {
  constructor(orderId: string) {
    super(`El pedido ${orderId} ya está pagado`, 'ORDER_ALREADY_PAID');
  }
}

export class DuplicatePaymentError extends MercadoPagoError {
  constructor(paymentId: string) {
    super(`Pago ${paymentId} ya procesado`, 'DUPLICATE_PAYMENT');
  }
}