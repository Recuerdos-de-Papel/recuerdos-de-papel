// Servicios
export * from './authService';
export * from './categoryService';
export * from './subcategoryService';
export { 
  getProducts, 
  getProductById, 
  getProductBySlug, 
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from './productService';
export * from './productImageService';
export * from './promotionService';
export * from './orderService';
export * from './favoriteService';
export * from './addressService';
export * from './storageService';