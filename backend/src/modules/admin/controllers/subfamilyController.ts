import { Request, Response, NextFunction } from 'express';
import {
  getSubfamilies,
  getSubfamiliesByFamily,
  getSubfamilyById,
  createSubfamily,
  updateSubfamily,
  deleteSubfamily,
} from '../services';
import {
  createSubfamilySchema,
  updateSubfamilySchema,
} from '../validators';
import { createAdminLog } from '../services';

// GET /api/admin/subfamilies - Obtener todas las subfamilias
export const getSubfamiliesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subfamilies = await getSubfamilies();
    res.json(subfamilies);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/subfamilies/family/:familyId - Obtener subfamilias por familia
export const getSubfamiliesByFamilyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { familyId } = req.params;
    const subfamilies = await getSubfamiliesByFamily(familyId);
    res.json(subfamilies);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/subfamilies/:id - Obtener una subfamilia por ID
export const getSubfamilyByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const subfamily = await getSubfamilyById(id);
    res.json(subfamily);
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrada')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

// POST /api/admin/subfamilies - Crear una nueva subfamilia
export const createSubfamilyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createSubfamilySchema.parse(req.body);
    const subfamily = await createSubfamily(validatedData);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'create_subfamily',
      entityType: 'subfamily',
      entityId: subfamily.id,
      description: `Subfamilia creada: ${subfamily.name}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(201).json(subfamily);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// PUT /api/admin/subfamilies/:id - Actualizar una subfamilia
export const updateSubfamilyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateSubfamilySchema.parse(req.body);
    const subfamily = await updateSubfamily(id, validatedData);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'update_subfamily',
      entityType: 'subfamily',
      entityId: subfamily.id,
      description: `Subfamilia actualizada: ${subfamily.name}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(subfamily);
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

// DELETE /api/admin/subfamilies/:id - Eliminar una subfamilia
export const deleteSubfamilyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteSubfamily(id);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'delete_subfamily',
      entityType: 'subfamily',
      entityId: id,
      description: `Subfamilia eliminada: ${id}`,
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