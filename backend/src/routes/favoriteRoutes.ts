import { Router } from 'express';
import { auth } from '../middlewares/auth';
import {
  getFavoritesController,
  addToFavoritesController,
  removeFromFavoritesController,
  isFavoriteController,
} from '../controllers/favoriteController';

const router = Router();

// Todas las rutas de favoritos requieren autenticación
router.use(auth);

// GET /api/favorites - Obtener favoritos del usuario
router.get('/', getFavoritesController);

// POST /api/favorites - Agregar producto a favoritos
router.post('/', addToFavoritesController);

// GET /api/favorites/:productId - Verificar si un producto está en favoritos
router.get('/:productId', isFavoriteController);

// DELETE /api/favorites/:productId - Eliminar producto de favoritos
router.delete('/:productId', removeFromFavoritesController);

export default router;
