// Base de datos configurada con Prisma
// Ejecuta migraciones automáticamente al iniciar

import { execSync } from 'child_process';
import { logger } from '../utils/logger';

export const connectDatabase = async () => {
  try {
    logger.info('Ejecutando migraciones de Prisma...');
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: { ...process.env },
    });
    logger.info('Migraciones ejecutadas correctamente');
  } catch (error) {
    logger.error('Error al ejecutar migraciones:', error);
    // No detenemos el servidor si las migraciones fallan
  }
};

export default null;
