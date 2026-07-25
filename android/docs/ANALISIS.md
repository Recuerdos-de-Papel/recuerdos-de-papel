# AUDITORÍA QA COMPLETA - Recuerdos de Papel Admin

## FECHA: 2026-07-24
## AUDITOR: Sistema QA

---

## 1. INVENTARIO DE PANTALLAS

| # | Pantalla | Archivo | Estado |
|---|----------|---------|--------|
| 1 | Splash | splash_screen.dart | IMPLEMENTADA |
| 2 | Login | login_screen.dart | IMPLEMENTADA |
| 3 | AuthWrapper | auth_wrapper.dart | IMPLEMENTADA |
| 4 | Home/Dashboard | home_screen.dart | IMPLEMENTADA |
| 5 | Productos - Lista | products_screen.dart | IMPLEMENTADA |
| 6 | Productos - Formulario | product_form_screen.dart | IMPLEMENTADA |
| 7 | Categorías | categories_screen.dart | IMPLEMENTADA |
| 8 | Subfamilias | subfamilies_screen.dart | IMPLEMENTADA |
| 9 | Promociones | promotions_screen.dart | IMPLEMENTADA |
| 10 | Flyers | flyers_screen.dart | IMPLEMENTADA |
| 11 | Pedidos | orders_screen.dart | IMPLEMENTADA |
| 12 | Configuración | settings_screen.dart | IMPLEMENTADA |
| 13 | Estadísticas | statistics_screen.dart | IMPLEMENTADA |
| **14** | **FAMILIAS** | **NO EXISTE** | **❌ FALTANTE** |

## 2. INVENTARIO DE COMPONENTES

### 2.1 Botones

| Pantalla | Botón | Tipo | Acción |
|----------|-------|------|--------|
| Login | Iniciar Sesión | FilledButton | _login() |
| Login | Usar Biometría | OutlinedButton | _loginWithBiometrics() |
| Home | Toggle Tema | IconButton | toggle theme |
| Home | Logout | IconButton | _logout() |
| Home | NavigationBar (5 items) | NavigationBar | navegación |
| Home | Productos | Card/InkWell | go /products |
| Home | Categorías | Card/InkWell | go /categories |
| Home | Subfamilias | Card/InkWell | go /subfamilies |
| Home | Promociones | Card/InkWell | go /promotions |
| Home | Flyers | Card/InkWell | go /flyers |
| Home | Config | Card/InkWell | go /settings |
| Productos | Search | IconButton | showDialog búsqueda |
| Productos | Switch Active | Switch | _toggleActive |
| Productos | FAB + | FloatingActionButton | Navigator.push ProductFormScreen |
| Productos | Editar (tap) | ListTile onTap | Navigator.push ProductFormScreen |
| Productos | Eliminar (longpress) | ListTile onLongPress | AlertDialog confirmación |
| ProductForm | Guardar | FilledButton | _saveProduct() |
| ProductForm | Agregar Imágenes | OutlinedButton | _pickImages() |
| ProductForm | Eliminar imagen | IconButton | removeAt |
| ProductForm | Switch Activo | SwitchListTile | setState |
| ProductForm | Switch Oferta | SwitchListTile | setState |
| ProductForm | SegmentedButton | SegmentedButton | setState status |
| Categorías | FAB + | FloatingActionButton | _showForm() |
| Categorías | Editar (tap) | ListTile onTap | _showForm |
| Categorías | Eliminar (longpress) | ListTile onLongPress | AlertDialog |
| Categorías | Switch Active | Switch | _toggleActive |
| Categorías | Guardar (form) | FilledButton | create/update |
| Subfamilias | FAB + | FloatingActionButton | _showForm() |
| Subfamilias | Switch Active | Switch | _toggleActive |
| Subfamilias | Guardar (form) | FilledButton | create/update |
| Promociones | FAB + | FloatingActionButton | _showForm() |
| Promociones | Switch Active | Switch | _toggleActive |
| Promociones | Guardar (form) | FilledButton | create/update |
| Flyers | FAB + | FloatingActionButton | _showForm() |
| Flyers | Switch Active | Switch | _toggleActive |
| Flyers | Seleccionar Imagen | OutlinedButton | pickImage |
| Flyers | Guardar (form) | FilledButton | create/update |
| Pedidos | Filtro estado | PopupMenuButton | filtrar órdenes |
| Pedidos | ChoiceChip estado | ChoiceChip | cambiar estado |
| Pedidos | Detalle (tap) | ListTile onTap | _showOrderDetails |
| Config | Editar Setting | ListTile onTap | _showSettingEditor |
| Config | Guardar Setting | TextButton | _updateSetting |

### 2.2 TextField

| Pantalla | Campo | Controller | Validación |
|----------|-------|-----------|------------|
| Login | Email | _emailController | No vacío + contiene @ |
| Login | Contraseña | _passwordController | No vacío |
| ProductForm | Nombre | _nameController | No vacío |
| ProductForm | Código | _codeController | Sin validación |
| ProductForm | Descripción | _descriptionController | Sin validación |
| ProductForm | Precio Normal | _priceController | No vacío |
| ProductForm | Precio Web | _webPriceController | Sin validación |
| ProductForm | Costo | _costController | Sin validación |
| ProductForm | Stock | _stockController | Sin validación |
| ProductForm | Búsqueda | TextField en Dialog | Sin validación |
| Categorías | Nombre | _nameController | No vacío |
| Categorías | Descripción | _descriptionController | Sin validación |
| Subfamilias | Nombre | _nameController | No vacío |
| Subfamilias | Descripción | _descriptionController | Sin validación |
| Promociones | Título | _titleController | No vacío |
| Promociones | Descripción | _descriptionController | Sin validación |
| Promociones | Descuento (%) | _discountController | No vacío |
| Promociones | Código | _codeController | Sin validación |
| Flyers | Título | _titleController | No vacío |
| Config | Valor setting | controller temporal | Sin validación |

### 2.3 Dropdown

| Pantalla | Dropdown | Items | Valor seleccionado |
|----------|----------|-------|-------------------|
| ProductForm | Subfamilia | _subfamilies | _selectedSubfamilyId |
| **Subfamilias** | **Familia** | **❌ NO EXISTE** | **_selectedFamilyId sin dropdown** |

### 2.4 Switch/Checkbox

| Pantalla | Control | Variable |
|----------|---------|----------|
| ProductForm | Activo | _isActive |
| ProductForm | En Oferta | _isOffer |
| Categorías (form) | Activo | _isActive |
| Subfamilias (form) | Activo | _isActive |
| Promociones (form) | Activo | _isActive |
| Flyers (form) | Activo | _isActive |
| Productos (lista) | Activo (cada item) | product.isActive |
| Categorías (lista) | Activo (cada item) | category.isActive |
| Subfamilias (lista) | Activo (cada item) | subfamily.isActive |
| Promociones (lista) | Activo (cada item) | promotion.isActive |
| Flyers (lista) | Activo (cada item) | flyer.isActive |

### 2.5 DatePicker

| Pantalla | Campo |
|----------|-------|
| Promociones | Fecha Inicio |
| Promociones | Fecha Fin |
| Flyers | Fecha Inicio |
| Flyers | Fecha Fin |

### 2.6 Dialog/BottomSheet

| Pantalla | Tipo | Propósito |
|----------|------|-----------|
| Productos | AlertDialog | Confirmar eliminación |
| Productos | AlertDialog | Búsqueda |
| Categorías | BottomSheet | Formulario create/edit |
| Subfamilias | BottomSheet | Formulario create/edit |
| Promociones | BottomSheet | Formulario create/edit |
| Flyers | BottomSheet | Formulario create/edit |
| Pedidos | BottomSheet | Detalle del pedido |
| Config | AlertDialog | Editor de setting |

## 3. CRUD OPERATIONS

### 3.1 Productos
- CREATE: POST /products ✅
- READ: GET /products, GET /products/:id ✅
- UPDATE: PUT /products/:id ✅
- DELETE: DELETE /products/:id ✅
- PATCH: /products/:id/state ✅
- PATCH: /products/:id/featured ✅
- PATCH: /products/:id/order ✅

### 3.2 Categorías
- CREATE: POST /categories ✅
- READ: GET /categories, GET /categories/:id ✅
- UPDATE: PUT /categories/:id ✅
- DELETE: DELETE /categories/:id ✅

### 3.3 Subfamilias
- CREATE: POST /subfamilies ✅
- READ: GET /subfamilies, GET /subfamilies/:id ✅
- UPDATE: PUT /subfamilies/:id ✅
- DELETE: DELETE /subfamilies/:id ✅

### 3.4 Promociones
- CREATE: POST /promotions ✅
- READ: GET /promotions, GET /promotions/:id ✅
- UPDATE: PUT /promotions/:id ✅
- DELETE: DELETE /promotions/:id ✅

### 3.5 Flyers
- CREATE: POST /flyers ✅
- READ: GET /flyers, GET /flyers/:id ✅
- UPDATE: PUT /flyers/:id ✅
- DELETE: DELETE /flyers/:id ✅

### 3.6 Pedidos
- READ: GET /orders (con filtro) ✅
- READ: GET /orders/:id ✅
- PATCH: /orders/:id/status ✅

### 3.7 Settings
- READ: GET /settings ✅
- UPDATE: UPDATE setting ✅

### 3.8 Estadísticas
- READ: GET /statistics ✅

## 4. HTTP ENDPOINTS (Backend esperado)

| Método | Endpoint | Servicio |
|--------|----------|----------|
| POST | /auth/login | AuthService |
| GET | /auth/profile | AuthService |
| GET | /products | ProductsService |
| GET | /products/:id | ProductsService |
| POST | /products | ProductsService |
| PUT | /products/:id | ProductsService |
| DELETE | /products/:id | ProductsService |
| PATCH | /products/:id/state | ProductsService |
| PATCH | /products/:id/featured | ProductsService |
| PATCH | /products/:id/order | ProductsService |
| GET | /categories | CategoriesService |
| GET | /categories/:id | CategoriesService |
| POST | /categories | CategoriesService |
| PUT | /categories/:id | CategoriesService |
| DELETE | /categories/:id | CategoriesService |
| GET | /subfamilies | SubfamiliesService |
| GET | /subfamilies/:id | SubfamiliesService |
| POST | /subfamilies | SubfamiliesService |
| PUT | /subfamilies/:id | SubfamiliesService |
| DELETE | /subfamilies/:id | SubfamiliesService |
| GET | /promotions | PromotionsService |
| GET | /promotions/:id | PromotionsService |
| POST | /promotions | PromotionsService |
| PUT | /promotions/:id | PromotionsService |
| DELETE | /promotions/:id | PromotionsService |
| GET | /flyers | FlyersService |
| GET | /flyers/:id | FlyersService |
| POST | /flyers | FlyersService |
| PUT | /flyers/:id | FlyersService |
| DELETE | /flyers/:id | FlyersService |
| GET | /orders | OrdersService |
| GET | /orders/:id | OrdersService |
| PATCH | /orders/:id/status | OrdersService |
| GET | /settings | SettingsService |
| PUT | /settings/:key | SettingsService |
| GET | /statistics | StatisticsService |

## 5. PROBLEMAS DETECTADOS (PRE-CORRECCIÓN)

### 🔴 CRÍTICOS

| ID | Problema | Archivo | Línea | Descripción |
|----|----------|---------|-------|-------------|
| **P1** | **Falta pantalla Familias** | NO EXISTE | - | Existe el modelo `Family` pero no hay screen ni service para gestionar familias |
| **P2** | **Subfamilias sin dropdown de Familia** | subfamilies_screen.dart | 99 | `_selectedFamilyId` se declara pero NO HAY DropdownButtonFormField para seleccionar la familia. El formulario envía `familyId: null` siempre |
| **P3** | **Doble Router** | src/app_router.dart + src/core/router/app_router.dart | - | Existen DOS archivos de rutas. `src/app_router.dart` tiene un `GoRouter`, y `src/core/app_router.dart` tiene un `AppRouter` con rutas tipo Map. Esto causa confusión |
| **P4** | **Navegación mezclada GoRouter + Navigator** | products_screen.dart | 181-188 | Usa `Navigator.push()` en lugar de `context.go()` - NO HAY BOTÓN BACK en ProductFormScreen para regresar a ProductsScreen |
| **P5** | **Sin BackButton en pantallas secundarias** | Varios | - | ProductsScreen, CategoriesScreen, etc. no tienen botón de retroceso en AppBar |
| **P6** | **AuthWrapper usa addPostFrameCallback** | auth_wrapper.dart | 66-71 | Usa `addPostFrameCallback` para redirigir, lo cual puede causar problemas de estado |

### 🟡 IMPORTANTES

| ID | Problema | Archivo | Línea | Descripción |
|----|----------|---------|-------|-------------|
| P7 | DatePicker no actualiza UI en BottomSheet | promotions_screen.dart | 173 | `_startDate = picked` pero no hay `setState` para actualizar la vista |
| P8 | Flyer image no se sube a servidor | flyers_screen.dart | 141-143 | Solo guarda path local, no URL |
| P9 | Login Biometrics no es funcional | login_screen.dart | 72-96 | Solo muestra snackbar, no inicia sesión automáticamente |
| P10 | StatisticsScreen tiene datos hardcodeados | statistics_screen.dart | (por leer) | Los stats del dashboard son 0 siempre |
| P11 | Sin validación de email fuerte | login_screen.dart | 141 | Solo verifica que contenga '@' |
| P12 | Sin manejo de error 401 (token expirado) | api_client.dart | - | No hay interceptor para refresh token |
| P13 | Sin confirmación de email en login | auth_service.dart | - | login() no verifica que el admin tenga email confirmado |
| P14 | OfflineSyncService sin implementar | offline_sync_service.dart | - | Servicio creado pero vacío |
| P15 | NotificationService sin implementar | notification_service.dart | - | Servicio creado pero vacío |
| P16 | Precio Web sin validación | product_form_screen.dart | 274-280 | No valida que webPrice sea positivo |
| P17 | Stock sin validación | product_form_screen.dart | 292-298 | No valida que stock sea >= 0 |
| P18 | Costo sin validación | product_form_screen.dart | 283-289 | No valida que cost sea positivo |
| P19 | Imágenes no se suben a storage | product_form_screen.dart | 85-93 | Solo guarda path local, no URL de Supabase Storage |

### 🟢 MENORES

| ID | Problema | Archivo | Descripción |
|----|----------|---------|-------------|
| P20 | Sin filtro de búsqueda en productos | products_screen.dart | La búsqueda solo filtra localmente por nombre/código |
| P21 | Sin scroll infinito en listas | Varios | Todas las listas cargan todos los datos de una vez |
| P22 | Sin skeleton loading | Varios | Solo usa CircularProgressIndicator |
| P23 | Sin caché offline | Varios | No guarda datos localmente |
| P24 | Sin logging estructurado | Varios | Usa debugPrint y print mezclados |