import { Request, Response, NextFunction } from 'express';
import {
  getSalesStats,
  getTopProducts,
  getTopCategories,
} from '../services';
import { statisticsFilterSchema } from '../validators';

// GET /api/admin/statistics/sales - Estadísticas de ventas
export const getSalesStatsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to, period } = statisticsFilterSchema.parse(req.query);

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (period && !from && !to) {
      const now = new Date();
      endDate = now;

      switch (period) {
        case 'day':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week': {
          const day = now.getDay();
          const diff = now.getDate() - day + (day === 0 ? -6 : 1);
          startDate = new Date(now.getFullYear(), now.getMonth(), diff);
          break;
        }
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
    } else {
      startDate = from;
      endDate = to;
    }

    const stats = await getSalesStats(startDate, endDate);
    res.json(stats);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// GET /api/admin/statistics/top-products - Productos más vendidos
export const getTopProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to, limit } = req.query;
    const parsedLimit = limit ? parseInt(limit as string, 10) : 10;

    const products = await getTopProducts(
      from ? new Date(from as string) : undefined,
      to ? new Date(to as string) : undefined,
      parsedLimit
    );

    res.json(products);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/statistics/top-categories - Categorías más vendidas
export const getTopCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to, limit } = req.query;
    const parsedLimit = limit ? parseInt(limit as string, 10) : 10;

    const categories = await getTopCategories(
      from ? new Date(from as string) : undefined,
      to ? new Date(to as string) : undefined,
      parsedLimit
    );

    res.json(categories);
  } catch (error) {
    next(error);
  }
};