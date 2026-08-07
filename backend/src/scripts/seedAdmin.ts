import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { prisma } from '../config/prisma';

dotenv.config();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@recuerdosdepapel.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Administrador';

  console.log('Verificando si existe administrador...');
  const existing = await prisma.user.findFirst({ where: { email: adminEmail, role: 'admin' } });
  if (existing) {
    console.log(`Admin ya existe: ${existing.email} (ID: ${existing.id})`);
    return;
  }

  console.log('Generando hash bcrypt...');
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: { email: adminEmail, password: hashedPassword, name: adminName, role: 'admin' },
  });

  console.log('Admin creado:', admin.email, admin.id);
  console.log('Login: POST /api/admin/auth/login');
  console.log(`Body: {"email":"${adminEmail}","password":"${adminPassword}"}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
