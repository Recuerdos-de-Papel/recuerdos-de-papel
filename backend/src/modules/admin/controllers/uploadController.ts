import { Request, Response, NextFunction } from 'express';
import { uploadToStorage, uploadMultipleToStorage } from '../../../services/supabaseStorage';
import { createAdminLog } from '../services';

// POST /api/admin/upload/product-images - Upload product images
export const uploadProductImagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = (req as any).files;
    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: 'No se subieron archivos' });
    }

    const fileData = files.map((file: any) => ({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
    }));

    const urls = await uploadMultipleToStorage('product-images', fileData);

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'upload_images',
      entityType: 'product_images',
      description: `Subidas ${fileData.length} imágenes para producto`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({ urls });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/upload/flyer-image - Upload a single flyer image
export const uploadFlyerImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const url = await uploadToStorage(
      'flyers',
      file.buffer,
      file.originalname,
      file.mimetype
    );

    // Log
    await createAdminLog({
      adminId: req.user!.id,
      action: 'upload_flyer_image',
      entityType: 'flyer_image',
      description: `Subida imagen de flyer: ${file.originalname}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({ url });
  } catch (error) {
    next(error);
  }
};
