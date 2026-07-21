import { Router } from 'express';
import { adminAuth } from '../middlewares/adminAuth';
import {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
  updateProductStateController,
  updateProductFeaturedController,
} from '../controllers/productController';
import {
  getCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from '../controllers/categoryController';
import {
  getSubfamiliesController,
  getSubfamiliesByFamilyController,
  getSubfamilyByIdController,
  createSubfamilyController,
  updateSubfamilyController,
  deleteSubfamilyController,
} from '../controllers/subfamilyController';
import {
  getPromotionsController,
  getPromotionByIdController,
  createPromotionController,
  updatePromotionController,
  deletePromotionController,
} from '../controllers/promotionController';
import {
  getFlyersController,
  getFlyerByIdController,
  createFlyerController,
  updateFlyerController,
  deleteFlyerController,
} from '../controllers/flyerController';
import {
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
} from '../controllers/orderController';
import {
  getSettingsController,
  getSettingByKeyController,
  createSettingController,
  updateSettingController,
} from '../controllers/settingController';
import {
  getSalesStatsController,
  getTopProductsController,
  getTopCategoriesController,
} from '../controllers/statisticsController';
import {
  loginController,
  profileController,
} from '../controllers/authController';

const router = Router();

// Auth routes (no auth required)
router.post('/auth/login', loginController);

// Protected routes
router.use(adminAuth);

// Auth
router.get('/auth/profile', profileController);

// Products
router.get('/products', getProductsController);
router.get('/products/:id', getProductByIdController);
router.post('/products', createProductController);
router.put('/products/:id', updateProductController);
router.delete('/products/:id', deleteProductController);
router.patch('/products/:id/state', updateProductStateController);
router.patch('/products/:id/featured', updateProductFeaturedController);

// Categories
router.get('/categories', getCategoriesController);
router.get('/categories/:id', getCategoryByIdController);
router.post('/categories', createCategoryController);
router.put('/categories/:id', updateCategoryController);
router.delete('/categories/:id', deleteCategoryController);

// Subfamilies
router.get('/subfamilies', getSubfamiliesController);
router.get('/subfamilies/family/:familyId', getSubfamiliesByFamilyController);
router.get('/subfamilies/:id', getSubfamilyByIdController);
router.post('/subfamilies', createSubfamilyController);
router.put('/subfamilies/:id', updateSubfamilyController);
router.delete('/subfamilies/:id', deleteSubfamilyController);

// Promotions
router.get('/promotions', getPromotionsController);
router.get('/promotions/:id', getPromotionByIdController);
router.post('/promotions', createPromotionController);
router.put('/promotions/:id', updatePromotionController);
router.delete('/promotions/:id', deletePromotionController);

// Flyers
router.get('/flyers', getFlyersController);
router.get('/flyers/:id', getFlyerByIdController);
router.post('/flyers', createFlyerController);
router.put('/flyers/:id', updateFlyerController);
router.delete('/flyers/:id', deleteFlyerController);

// Orders
router.get('/orders', getOrdersController);
router.get('/orders/:id', getOrderByIdController);
router.patch('/orders/:id/status', updateOrderStatusController);

// Settings
router.get('/settings', getSettingsController);
router.get('/settings/:key', getSettingByKeyController);
router.post('/settings', createSettingController);
router.put('/settings/:key', updateSettingController);

// Statistics
router.get('/statistics/sales', getSalesStatsController);
router.get('/statistics/top-products', getTopProductsController);
router.get('/statistics/top-categories', getTopCategoriesController);

export default router;