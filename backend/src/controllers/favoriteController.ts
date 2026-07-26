import { Request, Response, NextFunction } from 'express';
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} from '../services/favoriteService';

// GET /api/favorites - Obtener favoritos del usuario
export const getFavoritesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const favorites = await getFavorites(userId);
    res.json(favorites);
  } catch (error) {
    next(error);
  }
};

// POST /api/favorites - Agregar producto a favoritos
export const addToFavoritesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId es requerido' });
    }

    // Verificar si ya está en favoritos
    const alreadyFavorite = await isFavorite(userId, productId);
    if (alreadyFavorite) {
      return res.status(409).json({ error: 'El producto ya está en favoritos' });
    }

    const favorite = await addToFavorites(userId, productId);
    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/favorites/:productId - Eliminar producto de favoritos
export const removeFromFavoritesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { productId } = req.params;

    const result = await removeFromFavorites(userId, productId);

    if (result.count === 0) {
      return res.status(404).json({ error: 'Favorito no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// GET /api/favorites/:productId - Verificar si un producto está en favoritos
export const isFavoriteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { productId } = req.params;

    const favorite = await isFavorite(userId, productId);
    res.json({ isFavorite: favorite });
  } catch (error) {
    next(error);
  }
};
