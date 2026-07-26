# AUDITORÍA COMPLETA DEL PROYECTO - 26/07/2026

## RESUMEN DE ISSUES ENCONTRADOS Y CORREGIDOS

### 🔴 CRÍTICOS (Rompén funcionalidad) - CORREGIDOS

| # | Issue | Archivo | Solución Aplicada |
|---|-------|---------|-------------------|
| 1 | **APK guardaba rutas locales de imágenes** | `android/lib/src/features/products/product_form_screen.dart` | ✅ Modificado `_pickImages()` para subir imágenes a Supabase Storage vía API `/upload/product-images` y guardar las URLs públicas. Se agregó import de `dio` y función `_getMimeType()`. |
| 2 | **Product query usaba INNER JOINs restrictivos** | `web/src/services/productService.ts` | ✅ Cambiados `!inner` joins a LEFT JOINs (sin `!inner`) para que productos sin relaciones no se excluyan. |
| 3 | **Faltaba `count: 'exact'` en getProducts** | `web/src/services/productService.ts` | ✅ Separada la query en `countQuery` (con `head: true`) y `dataQuery` (con datos completos) para obtener paginación correcta. |

### 🟡 IMPORTANTES - CORREGIDOS

| # | Issue | Archivo | Solución Aplicada |
|---|-------|---------|-------------------|
| 4 | **Error handling silencioso en filtros** | `web/src/components/ProductFilters.tsx` | ✅ Agregado estado `error` con visualización en UI. Los errores ahora se muestran al usuario y se loguean en consola. |

### 🟢 VERIFICADOS COMO CORRECTOS (Ya funcionaban)

| Componente | Estado | Notas |
|------------|--------|-------|
| `orderService.ts` | ✅ Correcto | Ya usa `userId` y `orderId` (camelCase) correctamente |
| `addressService.ts` | ✅ Correcto | Ya usa `userId` y `isPrimary` (camelCase) correctamente |
| `MyAddresses.tsx` | ✅ Correcto | Ya usa `userId` y `isPrimary` (camelCase) correctamente |
| `flyersService.ts` | ✅ Existe | Ya está creado y exportado en `index.ts` |
| `settingsService.ts` | ✅ Existe | Ya está creado y exportado en `index.ts` |
| `services/index.ts` | ✅ Correcto | Ya exporta `flyersService` y `settingsService` |

### ⚠️ CONFIGURACIÓN PENDIENTE (No es código)

| # | Issue | Detalle |
|---|-------|---------|
| 1 | **web/.env tiene placeholders de Supabase** | `VITE_SUPABASE_URL=https://your-project.supabase.co` y `VITE_SUPABASE_ANON_KEY=your-anon-key` son placeholders. Deben reemplazarse con los valores reales del proyecto Supabase. El project ref es: `kdktpojkuztruiyqlqlr` (extraído de backend/.env). |
| 2 | **Web sin deploy configurado** | No hay configuración de despliegue para el frontend web (sin render.yaml, Dockerfile de producción, etc.) |

## ARCHIVOS MODIFICADOS

1. `web/src/services/productService.ts` - LEFT JOINs + paginación con count exacto
2. `web/src/components/ProductFilters.tsx` - Error handling visible
3. `android/lib/src/features/products/product_form_screen.dart` - Upload de imágenes a Supabase Storage
4. `docs/AUDITORIA_COMPLETA_2026-07-26.md` - Este archivo de auditoría