import { Router } from 'express';
import {
  getProductsController,
  getProductByIdController,
  getCategoriesController,
  getFamiliesByCategoryController,
  getSubfamiliesByFamilyController,
  getPromotionsController,
  getFlyersController,
} from '../controllers/publicController';

const router = Router();

// GET /api/products - Obtener todos los productos (público)
router.get('/products', getProductsController);

// GET /api/products/:id - Obtener un producto por ID (público)
router.get('/products/:id', getProductByIdController);

// GET /api/categories - Obtener todas las categorías (público)
router.get('/categories', getCategoriesController);

// GET /api/families/category/:categoryId - Obtener familias por categoría (público)
router.get('/families/category/:categoryId', getFamiliesByCategoryController);

// GET /api/subfamilies/family/:familyId - Obtener subfamilias por familia (público)
router.get('/subfamilies/family/:familyId', getSubfamiliesByFamilyController);

// GET /api/promotions - Obtener promociones activas (público)
router.get('/promotions', getPromotionsController);

// GET /api/flyers - Obtener todos los flyers (público)
router.get('/flyers', getFlyersController);

export default router;
