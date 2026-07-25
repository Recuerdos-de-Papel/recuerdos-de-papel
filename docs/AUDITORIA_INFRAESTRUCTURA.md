# AUDITORÍA DE INFRAESTRUCTURA - Recuerdos de Papel

**Fecha:** 25/07/2026
**Auditor:** Sistema de Auditoría Automatizada
**Objetivo:** Determinar con evidencia qué servicios utiliza realmente el proyecto. Verificar que NO se use Vercel ni otros servicios no autorizados.

---

## RESUMEN EJECUTIVO

| Componente | Servicio Real | Evidencia |
|---|---|---|
| **Frontend Web** | Sin desplegar (no hay configuración de producción) | No se encontró render.yaml, vercel.json, netlify.toml ni Dockerfile de producción para web |
| **Backend API** | **Render** | Script `render-start` en package.json + URL `onrender.com` en APK |
| **Base de Datos** | **Supabase (PostgreSQL)** | schema.prisma provider=postgresql + .env.example con supabase.co + código de pooler |
| **APK Flutter** | Backend en Render | URL hardcodeada `https://recuerdos-de-papel-backend.onrender.com/api/admin` |
| **Web → DB** | **Supabase directo** | Todos los servicios web usan `@supabase/supabase-js` directamente |

**NO se encontraron referencias a Vercel, Netlify, Railway, Firebase ni ningún otro servicio no autorizado.**

---

## 1. FRONTEND (Web)

### Tecnología
- React 18 + Vite + TypeScript + TailwindCSS
- Archivo: `web/package.json`

### ¿Dónde está desplegado realmente?
**NO hay evidencia de despliegue en producción.**

Evidencia:
- **No existe `render.yaml`** en ninguna ubicación del proyecto (verificado listando raíz, backend/, web/, docker/)
- **No existe `vercel.json`** en ninguna ubicación
- **No existe `netlify.toml`** en ninguna ubicación
- **No existe `Dockerfile` de producción para web** (el `docker/Dockerfile.web` es solo para Docker Compose local)
- **No existe configuración de despliegue** en `web/vite.config.ts` (solo configuración de dev server y proxy)
- **`web/.env.example`** tiene `VITE_API_URL=http://localhost:3000/api` (solo desarrollo)

### ¿Cómo accede a los datos?
**El frontend web se conecta DIRECTAMENTE a Supabase**, NO através del backend API.

Evidencia (archivos leídos):
- `web/src/lib/supabase.ts` (líneas 1-10): Crea cliente Supabase con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- `web/src/services/productService.ts` (línea 1): `import { supabase } from '../lib/supabase'` — usa `supabase.from('products')` directamente
- `web/src/services/authService.ts` (línea 1): `import { supabase } from '../lib/supabase'` — usa `supabase.auth.signInWithPassword()`
- `web/src/services/orderService.ts` (línea 1): `import { supabase } from '../lib/supabase'` — usa `supabase.from('orders')`
- `web/src/services/categoryService.ts` (línea 1): `import { supabase } from '../lib/supabase'`
- `web/src/services/promotionService.ts` (línea 1): `import { supabase } from '../lib/supabase'`
- `web/src/services/favoriteService.ts` (línea 1): `import { supabase } from '../lib/supabase'`
- `web/src/services/addressService.ts` (línea 1): `import { supabase } from '../lib/supabase'`
- `web/src/services/storageService.ts` (línea 1): `import { supabase } from '../lib/supabase'` — usa `supabase.storage`
- `web/src/context/AuthContext.tsx` (línea 2): `import { supabase } from '../lib/supabase'` — autenticación vía `supabase.auth`
- `web/package.json` (línea 16): `"@supabase/supabase-js": "^2.43.0"` como dependencia

**ÚNICO servicio que usa el backend API:**
- `web/src/services/paymentService.ts` (línea 3): `const API_URL = import.meta.env.VITE_API_URL;` — solo para endpoints de Mercado Pago (`/api/payments/create-preference`, `/api/payments/status/:paymentId`, `/api/payments/refund`)

### Conclusión Frontend
- El frontend web **no tiene configuración de despliegue en producción**
- Se conecta **directamente a Supabase** para todos los datos (productos, categorías, pedidos, favoritos, direcciones, promociones, autenticación, storage)
- Solo usa el backend API para operaciones de Mercado Pago

---

## 2. BACKEND

### Tecnología
- Node.js + Express + TypeScript + Prisma ORM
- Archivo: `backend/package.json`

### ¿Dónde está desplegado realmente?
**Render** (confirmado con evidencia).

Evidencia:
1. **`backend/package.json` (línea 12)**: `"render-start": "npx prisma db push --accept-data-loss && node dist/index.js"`
   - Este es el script de inicio estándar de Render. Render ejecuta `render-start` automáticamente al desplegar.
2. **`android/lib/src/core/network/api_client.dart` (línea 17-18)**:
   ```dart
   static const String baseUrl =
       'https://recuerdos-de-papel-backend.onrender.com/api/admin';
   ```
   - La URL de producción del backend termina en `.onrender.com`
3. **No existe `render.yaml`** en el repositorio — la configuración de Render se hizo vía dashboard o mediante el script `render-start`

### Estructura de rutas del backend
- `backend/src/index.ts` (líneas 244-247):
  - `app.use('/api/auth', authRoutes)` — rutas públicas (login, register, orders)
  - `app.use('/api/orders', orderRoutes)` — rutas de pedidos
  - `app.use('/api/payments', MercadoPagoRoutes)` — rutas de Mercado Pago
  - `app.use('/api/admin', adminLimiter, adminRoutes)` — rutas admin (protegidas con JWT)
- `backend/src/modules/admin/routes/index.ts`: 40+ endpoints bajo `/api/admin/`

### Conclusión Backend
- El backend está desplegado en **Render**
- URL de producción: `https://recuerdos-de-papel-backend.onrender.com`
- No hay render.yaml en el repositorio

---

## 3. BASE DE DATOS

### ¿Qué motor de base de datos se utiliza?
**Supabase (PostgreSQL)** — confirmado con múltiples evidencias.

Evidencia:
1. **`backend/prisma/schema.prisma` (líneas 6-9)**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. **`backend/.env.example` (líneas 5-7)**:
   ```
   DATABASE_URL="postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"
   ```
3. **`backend/src/config/database.ts` (líneas 20-22)**:
   ```
   // No se usa DIRECT_URL (inaccesible desde esta red).
   // Se usa DATABASE_URL con Supabase Pooler (puerto 6543).
   logger.info('Usando DATABASE_URL con Supabase Pooler (puerto 6543)');
   ```
4. **`backend/src/modules/admin/services/index.ts` (líneas 34-87)**:
   - Función `poolerToDirectUrl()` que transforma URLs de Supabase Pooler a URLs directas
   - Comentario: `// Singleton PrismaClient with PgBouncer support`
   - Agrega `pgbouncer=true` a la URL de conexión
   - Comentario: `// Format: postgresql://postgres.PROJECT_REF:PASS@aws-0-REGION.pooler.supabase.com:6543/DB`
5. **`backend/prisma/migrations/init/migration.sql`**: Usa sintaxis PostgreSQL (UUID, `gen_random_uuid()`, `TIMESTAMP(3)`, `DOUBLE PRECISION`, `BOOLEAN`, `FOREIGN KEY`)
6. **`web/package.json` (línea 16)**: `"@supabase/supabase-js": "^2.43.0"`

### ¿Todas las conexiones apuntan a Supabase?
- **Backend**: Sí, usa `DATABASE_URL` con Supabase Pooler (configurado en `backend/src/modules/admin/services/index.ts`)
- **Web**: Sí, usa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (configurado en `web/src/lib/supabase.ts`)
- **Android**: No accede directamente a Supabase (usa el backend API)

### Inconsistencia detectada
- **`backend/README.md` (línea 10)**: Dice "SQLite" ❌
- **`backend/README.md` (línea 40)**: Muestra `DATABASE_URL="file:./dev.db"` ❌
- **`README.md` raíz (línea 90)**: Dice "SQLite" ❌
- **`docs/ARQUITECTURA.md` (línea 29)**: Dice "SQLite" ❌
- **`docker/docker-compose.yml` (línea 12)**: `DATABASE_URL=file:./dev.db` ❌ (solo para desarrollo local)

> **ESTO ES INCORRECTO.** El proyecto usa PostgreSQL vía Supabase, no SQLite. La documentación está desactualizada.

---

## 4. APK FLUTTER (Android)

### ¿Contra qué backend trabaja?
**Contra el backend en Render.**

Evidencia:
- **`android/lib/src/core/network/api_client.dart` (líneas 17-18)**:
  ```dart
  static const String baseUrl =
      'https://recuerdos-de-papel-backend.onrender.com/api/admin';
  ```
- **`android/lib/src/features/auth/auth_service.dart` (líneas 12-20)**: POST a `/auth/login` con email y password
- **`android/lib/src/features/auth/auth_service.dart` (líneas 55-62)**: GET a `/auth/profile`
- **`android/README.md` (línea 191)**: "Todos los endpoints consumen la API existente en `http://localhost:3000/api/admin`" (esto es INCORRECTO — la URL real de producción es la de Render)

### ¿Usa la misma API de producción?
**Sí.** La URL está hardcodeada en el código fuente del APK:
- `https://recuerdos-de-papel-backend.onrender.com/api/admin`
- No hay mecanismo de environment switching (no usa variables de entorno, no tiene build flavors)

### ¿Accede directamente a Supabase?
**No.** El README de Android (`android/README.md`, línea 94) dice: "No acceder directamente a Supabase". El APK solo consume el backend API.

---

## 5. VARIABLES DE ENTORNA

### Backend (`backend/.env.example`)
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
```

### Web (`web/.env.example`)
```
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_MERCADO_PAGO_PUBLIC_KEY=your-public-key
```

### Detección de servicios no autorizados
| Servicio | Encontrado | Evidencia |
|---|---|---|
| **Vercel** | ❌ No | No se encontró `vercel.json`, `vercel-build`, ni referencias a Vercel |
| **Netlify** | ❌ No | No se encontró `netlify.toml` ni referencias a Netlify |
| **Railway** | ❌ No | No se encontró `railway.json` ni referencias a Railway |
| **Firebase** | ❌ No | No se encontró `firebase.json`, `google-services.json` ni referencias a Firebase |
| **Supabase** | ✅ Sí | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `DATABASE_URL` con `.supabase.co` |
| **Render** | ✅ Sí | Script `render-start` en package.json + URL `.onrender.com` en APK |
| **Mercado Pago** | ✅ Sí | Variables `MERCADO_PAGO_*` en backend y `VITE_MERCADO_PAGO_PUBLIC_KEY` en web |

---

## 6. URLs DE PRODUCCIÓN

| # | URL | Uso | Archivo |
|---|---|---|---|
| 1 | `https://recuerdos-de-papel-backend.onrender.com` | Backend API (Render) | `android/lib/src/core/network/api_client.dart:18` |
| 2 | `https://recuerdos-de-papel-backend.onrender.com/api/admin` | Admin API (APK) | `android/lib/src/core/network/api_client.dart:18` |
| 3 | `https://your-project.supabase.co` | Supabase (placeholder en .env.example) | `web/.env.example:5`, `backend/.env.example:6` |
| 4 | `http://localhost:3000` | Backend dev server | `web/vite.config.ts:16`, `README.md:62` |
| 5 | `http://localhost:5173` | Web dev server | `web/vite.config.ts:13`, `README.md:65` |
| 6 | `http://localhost:3000/api` | API URL en web (dev) | `web/.env.example:2` |

> **Nota:** La URL real de Supabase de producción no está en el repositorio (usa placeholder `your-project.supabase.co`). Se configura vía variable de entorno `VITE_SUPABASE_URL` en producción.

---

## 7. CONFIGURACIÓN DE DEPLOY

### Frontend (Web)
**SIN CONFIGURACIÓN DE DESPLIEGUE EN PRODUCCIÓN.**

- No hay `render.yaml`, `vercel.json`, `netlify.toml`
- No hay `Dockerfile` de producción para web (el `docker/Dockerfile.web` es para Docker Compose local)
- No hay configuración de despliegue en `vite.config.ts`
- El `web/.env.example` solo tiene configuración de desarrollo (`http://localhost:3000/api`)
- **Posible escenario**: El frontend podría estar desplegado como sitio estático en algún hosting no configurado en el repositorio, o simplemente no está desplegado

### Backend
**Render** (configuración implícita, no explícita).

- **Build command**: `npm run build` (definido en `backend/package.json:8`: `"build": "npx prisma generate && tsc"`)
- **Start command**: `npm run render-start` (definido en `backend/package.json:12`: `"render-start": "npx prisma db push --accept-data-loss && node dist/index.js"`)
- **No existe `render.yaml`** en el repositorio
- La configuración de Render se hizo vía dashboard de Render (no vía archivo de configuración en el repo)
- El backend escucha en el puerto definido por `env.PORT` (default 3000)

### Docker (desarrollo local)
- `docker/docker-compose.yml`: Levanta backend, web y nginx en local
- Usa `DATABASE_URL=file:./dev.db` (SQLite) — **INCOMPATIBLE con producción**
- El backend en Docker no usa Supabase

---

## 8. CONFIGURACIONES INCORRECTAS O SOBRANTES

### 🔴 CRÍTICAS

| # | Problema | Archivo | Descripción |
|---|---|---|---|
| 1 | **Documentación dice SQLite pero usa PostgreSQL** | `README.md:90`, `backend/README.md:10,40`, `docs/ARQUITECTURA.md:29` | La documentación indica SQLite, pero el schema.prisma usa PostgreSQL, las migraciones usan sintaxis PostgreSQL y el .env.example tiene conexionión a Supabase |
| 2 | **Docker Compose usa SQLite** | `docker/docker-compose.yml:12` | `DATABASE_URL=file:./dev.db` es incompatible con la base de datos de producción (Supabase PostgreSQL) |
| 3 | **Web sin configuración de despliegue** | `web/` | No hay render.yaml, Dockerfile de producción ni configuración de hosting para el frontend web |
| 4 | **URL de producción hardcodeada en APK** | `android/lib/src/core/network/api_client.dart:17-18` | La URL `https://recuerdos-de-papel-backend.onrender.com` está hardcodeada sin posibilidad de cambiar entre entornos |

### 🟡 IMPORTANTES

| # | Problema | Archivo | Descripción |
|---|---|---|---|
| 5 | **README de Android dice localhost** | `android/README.md:191` | Dice que los endpoints consumen `http://localhost:3000/api/admin`, pero la URL real de producción es `https://recuerdos-de-papel-backend.onrender.com/api/admin` |
| 6 | **API docs dicen localhost** | `docs/API.md:5` | La Base URL documentada es `http://localhost:3000/api` |
| 7 | **Swagger docs dicen localhost** | `backend/src/index.ts:62` | El servidor Swagger solo muestra `http://localhost:${env.PORT}` |
| 8 | **No existe render.yaml** | Repositorio | El backend usa Render pero no hay archivo de configuración `render.yaml` en el repo |
| 9 | **Backend README muestra SQLite** | `backend/README.md:40` | El ejemplo de configuración muestra `DATABASE_URL="file:./dev.db"` en lugar de PostgreSQL |

### 🟢 MENORES

| # | Problema | Archivo | Descripción |
|---|---|---|---|
| 10 | **VITE_API_URL solo para Mercado Pago** | `web/src/services/paymentService.ts:3` | La variable `VITE_API_URL` solo se usa para pagos, no para el resto de la app (que usa Supabase directamente) |
| 11 | **Vite proxy solo dev** | `web/vite.config.ts:14-18` | El proxy `/api` → `localhost:3000` solo funciona en desarrollo |
| 12 | **login_body.json y login_test.json** | Raíz del proyecto | Archivos de test con credenciales hardcodeadas (`test@test.com`/`test123`) |

---

## 9. MAPA DE DATOS

```
┌─────────────────────────────────────────────────────────┐
│                    ARQUITECTURA REAL                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐         ┌──────────────────────────┐  │
│  │  Web (React) │────────▶│  Supabase (PostgreSQL)   │  │
│  │  Vite        │         │  - products              │  │
│  │              │         │  - categories            │  │
│  │  - productos │         │  - families              │  │
│  │  - pedidos   │         │  - subfamilies           │  │
│  │  - auth      │         │  - orders                │  │
│  │  - storage   │         │  - users                 │  │
│  │              │         │  - favorites             │  │
│  │  - payments  │───API──▶│  - addresses             │  │
│  │  (MP)        │         │  - promotions            │  │
│  └──────────────┘         │  - flyers                │  │
│                           │  - settings              │  │
│  ┌──────────────┐         │  - admin_logs            │  │
│  │  APK (Flutter)│────────▶│                          │  │
│  │              │  API    │  (mismo Supabase)        │  │
│  │  - admin     │  JWT    └──────────────────────────┘  │
│  │  - CRUD      │                                       │
│  │  - stats     │         ┌──────────────────────────┐  │
│  └──────────────┘         │  Backend (Render)        │  │
│                           │  Node.js + Express       │  │
│                           │  Prisma ORM              │  │
│                           │  - /api/admin/*          │  │
│                           │  - /api/payments/*       │  │
│                           │  - /api/auth/*           │  │
│                           │  - /api/orders/*         │  │
│                           └──────────────────────────┘  │
│                                                          │
│  URL de producción:                                      │
│  https://recuerdos-de-papel-backend.onrender.com         │
└─────────────────────────────────────────────────────────┘
```

---

## 10. CONCLUSIONES

1. **El proyecto NO usa Vercel, Netlify, Railway ni Firebase.** No se encontraron referencias a ninguno de estos servicios en el código, configuraciones o variables de entorno.

2. **El backend está desplegado en Render.** Evidencia: script `render-start` en `backend/package.json` y URL `.onrender.com` hardcodeada en el APK.

3. **La base de datos es Supabase (PostgreSQL).** Evidencia: `schema.prisma` con `provider = "postgresql"`, `.env.example` con conexión a `.supabase.co`, y código de pooler en `services/index.ts`.

4. **El frontend web se conecta DIRECTAMENTE a Supabase.** No através del backend API. Solo usa el backend para operaciones de Mercado Pago.

5. **El APK Flutter consume el backend en Render.** URL hardcodeada: `https://recuerdos-de-papel-backend.onrender.com/api/admin`.

6. **La documentación está desactualizada.** Múltiples archivos (README.md, backend/README.md, docs/ARQUITECTURA.md) indican SQLite, pero el proyecto usa PostgreSQL vía Supabase.

7. **El frontend web no tiene configuración de despliegue.** No hay render.yaml, Dockerfile de producción ni configuración de hosting.

8. **El Docker Compose local usa SQLite**, lo cual es incompatible con la base de datos de producción (Supabase PostgreSQL).

9. **No existe `render.yaml`** en el repositorio, a pesar de que el backend está en Render. La configuración se hizo vía dashboard.

---

*Fin del informe de auditoría.*
