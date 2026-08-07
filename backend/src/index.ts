import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { connectDatabase } from './config/database';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';
import orderRoutes from './routes/orderRoutes';
import authRoutes from './routes/authRoutes';
import publicRoutes from './routes/publicRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import addressRoutes from './routes/addressRoutes';
import MercadoPagoRoutes from './modules/mercadopago/routes/MercadoPagoRoutes';
import { adminRoutes } from './modules/admin';

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Demasiadas solicitudes, intente más tarde' },
});
app.use(limiter);

const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: { error: 'Demasiadas solicitudes, intente más tarde' },
});

app.use(helmet());
const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  }
}));
app.use(morgan('dev'));

app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  },
}));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Papelería API - Admin',
    version: '1.0.0',
    description: 'API REST para administración de la papelería',
  },
  servers: [
    {
      url: `${env.BACKEND_URL}`,
      description: 'Servidor de producción',
    },
  ],
  paths: {
    '/api/admin/auth/login': {
      post: {
        summary: 'Login de administrador',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'admin@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login exitoso' },
          '401': { description: 'Credenciales inválidas' },
        },
      },
    },
    '/api/admin/products': {
      get: {
        summary: 'Obtener todos los productos',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Lista de productos' } },
      },
      post: {
        summary: 'Crear un producto',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Producto creado' } },
      },
    },
    '/api/admin/products/{id}': {
      get: {
        summary: 'Obtener un producto por ID',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Producto encontrado' } },
      },
      put: {
        summary: 'Actualizar un producto',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Producto actualizado' } },
      },
      delete: {
        summary: 'Eliminar un producto',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        responses: { '204': { description: 'Producto eliminado' } },
      },
    },
    '/api/admin/categories': {
      get: {
        summary: 'Obtener todas las categorías',
        tags: ['Categories'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Lista de categorías' } },
      },
      post: {
        summary: 'Crear una categoría',
        tags: ['Categories'],
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Categoría creada' } },
      },
    },
    '/api/admin/subfamilies': {
      get: {
        summary: 'Obtener todas las subfamilias',
        tags: ['Subfamilies'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Lista de subfamilias' } },
      },
      post: {
        summary: 'Crear una subfamilia',
        tags: ['Subfamilies'],
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Subfamilia creada' } },
      },
    },
    '/api/admin/promotions': {
      get: {
        summary: 'Obtener todas las promociones',
        tags: ['Promotions'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Lista de promociones' } },
      },
      post: {
        summary: 'Crear una promoción',
        tags: ['Promotions'],
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Promoción creada' } },
      },
    },
    '/api/admin/flyers': {
      get: {
        summary: 'Obtener todos los flyers',
        tags: ['Flyers'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Lista de flyers' } },
      },
      post: {
        summary: 'Crear un flyer',
        tags: ['Flyers'],
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Flyer creado' } },
      },
    },
    '/api/admin/orders': {
      get: {
        summary: 'Obtener todos los pedidos',
        tags: ['Orders'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Lista de pedidos' } },
      },
    },
    '/api/admin/orders/{id}/status': {
      patch: {
        summary: 'Cambiar estado de un pedido',
        tags: ['Orders'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Estado actualizado' } },
      },
    },
    '/api/admin/settings': {
      get: {
        summary: 'Obtener todas las configuraciones',
        tags: ['Settings'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Lista de configuraciones' } },
      },
    },
    '/api/admin/statistics/sales': {
      get: {
        summary: 'Estadísticas de ventas',
        tags: ['Statistics'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Estadísticas de ventas' } },
      },
    },
    '/api/admin/statistics/top-products': {
      get: {
        summary: 'Productos más vendidos',
        tags: ['Statistics'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Productos más vendidos' } },
      },
    },
    '/api/admin/statistics/top-categories': {
      get: {
        summary: 'Categorías más vendidas',
        tags: ['Statistics'],
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Categorías más vendidas' } },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', MercadoPagoRoutes);
app.use('/api/admin', adminLimiter, adminRoutes);
app.use('/api', publicRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/addresses', addressRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      logger.info(`Servidor corriendo en puerto ${env.PORT}`);
      logger.info(`Ambiente: ${env.NODE_ENV}`);
      logger.info(`Health check: ${env.BACKEND_URL}/health`);
      logger.info(`API Docs: ${env.BACKEND_URL}/api/docs`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();