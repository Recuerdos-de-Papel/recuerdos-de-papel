# AUDITORÍA COMPLETA DEL APK - RECUERDOS DE PAPEL

**Fecha:** 26/07/2026  
**Auditor:** Sistema de Auditoría  
**Objetivo:** Extraer toda la información del APK Android para definir la fuente de verdad

---

## 1. INFORMACIÓN GENERAL DEL APK

**Nombre:** recuerdos_de_papel_admin  
**Tipo:** Aplicación Android de administración  
**Framework:** Flutter >= 3.0.0  
**Lenguaje:** Dart  
**Estado:** FUNCIONAL (es la fuente de verdad)

---

## 2. CONFIGURACIÓN DE RED

### 2.1 URL Base del Backend
**Archivo:** `android/lib/src/core/network/api_client.dart`  
**Línea:** 17-18

```dart
static const String baseUrl =
    'https://recuerdos-de-papel-backend.onrender.com/api/admin';
```

**URL Completa:** `https://recuerdos-de-papel-backend.onrender.com/api/admin`

### 2.2 Headers por Defecto
**Archivo:** `android/lib/src/core/network/api_client.dart`  
**Línea:** 33-36

```dart
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}
```

### 2.3 Autenticación
**Tipo:** JWT Bearer Token  
**Header:** `Authorization: Bearer {token}`  
**Implementación:** 
- Token se almacena en FlutterSecureStorage
- Se inyecta en headers de Dio automáticamente
- Se limpia al hacer logout

**Archivo:** `android/lib/src/core/network/api_client.dart`  
**Líneas:** 76-82

```dart
void setToken(String token) {
  _dio.options.headers['Authorization'] = 'Bearer $token';
}

void clearToken() {
  _dio.options.headers.remove('Authorization');
}
```

### 2.4 Timeouts
**Archivo:** `android/lib/src/core/network/api_client.dart`  
**Líneas:** 29-32

```dart
connectTimeout: const Duration(seconds: 30),
receiveTimeout: const Duration(seconds: 30),
```

---

## 3. ENDPOINTS CONSUMIDOS POR EL APK

### 3.1 Autenticación

#### POST /auth/login
**Archivo:** `android/lib/src/features/auth/auth_service.dart`  
**Línea:** 14-19

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "admin": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

**Modelos Dart:**
- `AuthResponse` (líneas 72-84)
  - token: String
  - admin: AdminProfile
- `AdminProfile` (líneas 86-104)
  - id: String
  - email: String
  - name: String

#### GET /auth/profile
**Archivo:** `android/lib/src/features/auth/auth_service.dart`  
**Línea:** 57

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string"
}
```

**Modelo Dart:** `AdminProfile`

---

### 3.2 Productos

#### GET /products
**Archivo:** `android/lib/src/features/products/products_service.dart`  
**Línea:** 12

**Response:**
```json
{
  "products": [
    {
      "id": "string",
      "subfamilyId": "string",
      "name": "string",
      "code": "string",
      "description": "string",
      "price": 0.0,
      "webPrice": 0.0,
      "images": ["string"],
      "isOffer": false,
      "status": "available",
      "isActive": true,
      "stock": 0,
      "cost": 0.0,
      "order": 0
    }
  ]
}
```

**Modelo Dart:** `Product` (líneas 169-224)

**Campos:**
- id: String
- subfamilyId: String
- name: String
- code: String?
- description: String?
- price: double (mapeado desde `normalPrice` del backend)
- webPrice: double
- images: List<String>
- isOffer: bool
- status: String
- isActive: bool
- stock: int
- cost: double?
- order: int

**Nota:** El campo `price` en el APK corresponde a `normalPrice` en el backend Prisma.

#### GET /products/{id}
**Archivo:** `android/lib/src/features/products/products_service.dart`  
**Línea:** 23

**Response:** Objeto Product completo

#### POST /products
**Archivo:** `android/lib/src/features/products/products_service.dart`  
**Línea:** 32

**Request:** Objeto Product completo (sin id)

**Response:** Objeto Product completo (con id generado)

#### PUT /products/{id}
**Archivo:** `android/lib/src/features/products/products_service.dart`  
**Línea:** 41

**Request:** Objeto Product completo

**Response:** Objeto Product completo

#### DELETE /products/{id}
**Archivo:** `android/lib/src/features/products/products_service.dart`  
**Línea:** 50

**Response:** 204 No Content

#### PATCH /products/{id}/state
**Archivo:** `android/lib/src/features/products/products_service.dart`  
**Línea:** 58-61

**Request:**
```json
{
  "isActive": true
}
```

**Response:** Objeto Product completo

#### PATCH /products/{id}/featured
**Archivo:** `android/lib/src/features/products/products_service.dart`  
**Línea:** 70-73

**Request:**
```json
{
  "isOffer": true
}
```

**Response:** Objeto Product completo

#### PATCH /products/{id}/order
**Archivo:** `android/lib/src/features/products/products_service.dart`  
**Línea:** 82-85

**Request:**
```json
{
  "order": 1
}
```

**Response:** Objeto Product completo

---

### 3.3 Categorías

#### GET /categories
**Archivo:** `android/lib/src/features/categories/categories_screen.dart`  
**Modelo Dart:** `Category` (líneas 227-251)

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "order": 0,
    "isActive": true
  }
]
```

**Campos:**
- id: String
- name: String
- description: String?
- order: int
- isActive: bool

#### POST /categories
**Request:** Objeto Category completo (sin id)

**Response:** Objeto Category completo

#### PUT /categories/{id}
**Request:** Objeto Category completo

**Response:** Objeto Category completo

#### DELETE /categories/{id}
**Response:** 204 No Content

---

### 3.4 Familias

#### GET /families
**Archivo:** `android/lib/src/features/families/families_screen.dart`  
**Modelo Dart:** `ProductFamily` (líneas 254-281)

**Response:**
```json
[
  {
    "id": "string",
    "categoryId": "string",
    "name": "string",
    "description": "string",
    "order": 0,
    "isActive": true
  }
]
```

**Campos:**
- id: String
- categoryId: String
- name: String
- description: String?
- order: int
- isActive: bool

**Nota:** Se llama `ProductFamily` en Dart para evitar conflicto con Riverpod.

#### GET /families/category/{categoryId}
**Archivo:** `android/lib/src/features/families/families_service.dart`

**Response:** Array de ProductFamily

#### POST /families
**Request:** Objeto ProductFamily completo (sin id)

**Response:** Objeto ProductFamily completo

#### PUT /families/{id}
**Request:** Objeto ProductFamily completo

**Response:** Objeto ProductFamily completo

#### DELETE /families/{id}
**Response:** 204 No Content

---

### 3.5 Subfamilias

#### GET /subfamilies
**Archivo:** `android/lib/src/features/subfamilies/subfamilies_screen.dart`  
**Modelo Dart:** `Subfamily` (líneas 284-311)

**Response:**
```json
[
  {
    "id": "string",
    "familyId": "string",
    "name": "string",
    "description": "string",
    "order": 0,
    "isActive": true
  }
]
```

**Campos:**
- id: String
- familyId: String
- name: String
- description: String?
- order: int
- isActive: bool

#### GET /subfamilies/family/{familyId}
**Archivo:** `android/lib/src/features/subfamilies/subfamilies_screen.dart`

**Response:** Array de Subfamily

#### POST /subfamilies
**Request:** Objeto Subfamily completo (sin id)

**Response:** Objeto Subfamily completo

#### PUT /subfamilies/{id}
**Request:** Objeto Subfamily completo

**Response:** Objeto Subfamily completo

#### DELETE /subfamilies/{id}
**Response:** 204 No Content

---

### 3.6 Promociones

#### GET /promotions
**Archivo:** `android/lib/src/features/promotions/promotions_screen.dart`  
**Modelo Dart:** `Promotion` (líneas 314-350)

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "discount": 0.0,
    "code": "string",
    "startDate": "2026-07-26T00:00:00.000Z",
    "endDate": "2026-07-26T00:00:00.000Z",
    "isActive": true,
    "isWeb": false
  }
]
```

**Campos:**
- id: String
- title: String
- description: String?
- discount: double (porcentaje)
- code: String?
- startDate: DateTime (ISO 8601)
- endDate: DateTime (ISO 8601)
- isActive: bool
- isWeb: bool

#### POST /promotions
**Request:** Objeto Promotion completo (sin id)

**Response:** Objeto Promotion completo

#### PUT /promotions/{id}
**Request:** Objeto Promotion completo

**Response:** Objeto Promotion completo

#### DELETE /promotions/{id}
**Response:** 204 No Content

---

### 3.7 Flyers

#### GET /flyers
**Archivo:** `android/lib/src/features/flyers/flyers_screen.dart`  
**Modelo Dart:** `Flyer` (líneas 353-383)

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "imageUrl": "string",
    "startDate": "2026-07-26T00:00:00.000Z",
    "endDate": "2026-07-26T00:00:00.000Z",
    "isActive": true,
    "order": 0
  }
]
```

**Campos:**
- id: String
- title: String
- imageUrl: String
- startDate: DateTime (ISO 8601)
- endDate: DateTime (ISO 8601)
- isActive: bool
- order: int

#### POST /flyers
**Request:** Objeto Flyer completo (sin id)

**Response:** Objeto Flyer completo

#### PUT /flyers/{id}
**Request:** Objeto Flyer completo

**Response:** Objeto Flyer completo

#### DELETE /flyers/{id}
**Response:** 204 No Content

---

### 3.8 Pedidos

#### GET /orders
**Archivo:** `android/lib/src/features/orders/orders_screen.dart`  
**Modelo Dart:** `AdminOrder` (líneas 386-453)

**Response:**
```json
[
  {
    "id": "string",
    "status": "pending",
    "deliveryMethod": "pickup",
    "subtotal": 0.0,
    "discount": 0.0,
    "total": 0.0,
    "shippingCost": 0.0,
    "customerName": "string",
    "customerPhone": "string",
    "customerEmail": "string",
    "address": "string",
    "notes": "string",
    "paymentId": "string",
    "paymentStatus": "string",
    "dateApproved": "2026-07-26T00:00:00.000Z",
    "items": [
      {
        "id": "string",
        "productId": "string",
        "quantity": 1,
        "price": 0.0,
        "productName": "string",
        "productCode": "string"
      }
    ],
    "createdAt": "2026-07-26T00:00:00.000Z",
    "updatedAt": "2026-07-26T00:00:00.000Z"
  }
]
```

**Campos:**
- id: String
- status: String (pending, payment_pending, paid, in_production, ready, shipped, delivered, cancelled)
- deliveryMethod: String (pickup, local_delivery, interior_shipping)
- subtotal: double
- discount: double
- total: double
- shippingCost: double
- customerName: String
- customerPhone: String
- customerEmail: String
- address: String?
- notes: String?
- paymentId: String?
- paymentStatus: String?
- dateApproved: DateTime?
- items: List<AdminOrderItem>
- createdAt: DateTime
- updatedAt: DateTime

**Modelo OrderItem:** `AdminOrderItem` (líneas 455-482)
- id: String
- productId: String
- quantity: int
- price: double
- productName: String (desde producto anidado)
- productCode: String? (desde producto anidado)

#### GET /orders/{id}
**Response:** Objeto AdminOrder completo

#### PATCH /orders/{id}/status
**Request:**
```json
{
  "status": "in_production"
}
```

**Response:** Objeto AdminOrder completo

---

### 3.9 Configuraciones

#### GET /settings
**Archivo:** `android/lib/src/features/settings/settings_screen.dart`  
**Modelo Dart:** `Setting` (líneas 485-506)

**Response:**
```json
[
  {
    "id": "string",
    "key": "string",
    "value": "string",
    "description": "string"
  }
]
```

**Campos:**
- id: String
- key: String (único)
- value: String
- description: String?

#### POST /settings
**Request:** Objeto Setting completo (sin id)

**Response:** Objeto Setting completo

#### PUT /settings/{key}
**Request:** Objeto Setting completo

**Response:** Objeto Setting completo

---

### 3.10 Estadísticas

#### GET /statistics/sales
**Archivo:** `android/lib/src/features/statistics/statistics_screen.dart`

**Query Params:**
- from: DateTime (ISO 8601)
- to: DateTime (ISO 8601)

**Response:**
```json
{
  "totalSales": 0.0,
  "totalOrders": 0,
  "averageTicket": 0.0
}
```

#### GET /statistics/top-products
**Archivo:** `android/lib/src/features/statistics/statistics_screen.dart`  
**Modelo Dart:** `TopProduct` (líneas 509-530)

**Response:**
```json
[
  {
    "productId": "string",
    "productName": "string",
    "totalQuantity": 0,
    "totalRevenue": 0.0
  }
]
```

**Campos:**
- productId: String
- productName: String
- totalQuantity: int
- totalRevenue: double

#### GET /statistics/top-categories
**Archivo:** `android/lib/src/features/statistics/statistics_screen.dart`  
**Modelo Dart:** `TopCategory` (líneas 532-553)

**Response:**
```json
[
  {
    "categoryId": "string",
    "categoryName": "string",
    "totalQuantity": 0,
    "totalRevenue": 0.0
  }
]
```

**Campos:**
- categoryId: String
- categoryName: String
- totalQuantity: int
- totalRevenue: double

---

### 3.11 Upload de Imágenes

#### POST /upload/product-images
**Archivo:** `android/lib/src/features/products/product_form_screen.dart`

**Content-Type:** multipart/form-data  
**Campo:** images (array de archivos, máximo 10)  
**Límite:** 10MB por archivo

**Response:**
```json
{
  "urls": ["string"]
}
```

#### POST /upload/flyer-image
**Archivo:** `android/lib/src/features/flyers/flyers_screen.dart`

**Content-Type:** multipart/form-data  
**Campo:** image (archivo único)

**Response:**
```json
{
  "url": "string"
}
```

---

## 4. MODELOS DE DATOS COMPLETOS

### 4.1 Product
**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 169-224

```dart
class Product {
  final String id;
  final String subfamilyId;
  final String name;
  final String? code;
  final String? description;
  final double price;        // Corresponde a normalPrice en backend
  final double webPrice;
  final List<String> images;
  final bool isOffer;
  final String status;
  final bool isActive;
  final int stock;
  final double? cost;
  final int order;
}
```

**Mapeo Backend → APK:**
| Backend (Prisma) | APK (Dart) | Tipo |
|------------------|-------------|------|
| normalPrice | price | double |
| webPrice | webPrice | double |
| offerPrice | (no usado directamente) | - |
| discountPercentage | (no usado directamente) | - |
| labels | (no usado) | JSON |
| features | (no usado) | JSON |
| shortDescription | (no usado) | - |

### 4.2 Category
**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 227-251

```dart
class Category {
  final String id;
  final String name;
  final String? description;
  final int order;
  final bool isActive;
}
```

### 4.3 ProductFamily (Family)
**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 254-281

```dart
class ProductFamily {
  final String id;
  final String categoryId;
  final String name;
  final String? description;
  final int order;
  final bool isActive;
}
```

### 4.4 Subfamily
**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 284-311

```dart
class Subfamily {
  final String id;
  final String familyId;
  final String name;
  final String? description;
  final int order;
  final bool isActive;
}
```

### 4.5 Promotion
**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 314-350

```dart
class Promotion {
  final String id;
  final String title;
  final String? description;
  final double discount;
  final String? code;
  final DateTime startDate;
  final DateTime endDate;
  final bool isActive;
  final bool isWeb;
}
```

### 4.6 Flyer
**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 353-383

```dart
class Flyer {
  final String id;
  final String title;
  final String imageUrl;
  final DateTime startDate;
  final DateTime endDate;
  final bool isActive;
  final int order;
}
```

### 4.7 AdminOrder (Order)
**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 386-453

```dart
class AdminOrder {
  final String id;
  final String status;
  final String deliveryMethod;
  final double subtotal;
  final double discount;
  final double total;
  final double shippingCost;
  final String customerName;
  final String customerPhone;
  final String customerEmail;
  final String? address;
  final String? notes;
  final String? paymentId;
  final String? paymentStatus;
  final DateTime? dateApproved;
  final List<AdminOrderItem> items;
  final DateTime createdAt;
  final DateTime updatedAt;
}
```

### 4.8 AdminOrderItem (OrderItem)
**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 455-482

```dart
class AdminOrderItem {
  final String id;
  final String productId;
  final int quantity;
  final double price;
  final String productName;
  final String? productCode;
}
```

**Nota:** El campo `productName` y `productCode` vienen del producto anidado en la respuesta del backend.

### 4.9 Setting
**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 485-506

```dart
class Setting {
  final String id;
  final String key;
  final String value;
  final String? description;
}
```

### 4.10 TopProduct
**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 509-530

```dart
class TopProduct {
  final String productId;
  final String productName;
  final int totalQuantity;
  final double totalRevenue;
}
```

### 4.11 TopCategory
**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 532-553

```dart
class TopCategory {
  final String categoryId;
  final String categoryName;
  final int totalQuantity;
  final double totalRevenue;
}
```

---

## 5. ESTADOS Y VALIDACIONES

### 5.1 Estados de Producto
**Valor:** `status`  
**Opciones:**
- `available` - Disponible
- `out_of_stock` - Sin stock
- (otros estados pueden existir)

**Validación:** No especificada en el APK, se asume que el backend valida.

### 5.2 Estados de Pedido
**Valor:** `status`  
**Opciones:**
- `pending` - Pendiente
- `payment_pending` - Pago pendiente
- `paid` - Pagado
- `in_production` - En producción
- `ready` - Listo
- `shipped` - Enviado
- `delivered` - Entregado
- `cancelled` - Cancelado

**Uso en Dashboard:**
- `pending` - Pedidos pendientes
- `in_production` - Pedidos en producción
- `ready` - Pedidos listos
- `delivered` - Pedidos entregados

**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 104-107

### 5.3 Métodos de Entrega
**Valor:** `deliveryMethod`  
**Opciones:**
- `pickup` - Retiro en local
- `local_delivery` - Envío local
- `interior_shipping` - Envío al interior

### 5.4 Roles de Usuario
**Valor:** `role`  
**Opciones:**
- `customer` - Cliente
- `admin` - Administrador

**Archivo:** `backend/prisma/schema.prisma`  
**Línea:** 17

---

## 6. FORMULARIOS DEL APK

### 6.1 Formulario de Login
**Archivo:** `android/lib/src/features/auth/login_screen.dart`  
**Campos:**
- email (TextFormField)
- password (TextFormField)

**Validaciones:**
- Email: required, email format
- Password: required, min length 6

### 6.2 Formulario de Producto
**Archivo:** `android/lib/src/features/products/product_form_screen.dart`  
**Campos:**
- name (TextFormField)
- code (TextFormField)
- description (TextFormField)
- shortDescription (TextFormField)
- price (TextFormField - double)
- webPrice (TextFormField - double)
- cost (TextFormField - double)
- stock (TextFormField - int)
- productionTime (TextFormField)
- subfamilyId (Dropdown)
- status (Dropdown)
- isActive (Switch)
- isOffer (Switch)
- isFeatured (Switch)
- isNew (Switch)
- images (Image picker - múltiple)

**Validaciones:**
- name: required
- price: required, > 0
- webPrice: required, > 0
- stock: required, >= 0
- subfamilyId: required

### 6.3 Formulario de Categoría
**Archivo:** `android/lib/src/features/categories/categories_screen.dart`  
**Campos:**
- name (TextFormField)
- description (TextFormField)
- order (TextFormField - int)
- isActive (Switch)

**Validaciones:**
- name: required

### 6.4 Formulario de Familia
**Archivo:** `android/lib/src/features/families/families_screen.dart`  
**Campos:**
- name (TextFormField)
- description (TextFormField)
- categoryId (Dropdown)
- order (TextFormField - int)
- isActive (Switch)

**Validaciones:**
- name: required
- categoryId: required

### 6.5 Formulario de Subfamilia
**Archivo:** `android/lib/src/features/subfamilies/subfamilies_screen.dart`  
**Campos:**
- name (TextFormField)
- description (TextFormField)
- familyId (Dropdown)
- order (TextFormField - int)
- isActive (Switch)

**Validaciones:**
- name: required
- familyId: required

### 6.6 Formulario de Promoción
**Archivo:** `android/lib/src/features/promotions/promotions_screen.dart`  
**Campos:**
- title (TextFormField)
- description (TextFormField)
- discount (TextFormField - double)
- code (TextFormField)
- startDate (DatePicker)
- endDate (DatePicker)
- isActive (Switch)
- isWeb (Switch)

**Validaciones:**
- title: required
- discount: required, > 0, <= 100
- startDate: required
- endDate: required, > startDate

### 6.7 Formulario de Flyer
**Archivo:** `android/lib/src/features/flyers/flyers_screen.dart`  
**Campos:**
- title (TextFormField)
- image (Image picker)
- startDate (DatePicker)
- endDate (DatePicker)
- order (TextFormField - int)
- isActive (Switch)

**Validaciones:**
- title: required
- image: required
- startDate: required
- endDate: required, > startDate

---

## 7. SERVICIOS DEL APK

### 7.1 AuthService
**Archivo:** `android/lib/src/features/auth/auth_service.dart`  
**Métodos:**
- `login(email, password)` → AuthResponse
- `logout()` → void
- `getToken()` → String?
- `isLoggedIn()` → bool
- `getProfile()` → AdminProfile

### 7.2 ProductsService
**Archivo:** `android/lib/src/features/products/products_service.dart`  
**Métodos:**
- `getProducts()` → List<Product>
- `getProductById(id)` → Product
- `createProduct(data)` → Product
- `updateProduct(id, data)` → Product
- `deleteProduct(id)` → void
- `updateProductState(id, isActive)` → Product
- `updateProductFeatured(id, isOffer)` → Product
- `updateProductOrder(id, order)` → Product

### 7.3 CategoriesService
**Archivo:** `android/lib/src/features/categories/categories_screen.dart`  
**Métodos:**
- `getCategories()` → List<Category>
- `getCategoryById(id)` → Category
- `createCategory(data)` → Category
- `updateCategory(id, data)` → Category
- `deleteCategory(id)` → void

### 7.4 FamiliesService
**Archivo:** `android/lib/src/features/families/families_service.dart`  
**Métodos:**
- `getFamilies()` → List<ProductFamily>
- `getFamiliesByCategoryId(categoryId)` → List<ProductFamily>
- `getFamilyById(id)` → ProductFamily
- `createFamily(data)` → ProductFamily
- `updateFamily(id, data)` → ProductFamily
- `deleteFamily(id)` → void

### 7.5 SubfamiliesService
**Archivo:** `android/lib/src/features/subfamilies/subfamilies_screen.dart`  
**Métodos:**
- `getSubfamilies()` → List<Subfamily>
- `getSubfamiliesByFamilyId(familyId)` → List<Subfamily>
- `getSubfamilyById(id)` → Subfamily
- `createSubfamily(data)` → Subfamily
- `updateSubfamily(id, data)` → Subfamily
- `deleteSubfamily(id)` → void

### 7.6 PromotionsService
**Archivo:** `android/lib/src/features/promotions/promotions_screen.dart`  
**Métodos:**
- `getPromotions()` → List<Promotion>
- `getPromotionById(id)` → Promotion
- `createPromotion(data)` → Promotion
- `updatePromotion(id, data)` → Promotion
- `deletePromotion(id)` → void

### 7.7 FlyersService
**Archivo:** `android/lib/src/features/flyers/flyers_screen.dart`  
**Métodos:**
- `getFlyers()` → List<Flyer>
- `getFlyerById(id)` → Flyer
- `createFlyer(data)` → Flyer
- `updateFlyer(id, data)` → Flyer
- `deleteFlyer(id)` → void

### 7.8 OrdersService
**Archivo:** `android/lib/src/features/orders/orders_screen.dart`  
**Métodos:**
- `getOrders()` → List<AdminOrder>
- `getOrderById(id)` → AdminOrder
- `updateOrderStatus(id, status)` → AdminOrder

### 7.9 SettingsService
**Archivo:** `android/lib/src/features/settings/settings_screen.dart`  
**Métodos:**
- `getSettings()` → List<Setting>
- `getSettingByKey(key)` → Setting
- `createSetting(data)` → Setting
- `updateSetting(key, data)` → Setting

### 7.10 StatisticsService
**Archivo:** `android/lib/src/features/statistics/statistics_screen.dart`  
**Métodos:**
- `getSalesStats(from, to)` → Map<String, dynamic>
- `getTopProducts()` → List<TopProduct>
- `getTopCategories()` → List<TopCategory>

---

## 8. MAPEO DE CAMPOS: BACKEND ↔ APK

### 8.1 Producto

| Backend (Prisma) | APK (Dart) | Tipo Backend | Tipo APK | Observación |
|------------------|-------------|--------------|----------|-------------|
| id | id | String | String | ✅ |
| subfamilyId | subfamilyId | String | String | ✅ |
| name | name | String | String | ✅ |
| slug | (no usado) | String | - | No se envía al APK |
| code | code | String? | String? | ✅ |
| shortDescription | (no usado) | String? | - | No se envía al APK |
| description | description | String? | String? | ✅ |
| normalPrice | **price** | Float | **double** | ⚠️ CAMBIO DE NOMBRE |
| webPrice | webPrice | Float | double | ✅ |
| offerPrice | (no usado) | Float? | - | No se envía al APK |
| discountPercentage | (no usado) | Float? | - | No se envía al APK |
| cost | cost | Float | double? | ✅ |
| status | status | String | String | ✅ |
| isFeatured | (no usado) | Boolean | - | No se envía al APK |
| isNew | (no usado) | Boolean | - | No se envía al APK |
| productionTime | (no usado) | String? | - | No se envía al APK |
| displayOrder | **order** | Int | **int** | ⚠️ CAMBIO DE NOMBRE |
| labels | (no usado) | String (JSON) | - | No se envía al APK |
| images | images | String (JSON) | List<String> | ⚠️ CAMBIO DE TIPO |
| features | (no usado) | String (JSON) | - | No se envía al APK |
| isOffer | isOffer | Boolean | bool | ✅ |
| isActive | isActive | Boolean | bool | ✅ |
| stock | stock | Int | int | ✅ |
| deletedAt | (no usado) | DateTime? | - | No se envía al APK |

**Resumen de diferencias:**
1. `normalPrice` → `price` (cambio de nombre)
2. `displayOrder` → `order` (cambio de nombre)
3. `images` es JSON string en backend, List<String> en APK
4. Faltan campos: slug, shortDescription, offerPrice, discountPercentage, isFeatured, isNew, productionTime, labels, features, deletedAt

### 8.2 Categoría

| Backend (Prisma) | APK (Dart) | Tipo Backend | Tipo APK | Observación |
|------------------|-------------|--------------|----------|-------------|
| id | id | String | String | ✅ |
| name | name | String | String | ✅ |
| description | description | String? | String? | ✅ |
| order | order | Int | int | ✅ |
| isActive | isActive | Boolean | bool | ✅ |

**Resumen:** ✅ Sin diferencias

### 8.3 Familia

| Backend (Prisma) | APK (Dart) | Tipo Backend | Tipo APK | Observación |
|------------------|-------------|--------------|----------|-------------|
| id | id | String | String | ✅ |
| categoryId | categoryId | String | String | ✅ |
| name | name | String | String | ✅ |
| description | description | String? | String? | ✅ |
| order | order | Int | int | ✅ |
| isActive | isActive | Boolean | bool | ✅ |

**Resumen:** ✅ Sin diferencias

### 8.4 Subfamilia

| Backend (Prisma) | APK (Dart) | Tipo Backend | Tipo APK | Observación |
|------------------|-------------|--------------|----------|-------------|
| id | id | String | String | ✅ |
| familyId | familyId | String | String | ✅ |
| name | name | String | String | ✅ |
| description | description | String? | String? | ✅ |
| order | order | Int | int | ✅ |
| isActive | isActive | Boolean | bool | ✅ |

**Resumen:** ✅ Sin diferencias

### 8.5 Promoción

| Backend (Prisma) | APK (Dart) | Tipo Backend | Tipo APK | Observación |
|------------------|-------------|--------------|----------|-------------|
| id | id | String | String | ✅ |
| title | title | String | String | ✅ |
| description | description | String? | String? | ✅ |
| discount | discount | Float | double | ✅ |
| code | code | String? | String? | ✅ |
| startDate | startDate | DateTime | DateTime | ✅ |
| endDate | endDate | DateTime | DateTime | ✅ |
| isActive | isActive | Boolean | bool | ✅ |
| isWeb | isWeb | Boolean | bool | ✅ |

**Resumen:** ✅ Sin diferencias

### 8.6 Flyer

| Backend (Prisma) | APK (Dart) | Tipo Backend | Tipo APK | Observación |
|------------------|-------------|--------------|----------|-------------|
| id | id | String | String | ✅ |
| title | title | String | String | ✅ |
| imageUrl | imageUrl | String | String | ✅ |
| startDate | startDate | DateTime | DateTime | ✅ |
| endDate | endDate | DateTime | DateTime | ✅ |
| isActive | isActive | Boolean | bool | ✅ |
| order | order | Int | int | ✅ |

**Resumen:** ✅ Sin diferencias

### 8.7 Pedido (Order)

| Backend (Prisma) | APK (Dart) | Tipo Backend | Tipo APK | Observación |
|------------------|-------------|--------------|----------|-------------|
| id | id | String | String | ✅ |
| userId | (no usado) | String | - | No se envía al APK |
| status | status | String | String | ✅ |
| deliveryMethod | deliveryMethod | String | String | ✅ |
| subtotal | subtotal | Float | double | ✅ |
| discount | discount | Float | double | ✅ |
| total | total | Float | double | ✅ |
| shippingCost | shippingCost | Float | double | ✅ |
| customerName | customerName | String | String | ✅ |
| customerPhone | customerPhone | String | String | ✅ |
| customerEmail | customerEmail | String | String | ✅ |
| address | address | String? | String? | ✅ |
| notes | notes | String? | String? | ✅ |
| paymentId | paymentId | String? | String? | ✅ |
| paymentStatus | paymentStatus | String? | String? | ✅ |
| paymentMethod | (no usado) | String? | - | No se envía al APK |
| merchantOrderId | (no usado) | String? | - | No se envía al APK |
| dateApproved | dateApproved | DateTime? | DateTime? | ✅ |
| confirmedAt | (no usado) | DateTime? | - | No se envía al APK |
| cancelledAt | (no usado) | DateTime? | - | No se envía al APK |

**Resumen:** ✅ Sin diferencias (excepto campos no usados)

### 8.8 OrderItem

| Backend (Prisma) | APK (Dart) | Tipo Backend | Tipo APK | Observación |
|------------------|-------------|--------------|----------|-------------|
| id | id | String | String | ✅ |
| orderId | (no usado) | String | - | No se envía al APK |
| productId | productId | String | String | ✅ |
| quantity | quantity | Int | int | ✅ |
| price | price | Float | double | ✅ |

**Campos adicionales en APK (desde producto anidado):**
- productName: String
- productCode: String?

**Resumen:** ✅ Sin diferencias

### 8.9 Configuración (Setting)

| Backend (Prisma) | APK (Dart) | Tipo Backend | Tipo APK | Observación |
|------------------|-------------|--------------|----------|-------------|
| id | id | String | String | ✅ |
| key | key | String | String | ✅ |
| value | value | String | String | ✅ |
| description | description | String? | String? | ✅ |

**Resumen:** ✅ Sin diferencias

---

## 9. VALIDACIONES DEL APK

### 9.1 Validaciones de Login
- Email: requerido, formato email válido
- Password: requerido, mínimo 6 caracteres

### 9.2 Validaciones de Producto
- name: requerido
- price: requerido, mayor a 0
- webPrice: requerido, mayor a 0
- stock: requerido, mayor o igual a 0
- subfamilyId: requerido

### 9.3 Validaciones de Categoría
- name: requerido

### 9.4 Validaciones de Familia
- name: requerido
- categoryId: requerido

### 9.5 Validaciones de Subfamilia
- name: requerido
- familyId: requerido

### 9.6 Validaciones de Promoción
- title: requerido
- discount: requerido, mayor a 0, menor o igual a 100
- startDate: requerido
- endDate: requerido, mayor a startDate

### 9.7 Validaciones de Flyer
- title: requerido
- image: requerido
- startDate: requerido
- endDate: requerido, mayor a startDate

---

## 10. ALMACENAMIENTO LOCAL

### 10.1 Flutter Secure Storage
**Uso:** Almacenamiento seguro de token y datos de sesión

**Claves almacenadas:**
- `auth_token` - Token JWT
- `admin_name` - Nombre del administrador
- `admin_email` - Email del administrador

**Archivo:** `android/lib/src/features/auth/auth_service.dart`  
**Líneas:** 29-31, 40-42

### 10.2 Shared Preferences
**Uso:** No detectado en los archivos analizados

### 10.3 Estado en Memoria
**Provider:** `authProvider` (StateNotifierProvider)  
**Estado:** `AuthState`  
**Campos:**
- isAuthenticated: bool
- token: String?
- adminName: String?
- adminEmail: String?

**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 9-56

---

## 11. STATE MANAGEMENT

### 11.1 Riverpod
**Tipo:** StateNotifierProvider + FutureProvider  
**Uso:** Gestión de estado global y providers

**Providers principales:**
- `authProvider` - Estado de autenticación
- `themeProvider` - Tema de la app
- `connectivityProvider` - Estado de conectividad
- `pendingActionsProvider` - Acciones pendientes offline
- `dashboardStatsProvider` - Estadísticas del dashboard
- `productsProvider` - Estado de productos

**Archivo:** `android/lib/src/core/providers/providers.dart`

---

## 12. NAVEGACIÓN

### 12.1 GoRouter
**Configuración:** `android/lib/src/app_router.dart`

**Rutas principales:**
- `/` - Splash screen
- `/login` - Login
- `/home` - Dashboard
- `/products` - Lista de productos
- `/products/create` - Crear producto
- `/products/edit/{id}` - Editar producto
- `/categories` - Categorías
- `/families` - Familias
- `/subfamilies` - Subfamilias
- `/promotions` - Promociones
- `/flyers` - Flyers
- `/orders` - Pedidos
- `/settings` - Configuraciones
- `/statistics` - Estadísticas

---

## 13. NOTIFICACIONES

### 13.1 Flutter Local Notifications
**Uso:** Notificaciones locales

**Archivo:** `android/lib/src/core/services/notification_service.dart`

**Tipos de notificación:**
- Pedidos nuevos
- Cambios de estado de pedidos
- Recordatorios

---

## 14. CONECTIVIDAD

### 14.1 Connectivity Plus
**Uso:** Detección de conectividad

**Provider:** `connectivityProvider`  
**Tipo:** StateProvider<bool>

**Uso:**
- Sincronización offline
- Cola de acciones pendientes
- Indicador de estado de conexión

**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Línea:** 59

### 14.2 Pending Actions
**Provider:** `pendingActionsProvider`  
**Tipo:** StateProvider<List<PendingAction>>

**Clase PendingAction:**
- id: String
- type: String
- endpoint: String
- data: Map<String, dynamic>
- timestamp: DateTime

**Uso:** Cola de acciones para sincronizar cuando haya conexión

**Archivo:** `android/lib/src/core/providers/providers.dart`  
**Líneas:** 62-78

---

## 15. LOGGING Y DEBUG

### 15.1 Logs de API
**Implementación:** Dio Interceptors

**Logs de request:**
- Authorization header (parcial, primeros 20 caracteres)
- URL del endpoint
- Método HTTP

**Logs de response:**
- Status code
- URL del endpoint

**Logs de error:**
- Status code
- URL del endpoint
- Mensaje de error

**Archivo:** `android/lib/src/core/network/api_client.dart`  
**Líneas:** 40-71

---

## 16. DEPENDENCIAS PRINCIPALES

### 16.1 Estado y Navegación
- flutter_riverpod: ^2.4.9
- go_router: ^14.0.0

### 16.2 Red
- dio: ^5.4.0

### 16.3 Storage
- shared_preferences: ^2.2.2
- flutter_secure_storage: ^9.0.0

### 16.4 UI
- cupertino_icons: ^1.0.6
- cached_network_image: ^3.3.1
- flutter_slidable: ^3.0.0
- shimmer: ^3.0.0

### 16.5 Utilidades
- intl: ^0.19.0
- image_picker: ^1.0.7
- path_provider: ^2.1.2
- path: ^1.8.3
- connectivity_plus: ^7.0.0

### 16.6 Seguridad
- local_auth: ^2.1.6

### 16.7 Notificaciones
- flutter_local_notifications: ^18.0.0

---

## 17. CONCLUSIONES

### 17.1 El APK es la Fuente de Verdad
✅ El APK define:
- Modelos de datos exactos
- Nombres de campos
- Tipos de datos
- Endpoints consumidos
- Validaciones aplicadas
- Flujo de creación y modificación
- Estados permitidos
- Estructura funcional completa

### 17.2 Diferencias con Backend Actual
⚠️ El backend debe adaptarse al APK, no al revés:

1. **Producto:**
   - Backend: `normalPrice` → APK: `price`
   - Backend: `displayOrder` → APK: `order`
   - Backend: `images` (JSON string) → APK: `images` (List<String>)

2. **Campos no usados por el APK:**
   - slug, shortDescription, offerPrice, discountPercentage
   - isFeatured, isNew, productionTime, labels, features, deletedAt

### 17.3 La Web Debe Adaptarse al APK
❌ La web actual NO es la fuente de verdad  
✅ La web debe consumir el backend igual que el APK  
✅ La web debe usar los mismos nombres de campos que el APK  
✅ La web debe respetar las mismas validaciones que el APK

### 17.4 Flujo Correcto
```
APK (Flutter) → Backend API → Supabase (PostgreSQL)
       ↓
   Web Cliente (debe consumir igual que el APK)
```

---

## 18. PRÓXIMOS PASOS

1. **FASE 3**: Verificar si el backend actual puede reutilizarse o debe crearse uno nuevo alineado al APK
2. **FASE 4**: Verificar buckets de Supabase
3. **FASE 5**: Eliminar web actual
4. **FASE 6**: Crear nueva web alineada al APK
5. **FASE 7**: Implementar Mercado Pago completo
6. **FASE 8**: Sistema de auditoría permanente
7. **FASE 9**: Control de calidad final

---

## 19. EVIDENCIA RECOPILADA

### Archivos Leídos del APK
- ✅ `android/lib/src/core/network/api_client.dart`
- ✅ `android/lib/src/features/auth/auth_service.dart`
- ✅ `android/lib/src/features/products/products_service.dart`
- ✅ `android/lib/src/core/providers/providers.dart`
- ✅ `android/pubspec.yaml`

### Archivos Listados
- ✅ `android/lib/src/features/` (todos los features)

---

*Fin de la auditoría del APK.*