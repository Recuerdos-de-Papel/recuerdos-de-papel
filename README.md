# Recuerdos de Papel - Papelería Creativa

Sistema de gestión para papelería creativa con arquitectura de monorepo.

## 🏗️ Arquitectura

Este proyecto está dividido en tres aplicaciones independientes:

- **[Backend API](./backend/README.md)** - API REST con Node.js, Express, TypeScript y Prisma
- **[Web](./web/README.md)** - Aplicación web para clientes con React, Vite y TailwindCSS
- **[Android App](./android/README.md)** - Aplicación Android nativa para administración con Flutter

## 📋 Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Flutter >= 3.0.0 (solo para desarrollo Android)

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd recuerdos-de-papel
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

#### Backend
```bash
cd backend
cp .env.example .env
# Editar .env con tus configuraciones
```

#### Web
```bash
cd web
cp .env.example .env
# Editar .env con tus configuraciones
```

### 4. Inicializar base de datos
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 5. Ejecutar en desarrollo
```bash
# Desde la raíz del proyecto
npm run dev

# O individualmente:
# Backend: http://localhost:3000
npm run dev:backend

# Web: http://localhost:5173
npm run dev:web
```

## 📁 Estructura del Proyecto

```
recuerdos-de-papel/
├── backend/          # API REST
├── web/              # Aplicación web cliente
├── android/          # App Android administración
├── docs/             # Documentación
│   ├── ARQUITECTURA.md
│   └── API.md
├── scripts/          # Scripts de automatización
├── docker/           # Configuraciones Docker
├── package.json      # Dependencias del monorepo
└── README.md
```

## 🛠️ Stack Tecnológico

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite
- JWT + bcrypt
- Zod (validación)
- Helmet + CORS (seguridad)

### Web
- React 18
- Vite
- TypeScript
- TailwindCSS
- React Router DOM
- Axios

### Android
- Flutter
- Dart
- Riverpod (state management)
- Dio (networking)

## 📝 Scripts Disponibles

### Desde la raíz
```bash
npm run dev              # Ejecutar backend y web en desarrollo
npm run dev:backend      # Solo backend
npm run dev:web          # Solo web
npm run build            # Build de ambos proyectos
npm run lint             # Lint de ambos proyectos
npm run format           # Formatear código de ambos proyectos
```

### Backend
```bash
cd backend
npm run dev              # Desarrollo con nodemon
npm run build            # Compilar TypeScript
npm run start            # Ejecutar en producción
npm run lint             # Ejecutar ESLint
npm run lint:fix         # Corregir errores de lint
npm run format           # Formatear con Prettier
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio
```

### Web
```bash
cd web
npm run dev              # Desarrollo con Vite
npm run build            # Build para producción
npm run preview          # Preview del build
npm run lint             # Ejecutar ESLint
npm run lint:fix         # Corregir errores de lint
npm run format           # Formatear con Prettier
```

## 🔒 Seguridad

- Autenticación JWT
- Passwords hasheados con bcrypt
- Validación de datos con Zod
- Headers de seguridad con Helmet
- CORS configurado
- Variables de entorno para credenciales

## 📊 Base de Datos

El proyecto utiliza SQLite con Prisma ORM. El schema incluye:

- Users (clientes y administradores)
- Categories → Families → Subfamilies → Products
- Orders y OrderItems
- Promotions
- Flyers

Ver `backend/prisma/schema.prisma` para más detalles.

## 📖 Documentación

- [Arquitectura del Sistema](./docs/ARQUITECTURA.md)
- [Documentación de API](./docs/API.md)

## 🔄 Flujo de Trabajo

1. Crear una rama desde `main`
2. Desarrollar la funcionalidad
3. Ejecutar tests y lint
4. Crear Pull Request
5. Code review
6. Merge a `main`

## 📦 Estado del Proyecto

✅ **Versión 1.0 - LISTA PARA PRODUCCIÓN**

- [x] Endpoints de productos
- [x] Endpoints de pedidos
- [x] Autenticación (JWT + Supabase)
- [x] Pantallas de la web
- [x] App Android (Admin)
- [x] Integración Mercado Pago
- [x] Base de datos con Prisma
- [x] Seguridad (Helmet, CORS, Rate Limit)
- [x] SEO y PWA

## 📄 Licencia

Privado - Todos los derechos reservados

## 👥 Autores

Desarrollado para Recuerdos de Papel - Papelería Creativa