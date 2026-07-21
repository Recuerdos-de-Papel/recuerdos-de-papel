import { Request, Response, NextFunction } from 'express';
import {
  getFlyers,
  getFlyerById,
  createFlyer,
  updateFlyer,
  deleteFlyer,
} from '../services';
import {
  createFlyerSchema,
  updateFlyerSchema,
} from '../validators';
import { createAdminLog } from '../services';

// GET /api/admin/flyers - Obtener todos los flyers
export const getFlyersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flyers = await getFlyers();
    res.json(flyers);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/flyers/:id - Obtener un flyer por ID
export const getFlyerByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const flyer = await getFlyerById(id);
    res.json(flyer);
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

// POST /api/admin/flyers - Crear un nuevo flyer
export const createFlyerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createFlyerSchema.parse(req.body);
    const flyer = await createFlyer(validatedData);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'create_flyer',
      entityType: 'flyer',
      entityId: flyer.id,
      description: `Flyer creado: ${flyer.title}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(201).json(flyer);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// PUT /api/admin/flyers/:id - Actualizar un flyer
export const updateFlyerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateFlyerSchema.parse(req.body);
    const flyer = await updateFlyer(id, validatedData);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'update_flyer',
      entityType: 'flyer',
      entityId: flyer.id,
      description: `Flyer actualizado: ${flyer.title}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(flyer);
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// DELETE /api/admin/flyers/:id - Eliminar un flyer
export const deleteFlyerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteFlyer(id);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'delete_flyer',
      entityType: 'flyer',
      entityId: id,
      description: `Flyer eliminado: ${id}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};