// Servicios
export * from './authService';
export * from './categoryService';
export { 
  getProducts, 
  getProductById, 
  getProductBySlug, 
  getRelatedProducts,
  getCategories,
  getFamiliesByCategory,
  getSubfamiliesByFamily,
  createProduct,
  updateProduct,
  deleteProduct
} from './productService';
export * from './promotionService';
export * from './orderService';
export * from './favoriteService';
export * from './addressService';
export * from './storageService';