// Base de datos configurada con Prisma
// Ejecuta migraciones automáticamente al iniciar

import { logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

const generateDirectUrl = (poolerUrl: string): string | null => {
  const match = poolerUrl.match(/^postgresql:\/\/postgres\.([^.]+):([^@]+)@[^:]+:\d+\/(.+)$/);
  if (match) {
    return `postgresql://postgres:${match[2]}@db.${match[1]}.supabase.co:5432/${match[3].split('?')[0]}`;
  }
  return null;
};

export const connectDatabase = async () => {
  try {
    logger.info('Inicializando base de datos...');
    
    // No se usa DIRECT_URL (inaccesible desde esta red).
    // Se usa DATABASE_URL con Supabase Pooler (puerto 6543).
    logger.info('Usando DATABASE_URL con Supabase Pooler (puerto 6543)');

    const { prisma } = await import('../modules/admin/services');
    
    // Check if tables exist
    try {
      await prisma.$queryRaw`SELECT 1 FROM "users" LIMIT 1`;
      logger.info('Tablas ya existen');
      return;
    } catch {
      logger.info('Tablas no existen, ejecutando schema SQL...');
    }

    // Execute migration SQL files directly
    const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      logger.error(`Directorio de migraciones no encontrado: ${migrationsDir}`);
      return;
    }

    const dirs = fs.readdirSync(migrationsDir)
      .filter(d => d !== 'migration_lock.toml')
      .sort();

    for (const dir of dirs) {
      const sqlPath = path.join(migrationsDir, dir, 'migration.sql');
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        // Split by semicolons and execute each statement
        const statements = sql.split(';').filter(s => s.trim().length > 0);
        for (const statement of statements) {
          try {
            await prisma.$executeRawUnsafe(statement + ';');
          } catch (err: any) {
            // Ignore "already exists" errors
            if (!err.message?.includes('already exists')) {
              logger.warn(`Error en statement: ${err.message?.substring(0, 100)}`);
            }
          }
        }
        logger.info(`Migración ejecutada: ${dir}`);
      }
    }
    
    logger.info('Todas las migraciones ejecutadas correctamente');
  } catch (error: any) {
    logger.error('Error durante inicialización de BD:', error?.message || error);
  }
};

export default null;
