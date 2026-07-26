import { Request, Response, NextFunction } from 'express';
import {
  getProducts,
  getProductById,
  getCategories,
  getFamiliesByCategory,
  getSubfamiliesByFamily,
  getFlyers,
} from '../modules/admin/services';
import { getPromotions } from '../services/promotionService';

// GET /api/products - Obtener todos los productos (público)
// Reutiliza el servicio del panel administrador
export const getProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, isActive, status, subfamilyId } = req.query;
    const result = await getProducts({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      search: search as string | undefined,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      status: status as string | undefined,
      subfamilyId: subfamilyId as string | undefined,
    });

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;

    // Formato PaginatedResponse esperado por la web: { data, total, page, limit, totalPages }
    res.json({
      data: result.products,
      total: result.total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(result.total / limitNum),
    });
  } catch (error) {
    console.error('Error en getProductsController:', error);
    next(error);
  }
};

// GET /api/products/:id - Obtener un producto por ID (público)
export const getProductByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    res.json(product);
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

// GET /api/categories - Obtener todas las categorías (público)
export const getCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// GET /api/families/category/:categoryId - Obtener familias por categoría (público)
export const getFamiliesByCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;
    const families = await getFamiliesByCategory(categoryId);
    res.json(families);
  } catch (error) {
    next(error);
  }
};

// GET /api/subfamilies/family/:familyId - Obtener subfamilias por familia (público)
export const getSubfamiliesByFamilyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { familyId } = req.params;
    const subfamilies = await getSubfamiliesByFamily(familyId);
    res.json(subfamilies);
  } catch (error) {
    next(error);
  }
};

// GET /api/promotions - Obtener promociones activas (público)
// Reutiliza el servicio existente de promotionService
export const getPromotionsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const promotions = await getPromotions();
    res.json(promotions);
  } catch (error) {
    next(error);
  }
};

// GET /api/flyers - Obtener todos los flyers (público)
// Reutiliza el servicio del panel administrador
export const getFlyersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flyers = await getFlyers();
    res.json(flyers);
  } catch (error) {
    next(error);
  }
};
