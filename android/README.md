# Recuerdos de Papel - Admin APK

Aplicación Android nativa para administración de la Papelería Creativa - Recuerdos de Papel.

## Características

### Autenticación
- Login de administrador con JWT
- Sesión persistente con Flutter Secure Storage
- Biometría (si el dispositivo la soporta)
- Cerrar sesión

### Dashboard
- Ventas del día
- Ventas semana
- Ventas mes
- Pedidos pendientes
- Pedidos en producción
- Pedidos listos
- Pedidos entregados
- Ingresos totales

### Productos
- CRUD completo
- Crear, editar, eliminar
- Duplicar productos
- Activar/Desactivar
- Destacar/Oferta
- Orden de productos
- Gestión de precios (costo, precio normal, precio web, oferta)
- Subir múltiples imágenes
- Ordenar imágenes
- Imagen principal

### Categorías
- CRUD completo
- Activar/Desactivar

### Subfamilias
- CRUD completo
- Activar/Desactivar

### Promociones
- CRUD completo
- Fecha inicio/fin
- Descuento
- Activar/Desactivar

### Flyers
- CRUD completo
- Subir imágenes
- Activar/Desactivar

### Pedidos
- Listado completo
- Filtros por estado
- Buscar pedidos
- Ver detalle
- Cambiar estados:
  - Pendiente
  - Pago Pendiente
  - Pago Aprobado
  - En Producción
  - Listo
  - Entregado

### Facturación
- Total día
- Total semana
- Total mes
- Total año

### Estadísticas
- Productos más vendidos
- Categorías más vendidas
- Ingresos
- Pedidos
- Ganancias

### Configuración
- Alias Mercado Pago
- CBU
- QR
- Costo Córdoba
- Costo Interior
- Tiempo Producción
- WhatsApp
- Instagram
- Facebook
- Email

### Sincronización
- Consumir API existente
- No acceder directamente a Supabase

### Offline
- Guardar cambios pendientes
- Sincronizar automáticamente al recuperar Internet

### Notificaciones
- Nuevo pedido
- Pago aprobado
- Pedido cancelado
- Pedido listo

### Seguridad
- JWT
- Refresh Token
- Biometría

### Optimización
- Material 3
- Dark Mode
- Light Mode
- Responsive
- Carga diferida
- Cache inteligente

## Estructura del Proyecto

```
lib/
├── main.dart
├── src/
│   ├── app.dart
│   ├── core/
│   │   ├── providers/
│   │   │   └── providers.dart
│   │   ├── theme/
│   │   │   └── app_theme.dart
│   │   ├── network/
│   │   │   └── api_client.dart
│   │   └── services/
│   │       ├── offline_sync_service.dart
│   │       └── notification_service.dart
│   └── features/
│       ├── auth/
│       │   ├── auth_service.dart
│       │   ├── auth_wrapper.dart
│       │   └── login_screen.dart
│       ├── home/
│       │   └── home_screen.dart
│       ├── products/
│       │   ├── products_service.dart
│       │   ├── products_screen.dart
│       │   └── product_form_screen.dart
│       ├── categories/
│       │   ├── categories_service.dart
│       │   └── categories_screen.dart
│       ├── subfamilies/
│       │   ├── subfamilies_service.dart
│       │   └── subfamilies_screen.dart
│       ├── promotions/
│       │   ├── promotions_service.dart
│       │   └── promotions_screen.dart
│       ├── flyers/
│       │   ├── flyers_service.dart
│       │   └── flyers_screen.dart
│       ├── orders/
│       │   ├── orders_service.dart
│       │   └── orders_screen.dart
│       ├── settings/
│       │   ├── settings_service.dart
│       │   └── settings_screen.dart
│       ├── statistics/
│       │   ├── statistics_service.dart
│       │   └── statistics_screen.dart
│       └── splash/
│           └── splash_screen.dart
```

## Instalación

1. Asegúrate de tener Flutter instalado
2. Ejecuta `flutter pub get` en el directorio `android/`
3. Conecta un dispositivo Android o inicia un emulador
4. Ejecuta `flutter run` para probar la aplicación

## Build Release

```bash
# APK
flutter build apk --release

# AAB
flutter build appbundle --release
```

## API Endpoints

Todos los endpoints consumen la API existente en `http://localhost:3000/api/admin`

- `/auth/login` - Login
- `/auth/profile` - Perfil
- `/products` - Productos
- `/categories` - Categorías
- `/subfamilies` - Subfamilias
- `/promotions` - Promociones
- `/flyers` - Flyers
- `/orders` - Pedidos
- `/settings` - Configuraciones
- `/statistics/sales` - Estadísticas de ventas
- `/statistics/top-products` - Productos más vendidos
- `/statistics/top-categories` - Categorías más vendidas