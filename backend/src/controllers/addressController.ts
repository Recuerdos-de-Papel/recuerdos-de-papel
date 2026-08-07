import { Request, Response, NextFunction } from 'express';
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../services/addressService';

// Validar formato UUID
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// GET /api/addresses - Obtener direcciones del usuario
export const getAddressesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const addresses = await getAddresses(userId);
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

// POST /api/addresses - Crear una nueva dirección
export const createAddressController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const {
      name,
      province,
      city,
      neighborhood,
      street,
      number,
      floor,
      apartment,
      postalCode,
      references,
      isPrimary,
    } = req.body;

    if (!name || !province || !city || !street || !number) {
      return res.status(400).json({ error: 'Los campos name, province, city, street y number son requeridos' });
    }

    const address = await createAddress({
      userId,
      name,
      province,
      city,
      neighborhood,
      street,
      number,
      floor,
      apartment,
      postalCode,
      references,
      isPrimary,
    });

    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

// PUT /api/addresses/:id - Actualizar una dirección
export const updateAddressController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;

    // Validar formato de ID
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'ID de dirección inválido' });
    }

    // 1. Primero obtener la dirección existente
    const existingAddress = await getAddressById(id, userId);
    
    // 2. Si no existe, retornar HTTP 404 con mensaje claro
    if (!existingAddress) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }

    // 3. Solo si existe, continuar con updateAddress
    const address = await updateAddress(id, req.body);
    res.json(address);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/addresses/:id - Eliminar una dirección
export const deleteAddressController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { id } = req.params;

    // Validar formato de ID
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'ID de dirección inválido' });
    }

    // 1. Primero obtener la dirección existente
    const existingAddress = await getAddressById(id, userId);
    
    // 2. Si no existe, retornar HTTP 404 con mensaje claro
    if (!existingAddress) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }

    // 3. Solo si existe, continuar con deleteAddress
    await deleteAddress(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
