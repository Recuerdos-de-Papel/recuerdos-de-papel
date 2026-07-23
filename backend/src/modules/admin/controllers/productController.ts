import { Request, Response, NextFunction } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductState,
  updateProductFeatured,
} from '../services';
import {
  createProductSchema,
  updateProductSchema,
  updateProductStateSchema,
  updateProductFeaturedSchema,
} from '../validators';
import { createAdminLog } from '../services';

// GET /api/admin/products - Obtener todos los productos
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
    res.json({
      products: result.products,
      total: result.total,
      page: parseInt(page as string, 10) || 1,
      limit: parseInt(limit as string, 10) || 20,
      totalPages: Math.ceil(result.total / (parseInt(limit as string, 10) || 20)),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/products/:id - Obtener un producto por ID
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

// POST /api/admin/products - Crear un nuevo producto
export const createProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const product = await createProduct(validatedData);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'create_product',
      entityType: 'product',
      entityId: product.id,
      description: `Producto creado: ${product.name}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(201).json(product);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// PUT /api/admin/products/:id - Actualizar un producto
export const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateProductSchema.parse(req.body);
    const product = await updateProduct(id, validatedData);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'update_product',
      entityType: 'product',
      entityId: product.id,
      description: `Producto actualizado: ${product.name}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(product);
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// DELETE /api/admin/products/:id - Eliminar un producto
export const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteProduct(id);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'delete_product',
      entityType: 'product',
      entityId: id,
      description: `Producto eliminado: ${id}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

// PATCH /api/admin/products/state - Cambiar estado activo/inactivo
export const updateProductStateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isActive } = updateProductStateSchema.parse(req.body);
    const product = await updateProductState(id, isActive);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'change_state',
      entityType: 'product',
      entityId: product.id,
      description: `Producto ${isActive ? 'activado' : 'desactivado'}: ${product.name}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(product);
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// PATCH /api/admin/products/featured - Cambiar estado oferta
export const updateProductFeaturedController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isOffer } = updateProductFeaturedSchema.parse(req.body);
    const product = await updateProductFeatured(id, isOffer);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'change_featured',
      entityType: 'product',
      entityId: product.id,
      description: `Producto ${isOffer ? 'en oferta' : 'sin oferta'}: ${product.name}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json(product);
  } catch (error) {
    if (error instanceof Error && error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};