import { Router } from 'express';
import multer from 'multer';
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
  getFamiliesController,
  getFamiliesByCategoryController,
  getFamilyByIdController,
  createFamilyController,
  updateFamilyController,
  deleteFamilyController,
} from '../controllers/familyController';
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
  registerAdminController,
  profileController,
} from '../controllers/authController';
import {
  uploadProductImagesController,
  uploadFlyerImageController,
} from '../controllers/uploadController';

const router = Router();

// Multer configuration for file uploads (max 10 files, 10MB each)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10,
  },
});

// Auth routes (no auth required)
router.post('/auth/login', loginController);
router.post('/auth/register', registerAdminController);

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

// Families
router.get('/families', getFamiliesController);
router.get('/families/category/:categoryId', getFamiliesByCategoryController);
router.get('/families/:id', getFamilyByIdController);
router.post('/families', createFamilyController);
router.put('/families/:id', updateFamilyController);
router.delete('/families/:id', deleteFamilyController);

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

// Upload endpoints (protected)
router.post('/upload/product-images', upload.array('images', 10), uploadProductImagesController);
router.post('/upload/flyer-image', upload.single('image'), uploadFlyerImageController);

export default router;
