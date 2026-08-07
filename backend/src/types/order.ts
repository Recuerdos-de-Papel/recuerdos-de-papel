export type OrderStatus = 'pending' | 'payment_pending' | 'paid' | 'in_production' | 'ready' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type DeliveryMethod = 'pickup' | 'local_delivery' | 'interior_shipping';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  productName: string;
  productCode?: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  subtotal: number;
  discount: number;
  total: number;
  shippingCost: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address?: string;
  notes?: string;
  paymentId?: string;
  paymentStatus?: PaymentStatus;
  merchantOrderId?: string;
  paymentMethod?: string;
  dateApproved?: Date | null;
  confirmedAt?: Date;
  cancelledAt?: Date;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDto {
  userId: string;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  subtotal: number;
  discount: number;
  total: number;
  shippingCost: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address?: string;
  notes?: string;
}

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
  price: number;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentId?: string;
  paymentStatus?: PaymentStatus;
  merchantOrderId?: string;
  paymentMethod?: string;
  dateApproved?: Date | null;
  notes?: string;
}

export class OrderError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'OrderError';
  }
}

export class OrderNotFoundError extends OrderError {
  constructor(id: string) {
    super(`Pedido ${id} no encontrado`, 'ORDER_NOT_FOUND');
  }
}

export class OrderCannotCancelError extends OrderError {
  constructor(status: OrderStatus) {
    super(`El pedido con estado ${status} no puede cancelarse`, 'ORDER_CANNOT_CANCEL');
  }
}

export class CartEmptyError extends OrderError {
  constructor() {
    super('El carrito está vacío', 'CART_EMPTY');
  }
}

export class UserNotAuthenticatedError extends OrderError {
  constructor() {
    super('Usuario no autenticado', 'USER_NOT_AUTHENTICATED');
  }
}