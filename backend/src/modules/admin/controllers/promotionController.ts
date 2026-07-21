import { Request, Response, NextFunction } from 'express';
import {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from '../services';
import {
  createPromotionSchema,
  updatePromotionSchema,
} from '../validators';
import { createAdminLog } from '../services';

// GET /api/admin/promotions - Obtener todas las promociones
export const getPromotionsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const promotions = await getPromotions();
    res.json(promotions);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/promotions/:id - Obtener una promoción por ID
export const getPromotionByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const promotion = await getPromotionById(id);
    res.json(promotion);
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrada')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

// POST /api/admin/promotions - Crear una nueva promoción
export const createPromotionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createPromotionSchema.parse(req.body);
    const promotion = await createPromotion(validatedData);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'create_promotion',
      entityType: 'promotion',
      entityId: promotion.id,
      description: `Promoción creada: ${promotion.title}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(201).json(promotion);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// PUT /api/admin/promotions/:id - Actualizar una promoción
export const updatePromotionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updatePromotionSchema.parse(req.body);
    const promotion = await updatePromotion(id, validatedData);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'update_promotion',
      entityType: 'promotion',
      entityId: promotion.id,
      description: `Promoción actualizada: ${promotion.title}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(promotion);
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

// DELETE /api/admin/promotions/:id - Eliminar una promoción
export const deletePromotionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deletePromotion(id);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'delete_promotion',
      entityType: 'promotion',
      entityId: id,
      description: `Promoción eliminada: ${id}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrada')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};