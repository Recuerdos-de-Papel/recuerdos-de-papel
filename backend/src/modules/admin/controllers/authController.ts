import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../../../config/env';
import { adminLoginSchema } from '../validators';
import { createAdminLog } from '../services';

const prisma = new PrismaClient();

// POST /api/admin/auth/login - Login de administrador
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);

    // Find admin user
    const user = await prisma.user.findFirst({
      where: {
        email,
        role: 'admin',
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET || 'default-secret',
      { expiresIn: env.JWT_EXPIRES_IN || '7d' } as any
    );

    // Log
    await createAdminLog({
      adminId: user.id,
      action: 'login',
      description: `Login exitoso: ${user.email}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({
      token,
      admin: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// GET /api/admin/auth/profile - Obtener perfil del administrador
export const profileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};