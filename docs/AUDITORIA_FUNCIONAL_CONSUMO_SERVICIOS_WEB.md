# AUDITORÍA FUNCIONAL: CONSUMO DE SERVICIOS EN LA WEB

**Fecha:** 25/07/2026  
**Auditor:** Auditoría de Integración Web  
**Objetivo:** Verificar pantalla por pantalla que la Web consuma REALMENTE los datos desde los servicios de Supabase, y que los cambios realizados desde el APK se reflejen automáticamente.  
**Metodología:** Análisis estático de código fuente de cada página y componente, trazando cada dato mostrado hacía el servicio que lo provee.

---

## RESUMEN EJECUTIVO

| Concepto | Estado |
|---|---|
| Servicios creados en web/src/services/ | ✅ flyersService.ts, settingsService.ts, productService.ts, etc. |
| Servicios exportados en index.ts | ✅ flyersService y settingsService están exportados |
| **Páginas que USAN settingsService** | ❌ **CERO** — El servicio existe pero ninguna página lo importa |
| **Páginas que USAN flyersService** | ❌ **CERO** — El servicio existe pero ninguna página lo importa |
| Páginas que USAN productService | ✅ Home (destacados), Products, ProductPage, Subcategories |
| Páginas que USAN orderService | ✅ MyOrders, OrderDetail, Checkout |
| Field names camelCase consistentes | ✅ orderService, addressService, MyAddresses corregidos |

**Conclusión:** La sincronización de datos no está completada. Los servicios de flyers y settings fueron creados (como indica el informe anterior), pero **ninguna pantalla de la Web los consume**. El logo, el banner, los flyers, el WhatsApp, las redes sociales y los datos del negocio siguen siendo **hardcodeados**. La Web no "usa" esos servicios.

---

## MAPA DE ARCHIVOS CLAVE

### Servicios (capa de datos)
| Archivo | ¿Existe? | ¿Exportado en index.ts? | ¿Usado por alguna página? |
|---|---|---|---|
| `web/src/services/settingsService.ts` | ✅ Sí | ✅ Sí | ❌ **NO** |
| `web/src/services/flyersService.ts` | ✅ Sí | ✅ Sí | ❌ **NO** |
| `web/src/services/productService.ts` | ✅ Sí | ✅ Sí | ✅ Sí |
| `web/src/services/categoryService.ts` | ✅ Sí | ✅ Sí | Parcial (CategoriesSection, Header) |
| `web/src/services/promotionService.ts` | ✅ Sí | ✅ Sí | ✅ Sí (Promotions) |
| `web/src/services/orderService.ts` | ✅ Sí | ✅ Sí | ✅ Sí (MyOrders, OrderDetail) |
| `web/src/services/addressService.ts` | ✅ Sí | ✅ Sí | Parcial (MyAddresses usa supabase directo) |
| `web/src/services/favoriteService.ts` | ✅ Sí | ✅ Sí | ✅ Sí (Favorites) |

---

## 1. PANTALLA DE INICIO (Home)

**Archivo:** `web/src/pages/Home.tsx`  
**Componentes:** HeroSection, CategoriesSection, FeaturedProductsSection, WhyChooseUsSection

### 1.1 Logo

| Ítem | Detalle |
|---|---|
| **¿Desde qué servicio debería venir?** | `settingsService.getLogo()` — clave `logo` en tabla `settings` |
| **¿Desde dónde viene realmente?** | `web/src/components/Header.tsx` línea 55 — **HARDCODEADO como texto**: `<span className="text-2xl font-bold text-primary-600">RECUERDOS DE PAPEL</span>` |
| **¿Importa settingsService?** | ❌ No — Header.tsx no importa settingsService |
| **¿Refleja cambios del APK?** | ❌ **NO** — Si cambiás el logo desde el APK, la Web sigue mostrando el texto "RECUERDOS DE PAPEL" |

### 1.2 Banner principal

| Ítem | Detalle |
|---|---|
| **¿Desde qué servicio debería venir?** | `settingsService.getBanner()` — clave `banner` en tabla `settings` |
| **¿Desde dónde viene realmente?** | `web/src/components/HeroSection.tsx` línea 6 — **HARDCODEADO**: `bg-[url('https://images.unsplash.com/photo-1513364726-976a1a0a00b0?...')]` |
| **¿Importa settingsService?** | ❌ No — HeroSection.tsx no importa settingsService |
| **¿Refleja cambios del APK?** | ❌ **NO** — El banner es una imagen de Unsplash fija, no se lee de la base de datos |

### 1.3 Flyers

| Ítem | Detalle |
|---|---|
| **¿Desde qué servicio debería venir?** | `flyersService.getFlyers()` — tabla `flyers`, filtra por `isActive: true` |
| **¿Desde dónde viene realmente?** | **NO EXISTE** — Home.tsx no incluye ningún componente de flyers. No hay ningún componente en toda la Web que llame a `getFlyers()` |
| **¿Importa flyersService?** | ❌ No — Ningún archivo en `web/src/` importa flyersService |
| **¿Refleja cambios del APK?** | ❌ **NO** — Flyers creados/editados/eliminados desde el APK no aparecen en la Web porque la Web no los consulta |

### 1.4 Productos destacados

| Ítem | Detalle |
|---|---|
| **¿Desde qué servicio debería venir?** | `productService.getProducts(1, 8, { isFeatured: true })` |
| **¿Desde dónde viene realmente?** | `web/src/components/FeaturedProductsSection.tsx` línea 15 — `await getProducts(1, 8, { isFeatured: true })` |
| **¿Importa productService?** | ✅ Sí — `import { getProducts } from '../services/productService'` |
| **¿Filtra por isFeatured?** | ✅ Sí — `{ isFeatured: true }` |
| **¿Filtra por isActive?** | ✅ Sí — productService.ts línea 27: `.eq('isActive', true)` |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — Si marcás un producto como destacado desde el APK, aparecerá en "Productos Destacados" al recargar. Si desactivás un producto, desaparecerá |

### 1.5 Categorías (en Home)

| Ítem | Detalle |
|---|---|
| **¿Desde qué servicio debería venir?** | `productService.getCategories()` o `categoryService.getCategories()` |
| **¿Desde dónde viene realmente?** | `web/src/components/CategoriesSection.tsx` línea 26 — `await getCategories()` desde `categoryService` |
| **¿Filtra por isActive?** | ⚠️ **NO** — `categoryService.getCategories()` (línea 4-12 de categoryService.ts) NO filtra por `isActive`. Solo ordena por `order` |
| **¿Refleja cambios del APK?** | ⚠️ **PARCIAL** — Categorías creadas/editadas aparecen, pero categorías desactivadas desde el APK **siguen mostrándose** en la Web porque no hay filtro de isActive |

---

## 2. PANTALLA DE CATÁLOGO (Products)

**Archivo:** `web/src/pages/Products.tsx`  
**Componentes:** ProductFilters, ProductCard, ProductPagination

### 2.1 Productos

| Ítem | Detalle |
|---|---|
| **Servicio** | `productService.getProducts(page, 12, filters)` |
| **¿Importa productService?** | ✅ Sí — línea 3 |
| **¿Filtra por isActive?** | ✅ Sí — productService.ts línea 27 |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — Crear/editar/desactivar productos desde el APK se refleja al recargar |

### 2.2 Categorías (filtro)

| Ítem | Detalle |
|---|---|
| **Servicio** | `productService.getCategories()` — importado en ProductFilters.tsx línea 2 |
| **¿Filtra por isActive?** | ✅ Sí — productService.getCategories() línea 136: `.eq('isActive', true)` |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — Categorías desactivadas desde el APK no aparecen en el filtro |

### 2.3 Familias (filtro)

| Ítem | Detalle |
|---|---|
| **Servicio** | `productService.getFamiliesByCategory(categoryId)` |
| **¿Filtra por isActive?** | ✅ Sí — productService.ts línea 148: `.eq('isActive', true)` |
| **¿Refleja cambios del APK?** | ✅ **SÍ** |

### 2.4 Subfamilias (filtro)

| Ítem | Detalle |
|---|---|
| **Servicio** | `productService.getSubfamiliesByFamily(familyId)` |
| **¿Filtra por isActive?** | ✅ Sí — productService.ts línea 166: `.eq('isActive', true)` |
| **¿Refleja cambios del APK?** | ✅ **SÍ** |

### 2.5 Precio

| Ítem | Detalle |
|---|---|
| **Servicio** | Datos del producto desde `productService.getProducts()` |
| **Campo usado** | `product.webPrice` — ProductCard.tsx línea 70 |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — Si cambiás el precio desde el APK, se refleja al recargar |

### 2.6 Oferta

| Ítem | Detalle |
|---|---|
| **Servicio** | Datos del producto desde `productService.getProducts()` |
| **Campo usado** | `hasLabel(product, 'offer')` — ProductCard.tsx línea 51, que parsea `product.labels` JSON |
| **¿Filtra por isOffer?** | ⚠️ No filtra en la query, pero muestra la etiqueta "OFERTA" si el label está presente |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — Si marcás un producto como oferta desde el APK, aparece la etiqueta "OFERTA" |

### 2.7 Destacado

| Ítem | Detalle |
|---|---|
| **Servicio** | `productService.getProducts()` con filtro `isFeatured` |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — En la página de inicio (FeaturedProductsSection) se filtra por `isFeatured: true` |

### 2.8 Estado Activo

| Ítem | Detalle |
|---|---|
| **Servicio** | `productService.getProducts()` |
| **Campo usado** | `.eq('isActive', true)` — productService.ts línea 27 |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — Si desactivás un producto desde el APK, desaparece del catálogo |

---

## 3. PANTALLA DE PRODUCTO INDIVIDUAL (ProductPage)

**Archivo:** `web/src/pages/ProductPage.tsx`

### 3.1 Imágenes

| Ítem | Detalle |
|---|---|
| **Servicio** | `productService.getProductById(id)` |
| **Campo usado** | `product.images` — parseado como JSON en `getProductImages()` línea 10 |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — Si cambiás las imágenes desde el APK, se refleja al recargar (asumiendo que las URLs sean válidas) |

### 3.2 Precio

| Ítem | Detalle |
|---|---|
| **Servicio** | `productService.getProductById(id)` |
| **Campo usado** | `product.webPrice` — línea 197 |
| **¿Refleja cambios del APK?** | ✅ **SÍ** |

### 3.3 Promoción / Oferta

| Ítem | Detalle |
|---|---|
| **Servicio** | `productService.getProductById(id)` |
| **Campo usado** | `hasLabel(product, 'offer')` — línea 151, parsea `product.labels` |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — La etiqueta "OFERTA" aparece si el label está presente |

### 3.4 Stock

| Ítem | Detalle |
|---|---|
| **Servicio** | `productService.getProductById(id)` |
| **Campo usado** | `product.stock` existe en el tipo pero **NO SE MUESTRA** en la pantalla |
| **¿Refleja cambios del APK?** | ❌ **NO APLICA** — El stock no se muestra en la Web. No hay indicación de disponibilidad por stock |

### 3.5 Información del producto

| Ítem | Detalle |
|---|---|
| **Servicio** | `productService.getProductById(id)` |
| **Campo usado** | `product.name` (línea 182), `product.description` (línea 192), `product.code` (línea 189), `product.brand` (línea 309), `product.productionTime` (línea 293) |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — Nombre, descripción, código, marca y tiempo de producción se reflejan |

### 3.6 WhatsApp del producto (botón)

| Ítem | Detalle |
|---|---|
| **Servicio debería venir** | `settingsService.getWhatsApp()` |
| **Desde dónde viene realmente** | `web/src/pages/ProductPage.tsx` línea 257 — **HARDCODEADO**: `href={`https://wa.me/5491112345678?text=...`}` |
| **¿Importa settingsService?** | ❌ No |
| **¿Refleja cambios del APK?** | ❌ **NO** — El número de WhatsApp está fijo en el código |

---

## 4. PANTALLA DE CONTACTO (Contact)

**Archivo:** `web/src/pages/Contact.tsx`

### 4.1 WhatsApp

| Ítem | Detalle |
|---|---|
| **Servicio debería venir** | `settingsService.getWhatsApp()` — clave `whatsapp` |
| **Desde dónde viene realmente** | `web/src/pages/Contact.tsx` línea 17 — **HARDCODEADO**: `+54 9 11 1234-5678` |
| **¿Importa settingsService?** | ❌ No |
| **¿Refleja cambios del APK?** | ❌ **NO** |

### 4.2 Redes sociales

| Ítem | Detalle |
|---|---|
| **Servicio debería venir** | `settingsService.getSocialLinks()` — claves `facebook`, `instagram`, `twitter`, `tiktok`, `youtube` |
| **Desde dónde viene realmente** | `web/src/pages/Contact.tsx` — **NO EXISTEN** los enlaces de redes sociales en esta página |
| **¿Importa settingsService?** | ❌ No |
| **¿Refleja cambios del APK?** | ❌ **NO** — No se muestran redes sociales en Contact |

### 4.3 Datos del negocio

| Ítem | Detalle |
|---|---|
| **Servicio debería venir** | `settingsService.getBusinessInfo()` — claves `business_name`, `business_email`, `business_phone`, `business_address` |
| **Desde dónde viene realmente** | `web/src/pages/Contact.tsx` líneas 17-23 — **HARDCODEADO**: WhatsApp `+54 9 11 1234-5678`, Email `info@recuerdosdepapel.com`, Dirección `Av. Corrientes 1234, CABA` |
| **¿Importa settingsService?** | ❌ No |
| **¿Refleja cambios del APK?** | ❌ **NO** |

### 4.4 Footer (presente en todas las páginas)

| Ítem | Detalle |
|---|---|
| **Archivo** | `web/src/components/Footer.tsx` |
| **WhatsApp** | Línea 73 — **HARDCODEADO**: `+54 9 11 1234-5678` |
| **Dirección** | Línea 76 — **HARDCODEADO**: `Av. Corrientes 1234, CABA` |
| **Email** | Línea 79 — **HARDCODEADO**: `info@recuerdosdepapel.com` |
| **Facebook** | Línea 18 — **HARDCODEADO**: `https://facebook.com` |
| **Instagram** | Línea 26 — **HARDCODEADO**: `https://instagram.com` |
| **¿Importa settingsService?** | ❌ No |
| **¿Refleja cambios del APK?** | ❌ **NO** — Todo el footer es estático |

### 4.5 About / Nosotros

| Ítem | Detalle |
|---|---|
| **Archivo** | `web/src/pages/About.tsx` |
| **Email de contacto** | Línea 29 — **HARDCODEADO**: `info@recuerdosdepapel.com` |
| **¿Importa settingsService?** | ❌ No |
| **¿Refleja cambios del APK?** | ❌ **NO** |

---

## 5. PANTALLA DE PEDIDOS (Orders)

### 5.1 MyOrders (Mis Pedidos)

| Ítem | Detalle |
|---|---|
| **Servicio** | `orderService.getOrders(userId)` |
| **¿Importa orderService?** | ✅ Sí — línea 4 |
| **Field names** | ✅ camelCase — `userId` (línea 14 de orderService.ts), `createdAt` (línea 15) |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — Pedidos creados/editados desde el APK aparecen en la Web |

### 5.2 OrderDetail (Detalle de Pedido)

| Ítem | Detalle |
|---|---|
| **Servicio** | `orderService.getOrderById(id, userId)` |
| **¿Importa orderService?** | ✅ Sí — línea 4 |
| **Field names** | ✅ camelCase — `userId`, `orderId`, `createdAt` |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — Cambios de estado desde el APK se reflejan |

### 5.3 Checkout (Finalizar Compra)

| Ítem | Detalle |
|---|---|
| **Servicio** | `orderService.createOrder(order, items)` |
| **¿Importa orderService?** | ✅ Sí — línea 5 |
| **Field names** | ✅ camelCase — `userId` (línea 83), `orderId` (línea 53 de orderService.ts) |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — Pedidos creados desde la Web usan field names correctos y aparecen en el APK |

### 5.4 Cancelar Pedido

| Ítem | Detalle |
|---|---|
| **Servicio** | `orderService.cancelOrder(id)` |
| **¿Importa orderService?** | ✅ Sí — OrderDetail.tsx línea 4, MyOrders.tsx línea 4 |
| **Field names** | ✅ camelCase |
| **¿Refleja cambios del APK?** | ✅ **SÍ** |

### 5.5 Orders (Seguimiento público de pedidos)

| Ítem | Detalle |
|---|---|
| **Archivo** | `web/src/pages/Orders.tsx` |
| **Servicio** | ❌ **NO** — Es una página estática con un formulario de búsqueda que no conecta a ningún servicio |
| **¿Funciona?** | ❌ No — El botón "Buscar" no tiene handler, no consulta la base de datos |
| **¿Refleja cambios del APK?** | ❌ **NO** — No hay integración |

### 5.6 MyAddresses (Mis Direcciones)

| Ítem | Detalle |
|---|---|
| **Servicio** | Usa `supabase` directamente (no importa addressService) |
| **Field names** | ✅ camelCase — `userId` (línea 46), `isPrimary` (línea 65, 104, 110, 115) |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — Field names corregidos |

---

## 6. PANTALLA DE PROMOCIONES (Promotions)

| Ítem | Detalle |
|---|---|
| **Servicio** | `promotionService.getPromotions()` |
| **¿Importa promotionService?** | ✅ Sí — línea 3 |
| **¿Filtra por isActive?** | ✅ Sí — promotionService.ts línea 8: `.eq('isActive', true)` |
| **¿Filtra por isWeb?** | ⚠️ No — No filtra por `isWeb`, muestra todas las promociones activas |
| **¿Refleja cambios del APK?** | ✅ **SÍ** — Promociones creadas/editadas/desactivadas desde el APK se reflejan |

---

## 7. PANTALLA DE FAVORITOS (Favorites)

| Ítem | Detalle |
|---|---|
| **Servicio** | `favoriteService.getFavorites(userId)` |
| **¿Importa favoriteService?** | ✅ Sí |
| **Field names** | ✅ camelCase — `userId`, `productId` |
| **¿Refleja cambios del APK?** | ✅ **SÍ** |

---

## 8. PANTALLA DE CARRITO (Cart)

| Ítem | Detalle |
|---|---|
| **Servicio** | No usa servicios de Supabase — usa `CartContext` (localStorage) |
| **Datos** | Productos agregados al carrito desde `productService` (ya cargados) |
| **¿Refleja cambios del APK?** | ⚠️ **PARCIAL** — El carrito usa datos en memoria/localStorage. Si un producto cambió de precio después de agregarlo, el carrito mantiene el precio viejo hasta recargar |

---

## RESUMEN POR PANTALLA

| Pantalla | Logo | Banner | Flyers | WhatsApp | Redes | Datos Negocio | Productos | Precio | Oferta | Destacado | Stock | Estado |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Inicio** | ❌ Hardcodeado | ❌ Hardcodeado | ❌ No existe | N/A | N/A | N/A | ✅ | ✅ | ✅ | ✅ | N/A | ✅ |
| **Catálogo** | N/A | N/A | N/A | N/A | N/A | N/A | ✅ | ✅ | ✅ | N/A | N/A | ✅ |
| **Producto** | N/A | N/A | N/A | ❌ Hardcodeado | N/A | N/A | ✅ | ✅ | ✅ | N/A | ❌ No muestra | N/A |
| **Contacto** | N/A | N/A | N/A | ❌ Hardcodeado | ❌ No existe | ❌ Hardcodeado | N/A | N/A | N/A | N/A | N/A | N/A |
| **Footer** | N/A | N/A | N/A | ❌ Hardcodeado | ❌ Hardcodeado | ❌ Hardcodeado | N/A | N/A | N/A | N/A | N/A | N/A |
| **Pedidos** | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ |
| **Promociones** | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ |
| **Favoritos** | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ |

**Leyenda:** ✅ = Consume desde servicio real | ❌ = Hardcodeado / no existe | N/A = No aplica

---

## PRUEBAS DE SINCRONIZACIÓN APK → WEB (VERIFICABLE)

### Pruebas que PASAN ✅

| Prueba | Resultado | Evidencia |
|---|---|---|
| Crear producto desde APK → Ver en Web | ✅ | productService.getProducts() lee de tabla `products` con `isActive: true` |
| Editar nombre de producto desde APK → Ver en Web | ✅ | ProductCard.tsx y ProductPage.tsx usan `product.name` |
| Modificar precio desde APK → Ver en Web | ✅ | ProductCard.tsx línea 70: `product.webPrice` |
| Desactivar producto desde APK → Desaparece de Web | ✅ | productService.ts línea 27: `.eq('isActive', true)` |
| Activar producto desde APK → Reaparece en Web | ✅ | Mismo filtro |
| Marcar producto como destacado desde APK → Aparece en "Destacados" | ✅ | FeaturedProductsSection.tsx: `getProducts(1, 8, { isFeatured: true })` |
| Marcar producto como oferta desde APK → Aparece etiqueta "OFERTA" | ✅ | ProductCard.tsx: `hasLabel(product, 'offer')` |
| Crear promoción desde APK → Ver en Web | ✅ | promotionService.getPromotions() con `isActive: true` |
| Desactivar promoción desde APK → Desaparece de Web | ✅ | Mismo filtro |
| Crear/editar categoría desde APK → Ver en Web | ✅ | ProductFilters.tsx: `getCategories()` con `isActive: true` |
| Crear/editar familia desde APK → Ver en Web | ✅ | ProductFilters.tsx: `getFamiliesByCategory()` con `isActive: true` |
| Crear/editar subfamilia desde APK → Ver en Web | ✅ | ProductFilters.tsx: `getSubfamiliesByFamily()` con `isActive: true` |
| Crear pedido desde Web → Ver en APK | ✅ | orderService.ts usa `userId` (camelCase) correctamente |
| Cambio de estado de pedido desde APK → Ver en Web | ✅ | orderService.ts usa `userId` correctamente |

### Pruebas que FALLAN ❌

| Prueba | Resultado | Evidencia |
|---|---|---|
| Cambiar logo desde APK → Ver en Web | ❌ | Header.tsx línea 55: texto hardcodeado "RECUERDOS DE PAPEL". No importa settingsService |
| Cambiar banner desde APK → Ver en Web | ❌ | HeroSection.tsx línea 6: imagen de Unsplash hardcodeada. No importa settingsService |
| Crear flyer desde APK → Ver en Web | ❌ | No existe ningún componente que llame a flyersService.getFlyers() |
| Editar flyer desde APK → Ver en Web | ❌ | Lo mismo |
| Cambiar WhatsApp desde APK → Ver en Web | ❌ | Contact.tsx línea 17: `+54 9 11 1234-5678` hardcodeado. Footer.tsx línea 73: lo mismo. ProductPage.tsx línea 257: `wa.me/5491112345678` hardcodeado |
| Cambiar redes sociales desde APK → Ver en Web | ❌ | Footer.tsx líneas 18, 26: URLs de Facebook e Instagram hardcodeadas |
| Cambiar datos del negocio desde APK → Ver en Web | ❌ | Contact.tsx líneas 17-23: email, dirección hardcodeados. Footer.tsx: lo mismo |
| Desactivar categoría desde APK → Desaparece de Home | ❌ | CategoriesSection.tsx usa `categoryService.getCategories()` que NO filtra por `isActive` |
| Ver stock de producto en Web | ❌ | ProductPage.tsx no muestra `product.stock` en ningún lugar |
| Seguimiento público de pedidos | ❌ | Orders.tsx es una página estática sin backend |

---

## ANÁLISIS DE SERVICIOS CREADOS PERO NO UTILIZADOS

### settingsService.ts — SERVICIO CREADO PERO NO CONSUMIDO

El servicio `web/src/services/settingsService.ts` fue creado con las siguientes funciones:
- `getSettings()`, `getSettingByKey(key)`, `getSettingsByKeys(keys)`
- `createSetting()`, `updateSetting()`, `upsertSetting()`, `deleteSetting()`
- Helpers: `getLogo()`, `getBanner()`, `getWhatsApp()`, `getSocialLinks()`, `getBusinessInfo()`

**Ninguna de estas funciones es llamada por ninguna página o componente de la Web.**

Las claves que busca el servicio (`logo`, `banner`, `whatsapp`, `facebook`, `instagram`, `business_name`, `business_email`, `business_phone`, `business_address`) coinciden parcialmente con las que administra el APK (que incluye `whatsapp`, `instagram`, `facebook`, `email`, `mp_alias`, `mp_cbu`, `mp_qr`, `cost_cordoba`, `cost_interior`, `production_time`).

### flyersService.ts — SERVICIO CREADO PERO NO CONSUMIDO

El servicio `web/src/services/flyersService.ts` fue creado con:
- `getFlyers()`, `getFlyerById(id)`, `createFlyer()`, `updateFlyer()`, `deleteFlyer()`, `toggleFlyerStatus()`

**Ninguna de estas funciones es llamada por ninguna página o componente de la Web.** No existe ningún componente de flyers (como un `FlyersSection.tsx` o `FlyerCarousel.tsx`).

---

## ARCHIVOS QUE NECESITAN CORRECCIÓN

### 🔴 CRÍTICAS — La Web no consume servicios creados

| # | Archivo | Problema | Impacto |
|---|---|---|---|
| 1 | `web/src/components/Header.tsx` | Logo hardcodeado como texto. No importa settingsService | Logo del APK no se muestra en Web |
| 2 | `web/src/components/HeroSection.tsx` | Banner hardcodeado con imagen de Unsplash. No importa settingsService | Banner del APK no se muestra en Web |
| 3 | `web/src/pages/Contact.tsx` | WhatsApp, email, dirección hardcodeados. No importa settingsService | Datos de contacto del APK no se muestran |
| 4 | `web/src/components/Footer.tsx` | WhatsApp, dirección, email, Facebook, Instagram hardcodeados. No importa settingsService | Todo el footer es estático |
| 5 | `web/src/pages/ProductPage.tsx` | WhatsApp hardcodeado (`wa.me/5491112345678`). No importa settingsService | WhatsApp del APK no se usa |
| 6 | `web/src/pages/About.tsx` | Email hardcodeado. No importa settingsService | Email del APK no se muestra |
| 7 | **No existe** | No hay componente de flyers en la Web | Flyers del APK no se muestran |
| 8 | `web/src/components/CategoriesSection.tsx` | Usa `categoryService.getCategories()` sin filtro `isActive` | Categorías desactivadas siguen mostrándose en Home |

### 🟡 IMPORTANTES — Mejoras funcionales

| # | Archivo | Problema | Impacto |
|---|---|---|---|
| 9 | `web/src/pages/ProductPage.tsx` | No muestra `product.stock` | No hay indicación de disponibilidad por stock |
| 10 | `web/src/pages/Orders.tsx` | Página estática sin backend | No se puede seguir pedidos públicamente |
| 11 | `web/src/components/ProductFilters.tsx` | `sortBy` se lee pero no se aplica en la query de getProducts | El ordenamiento no funciona |
| 12 | `web/src/pages/Promotions.tsx` | No filtra por `isWeb` | Promociones no web aparecen en la tienda |

---

## CONCLUSIÓN

**La sincronización de datos NO está completada.**

El informe anterior (`AUDITORIA_SINCRONIZACION_COMPLETADA.md`) declaró que la sincronización estaba "completada al 100%" porque:
1. Se corrigieron los field names de `orderService.ts` y `addressService.ts` (snake_case → camelCase) ✅
2. Se crearon los servicios `flyersService.ts` y `settingsService.ts` ✅

**Pero esto es insuficiente.** Tener un servicio creado no significa que la Web lo use. La auditoría funcional demuestra que:

- **`settingsService.ts` existe pero NO es importado por ninguna página.** El logo, banner, WhatsApp, redes sociales y datos del negocio siguen hardcodeados.
- **`flyersService.ts` existe pero NO es importado por ninguna página.** No hay ningún componente que muestre flyers.
- **El 80% de los datos de configuración que el APK administra no llegan a la Web.**

**La sincronización solo está completa para:** productos, categorías, familias, subfamilias, promociones, pedidos y favoritos.

**La sincronización NO está completa para:** logo, banner, flyers, WhatsApp, redes sociales, datos del negocio, stock (visualización).

### Próximos pasos necesarios

1. **Crear un componente `FlyersSection`** que llame a `flyersService.getFlyers()` e incluirlo en `Home.tsx`
2. **Crear un hook o contexto `SettingsContext`** que cargue las configuraciones desde `settingsService` y hacerlo disponible para toda la app
3. **Modificar `Header.tsx`** para usar `settingsService.getLogo()` en lugar del texto hardcodeado
4. **Modificar `HeroSection.tsx`** para usar `settingsService.getBanner()` en lugar de la imagen de Unsplash
5. **Modificar `Footer.tsx`** para usar `settingsService.getWhatsApp()`, `getSocialLinks()`, `getBusinessInfo()`
6. **Modificar `Contact.tsx`** para usar `settingsService.getWhatsApp()`, `getBusinessInfo()`
7. **Modificar `ProductPage.tsx`** para usar `settingsService.getWhatsApp()` en el botón de WhatsApp
8. **Modificar `CategoriesSection.tsx`** para usar `productService.getCategories()` (con filtro isActive) en lugar de `categoryService.getCategories()`
9. **Agregar visualización de stock** en `ProductPage.tsx`
10. **Implementar seguimiento público de pedidos** en `Orders.tsx`

Solo cuando TODAS las pantallas consuman datos reales desde Supabase (no solo tengan servicios creados), la sincronización podrá considerarse terminada.

---

*Fin del informe de auditoría funcional.*
