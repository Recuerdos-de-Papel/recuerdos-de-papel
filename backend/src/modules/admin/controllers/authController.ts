 import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../../../config/env';
import { adminLoginSchema, adminRegisterSchema } from '../validators';
import { createAdminLog, prisma } from '../services';

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
    const jwtSecret = env.JWT_SECRET || 'default-secret';
    const jwtExpiresIn = env.JWT_EXPIRES_IN && env.JWT_EXPIRES_IN.trim() !== '' 
      ? env.JWT_EXPIRES_IN 
      : '7d';

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as any
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

// POST /api/admin/auth/register - Registro de primer administrador (solo si no existe ninguno)
export const registerAdminController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = adminRegisterSchema.parse(req.body);

    // Verificar si ya existe un admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' },
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Ya existe un administrador registrado' });
    }

    // Verificar si el email ya está en uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin',
      },
    });

    res.status(201).json({
      message: 'Administrador creado exitosamente',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};
