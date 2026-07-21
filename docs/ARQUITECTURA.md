# Arquitectura del Sistema - Recuerdos de Papel

## Visión General

Sistema de papelería creativa dividido en tres aplicaciones independientes:

1. **Web** - Aplicación para clientes
2. **Backend API** - Corazón del sistema
3. **Android App** - Panel de administración

## Estructura del Monorepo

```
recuerdos-de-papel/
├── backend/          # API REST con Node.js + Express + TypeScript
├── web/              # Aplicación web con React + Vite + TypeScript
├── android/          # App Android nativa con Flutter
├── docs/             # Documentación del proyecto
├── scripts/          # Scripts de automatización
└── docker/           # Configuraciones de Docker
```

## Backend API

### Tecnologías
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite
- JWT para autenticación
- Zod para validación

### Estructura
```
backend/
├── src/
│   ├── config/       # Configuraciones (env, database)
│   ├── controllers/  # Controladores de rutas
│   ├── middlewares/   # Middlewares (auth, validation, error)
│   ├── routes/       # Definición de rutas
│   ├── services/     # Lógica de negocio
│   ├── utils/        # Utilidades
│   ├── types/        # Tipos TypeScript
│   └── index.ts      # Punto de entrada
├── prisma/
│   └── schema.prisma # Schema de base de datos
└── package.json
```

### Modelos de Datos

- **User** - Usuarios (clientes y administradores)
- **Category** - Categorías de productos
- **Family** - Familias dentro de categorías
- **Subfamily** - Subfamilias dentro de familias
- **Product** - Productos personalizados
- **Promotion** - Promociones
- **Flyer** - Flyers publicitarios
- **Order** - Pedidos
- **OrderItem** - Items de pedido

## Web (Clientes)

### Tecnologías
- React 18
- Vite
- TypeScript
- TailwindCSS
- React Router DOM
- Axios

### Estructura
```
web/
├── src/
│   ├── components/   # Componentes reutilizables
│   ├── pages/        # Páginas de la aplicación
│   ├── hooks/        # Custom hooks
│   ├── services/     # Servicios API
│   ├── types/        # Tipos TypeScript
│   ├── utils/        # Utilidades
│   ├── assets/       # Imágenes, iconos
│   ├── App.tsx       # Componente principal
│   └── main.tsx      # Punto de entrada
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

### Funcionalidades
- Ver productos
- Buscar productos
- Comprar
- Pagar (Mercado Pago - futuro)
- Consultar pedidos
- Registrarse

## Android App (Administración)

### Tecnologías
- Flutter
- Dart
- Riverpod (State Management)
- Dio (Networking)

### Estructura
```
android/
├── lib/
│   ├── main.dart           # Punto de entrada
│   ├── screens/            # Pantallas
│   ├── widgets/            # Widgets reutilizables
│   ├── providers/          # Estado con Riverpod
│   ├── services/           # Servicios API
│   ├── models/             # Modelos de datos
│   └── utils/              # Utilidades
├── assets/
│   ├── images/
│   └── icons/
└── pubspec.yaml
```

### Funcionalidades
- Gestión de productos
- Gestión de precios
- Gestión de promociones
- Gestión de flyers
- Gestión de categorías
- Visualización de ventas
- Facturación
- Estadísticas

## Reglas de Negocio

1. **Productos personalizados** - Todos los productos requieren personalización
2. **Tiempo de cancelación** - 2 horas después de acreditado el pago
3. **Transición automática** - Después de 2 horas, el pedido pasa a producción
4. **Métodos de entrega**:
   - Retirar
   - Entrega Local
   - Envío al Interior

## Flujo de Pedidos

```
Cliente realiza pedido
    ↓
Pago con Mercado Pago
    ↓
Pago acreditado
    ↓
2 horas para cancelar
    ↓
Automáticamente a producción
    ↓
Notificación al cliente
```

## Estructura de Productos

```
Categoría
  └── Familia
       └── Subfamilia
            └── Producto
```

Ejemplo:
```
Papelería
  └── Cuadernos
       └── A5
            └── Cuaderno Escolar Personalizado
```

## Seguridad

- JWT para autenticación
- bcrypt para hashing de contraseñas
- Helmet para headers de seguridad
- CORS configurado
- Validación con Zod
- Variables de entorno

## Próximos Pasos

1. Implementar endpoints del backend
2. Crear pantallas de la web
3. Desarrollar app Android
4. Integrar Mercado Pago
5. Testing
6. Deploy