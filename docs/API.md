# Documentación de API - Recuerdos de Papel

## Base URL
```
http://localhost:3000/api
```

## Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación.

### Headers requeridos
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Endpoints

### Productos

#### GET /api/products
Obtener lista de productos (público)

**Query Parameters:**
- `category` (opcional): Filtrar por categoría
- `family` (opcional): Filtrar por familia
- `subfamily` (opcional): Filtrar por subfamilia
- `search` (opcional): Buscar por nombre
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Items por página (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Cuaderno A5",
      "description": "Descripción del producto",
      "price": 15000,
      "images": ["url1", "url2"],
      "stock": 100,
      "subfamily": {
        "id": "uuid",
        "name": "A5",
        "family": {
          "id": "uuid",
          "name": "Cuadernos",
          "category": {
            "id": "uuid",
            "name": "Papelería"
          }
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

#### GET /api/products/:id
Obtener producto por ID (público)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Cuaderno A5",
    "description": "Descripción del producto",
    "price": 15000,
    "images": ["url1", "url2"],
    "stock": 100
  }
}
```

### Categorías

#### GET /api/categories
Obtener todas las categorías (público)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Papelería",
      "description": "Productos de papelería",
      "families": [
        {
          "id": "uuid",
          "name": "Cuadernos",
          "subfamilies": [
            {
              "id": "uuid",
              "name": "A5"
            }
          ]
        }
      ]
    }
  ]
}
```

### Pedidos

#### POST /api/orders
Crear pedido (requiere autenticación)

**Request:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "deliveryMethod": "pickup",
  "customerName": "Juan Pérez",
  "customerPhone": "3511234567",
  "customerEmail": "juan@example.com",
  "address": "Calle 123",
  "notes": "Instrucciones especiales"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "pending",
    "total": 30000,
    "paymentId": "mercadopago_id",
    "initPoint": "https://mercadopago.com/..."
  }
}
```

#### GET /api/orders
Obtener pedidos del usuario autenticado (requiere autenticación)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "status": "pending",
      "total": 30000,
      "items": [...],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET /api/orders/:id
Obtener pedido por ID (requiere autenticación)

### Usuarios

#### POST /api/auth/register
Registrar usuario (público)

**Request:**
```json
{
  "email": "juan@example.com",
  "password": "password123",
  "name": "Juan Pérez",
  "phone": "3511234567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "token": "jwt_token"
  }
}
```

#### POST /api/auth/login
Iniciar sesión (público)

**Request:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "role": "customer",
    "token": "jwt_token"
  }
}
```

### Promociones

#### GET /api/promotions
Obtener promociones activas (público)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Descuento 20%",
      "description": "En todos los cuadernos",
      "discount": 20,
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    }
  ]
}
```

### Flyers

#### GET /api/flyers
Obtener flyers activos (público)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Oferta de Verano",
      "imageUrl": "https://...",
      "order": 1
    }
  ]
}
```

## Códigos de Estado

- `200` - Éxito
- `201` - Creado
- `400` - Solicitud incorrecta
- `401` - No autorizado
- `403` - Prohibido
- `404` - No encontrado
- `500` - Error interno del servidor

## Formato de Respuesta

Todas las respuestas siguen este formato:

**Éxito:**
```json
{
  "success": true,
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "error": "Mensaje de error"
}