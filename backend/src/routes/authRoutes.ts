import { Router } from 'express';
import {
  loginController,
  registerController,
  profileController,
} from '../controllers/authController';
import { auth } from '../middlewares/auth';

const router = Router();

// POST /api/auth/login - Login de cliente
router.post('/login', loginController);

// POST /api/auth/register - Registro de cliente
router.post('/register', registerController);

// Protected routes
router.use(auth);

// GET /api/auth/profile - Obtener perfil del usuario
router.get('/profile', profileController);

export default router;