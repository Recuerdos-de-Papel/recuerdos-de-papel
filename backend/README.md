# Backend API - Recuerdos de Papel

API REST para el sistema de Papelería Creativa.

## 🚀 Tecnologías

- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite
- JWT + bcrypt
- Zod (validación)
- Helmet + CORS (seguridad)

## 📋 Requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🔧 Instalación

```bash
npm install
```

## ⚙️ Configuración

1. Copiar el archivo de variables de entorno:
```bash
cp .env.example .env
```

2. Editar `.env` con tus configuraciones:
```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

3. Generar el cliente Prisma:
```bash
npm run prisma:generate
```

4. Ejecutar migraciones:
```bash
npm run prisma:migrate
```

## 🚀 Desarrollo

```bash
npm run dev
```

El servidor correrá en `http://localhost:3000`

## 📦 Build

```bash
npm run build
npm run start
```

## 🧪 Testing

```bash
# Pendiente de implementación
```

## 📊 Prisma Studio

Para visualizar y editar la base de datos:

```bash
npm run prisma:studio
```

## 📁 Estructura

```
src/
├── config/       # Configuraciones
│   ├── env.ts    # Variables de entorno
│   └── database.ts # Conexión Prisma
├── controllers/  # Controladores
├── middlewares/  # Middlewares
├── routes/       # Rutas
├── services/     # Lógica de negocio
├── utils/        # Utilidades
├── types/        # Tipos TypeScript
└── index.ts      # Punto de entrada
```

## 🔒 Seguridad

- Autenticación con JWT
- Passwords hasheados con bcrypt
- Validación con Zod
- Headers de seguridad con Helmet
- CORS configurado

## 📝 Scripts

| Script | Descripción |
|--------|-------------|
| `dev` | Desarrollo con nodemon |
| `build` | Compilar TypeScript |
| `start` | Ejecutar en producción |
| `lint` | Ejecutar ESLint |
| `lint:fix` | Corregir errores de lint |
| `format` | Formatear con Prettier |
| `prisma:generate` | Generar cliente Prisma |
| `prisma:migrate` | Ejecutar migraciones |
| `prisma:studio` | Abrir Prisma Studio |</arg_value>
<arg_key>task_progress</arg_key>
<arg_value>- [x] Analizar directorio actual
- [x] Crear estructura de monorepo
- [ ] Configurar Backend (Node.js + Express + TypeScript + Prisma + SQLite)
- [ ] Configurar Web (React + Vite + TypeScript + TailwindCSS)
- [ ] Configurar Android (Flutter)
- [ ] Crear carpetas docs, scripts, docker
- [ ] Configurar Git
- [ ] Configurar ESLint y Prettier
- [ ] Crear archivos de variables de entorno
- [ ] Verificar compilación
- [ ] Crear READMEs
- [ ] Generar informe final</arg_value>
</tool_call>