// Base de datos configurada con Prisma
// Las migraciones se ejecutan exclusivamente mediante: npx prisma migrate deploy

import { logger } from '../utils/logger';
import { prisma } from './prisma';

export const connectDatabase = async () => {
  try {
    logger.info('Verificando conexión a base de datos...');
    
    await prisma.$connect();
    logger.info('Conexión a base de datos establecida correctamente');
  } catch (error: any) {
    logger.error('Error al conectar a base de datos:', error?.message || error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    logger.info('Conexión a base de datos cerrada');
  } catch (error: any) {
    logger.error('Error al cerrar conexión a base de datos:', error?.message || error);
  }
};

export default null;
