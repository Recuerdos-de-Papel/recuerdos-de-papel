# AUDITORÍA FUNCIONAL - FASE 6: WEB CLIENTE

## INFORMACIÓN GENERAL

**Fecha:** 2026-07-26  
**Objetivo:** Demostrar con evidencia que la web funciona correctamente  
**Estado:** PENDIENTE DE PRUEBAS

---

## INSTRUCCIONES PARA EL PROPIETARIO

Esta auditoría requiere que usted ejecute las pruebas y documente los resultados. Cada sección incluye:
- **Pasos a seguir:** Instrucciones detalladas
- **Resultado esperado:** Lo que debe ver
- **Evidencia requerida:** Capturas de pantalla o logs
- **Estado:** Pendiente / Completado / Fallido

---

## SECCIÓN 1: COMPILACIÓN DE LA WEB

### 1.1 Instalar dependencias

**Pasos:**
```bash
cd web
npm install
```

**Resultado esperado:**
- No hay errores
- Se crea la carpeta `node_modules`
- Se genera el archivo `package-lock.json`

**Evidencia requerida:**
- [ ] Log de instalación sin errores
- [ ] Captura de pantalla de la consola

**Estado:** ⏳ Pendiente

---

### 1.2 Verificar compilación TypeScript

**Pasos:**
```bash
cd web
npx tsc --noEmit
```

**Resultado esperado:**
- No hay errores de TypeScript
- No hay warnings

**Evidencia requerida:**
- [ ] Log de compilación sin errores

**Estado:** ⏳ Pendiente

---

### 1.3 Ejecutar servidor de desarrollo

**Pasos:**
```bash
cd web
npm run dev
```

**Resultado esperado:**
- Servidor inicia en `http://localhost:5173`
- No hay errores en consola
- La página carga correctamente

**Evidencia requerida:**
- [ ] Captura de pantalla del navegador mostrando la web
- [ ] Log del servidor sin errores

**Estado:** ⏳ Pendiente

---

## SECCIÓN 2: CONEXIÓN CON BACKEND

### 2.1 Verificar URL del backend

**Pasos:**
1. Abrir archivo `web/.env`
2. Verificar que `VITE_API_URL` apunte al backend en producción

**Configuración actual:**
```
VITE_API_URL=http://localhost:3000/api
```

**Acción requerida:**
- [ ] Cambiar a URL de producción de Render
- [ ] Ejemplo: `VITE_API_URL=https://recuerdos-de-papel-backend.onrender.com/api`

**Estado:** ⏳ Pendiente

---

### 2.2 Probar endpoint de productos

**Pasos:**
1. Abrir navegador en `http://localhost:5173`
2. Abrir DevTools (F12)
3. Ir a la pestaña "Network"
4. Recargar la página (F5)
5. Buscar request a `/api/products`

**Resultado esperado:**
- Status: 200 OK
- Response: Array de productos
- No hay errores 404 o 500

**Evidencia requerida:**
- [ ] Captura de pantalla del Network tab mostrando el request
- [ ] Captura de pantalla de la respuesta JSON
- [ ] Lista de productos visibles en la pantalla

**Estado:** ⏳ Pendiente

---

### 2.3 Probar endpoint de categorías

**Pasos:**
1. En DevTools, buscar request a `/api/categories`
2. Verificar respuesta

**Resultado esperado:**
- Status: 200 OK
- Response: Array de categorías

**Evidencia requerida:**
- [ ] Captura de pantalla de la respuesta

**Estado:** ⏳ Pendiente

---

### 2.4 Probar endpoint de promociones

**Pasos:**
1. En DevTools, buscar request a `/api/promotions`
2. Verificar respuesta

**Resultado esperado:**
- Status: 200 OK
- Response: Array de promociones activas

**Evidencia requerida:**
- [ ] Captura de pantalla de la respuesta

**Estado:** ⏳ Pendiente

---

### 2.5 Probar endpoint de flyers

**Pasos:**
1. En DevTools, buscar request a `/api/flyers`
2. Verificar respuesta

**Resultado esperado:**
- Status: 200 OK
- Response: Array de flyers activos

**Evidencia requerida:**
- [ ] Captura de pantalla de la respuesta

**Estado:** ⏳ Pendiente

---

## SECCIÓN 3: AUTENTICACIÓN

### 3.1 Probar registro de usuario

**Pasos:**
1. Ir a `http://localhost:5173/register`
2. Completar formulario:
   - Nombre: "Usuario Prueba"
   - Email: "prueba@test.com"
   - Teléfono: "+54 9 351 123 4567"
   - Contraseña: "123456"
   - Confirmar contraseña: "123456"
3. Hacer clic en "Registrarse"

**Resultado esperado:**
- Status: 201 Created (o 200 OK)
- Redirección a página principal
- Token JWT guardado en localStorage
- Usuario logueado

**Evidencia requerida:**
- [ ] Captura de pantalla del formulario completado
- [ ] Captura de pantalla después del registro (usuario logueado)
- [ ] Log de la consola mostrando el request POST a `/api/auth/register`
- [ ] Log de la consola mostrando el token JWT

**Estado:** ⏳ Pendiente

---

### 3.2 Probar login

**Pasos:**
1. Cerrar sesión (si está logueado)
2. Ir a `http://localhost:5173/login`
3. Completar formulario:
   - Email: "prueba@test.com"
   - Contraseña: "123456"
4. Hacer clic en "Iniciar Sesión"

**Resultado esperado:**
- Status: 200 OK
- Redirección a página principal
- Token JWT guardado en localStorage
- Nombre de usuario visible en el header

**Evidencia requerida:**
- [ ] Captura de pantalla del formulario completado
- [ ] Captura de pantalla después del login (usuario logueado)
- [ ] Log de la consola mostrando el request POST a `/api/auth/login`
- [ ] Log de la consola mostrando el token JWT

**Estado:** ⏳ Pendiente

---

### 3.3 Verificar persistencia de sesión

**Pasos:**
1. Estar logueado
2. Abrir DevTools → Application → Local Storage
3. Verificar que existan las claves:
   - `auth_token`
   - `auth_user`
4. Recargar la página (F5)
5. Verificar que el usuario sigue logueado

**Resultado esperado:**
- Token y usuario guardados en localStorage
- Usuario sigue logueado después de recargar

**Evidencia requerida:**
- [ ] Captura de pantalla del Local Storage
- [ ] Captura de pantalla después de recargar (usuario sigue logueado)

**Estado:** ⏳ Pendiente

---

### 3.4 Probar cierre de sesión

**Pasos:**
1. Estar logueado
2. Hacer clic en "Cerrar Sesión" en el header
3. Verificar que se redirige a la página principal
4. Verificar que el usuario ya no está logueado

**Resultado esperado:**
- Redirección a home
- Token eliminado de localStorage
- Usuario ya no visible en el header

**Evidencia requerida:**
- [ ] Captura de pantalla después de cerrar sesión
- [ ] Captura de pantalla del Local Storage (sin token)

**Estado:** ⏳ Pendiente

---

## SECCIÓN 4: CATÁLOGO DE PRODUCTOS

### 4.1 Verificar productos visibles

**Pasos:**
1. Ir a `http://localhost:5173`
2. Scroll down hasta "Productos Destacados"
3. Verificar que se muestran productos

**Resultado esperado:**
- Mínimo 8 productos visibles
- Cada producto muestra:
  - Imagen
  - Nombre
  - Precio
  - Botón "Agregar al carrito"

**Evidencia requerida:**
- [ ] Captura de pantalla de la sección de productos destacados
- [ ] Lista de productos visibles (nombres y precios)

**Estado:** ⏳ Pendiente

---

### 4.2 Verificar imágenes de productos

**Pasos:**
1. En la página principal, verificar que las imágenes se cargan
2. Hacer clic en un producto
3. Verificar que la imagen se muestra correctamente

**Resultado esperado:**
- Imágenes se cargan correctamente
- No hay imágenes rotas

**Evidencia requerida:**
- [ ] Captura de pantalla de productos con imágenes
- [ ] Captura de pantalla de producto individual

**Estado:** ⏳ Pendiente

---

### 4.3 Verificar precios

**Pasos:**
1. Verificar productos en oferta
2. Verificar productos sin oferta
3. Verificar que los precios son correctos

**Resultado esperado:**
- Productos en oferta muestran precio con descuento y precio original tachado
- Productos sin oferta muestran precio webPrice

**Evidencia requerida:**
- [ ] Captura de pantalla de producto en oferta
- [ ] Captura de pantalla de producto sin oferta

**Estado:** ⏳ Pendiente

---

### 4.4 Probar filtros

**Pasos:**
1. Ir a `http://localhost:5173/products`
2. Probar búsqueda por texto
3. Probar filtro por categoría

**Resultado esperado:**
- Búsqueda filtra productos por nombre/descripción
- Filtro por categoría muestra solo productos de esa categoría

**Evidencia requerida:**
- [ ] Captura de pantalla con búsqueda aplicada
- [ ] Captura de pantalla con filtro aplicado

**Estado:** ⏳ Pendiente

---

### 4.5 Verificar categorías

**Pasos:**
1. Ir a `http://localhost:5173/categories`
2. Verificar que se muestran todas las categorías
3. Hacer clic en una categoría
4. Verificar que se muestran los productos

**Resultado esperado:**
- Grid de categorías visible
- Al hacer clic, se muestran productos de esa categoría

**Evidencia requerida:**
- [ ] Captura de pantalla del grid de categorías
- [ ] Captura de pantalla de productos por categoría

**Estado:** ⏳ Pendiente

---

## SECCIÓN 5: CARRITO DE COMPRAS

### 5.1 Agregar producto al carrito

**Pasos:**
1. Ir a `http://localhost:5173/products`
2. Hacer clic en "Agregar al carrito" en un producto
3. Verificar que el producto se agrega

**Resultado esperado:**
- Producto agregado al carrito
- Contador del carrito en el header se actualiza
- No hay errores

**Evidencia requerida:**
- [ ] Captura de pantalla del contador actualizado en el header
- [ ] Log de la consola sin errores

**Estado:** ⏳ Pendiente

---

### 5.2 Modificar cantidad

**Pasos:**
1. Ir a `http://localhost:5173/cart`
2. Hacer clic en "+" para aumentar cantidad
3. Hacer clic en "-" para disminuir cantidad
4. Verificar que el total se actualiza

**Resultado esperado:**
- Cantidad se actualiza
- Total se recalcula correctamente

**Evidencia requerida:**
- [ ] Captura de pantalla del carrito con cantidades modificadas
- [ ] Captura de pantalla del total actualizado

**Estado:** ⏳ Pendiente

---

### 5.3 Eliminar producto

**Pasos:**
1. En el carrito, hacer clic en "Eliminar" en un producto
2. Verificar que el producto se elimina

**Resultado esperado:**
- Producto eliminado del carrito
- Total se actualiza

**Evidencia requerida:**
- [ ] Captura de pantalla del carrito después de eliminar

**Estado:** ⏳ Pendiente

---

### 5.4 Verificar persistencia del carrito

**Pasos:**
1. Agregar productos al carrito
2. Recargar la página (F5)
3. Verificar que los productos siguen en el carrito

**Resultado esperado:**
- Carrito persiste después de recargar la página

**Evidencia requerida:**
- [ ] Captura de pantalla del carrito después de recargar

**Estado:** ⏳ Pendiente

---

## SECCIÓN 6: CHECKOUT Y MERCADO PAGO

### 6.1 Probar flujo de checkout

**Pasos:**
1. Estar logueado
2. Tener productos en el carrito
3. Ir a `http://localhost:5173/cart`
4. Hacer clic en "Proceder al Pago"
5. Completar datos de envío
6. Hacer clic en "Continuar al pago"
7. Revisar resumen
8. Hacer clic en "Pagar con Mercado Pago"

**Resultado esperado:**
- Formulario de envío se muestra
- Al continuar, se muestra resumen
- Al pagar, se redirige a Mercado Pago (o muestra error si no está configurado)

**Evidencia requerida:**
- [ ] Captura de pantalla del formulario de envío
- [ ] Captura de pantalla del resumen del pedido
- [ ] Captura de pantalla de la redirección a Mercado Pago (o mensaje de error)

**Estado:** ⏳ Pendiente

---

## SECCIÓN 7: PERFIL Y FAVORITOS

### 7.1 Probar perfil de usuario

**Pasos:**
1. Estar logueado
2. Ir a `http://localhost:5173/profile`
3. Modificar nombre/email/teléfono
4. Hacer clic en "Guardar Cambios"

**Resultado esperado:**
- Formulario se muestra con datos del usuario
- Al guardar, se muestra mensaje de éxito
- Datos se actualizan en el header

**Evidencia requerida:**
- [ ] Captura de pantalla del formulario de perfil
- [ ] Captura de pantalla del mensaje de éxito
- [ ] Captura de pantalla del header con datos actualizados

**Estado:** ⏳ Pendiente

---

### 7.2 Probar favoritos

**Pasos:**
1. Estar logueado
2. Ir a un producto
3. Hacer clic en "Agregar a favoritos" (si existe el botón)
4. Ir a `http://localhost:5173/favorites`
5. Verificar que el producto aparece

**Resultado esperado:**
- Producto se agrega a favoritos
- Producto visible en la página de favoritos

**Evidencia requerida:**
- [ ] Captura de pantalla de la página de favoritos

**Estado:** ⏳ Pendiente

---

### 7.3 Probar pedidos

**Pasos:**
1. Estar logueado
2. Realizar un pedido completo (checkout + pago)
3. Ir a `http://localhost:5173/orders`
4. Verificar que el pedido aparece

**Resultado esperado:**
- Pedido aparece en la lista
- Muestra estado, fecha, items y total

**Evidencia requerida:**
- [ ] Captura de pantalla de la página de pedidos
- [ ] Captura de pantalla del detalle del pedido

**Estado:** ⏳ Pendiente

---

## SECCIÓN 8: RESPONSIVE

### 8.1 Verificar en móvil (375px)

**Pasos:**
1. Abrir DevTools (F12)
2. Activar modo responsive (Ctrl+Shift+M)
3. Seleccionar dispositivo "iPhone 12 Pro" (375px)
4. Navegar por las páginas principales

**Resultado esperado:**
- Header se convierte en menú hamburguesa
- Productos se muestran en 1 columna
- Formularios son legibles
- No hay overflow horizontal

**Evidencia requerida:**
- [ ] Captura de pantalla de Home en móvil
- [ ] Captura de pantalla de Products en móvil
- [ ] Captura de pantalla de Cart en móvil

**Estado:** ⏳ Pendiente

---

### 8.2 Verificar en tablet (768px)

**Pasos:**
1. En DevTools, seleccionar "iPad" (768px)
2. Navegar por las páginas principales

**Resultado esperado:**
- Productos se muestran en 2 columnas
- Header muestra navegación completa
- Layout se adapta correctamente

**Evidencia requerida:**
- [ ] Captura de pantalla de Home en tablet
- [ ] Captura de pantalla de Products en tablet

**Estado:** ⏳ Pendiente

---

### 8.3 Verificar en escritorio (1920px)

**Pasos:**
1. En DevTools, seleccionar resolución 1920x1080
2. Navegar por las páginas principales

**Resultado esperado:**
- Productos se muestran en 4 columnas
- Header completo
- Footer con 3 columnas
- Layout se ve profesional

**Evidencia requerida:**
- [ ] Captura de pantalla de Home en escritorio
- [ ] Captura de pantalla de Products en escritorio

**Estado:** ⏳ Pendiente

---

## SECCIÓN 9: INTEGRACIÓN CON APK

### 9.1 Verificar flujo completo

**Pasos:**
1. Verificar que el APK Android está funcionando
2. Crear un producto desde el APK administrativo
3. Verificar que aparece en la web
4. Crear un pedido desde la web
5. Verificar que aparece en el APK

**Resultado esperado:**
- Producto creado en APK → visible en web
- Pedido creado en web → visible en APK
- Ambos comparten la misma base de datos

**Evidencia requerida:**
- [ ] Captura de pantalla del APK mostrando el producto creado
- [ ] Captura de pantalla de la web mostrando el mismo producto
- [ ] Captura de pantalla del APK mostrando el pedido
- [ ] Captura de pantalla de la web mostrando el pedido

**Estado:** ⏳ Pendiente

---

## SECCIÓN 10: PRUEBAS DE ERRORES

### 10.1 Probar manejo de errores

**Pasos:**
1. Intentar acceder a producto que no existe: `http://localhost:5173/products/999999`
2. Intentar hacer login con credenciales incorrectas
3. Intentar acceder a `/profile` sin estar logueado

**Resultado esperado:**
- Producto no encontrado: Mensaje amigable
- Login incorrecto: Mensaje de error
- Sin autenticación: Redirección a login

**Evidencia requerida:**
- [ ] Captura de pantalla de producto no encontrado
- [ ] Captura de pantalla de error de login
- [ ] Captura de pantalla de redirección a login

**Estado:** ⏳ Pendiente

---

## RESUMEN DE PRUEBAS

### Total de pruebas: 25

- ✅ Completadas: 0
- ⏳ Pendientes: 25
- ❌ Fallidas: 0

---

## PROBLEMAS ENCONTRADOS

### Durante las pruebas, documentar aquí cualquier problema:

1. **Problema:** 
   - **Pasos para reproducir:**
   - **Error esperado:**
   - **Error actual:**
   - **Solución propuesta:**

---

## RECOMENDACIONES

Antes de continuar con FASE 7 (Mercado Pago) o FASE 8 (Auditoría permanente):

1. **Completar TODAS las pruebas de esta auditoría**
2. **Documentar evidencia de cada prueba**
3. **Corregir problemas encontrados**
4. **Volver a ejecutar pruebas fallidas**
5. **Solo si todas las pruebas pasan, continuar con las siguientes fases**

---

## PRÓXIMOS PASOS (después de esta auditoría)

Si todas las pruebas pasan:
- ✅ Continuar con FASE 7: Mercado Pago (configuración completa)
- ✅ Continuar con FASE 8: Sistema de auditoría permanente
- ✅ Continuar con FASE 9: Control de calidad final

Si hay pruebas fallidas:
- ❌ Corregir problemas
- ❌ Volver a ejecutar pruebas
- ❌ Documentar correcciones en `AUDITORIA_CAMBIO_X.md`

---

**Nota importante:** Esta auditoría debe ser completada por el propietario del proyecto con evidencia real de funcionamiento. No se puede considerar la FASE 6 como completada sin esta validación.