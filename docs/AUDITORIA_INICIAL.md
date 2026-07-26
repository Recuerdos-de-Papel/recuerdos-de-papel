# AUDITORÍA INICIAL COMPLETA DEL PROYECTO - RECUERDOS DE PAPEL

**Fecha:** 26/07/2026  
**Auditor:** Sistema de Auditoría  
**Objetivo:** Evaluación completa del estado actual del proyecto antes de la reconstrucción

---

## 1. ESTADO ACTUAL DEL PROYECTO

### Resumen Ejecutivo
El proyecto es un **monorepo** que contiene tres componentes principales:
- **Backend API**: Node.js + Express + TypeScript + Prisma (desplegado en Render)
- **Web Cliente**: React + Vite + TypeScript + TailwindCSS (sin despliegue confirmado)
- **APK Android**: Flutter (aplicación administrativa funcional)

### Arquitectura Actual
```
┌─────────────────────────────────────────────────────────┐
│                    MONOREPO                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Backend   │  │     Web     │  │      APK        │ │
│  │  (Node/TS)  │  │  (React/TS) │  │   (Flutter)     │ │
│  │  Render     │  │  Sin deploy │  │  Administrativo │ │
│  └──────┬──────┘  └──────┬──────┘  └───────┬─────────┘ │
│         │                │                  │            │
│         └────────────────┼──────────────────┘            │
│                          │                               │
│                    ┌─────▼─────┐                         │
│                    │  Supabase │                         │
│                    │ (Postgres)│                         │
│                    └───────────┘                         │
└─────────────────────────────────────────────────────────┘
```

---

## 2. ARQUITECTURA ENCONTRADA

### 2.1 Backend API
**Tecnologías:**
- Node.js + Express + TypeScript
- Prisma ORM (PostgreSQL)
- JWT para autenticación
- Mercado Pago SDK
- Supabase Storage para imágenes
- Swagger para documentación

**Estructura de carpetas:**
```
backend/
├── src/
│   ├── index.ts                    # Punto de entrada
│   ├── config/
│   │   ├── database.ts             # Conexión Prisma
│   │   └── env.ts                  # Variables de entorno
│   ├── controllers/                # Controladores
│   │   ├── authController.ts
│   │   ├── orderController.ts
│   │   └── (en modules/admin/)
│   ├── middlewares/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── modules/
│   │   ├── admin/                  # Módulo administrativo
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── validators/
│   │   │   └── dto/
│   │   └── mercadopago/            # Integración MP
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── orderRoutes.ts
│   ├── services/                   # Lógica de negocio
│   │   ├── productService.ts
│   │   ├── categoryService.ts
│   │   ├── orderService.ts
│   │   └── supabaseStorage.ts
│   ├── types/
│   └── utils/
├── prisma/
│   └── schema.prisma               # Schema de BD
├── package.json
└── .env.example
```

**Endpoints principales:**
- `POST /api/auth/login` - Login admin
- `POST /api/auth/register` - Registro admin
- `GET /api/auth/profile` - Perfil admin
- `GET /api/orders` - Pedidos
- `POST /api/payments/create-preference` - Mercado Pago
- `POST /api/payments/webhook` - Webhook MP
- `GET/POST/PUT/DELETE /api/admin/products` - CRUD productos
- `GET/POST/PUT/DELETE /api/admin/categories` - CRUD categorías
- `GET/POST/PUT/DELETE /api/admin/families` - CRUD familias
- `GET/POST/PUT/DELETE /api/admin/subfamilies` - CRUD subfamilias
- `GET/POST/PUT/DELETE /api/admin/promotions` - CRUD promociones
- `GET/POST/PUT/DELETE /api/admin/flyers` - CRUD flyers
- `GET/PATCH /api/admin/orders` - Gestión pedidos
- `GET/POST/PUT /api/admin/settings` - Configuraciones
- `GET /api/admin/statistics/*` - Estadísticas
- `POST /api/admin/upload/*` - Subida de imágenes

### 2.2 Web Cliente
**Tecnologías:**
- React 18 + TypeScript
- Vite como bundler
- TailwindCSS para estilos
- React Router para navegación
- Supabase JS SDK (conexión directa a BD)
- Heroicons para iconos

**Estructura de carpetas:**
```
web/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── CategoriesSection.tsx
│   │   ├── FlyersSection.tsx
│   │   ├── FeaturedProductsSection.tsx
│   │   ├── ProductCard.tsx
│   │   └── ProductFilters.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── Subcategories.tsx
│   │   ├── ProductPage.tsx
│   │   ├── Cart.tsx
│   │   ├── Favorites.tsx
│   │   ├── OrderDetail.tsx
│   │   ├── MyAddresses.tsx
│   │   └── Contact.tsx
│   ├── services/
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   ├── addressService.ts
│   │   ├── favoriteService.ts
│   │   ├── flyersService.ts
│   │   ├── settingsService.ts
│   │   └── index.ts
│   ├── context/
│   │   └── SettingsContext.tsx
│   ├── types/
│   │   └── index.ts
│   └── lib/
│       └── supabase.ts
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── .env
```

**Características:**
- Catálogo de productos
- Carrito de compras
- Checkout con Mercado Pago
- Gestión de direcciones
- Favoritos
- Visualización de flyers
- Diseño responsive

### 2.3 APK Android
**Tecnologías:**
- Flutter 3.x
- Dart
- Riverpod para state management
- GoRouter para navegación
- Dio para HTTP
- Shared Preferences + Secure Storage
- Image Picker
- Local Auth (biometría)
- Notificaciones locales

**Estructura de carpetas:**
```
android/
├── lib/
│   ├── main.dart
│   ├── app_router.dart
│   ├── core/
│   │   ├── network/
│   │   │   └── api_client.dart
│   │   ├── providers/
│   │   │   └── providers.dart
│   │   └── services/
│   │       └── notification_service.dart
│   └── features/
│       ├── auth/
│       │   ├── auth_service.dart
│       │   ├── auth_wrapper.dart
│       │   └── login_screen.dart
│       ├── products/
│       │   ├── products_screen.dart
│       │   ├── product_form_screen.dart
│       │   └── products_service.dart
│       ├── categories/
│       │   └── categories_screen.dart
│       ├── families/
│       │   ├── families_screen.dart
│       │   └── families_service.dart
│       ├── subfamilies/
│       │   └── subfamilies_screen.dart
│       ├── promotions/
│       │   └── promotions_screen.dart
│       ├── flyers/
│       │   └── flyers_screen.dart
│       ├── orders/
│       │   └── orders_screen.dart
│       ├── settings/
│       │   └── settings_screen.dart
│       ├── statistics/
│       │   └── statistics_screen.dart
│       └── home/
│           └── home_screen.dart
├── assets/
├── pubspec.yaml
└── android/
```

---

## 3. TECNOLOGÍAS USADAS

### Backend
- **Runtime**: Node.js >= 18.0.0
- **Framework**: Express 4.18.2
- **Lenguaje**: TypeScript 5.3.3
- **ORM**: Prisma 5.0.0
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: JWT + bcrypt
- **Pagos**: Mercado Pago SDK 3.2.0
- **Storage**: Supabase Storage
- **Seguridad**: Helmet, CORS, Rate Limit
- **Docs**: Swagger UI Express
- **Validación**: Zod 3.22.4

### Web
- **Framework**: React 18.2.0
- **Bundler**: Vite 5.0.12
- **Lenguaje**: TypeScript 5.3.3
- **Estilos**: TailwindCSS 3.4.1
- **Routing**: React Router DOM 6.21.1
- **BD Cliente**: Supabase JS SDK 2.43.0
- **Iconos**: Heroicons 2.2.0

### Android
- **Framework**: Flutter >= 3.0.0
- **Lenguaje**: Dart
- **State Management**: Riverpod 2.4.9
- **Routing**: GoRouter 14.0.0
- **HTTP**: Dio 5.4.0
- **Storage**: Shared Preferences + Secure Storage
- **Imágenes**: Image Picker + Cached Network Image
- **UI**: Material Design + Cupertino Icons

---

## 4. SERVICIOS CONECTADOS

### 4.1 Supabase
**URL**: `https://kdktpojkuztruiyqlqlr.supabase.co` (proyecto: kdktpojkuztruiyqlqlr)

**Uso:**
- Base de datos PostgreSQL
- Storage para imágenes de productos y flyers
- Autenticación (solo web)

**Buckets esperados:**
- `product-images` - Imágenes de productos
- `flyers` - Imágenes de flyers

### 4.2 Render
**URL**: `https://recuerdos-de-papel-backend.onrender.com`

**Uso:**
- Hosting del backend API
- Puerto: 3000 (variable PORT)
- Script de inicio: `render-start`

### 4.3 Mercado Pago
**Access Token**: `APP_USR-28ee0e80-88d1-4d3b-87f0-735e94ec4ae0` (public key en web)

**Uso:**
- Procesamiento de pagos
- Webhooks para confirmación

---

## 5. VARIABLES DISPONIBLES

### Backend (.env.example)
```
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"
CORS_ORIGIN=http://localhost:5173
MERCADO_PAGO_ACCESS_TOKEN=your-access-token
MERCADO_PAGO_PUBLIC_KEY=your-public-key
MERCADO_PAGO_WEBHOOK_SECRET=your-webhook-secret
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Web (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://kdktpojkuztruiyqlqlr.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR-28ee0e80-88d1-4d3b-87f0-735e94ec4ae0
```

---

## 6. VARIABLES FALTANTES

### Backend
| Variable | Ubicación Esperada | Función | Estado |
|----------|-------------------|---------|--------|
| `DATABASE_URL` | backend/.env | Conexión a Supabase PostgreSQL | **FALTA** - Necesita confirmación del propietario |
| `DIRECT_URL` | backend/.env | Conexión directa a Supabase | **FALTA** - Necesita confirmación del propietario |
| `JWT_SECRET` | backend/.env | Clave secreta para JWT | **FALTA** - Necesita confirmación del propietario |
| `MERCADO_PAGO_ACCESS_TOKEN` | backend/.env | Token de acceso Mercado Pago | **FALTA** - Necesita confirmación del propietario |
| `MERCADO_PAGO_PUBLIC_KEY` | backend/.env | Clave pública Mercado Pago | **FALTA** - Necesita confirmación del propietario |
| `MERCADO_PAGO_WEBHOOK_SECRET` | backend/.env | Secreto para validar webhooks | **FALTA** - Necesita confirmación del propietario |
| `SUPABASE_URL` | backend/.env | URL del proyecto Supabase | **FALTA** - Necesita confirmación del propietario |
| `SUPABASE_SERVICE_ROLE_KEY` | backend/.env | Service role key de Supabase | **FALTA** - Necesita confirmación del propietario |
| `CORS_ORIGIN` | backend/.env | Origen permitido para CORS | **FALTA** - Necesita confirmación del propietario |

### Web
| Variable | Ubicación Esperada | Función | Estado |
|----------|-------------------|---------|--------|
| `VITE_SUPABASE_ANON_KEY` | web/.env | Anon key de Supabase | **FALTA** - Necesita confirmación del propietario |

> **Nota:** Si el propietario entrega posteriormente alguna de estas claves o tokens, registrar:  
> "Dato entregado manualmente por propietario del proyecto. No encontrado en código fuente."

---

## 7. ERRORES ENCONTRADOS

### 7.1 Críticos

| # | Error | Archivo | Línea | Descripción |
|---|-------|---------|-------|-------------|
| 1 | Documentación dice SQLite pero usa PostgreSQL | README.md | 90 | Indica SQLite cuando el proyecto usa PostgreSQL vía Supabase |
| 2 | Documentación dice SQLite pero usa PostgreSQL | backend/README.md | 10, 40 | Muestra configuración SQLite incorrecta |
| 3 | Documentación dice SQLite pero usa PostgreSQL | docs/ARQUITECTURA.md | 29 | Muestra SQLite en diagrama de arquitectura |
| 4 | Docker Compose usa SQLite | docker/docker-compose.yml | 12 | `DATABASE_URL=file:./dev.db` incompatible con producción |
| 5 | URL de producción hardcodeada en APK | android/lib/src/core/network/api_client.dart | 17-18 | No permite cambio de entorno |
| 6 | Web sin configuración de despliegue | web/ | - | No hay render.yaml, Dockerfile de producción ni configuración de hosting |

### 7.2 Importantes

| # | Error | Archivo | Línea | Descripción |
|---|-------|---------|-------|-------------|
| 7 | README Android dice localhost | android/README.md | 191 | Dice que consume `http://localhost:3000/api/admin` pero la URL real es Render |
| 8 | API docs dicen localhost | docs/API.md | 5 | Base URL documentada es localhost |
| 9 | Swagger docs dicen localhost | backend/src/index.ts | 62 | Solo muestra localhost en servidores |
| 10 | No existe render.yaml | backend/ | - | Backend usa Render pero no hay archivo de configuración |

### 7.3 Menores

| # | Error | Archivo | Línea | Descripción |
|---|-------|---------|-------|-------------|
| 11 | VITE_API_URL solo para Mercado Pago | web/src/services/paymentService.ts | 3 | Solo se usa para pagos, no para el resto de la app |
| 12 | Archivos de test con credenciales | login_body.json, login_test.json | - | Credenciales hardcodeadas en raíz del proyecto |

---

## 8. ARCHIVOS OBSOLETOS

### 8.1 Documentación Desactualizada
- `README.md` - Dice SQLite, debe decir PostgreSQL
- `backend/README.md` - Muestra SQLite, debe mostrar PostgreSQL
- `docs/ARQUITECTURA.md` - Diagrama muestra SQLite
- `android/README.md` - Dice localhost, debe decir URL de Render
- `docs/API.md` - Base URL es localhost

### 8.2 Configuraciones Incorrectas
- `docker/docker-compose.yml` - Usa SQLite, incompatible con producción
- `web/.env.example` - Solo tiene configuración de desarrollo

### 8.3 Archivos de Test
- `login_body.json` - Credenciales hardcodeadas
- `login_test.json` - Credenciales hardcodeadas
- `backend/login_test.json` - Credenciales hardcodeadas

---

## 9. ARCHIVOS REUTILIZABLES

### Backend
- ✅ `backend/prisma/schema.prisma` - Schema completo y bien estructurado
- ✅ `backend/src/index.ts` - Estructura de Express correcta
- ✅ `backend/src/modules/admin/routes/index.ts` - Rutas admin completas
- ✅ `backend/src/services/supabaseStorage.ts` - Servicio de storage funcional
- ✅ `backend/src/modules/mercadopago/` - Integración MP completa
- ✅ Todos los servicios en `backend/src/services/` - Lógica de negocio

### Web
- ✅ `web/src/types/index.ts` - Tipos TypeScript
- ✅ Estructura de componentes React
- ✅ Servicios de Supabase (adaptar al APK)

### APK
- ✅ Todo el código Flutter es funcional y es la fuente de verdad
- ✅ Estructura de features bien organizada
- ✅ Servicios API completos

---

## 10. ARCHIVOS QUE DEBEN ELIMINARSE

### 10.1 Archivos de Test con Credenciales
- `login_body.json`
- `login_test.json`
- `backend/login_test.json`

### 10.2 Configuraciones Obsoletas (después de crear nuevas)
- `docker/docker-compose.yml` (después de crear configuración correcta)
- `web/.env.example` (después de crear nueva)

### 10.3 Documentación Desactualizada (después de actualizar)
- Mantener pero actualizar:
  - `README.md`
  - `backend/README.md`
  - `docs/ARQUITECTURA.md`
  - `android/README.md`
  - `docs/API.md`

---

## 11. MODELO DE DATOS (Prisma Schema)

### Entidades Principales

**User** (usuarios y admins)
- id, email, password, name, phone, role (customer/admin)
- Relaciones: orders, addresses, favorites, adminLogs

**Category** (categorías)
- id, name, description, order, isActive
- Relaciones: families

**Family** (familias)
- id, categoryId, name, description, order, isActive
- Relaciones: category, subfamilies

**Subfamily** (subfamilias)
- id, familyId, name, description, order, isActive
- Relaciones: family, products

**Product** (productos)
- id, subfamilyId, name, slug, code, shortDescription, description
- normalPrice, webPrice, offerPrice, discountPercentage, cost
- status (available, out_of_stock, etc.)
- isFeatured, isNew, productionTime, displayOrder
- labels (JSON), images (JSON), features (JSON)
- isOffer, isActive, stock, deletedAt
- Relaciones: subfamily, orderItems, favorites

**Order** (pedidos)
- id, userId, status (pending, payment_pending, paid, in_production, ready, shipped, delivered, cancelled)
- deliveryMethod (pickup, local_delivery, interior_shipping)
- subtotal, discount, total, shippingCost
- customerName, customerPhone, customerEmail, address, notes
- paymentId, paymentStatus, paymentMethod, merchantOrderId
- dateApproved, confirmedAt, cancelledAt
- Relaciones: user, items

**OrderItem** (items de pedido)
- id, orderId, productId, quantity, price
- Relaciones: order, product

**Address** (direcciones)
- id, userId, name, province, city, neighborhood, street, number, floor, apartment, postalCode, references, isPrimary

**Favorite** (favoritos)
- id, userId, productId

**Promotion** (promociones)
- id, title, description, discount, code, startDate, endDate, isActive, isWeb

**Flyer** (flyers/publicidad)
- id, title, imageUrl, startDate, endDate, isActive, order

**Setting** (configuraciones)
- id, key (unique), value, description

**AdminLog** (logs de administración)
- id, adminId, action, entityType, entityId, description, ipAddress, userAgent

---

## 12. CONECTIVIDAD ACTUAL

### Flujo de Datos Actual

**APK → Backend → Supabase:**
1. APK se autentica en `/api/auth/login`
2. APK consume `/api/admin/*` con JWT
3. Backend consulta Supabase vía Prisma
4. Backend retorna datos al APK

**Web → Supabase (directo):**
1. Web se autentica vía `supabase.auth`
2. Web consulta datos vía `supabase.from()`
3. Web sube imágenes vía `supabase.storage`
4. Solo usa backend para Mercado Pago

**Problema:** La web no sigue el flujo APK → Backend → BD. Va directo a BD.

---

## 13. PRÓXIMOS PASOS

1. **FASE 2**: Auditar APK completo para extraer modelos y endpoints exactos
2. **FASE 3**: Definir si el backend actual se reutiliza o se crea uno nuevo
3. **FASE 4**: Verificar buckets de Supabase
4. **FASE 5**: Eliminar web actual (si se confirma que no es confiable)
5. **FASE 6**: Crear nueva web alineada al APK
6. **FASE 7**: Implementar Mercado Pago completo
7. **FASE 8**: Sistema de auditoría permanente
8. **FASE 9**: Control de calidad final

---

## 14. EVIDENCIA RECOPILADA

### Archivos Leídos
- ✅ package.json (raíz)
- ✅ backend/package.json
- ✅ backend/.env.example
- ✅ backend/prisma/schema.prisma
- ✅ backend/src/index.ts
- ✅ backend/src/modules/admin/routes/index.ts
- ✅ web/package.json
- ✅ web/.env
- ✅ android/pubspec.yaml
- ✅ docs/AUDITORIA_INFRAESTRUCTURA.md

### Estructuras Listadas
- ✅ backend/src/ (completa)
- ✅ Raíz del proyecto (completa)

---

*Fin de la auditoría inicial.*