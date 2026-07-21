import { Order, OrderItem } from './order';

export { Order, OrderItem };

// Extend Express Request type
declare module 'express' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}
