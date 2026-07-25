# AUDITORÍA DE SINCRONIZACIÓN APK ↔ WEB

**Fecha:** 25/07/2026
**Auditor:** Sistema de Auditoría Automatizada
**Objetivo:** Verificar que TODO lo administrado desde el APK se refleje automáticamente en la Web. Confirmar que ambos utilizan EXACTAMENTE las mismas tablas, campos y esquema.

---

## RESUMEN EJECUTIVO

| Entidad | Sincronizado | Estado |
|---|---|---|
| **Productos** | ✅ Sí | Misma tabla, campos coinciden. Web lee directamente de Supabase |
| **Categorías** | ✅ Sí | Misma tabla, campos coinciden |
| **Familias** | ✅ Sí | Misma tabla, campos coinciden |
| **Subfamilias** | ✅ Sí | Misma tabla, campos coinciden |
| **Promociones** | ✅ Sí | Misma tabla, campos coinciden |
| **Flyers** | ❌ **NO** | Web no tiene servicio de flyers |
| **Configuración** | ❌ **NO** | Web no tiene servicio de settings |
| **Pedidos** | ❌ **NO** | **Field name mismatch crítico** (`user_id` vs `userId`) |
| **Favoritos** | ✅ Sí | Misma tabla, campos coinciden |
| **Imágenes** | ⚠️ Parcial | Formato OK, pero APK sube paths locales |

**Arquitectura de datos:**
- **APK** → Backend API (Render) → Prisma → **Supabase PostgreSQL**
- **Web** → **Supabase JS Client** → **Supabase PostgreSQL**

Ambos leen de la **misma base de datos Supabase**, por lo que los cambios del APK deberían verse inmediatamente en la Web. **El problema no es la arquitectura, sino inconsistencias en los nombres de campos y servicios faltantes en la Web.**

---

## 1. PRODUCTOS

### Estado: ✅ SINCRRONIZADO (con observaciones)

### Evidencia de tabla y campos

**Base de datos** (`backend/prisma/schema.prisma`, líneas 75-114):
- Tabla: `products`
- Columnas: `id`, `subfamilyId`, `name`, `slug`, `code`, `shortDescription`, `description`, `normalPrice`, `webPrice`, `offerPrice`, `discountPercentage`, `cost`, `status`, `isFeatured`, `isNew`, `productionTime`, `displayOrder`, `labels`, `images`, `features`, `isOffer`, `isActive`, `stock`, `deletedAt`, `createdAt`, `updatedAt`

**Web** (`web/src/services/productService.ts`):
- Usa `supabase.from('products')` ✅
- Filtra por `.eq('isActive', true)` ✅ (coincide con columna `isActive`)
- Filtra por `.eq('isFeatured', ...)` ✅ (coincide con columna `isFeatured`)
- Filtra por `.eq('isOffer', ...)` ✅ (coincide con columna `isOffer`)
- Ordena por `.order('displayOrder', ...)` ✅ (coincide con columna `displayOrder`)
- Lee `normalPrice` ✅ (coincide con columna `normalPrice`)
- Lee `webPrice` ✅ (coincide con columna `webPrice`)
- Lee `images` como string JSON ✅ (coincide con columna `images` String)
- Lee `labels` como string JSON ✅ (coincide con columna `labels` String)
- Lee `slug` ✅ (coincide con columna `slug`)
- Lee `shortDescription` ✅ (coincide con columna `shortDescription`)
- Lee `offerPrice` ✅ (coincide con columna `offerPrice`)
- Lee `discountPercentage` ✅ (coincide con columna `discountPercentage`)

**APK** (`android/lib/src/core/providers/providers.dart`, líneas 169-224):
- Usa API `/products` ✅
- Lee `price` (mapeado desde `normalPrice` por el backend) ⚠️
- Lee `webPrice` ✅
- Lee `images` como array ✅ (parseado por el backend)
- Lee `isOffer` ✅
- Lee `isActive` ✅
- Lee `stock` ✅
- Lee `cost` ✅
- Lee `status` ✅
- **NO recibe**: `slug`, `isFeatured`, `isNew`, `displayOrder`, `labels`, `offerPrice`, `discountPercentage`, `shortDescription` ❌

**Backend** (`backend/src/modules/admin/services/index.ts`, función `mapProduct`, líneas 96-126):
- Mapea `p.normalPrice` → `price` (cambia el nombre del campo) ⚠️
- Mapea `p.images` → `JSON.parse(p.images)` → `images: string[]` (cambia el formato) ⚠️
- **NO incluye en el mapeo**: `slug`, `isFeatured`, `isNew`, `displayOrder`, `labels`, `offerPrice`, `discountPercentage`, `shortDescription` ❌

### Verificación de pruebas

| Prueba | Resultado | Evidencia |
|---|---|---|
| Crear producto desde APK | ✅ Verá en Web | Ambos leen de la misma tabla `products` |
| Editar producto desde APK | ✅ Verá en Web | La Web lee directamente de Supabase |
| Cambiar precio desde APK | ✅ Verá en Web | `normalPrice` y `webPrice` están en la tabla |
| Desactivar producto desde APK | ✅ Desaparecerá de Web | Web filtra por `isActive: true` |
| Activar producto desde APK | ✅ Volverá a mostrarse | Web filtra por `isActive: true` |
| Eliminar producto desde APK | ✅ Desaparecerá de Web | `deleteProduct` hace borrado lógico (`deletedAt`) |

### Issues detectados

| # | Problema | Archivo | Impacto |
|---|---|---|---|
| P1 | Backend `mapProduct` no incluye `slug`, `isFeatured`, `isNew`, `displayOrder`, `labels`, `offerPrice`, `discountPercentage`, `shortDescription` | `backend/src/modules/admin/services/index.ts:96-126` | El APK no recibe estos campos. La Web sí los recibe (lee directamente de Supabase) |
| P2 | Backend mapea `normalPrice` → `price` | `backend/src/modules/admin/services/index.ts:102` | Inconsistencia de nombres entre API y DB |
| P3 | No existe endpoint `/products/:id/order` en backend | `backend/src/modules/admin/routes/index.ts` | El APK llama a `updateProductOrder` pero el backend no tiene esta ruta |

---

## 2. CATEGORÍAS

### Estado: ✅ SINCRRONIZADO

### Evidencia

**Base de datos** (`backend/prisma/schema.prisma`, líneas 29-41):
- Tabla: `categories`
- Columnas: `id`, `name`, `description`, `order`, `isActive`, `createdAt`, `updatedAt`

**Web** (`web/src/services/categoryService.ts`):
- Usa `supabase.from('categories')` ✅
- Lee `.select('*')` ✅
- Filtra por `.eq('isActive', true)` ✅
- Ordena por `.order('order')` ✅

**APK** (`android/lib/src/core/providers/providers.dart`, líneas 227-251):
- Usa API `/categories` ✅
- Lee: `id`, `name`, `description`, `order`, `isActive` ✅

**Backend** (`backend/src/modules/admin/services/index.ts`, líneas 300-333):
- Usa `prisma.category.findMany()` ✅
- Devuelve objetos Prisma directamente ✅

### Verificación de pruebas

| Prueba | Resultado |
|---|---|
| Crear categoría desde APK | ✅ Verá en Web |
| Editar categoría desde APK | ✅ Verá en Web |
| Eliminar categoría desde APK | ✅ Verá en Web |
| Cambiar orden desde APK | ✅ Verá en Web |
| Activar/Desactivar desde APK | ✅ Verá en Web |

---

## 3. FAMILIAS

### Estado: ✅ SINCRRONIZADO

### Evidencia

**Base de datos** (`backend/prisma/schema.prisma`, líneas 43-57):
- Tabla: `families`
- Columnas: `id`, `categoryId`, `name`, `description`, `order`, `isActive`, `createdAt`, `updatedAt`

**Web**: No tiene servicio standalone, pero obtiene familias a través de consultas anidadas en `productService.ts`:
```ts
family:families(
  id,
  name,
  category:categories(
    id,
    name
  )
)
```
✅ Usa la tabla `families` correctamente

**APK** (`android/lib/src/core/providers/providers.dart`, líneas 254-281):
- Usa API `/families` ✅
- Lee: `id`, `categoryId`, `name`, `description`, `order`, `isActive` ✅

**Backend** (`backend/src/modules/admin/services/index.ts`, líneas 336-376):
- Usa `prisma.family.findMany()` ✅

### Verificación de pruebas

| Prueba | Resultado |
|---|---|
| Crear familia desde APK | ✅ Verá en Web (a través de productos) |
| Editar familia desde APK | ✅ Verá en Web |
| Eliminar familia desde APK | ✅ Verá en Web |

---

## 4. SUBFAMILIAS

### Estado: ✅ SINCRRONIZADO

### Evidencia

**Base de datos** (`backend/prisma/schema.prisma`, líneas 59-73):
- Tabla: `subfamilies`
- Columnas: `id`, `familyId`, `name`, `description`, `order`, `isActive`, `createdAt`, `updatedAt`

**Web**: Obtiene subfamilias a través de consultas anidadas en `productService.ts`:
```ts
subfamily:subfamilies(
  id,
  name,
  family:families(...)
)
```
✅ Usa la tabla `subfamilies` correctamente

**APK** (`android/lib/src/core/providers/providers.dart`, líneas 284-311):
- Usa API `/subfamilies` ✅
- Lee: `id`, `familyId`, `name`, `description`, `order`, `isActive` ✅

**Backend** (`backend/src/modules/admin/services/index.ts`, líneas 379-419):
- Usa `prisma.subfamily.findMany()` ✅

### Verificación de pruebas

| Prueba | Resultado |
|---|---|
| Crear subfamilia desde APK | ✅ Verá en Web |
| Editar subfamilia desde APK | ✅ Verá en Web |
| Eliminar subfamilia desde APK | ✅ Verá en Web |

---

## 5. PROMOCIONES

### Estado: ✅ SINCRRONIZADO

### Evidencia

**Base de datos** (`backend/prisma/schema.prisma`, líneas 150-164):
- Tabla: `promotions`
- Columnas: `id`, `title`, `description`, `discount`, `code`, `startDate`, `endDate`, `isActive`, `isWeb`, `createdAt`, `updatedAt`

**Web** (`web/src/services/promotionService.ts`):
- Usa `supabase.from('promotions')` ✅
- Filtra por `.eq('isActive', true)` ✅
- Lee `isWeb` ✅

**APK** (`android/lib/src/core/providers/providers.dart`, líneas 314-350):
- Usa API `/promotions` ✅
- Lee: `id`, `title`, `description`, `discount`, `code`, `startDate`, `endDate`, `isActive`, `isWeb` ✅

**Backend** (`backend/src/modules/admin/services/index.ts`, líneas 422-475):
- Usa `prisma.promotion.findMany()` ✅
- Agrega `isWeb` al retorno ✅

### Verificación de pruebas

| Prueba | Resultado |
|---|---|
| Crear promoción desde APK | ✅ Verá en Web |
| Editar promoción desde APK | ✅ Verá en Web |
| Eliminar promoción desde APK | ✅ Verá en Web |
| Activar/Desactivar desde APK | ✅ Verá en Web |

---

## 6. FLYERS

### Estado: ❌ **NO SINCRRONIZADO**

### Evidencia

**Base de datos** (`backend/prisma/schema.prisma`, líneas 166-178):
- Tabla: `flyers`
- Columnas: `id`, `title`, `imageUrl`, `startDate`, `endDate`, `isActive`, `order`, `createdAt`, `updatedAt`

**APK** (`android/lib/src/features/flyers/flyers_service.dart`):
- Usa API `/flyers` ✅
- CRUD completo ✅

**Backend** (`backend/src/modules/admin/services/index.ts`, líneas 478-511):
- Usa `prisma.flyer.findMany()` ✅

**Web**: **NO EXISTE SERVICIO DE FLYERS** ❌
- `web/src/services/index.ts` no exporta ningún servicio de flyers
- No existe `web/src/services/flyersService.ts`
- No hay ninguna página que consulte la tabla `flyers`

### Impacto
- Flyers creados/editados/eliminados desde el APK **NO aparecerán en la Web**
- La Web no muestra flyers publicitarios

### Archivos afectados
- `web/src/services/index.ts` - falta export de flyersService
- No existe `web/src/services/flyersService.ts`

---

## 7. CONFIGURACIÓN (SETTINGS)

### Estado: ❌ **NO SINCRRONIZADO**

### Evidencia

**Base de datos** (`backend/prisma/schema.prisma`, líneas 229-238):
- Tabla: `settings`
- Columnas: `id`, `key`, `value`, `description`, `createdAt`, `updatedAt`

**APK** (`android/lib/src/features/settings/settings_service.dart`):
- Usa API `/settings` ✅
- CRUD completo ✅

**Backend** (`backend/src/modules/admin/services/index.ts`, líneas 621-647):
- Usa `prisma.setting.findMany()` ✅

**Web**: **NO EXISTE SERVICIO DE SETTINGS** ❌
- `web/src/services/index.ts` no exporta ningún servicio de settings
- No existe `web/src/services/settingsService.ts`
- No hay ninguna página que consulte la tabla `settings`

### Impacto
- Configuraciones (logo, banner, datos del negocio, redes sociales, WhatsApp, etc.) gestionadas desde el APK **NO aparecerán en la Web**

### Archivos afectados
- `web/src/services/index.ts` - falta export de settingsService
- No existe `web/src/services/settingsService.ts`

---

## 8. PEDIDOS

### Estado: ❌ **NO SINCRRONIZADO** (Field name mismatch crítico)

### Evidencia

**Base de datos** (`backend/prisma/migrations/init/migration.sql`, líneas 152-177):
- Tabla: `orders`
- Columnas en **camelCase**: `userId`, `status`, `deliveryMethod`, `subtotal`, `discount`, `total`, `shippingCost`, `customerName`, `customerPhone`, `customerEmail`, `address`, `notes`, `paymentId`, `paymentStatus`, `paymentMethod`, `merchantOrderId`, `dateApproved`, `confirmedAt`, `cancelledAt`, `createdAt`, `updatedAt`

- Tabla: `order_items`
- Columnas en **camelCase**: `orderId`, `productId`, `quantity`, `price`, `createdAt`

**Web** (`web/src/services/orderService.ts`):
- Usa `supabase.from('orders')` ✅
- **USA `user_id` (snake_case) EN LUGAR DE `userId` (camelCase)** ❌
  - Línea 14: `.eq('user_id', userId)` → DEBE SER `.eq('userId', userId)`
  - Línea 33: `query = query.eq('user_id', userId)` → DEBE SER `query = query.eq('userId', userId)`
  - Línea 46: `.insert([{ ...order, user_id: order.userId }])` → DEBE SER `.insert([{ ...order, userId: order.userId }])`
- Usa `order_id` (snake_case) EN LUGAR DE `orderId` (camelCase) ❌
  - Línea 53: `const orderItems = items.map(item => ({ ...item, order_id: orderId }))` → DEBE SER `const orderItems = items.map(item => ({ ...item, orderId: orderId }))`

**Web** (`web/src/pages/MyAddresses.tsx`):
- **USA `user_id` (snake_case) EN LUGAR DE `userId` (camelCase)** ❌
  - Línea 7: `user_id: string` → DEBE SER `userId: string`
  - Línea 18: `is_primary: boolean` → DEBE SER `isPrimary: boolean`
  - Línea 46: `.eq('user_id', user.id)` → DEBE SER `.eq('userId', user.id)`
  - Línea 63: `user_id: user.id` → DEBE SER `userId: user.id`
  - Línea 65: `is_primary: addresses.length === 0` → DEBE SER `isPrimary: addresses.length === 0`
  - Línea 104: `.update({ is_primary: false })` → DEBE SER `.update({ isPrimary: false })`
  - Línea 110: `.update({ is_primary: true })` → DEBE SER `.update({ isPrimary: true })`
  - Línea 115: `is_primary: a.id === id` → DEBE SER `isPrimary: a.id === id`

**Web** (`web/src/pages/Checkout.tsx`):
- Crea órdenes con `userId` (camelCase) ✅ (línea 83: `userId: user?.id || ''`)
- Pero luego llama a `createOrder(order, orderItems)` que usa `user_id` ❌

**APK** (`android/lib/src/core/providers/providers.dart`, líneas 386-453):
- Usa API `/orders` ✅
- Lee: `id`, `status`, `deliveryMethod`, `subtotal`, `discount`, `total`, `shippingCost`, `customerName`, `customerPhone`, `customerEmail`, `address`, `notes`, `paymentId`, `paymentStatus`, `dateApproved`, `items`, `createdAt`, `updatedAt` ✅

**Backend** (`backend/src/modules/admin/services/index.ts`, líneas 514-618):
- Usa `prisma.order.findMany()` ✅
- Devuelve `userId` (camelCase) ✅

### Impacto CRÍTICO
- **Los pedidos creados desde la Web NO se podrán consultar** porque `getOrders` usa `user_id` que no existe en la base de datos
- **Las direcciones creadas desde la Web NO se podrán consultar** porque usan `user_id` y `is_primary` que no existen
- **Los pedidos creados desde la Web fallarán al insertar** porque usan `user_id` y `order_id` que no existen como columnas

### Verificación de pruebas

| Prueba | Resultado | Evidencia |
|---|---|---|
| Pedido creado desde Web | ❌ No se verá en APK | `orderService.ts` usa `user_id` que no existe en DB |
| Cambio de estado desde APK | ❌ No se verá en Web | `orderService.ts` usa `user_id` para consultar |
| Pedido creado desde Web | ❌ Fallará al insertar | `orderService.ts` inserta con `user_id` y `order_id` |

---

## 9. FAVORITOS

### Estado: ✅ SINCRRONIZADO

### Evidencia

**Base de datos** (`backend/prisma/schema.prisma`, líneas 138-148):
- Tabla: `favorites`
- Columnas: `id`, `userId`, `productId`, `createdAt`

**Web** (`web/src/services/favoriteService.ts`):
- Usa `supabase.from('favorites')` ✅
- Usa `.eq('userId', userId)` ✅ (camelCase correcto)
- Usa `.eq('productId', productId)` ✅ (camelCase correcto)
- Usa `supabase.from('favorites').select('*, product:products(*)')` ✅

**APK**: No aplica (favoritos son para clientes, no para admin)

### Verificación de pruebas

| Prueba | Resultado |
|---|---|
| Favoritos funcionan correctamente | ✅ Sí |

---

## 10. IMÁGENES

### Estado: ⚠️ PARCIALMENTE SINCRRONIZADO

### Evidencia

**Base de datos** (`backend/prisma/schema.prisma`, línea 94):
- Columna: `images String?` (JSON array como string)

**Web** (`web/src/components/ProductCard.tsx`, líneas 9-20):
- Parsea `JSON.parse(product.images)` ✅
- Maneja tanto string como array ✅
- Extrae `parsed[0]?.url || parsed[0]` ✅

**Web** (`web/src/pages/ProductPage.tsx`, líneas 10-21):
- Parsea `JSON.parse(product.images)` ✅
- Maneja tanto string como array ✅

**Backend** (`backend/src/modules/admin/services/index.ts`, línea 104):
- `JSON.parse(p.images)` → devuelve `images: string[]` ✅

**APK** (`android/lib/src/core/providers/providers.dart`, líneas 211-215):
- Maneja tanto string como array ✅
- Parsea correctamente ✅

### Issue detectado

| # | Problema | Archivo | Impacto |
|---|---|---|---|
| P4 | APK guarda paths locales, no URLs de Supabase Storage | `android/lib/src/features/products/product_form_screen.dart` (según QA audit) | Las imágenes subidas desde el APK no serán accesibles desde la Web |

El QA audit (`android/docs/ANALISIS.md`, línea 219) confirma: "Imágenes productos guardan ruta local" ❌

---

## 11. VERIFICACIÓN DE ESQUEMA ANTIGUO

### Estado: ✅ NO HAY REFERENCIAS AL ESQUEMA VIEJO

### Verificación

| Referencia antigua | Encontrada | Evidencia |
|---|---|---|
| `subcategories` (tabla) | ❌ No | Web usa `subfamilies` ✅ |
| `product_images` (tabla) | ❌ No | Web usa `images` column en `products` ✅ |
| `categoryId` inexistente | ❌ No | `categoryId` existe en tabla `families` ✅ |
| `subcategoryId` inexistente | ❌ No | `subfamilyId` existe en tabla `products` ✅ |
| `user_id` (snake_case) | ✅ Sí (ERROR) | En `orderService.ts` y `MyAddresses.tsx` ❌ |
| `order_id` (snake_case) | ✅ Sí (ERROR) | En `orderService.ts` ❌ |
| `is_primary` (snake_case) | ✅ Sí (ERROR) | En `MyAddresses.tsx` ❌ |

### Comentario en tipos web
`web/src/types/index.ts` línea 54: `// Subfamilia (reemplaza Subcategory)` ✅
Confirma que el rename de `Subcategory` → `Subfamily` fue documentado.

---

## 12. MAPA DE DATOS

```
┌─────────────────────────────────────────────────────────────────┐
│                    SINCRONIZACIÓN DE DATOS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    API    ┌──────────────────────────┐        │
│  │  APK (Flutter)│──────────▶│  Backend (Render)        │        │
│  │  Admin Panel  │  JWT      │  Node.js + Express       │        │
│  │               │           │  Prisma ORM              │        │
│  │  - Products   │           │  - /api/admin/*          │        │
│  │  - Categories  │           │  - /api/payments/*       │        │
│  │  - Families    │           │  - /api/auth/*           │        │
│  │  - Subfamilies │           │  - /api/orders/*         │        │
│  │  - Promotions  │           └──────────┬───────────────┘        │
│  │  - Flyers      │                      │ Prisma                │
│  │  - Settings    │                      ▼                       │
│  │  - Orders      │           ┌──────────────────────────┐        │
│  └──────────────┘           │  Supabase (PostgreSQL)    │        │
│                             │  - products                │        │
│  ┌──────────────┐           │  - categories              │        │
│  │  Web (React)  │──────────▶│  - families              │        │
│  │  Store        │  JS      │  - subfamilies           │        │
│  │               │  Client   │  - promotions            │        │
│  │  - Products   │           │  - flyers                │        │
│  │  - Categories  │           │  - settings              │        │
│  │  - Orders      │           │  - orders                │        │
│  │  - Favorites   │           │  - order_items           │        │
│  │  - Addresses   │           │  - addresses             │        │
│  │  - Promos      │           │  - favorites             │        │
│  │               │           │  - users                 │        │
│  │  ❌ Flyers     │           │  - admin_logs            │        │
│  │  ❌ Settings   │           └──────────────────────────┘        │
│  │  ❌ Orders*    │                                               │
│  │  ❌ Addresses* │                                               │
│  └──────────────┘                                               │
│                                                                 │
│  * = Field name mismatch (user_id vs userId)                    │
│  ❌ = Missing service in Web                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. RESUMEN DE CORRECCIONES NECESARIAS

### 🔴 CRÍTICAS (Sincronización rota)

| # | Archivo | Corrección |
|---|---|---|
| 1 | `web/src/services/orderService.ts:14` | Cambiar `user_id` → `userId` |
| 2 | `web/src/services/orderService.ts:33` | Cambiar `user_id` → `userId` |
| 3 | `web/src/services/orderService.ts:46` | Cambiar `user_id` → `userId` |
| 4 | `web/src/services/orderService.ts:53` | Cambiar `order_id` → `orderId` |
| 5 | `web/src/services/addressService.ts:8` | Cambiar `user_id` → `userId` |
| 6 | `web/src/services/addressService.ts:29` | Cambiar `user_id` → `userId` |
| 7 | `web/src/services/addressService.ts:61` | Cambiar `is_primary` → `isPrimary` |
| 8 | `web/src/services/addressService.ts:68` | Cambiar `is_primary` → `isPrimary` |
| 9 | `web/src/pages/MyAddresses.tsx:7` | Cambiar `user_id` → `userId` |
| 10 | `web/src/pages/MyAddresses.tsx:18` | Cambiar `is_primary` → `isPrimary` |
| 11 | `web/src/pages/MyAddresses.tsx:46` | Cambiar `user_id` → `userId` |
| 12 | `web/src/pages/MyAddresses.tsx:63` | Cambiar `user_id` → `userId` |
| 13 | `web/src/pages/MyAddresses.tsx:65` | Cambiar `is_primary` → `isPrimary` |
| 14 | `web/src/pages/MyAddresses.tsx:104` | Cambiar `is_primary` → `isPrimary` |
| 15 | `web/src/pages/MyAddresses.tsx:110` | Cambiar `is_primary` → `isPrimary` |
| 16 | `web/src/pages/MyAddresses.tsx:115` | Cambiar `is_primary` → `isPrimary` |

### 🟡 IMPORTANTES (Funcionalidad faltante)

| # | Archivo | Corrección |
|---|---|---|
| 17 | `web/src/services/index.ts` | Agregar export de `flyersService` |
| 18 | No existe | Crear `web/src/services/flyersService.ts` |
| 19 | `web/src/services/index.ts` | Agregar export de `settingsService` |
| 20 | No existe | Crear `web/src/services/settingsService.ts` |

### 🟢 MENORES (Consistencia)

| # | Archivo | Corrección |
|---|---|---|
| 21 | `backend/src/modules/admin/services/index.ts:96-126` | Agregar `slug`, `isFeatured`, `isNew`, `displayOrder`, `labels`, `offerPrice`, `discountPercentage`, `shortDescription` al mapeo de productos |
| 22 | `backend/src/modules/admin/services/index.ts:102` | Considerar mantener `normalPrice` en lugar de mapear a `price` |
| 23 | `backend/src/modules/admin/routes/index.ts` | Agregar endpoint `PATCH /products/:id/order` |

---

## 14. CONCLUSIONES

1. **La arquitectura es correcta**: APK → Backend API → Supabase PostgreSQL, y Web → Supabase JS Client → Supabase PostgreSQL. Ambos leen de la misma base de datos.

2. **La sincronización funciona para la mayoría de entidades**: Productos, Categorías, Familias, Subfamilias, Promociones y Favoritos están correctamente sincronizados.

3. **Hay 3 bloqueos críticos de sincronización**:
   - **Pedidos**: Field name mismatch (`user_id` vs `userId`) rompe la consulta e inserción de pedidos desde la Web
   - **Direcciones**: Field name mismatch (`user_id`, `is_primary` vs `userId`, `isPrimary`) rompe la gestión de direcciones desde la Web
   - **Flyers y Settings**: La Web no tiene servicios para estas entidades, por lo que no se mostrarán

4. **No hay referencias al esquema antiguo** (`subcategories`, `product_images`): El rename a `subfamilies` fue completado correctamente.

5. **Las imágenes funcionan en formato**, pero el APK sube paths locales en lugar de URLs de Supabase Storage, lo que significa que las imágenes no serán accesibles desde la Web.

6. **El backend no expone todos los campos del producto** a través de la API, pero esto no afecta la sincronización porque la Web lee directamente de Supabase.

---

*Fin del informe de auditoría de sincronización.*
