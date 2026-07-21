import { Request, Response, NextFunction } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators';
import { createAdminLog } from '../services';

// GET /api/admin/categories - Obtener todas las categorías
export const getCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/categories/:id - Obtener una categoría por ID
export const getCategoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);
    res.json(category);
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrada')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

// POST /api/admin/categories - Crear una nueva categoría
export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const category = await createCategory(validatedData);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'create_category',
      entityType: 'category',
      entityId: category.id,
      description: `Categoría creada: ${category.name}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(201).json(category);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// PUT /api/admin/categories/:id - Actualizar una categoría
export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateCategorySchema.parse(req.body);
    const category = await updateCategory(id, validatedData);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'update_category',
      entityType: 'category',
      entityId: category.id,
      description: `Categoría actualizada: ${category.name}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(category);
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

// DELETE /api/admin/categories/:id - Eliminar una categoría
export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteCategory(id);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'delete_category',
      entityType: 'category',
      entityId: id,
      description: `Categoría eliminada: ${id}`,
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