import { z } from 'zod';

export const createPreferenceSchema = z.object({
  orderId: z.string().uuid('ID de pedido inválido'),
});

export const refundSchema = z.object({
  paymentId: z.string().min(1, 'ID de pago requerido'),
  amount: z.number().positive().optional(),
});

export type CreatePreferenceInput = z.infer<typeof createPreferenceSchema>;
export type RefundInput = z.infer<typeof refundSchema>;