import { Request, Response, NextFunction } from 'express';
import {
  getSettings,
  getSettingByKey,
  createSetting,
  updateSetting,
} from '../services';
import {
  createSettingSchema,
  updateSettingSchema,
} from '../validators';
import { createAdminLog } from '../services';

// GET /api/admin/settings - Obtener todas las configuraciones
export const getSettingsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/settings/:key - Obtener una configuración por clave
export const getSettingByKeyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const setting = await getSettingByKey(key);
    res.json(setting);
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrada')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

// POST /api/admin/settings - Crear una nueva configuración
export const createSettingController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createSettingSchema.parse(req.body);
    const setting = await createSetting(validatedData);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'create_setting',
      entityType: 'setting',
      entityId: setting.id,
      description: `Configuración creada: ${setting.key}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(201).json(setting);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// PUT /api/admin/settings/:key - Actualizar una configuración
export const updateSettingController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const validatedData = updateSettingSchema.parse(req.body);
    const setting = await updateSetting(key, validatedData);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'update_setting',
      entityType: 'setting',
      entityId: setting.id,
      description: `Configuración actualizada: ${setting.key}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(setting);
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrada')) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};