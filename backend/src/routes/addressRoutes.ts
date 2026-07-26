import { Router } from 'express';
import { auth } from '../middlewares/auth';
import {
  getAddressesController,
  createAddressController,
  updateAddressController,
  deleteAddressController,
} from '../controllers/addressController';

const router = Router();

// Todas las rutas de direcciones requieren autenticación
router.use(auth);

// GET /api/addresses - Obtener direcciones del usuario
router.get('/', getAddressesController);

// POST /api/addresses - Crear una nueva dirección
router.post('/', createAddressController);

// PUT /api/addresses/:id - Actualizar una dirección
router.put('/:id', updateAddressController);

// DELETE /api/addresses/:id - Eliminar una dirección
router.delete('/:id', deleteAddressController);

export default router;
