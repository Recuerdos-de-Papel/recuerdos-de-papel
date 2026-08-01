import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.coerce.number().default(10000),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default('https://recuerdos-de-papel.onrender.com'),
  BACKEND_URL: z.string().default('https://recuerdos-de-papel-backend.onrender.com'),
  MERCADO_PAGO_ACCESS_TOKEN: z.string().optional(),
  MERCADO_PAGO_PUBLIC_KEY: z.string().optional(),
  MERCADO_PAGO_WEBHOOK_SECRET: z.string().optional(),
  JWT_SECRET: z.string().default('default-jwt-secret'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
});

export const env = envSchema.parse(process.env);