# AUDITORÍA DE RECUPERACIÓN 03 - COMPARACIÓN WEB vs BACKEND (PASO 5)

**Fecha:** 2026-07-26
**Objetivo:** Comparar los endpoints que consume la web contra los que expone el backend
**Estado:** 🔴 BLOQUEANTE ENCONTRADO

---

## 1. MAPA DE ENDPOINTS: WEB vs BACKEND

### Estructura de montaje del backend
```
app.use('/api/auth', authRoutes);       → /api/auth/login, /api/auth/register, /api/auth/profile
app.use('/api/orders', orderRoutes);    → /api/orders (protegido con auth de usuario)
app.use('/api/payments', MercadoPagoRoutes); → /api/payments/create-preference, /api/payments/webhook
app.use('/api/admin', adminLimiter, adminRoutes); → /api/admin/products, /api/admin/categories, etc. (PROTEGIDO con JWT admin)
```

### Endpoints que la WEB consume vs lo que el BACKEND expone

| Web llama a | Backend tiene | ¿Coinciden? |
|-------------|---------------|-------------|
| `POST /auth/login` | `/api/auth/login` | ✅ Público |
| `POST /auth/register` | `/api/auth/register` | ✅ Público |
| `GET /auth/profile` | `/api/auth/profile` | ✅ Requiere auth usuario |
| `GET /products` | Solo en `/api/admin/products` (JWT admin) | ❌ **NO EXISTE como público** |
| `GET /products/:id` | Solo en `/api/admin/products/:id` (JWT admin) | ❌ **NO EXISTE como público** |
| `GET /categories` | Solo en `/api/admin/categories` (JWT admin) | ❌ **NO EXISTE como público** |
| `GET /families/category/:id` | Solo en `/api/admin/families/category/:id` (JWT admin) | ❌ **NO EXISTE como público** |
| `GET /subfamilies/family/:id` | Solo en `/api/admin/subfamilies/family/:id` (JWT admin) | ❌ **NO EXISTE como público** |
| `GET /promotions` | Solo en `/api/admin/promotions` (JWT admin) | ❌ **NO EXISTE como público** |
| `GET /flyers` | Solo en `/api/admin/flyers` (JWT admin) | ❌ **NO EXISTE como público** |
| `GET /orders` | `/api/orders` (auth usuario) | ✅ Requiere auth |
| `POST /orders` | `/api/orders` (auth usuario) | ✅ Requiere auth |
| `GET /favorites` | ❌ **NO EXISTE** | ❌ **NO EXISTE** |
| `POST /favorites` | ❌ **NO EXISTE** | ❌ **NO EXISTE** |
| `DELETE /favorites/:id` | ❌ **NO EXISTE** | ❌ **NO EXISTE** |
| `GET /addresses` | ❌ **NO EXISTE** | ❌ **NO EXISTE** |
| `POST /payments/create-preference` | `/api/payments/create-preference` | ✅ Público |

---

## 2. DISCREPANCIAS CRÍTICAS

### 🔴 BLOQUEANTE: La web no puede obtener datos del catálogo

La web necesita estos endpoints PÚBLICOS de solo lectura que el backend NO expone:

| Endpoint Necesario | Función |
|-------------------|---------|
| `GET /api/products` | Listar productos activos para el catálogo |
| `GET /api/products/:id` | Ver detalle de producto |
| `GET /api/categories` | Listar categorías activas |
| `GET /api/families/category/:categoryId` | Filtrar familias por categoría |
| `GET /api/subfamilies/family/:familyId` | Filtrar subfamilias por familia |
| `GET /api/promotions` | Listar promociones activas |
| `GET /api/flyers` | Listar flyers activos |

El backend solo tiene estos endpoints bajo `/api/admin/` que requiere autenticación JWT de administrador.

### 🔴 BLOQUEANTE: Faltan endpoints de favoritos y direcciones

| Endpoint Necesario | Función |
|-------------------|---------|
| `GET /api/favorites` | Listar favoritos del usuario |
| `POST /api/favorites` | Agregar a favoritos |
| `DELETE /api/favorites/:productId` | Quitar de favoritos |
| `GET /api/addresses` | Listar direcciones del usuario |
| `POST /api/addresses` | Crear dirección |
| `PUT /api/addresses/:id` | Actualizar dirección |
| `DELETE /api/addresses/:id` | Eliminar dirección |

---

## 3. CONCLUSIÓN

**La web compila y el servidor de desarrollo corre, pero NO PUEDE OBTENER DATOS** porque:

1. **El backend no expone endpoints públicos de lectura** para productos, categorías, familias, subfamilias, promociones y flyers. Todos están bajo `/api/admin/` con JWT de administrador.

2. **El backend no tiene endpoints** para favoritos ni direcciones de clientes.

3. **La web no puede funcionar** sin estos endpoints.

### Posibles soluciones (requieren modificar backend):
1. Agregar rutas públicas de solo lectura en `/api/` para productos, categorías, familias, subfamilias, promociones y flyers
2. Agregar rutas protegidas (con auth de usuario) para favoritos y direcciones

### Archivos que necesitan modificarse en el backend:
- `backend/src/index.ts` - Agregar nuevas rutas
- Crear `backend/src/routes/publicRoutes.ts` - Rutas públicas de lectura
- Crear `backend/src/routes/clientRoutes.ts` - Rutas protegidas para clientes (favoritos, direcciones)
- Crear controladores públicos en `backend/src/controllers/`

**Según las reglas establecidas, NO modifico el backend.** Esto queda documentado como hallazgo para que el propietario decida cómo proceder.

---

## 4. ESTADO ACTUAL DE LA WEB

| Aspecto | Estado |
|---------|--------|
| Estructura de archivos | ✅ Completa (31 archivos) |
| Dependencias instaladas | ✅ npm install exitoso |
| Compilación TypeScript | ✅ BUILD SUCCESSFUL |
| Servidor de desarrollo | ✅ Corriendo en localhost:5173 |
| Conexión con backend | ❌ **BLOQUEADA** - Faltan endpoints públicos |
| Catálogo de productos | ❌ No puede cargar datos |
| Autenticación | ⚠️ Parcial (login/register existen pero no se probaron) |
| Carrito de compras | ⚠️ Funciona con localStorage (sin backend) |
| Checkout | ⚠️ Parcial (sin conexión a backend) |