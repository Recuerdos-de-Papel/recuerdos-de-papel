# AUDITORÍA DE RECUPERACIÓN 01 - INVENTARIO COMPLETO DEL PROYECTO WEB

**Fecha:** 2026-07-26
**Objetivo:** Inventario completo y verificación del estado real del proyecto web
**Metodología:** Lectura de cada archivo existente, verificación de imports, rutas y dependencias

---

## 1. ESTRUCTURA COMPLETA DEL DIRECTORIO WEB

```
web/
├── .env                          # Variables de entorno (desarrollo)
├── .env.example                  # Variables de entorno de ejemplo
├── index.html                    # HTML base
├── package.json                  # Dependencias y scripts
├── postcss.config.js             # Configuración PostCSS
├── tailwind.config.js            # Configuración Tailwind CSS
├── tsconfig.json                 # Configuración TypeScript
├── vite.config.ts                # Configuración Vite
└── src/
    ├── main.tsx                  # Punto de entrada React
    ├── App.tsx                   # Router y providers
    ├── index.css                 # Estilos globales Tailwind
    ├── api/
    │   └── client.ts             # Cliente Axios centralizado
    ├── components/
    │   ├── Footer.tsx            # Footer con datos hardcodeados
    │   ├── Header.tsx            # Header con navegación
    │   └── ProductCard.tsx       # Tarjeta de producto
    ├── context/
    │   ├── AuthContext.tsx        # Contexto de autenticación
    │   └── CartContext.tsx        # Contexto de carrito
    ├── pages/
    │   ├── Cart.tsx              # Carrito de compras
    │   ├── Categories.tsx        # Categorías
    │   ├── Checkout.tsx          # Finalizar compra
    │   ├── Contact.tsx           # Contacto
    │   ├── Favorites.tsx         # Favoritos
    │   ├── Home.tsx              # Página principal
    │   ├── Login.tsx             # Inicio de sesión
    │   ├── Orders.tsx            # Pedidos
    │   ├── ProductPage.tsx       # Detalle de producto
    │   ├── Products.tsx          # Catálogo de productos
    │   ├── Profile.tsx           # Perfil de usuario
    │   └── Register.tsx          # Registro
    ├── services/
    │   ├── authService.ts        # Servicio de autenticación
    │   ├── favoriteService.ts    # Servicio de favoritos
    │   ├── orderService.ts       # Servicio de pedidos
    │   ├── paymentService.ts     # Servicio de pagos MP
    │   └── productService.ts     # Servicio de productos
    └── types/
        └── index.ts              # Tipos TypeScript
```

---

## 2. INVENTARIO DE ARCHIVOS

### 2.1 Archivos de Configuración (7)

| Archivo | Estado | Líneas | Observaciones |
|---------|--------|--------|---------------|
| `package.json` | ✅ Existe | 38 | Dependencias definidas, scripts configurados |
| `vite.config.ts` | ✅ Existe | 21 | Proxy a localhost:3000, alias @ |
| `tsconfig.json` | ✅ Existe | 25 | Strict mode, paths alias |
| `tailwind.config.js` | ✅ Existe | - | Configuración Tailwind |
| `postcss.config.js` | ✅ Existe | - | Configuración PostCSS |
| `index.html` | ✅ Existe | - | HTML base con div#root |
| `.env` | ✅ Existe | - | VITE_API_URL=http://localhost:3000/api |
| `.env.example` | ✅ Existe | - | Variables de ejemplo |

### 2.2 Punto de Entrada (2)

| Archivo | Estado | Líneas | Imports |
|---------|--------|--------|---------|
| `src/main.tsx` | ✅ Existe | 10 | React, ReactDOM, App, index.css |
| `src/App.tsx` | ✅ Existe | 51 | Router, AuthProvider, CartProvider, Header, Footer, 11 páginas |

### 2.3 API Client (1)

| Archivo | Estado | Líneas | Observaciones |
|---------|--------|--------|---------------|
| `src/api/client.ts` | ✅ Existe | 90 | Axios con interceptors JWT, manejo de errores 401/403/500 |

### 2.4 Tipos TypeScript (1)

| Archivo | Estado | Líneas | Tipos definidos |
|---------|--------|--------|-----------------|
| `src/types/index.ts` | ✅ Existe | 199 | Product, Category, Family, Subfamily, Promotion, Flyer, Order, OrderItem, Address, Favorite, User, LoginRequest, RegisterRequest, AuthResponse, CartItem, Setting, ApiResponse, PaginatedResponse, OrderStatus, DeliveryMethod |

### 2.5 Servicios (5)

| Archivo | Estado | Líneas | Funciones | Usa Axios |
|---------|--------|--------|-----------|-----------|
| `authService.ts` | ✅ Existe | 35 | login, register, getProfile | ✅ Sí |
| `favoriteService.ts` | ✅ Existe | 45 | getFavorites, addToFavorites, removeFromFavorites, isFavorite | ✅ Sí |
| `orderService.ts` | ✅ Existe | 91 | getOrders, getOrderById, createOrder, getAddresses, createAddress, updateAddress, deleteAddress | ✅ Sí |
| `paymentService.ts` | ✅ Existe | 33 | createPaymentPreference, getPaymentStatus | ✅ Sí |
| `productService.ts` | ✅ Existe | 86 | getProducts, getProductById, getCategories, getFamiliesByCategory, getSubfamiliesByFamily, getPromotions, getFlyers | ✅ Sí |

### 2.6 Componentes (3)

| Archivo | Estado | Líneas | Observaciones |
|---------|--------|--------|---------------|
| `Header.tsx` | ✅ Existe | 124 | Logo hardcodeado "Recuerdos de Papel", navegación, carrito, auth |
| `Footer.tsx` | ✅ Existe | - | Datos hardcodeados (WhatsApp, email, dirección, redes) |
| `ProductCard.tsx` | ✅ Existe | - | Tarjeta de producto con imagen, precio, botón |

### 2.7 Contextos (2)

| Archivo | Estado | Líneas | Observaciones |
|---------|--------|--------|---------------|
| `AuthContext.tsx` | ✅ Existe | - | Login, register, logout, persistencia localStorage |
| `CartContext.tsx` | ✅ Existe | - | Agregar, eliminar, cantidades, persistencia localStorage |

### 2.8 Páginas (12)

| Archivo | Estado | Líneas | Ruta | Observaciones |
|---------|--------|--------|------|---------------|
| `Home.tsx` | ✅ Existe | - | `/` | Página principal |
| `Products.tsx` | ✅ Existe | - | `/products` | Catálogo con filtros |
| `Login.tsx` | ✅ Existe | - | `/login` | Formulario login |
| `Register.tsx` | ✅ Existe | - | `/register` | Formulario registro |
| `Cart.tsx` | ✅ Existe | - | `/cart` | Carrito de compras |
| `Checkout.tsx` | ✅ Existe | - | `/checkout` | Checkout con MP |
| `Profile.tsx` | ✅ Existe | - | `/profile` | Perfil de usuario |
| `ProductPage.tsx` | ✅ Existe | - | `/products/:id` | Detalle producto |
| `Categories.tsx` | ✅ Existe | - | `/categories` | Categorías |
| `Favorites.tsx` | ✅ Existe | - | `/favorites` | Favoritos |
| `Orders.tsx` | ✅ Existe | - | `/orders` | Pedidos |
| `Contact.tsx` | ✅ Existe | - | `/contact` | Contacto |

---

## 3. VERIFICACIÓN DE IMPORTS

### 3.1 Imports en App.tsx
| Import | Origen | ¿Existe? |
|--------|--------|----------|
| `./context/AuthContext` | `src/context/AuthContext.tsx` | ✅ |
| `./context/CartContext` | `src/context/CartContext.tsx` | ✅ |
| `./components/Header` | `src/components/Header.tsx` | ✅ |
| `./components/Footer` | `src/components/Footer.tsx` | ✅ |
| `./pages/Home` | `src/pages/Home.tsx` | ✅ |
| `./pages/Products` | `src/pages/Products.tsx` | ✅ |
| `./pages/Login` | `src/pages/Login.tsx` | ✅ |
| `./pages/Register` | `src/pages/Register.tsx` | ✅ |
| `./pages/Cart` | `src/pages/Cart.tsx` | ✅ |
| `./pages/Checkout` | `src/pages/Checkout.tsx` | ✅ |
| `./pages/Profile` | `src/pages/Profile.tsx` | ✅ |
| `./pages/ProductPage` | `src/pages/ProductPage.tsx` | ✅ |
| `./pages/Categories` | `src/pages/Categories.tsx` | ✅ |
| `./pages/Favorites` | `src/pages/Favorites.tsx` | ✅ |
| `./pages/Orders` | `src/pages/Orders.tsx` | ✅ |
| `./pages/Contact` | `src/pages/Contact.tsx` | ✅ |

### 3.2 Imports en Servicios
| Archivo | Importa desde | ¿Existe? |
|---------|---------------|----------|
| `authService.ts` | `../api/client` | ✅ |
| `favoriteService.ts` | `../api/client` | ✅ |
| `orderService.ts` | `../api/client` | ✅ |
| `paymentService.ts` | `../api/client` | ✅ |
| `productService.ts` | `../api/client` | ✅ |

### 3.3 Imports en Componentes
| Archivo | Importa desde | ¿Existe? |
|---------|---------------|----------|
| `Header.tsx` | `../context/AuthContext` | ✅ |
| `Header.tsx` | `../context/CartContext` | ✅ |

---

## 4. VERIFICACIÓN DE RUTAS

| Ruta | Componente | ¿Configurada? |
|------|-----------|----------------|
| `/` | Home | ✅ |
| `/products` | Products | ✅ |
| `/login` | Login | ✅ |
| `/register` | Register | ✅ |
| `/cart` | Cart | ✅ |
| `/checkout` | Checkout | ✅ |
| `/profile` | Profile | ✅ |
| `/products/:id` | ProductPage | ✅ |
| `/categories` | Categories | ✅ |
| `/favorites` | Favorites | ✅ |
| `/orders` | Orders | ✅ |
| `/contact` | Contact | ✅ |

---

## 5. VERIFICACIÓN DE DEPENDENCIAS (package.json)

### Dependencias de Producción
| Dependencia | Versión | ¿Instalada? |
|-------------|---------|-------------|
| react | ^18.2.0 | ❌ No (node_modules no existe) |
| react-dom | ^18.2.0 | ❌ No |
| react-router-dom | ^6.21.1 | ❌ No |
| axios | ^1.6.2 | ❌ No |

### Dependencias de Desarrollo
| Dependencia | Versión | ¿Instalada? |
|-------------|---------|-------------|
| @types/react | ^18.2.48 | ❌ No |
| @types/react-dom | ^18.2.18 | ❌ No |
| @typescript-eslint/eslint-plugin | ^6.21.0 | ❌ No |
| @typescript-eslint/parser | ^6.21.0 | ❌ No |
| @vitejs/plugin-react | ^4.2.1 | ❌ No |
| autoprefixer | ^10.4.17 | ❌ No |
| eslint | ^8.56.0 | ❌ No |
| eslint-plugin-react | ^7.33.2 | ❌ No |
| eslint-plugin-react-hooks | ^4.6.0 | ❌ No |
| eslint-plugin-react-refresh | ^0.4.5 | ❌ No |
| postcss | ^8.4.33 | ❌ No |
| prettier | ^3.1.1 | ❌ No |
| prettier-plugin-tailwindcss | ^0.5.11 | ❌ No |
| tailwindcss | ^3.4.1 | ❌ No |
| typescript | ^5.3.3 | ❌ No |
| vite | ^5.0.12 | ❌ No |

**Total: 4 dependencias producción + 16 dependencias desarrollo = 20 dependencias. NINGUNA instalada.**

---

## 6. ARCHIVOS QUE LA DOCUMENTACIÓN ANTERIOR MENCIONA PERO NO EXISTEN

| Archivo | Documento que lo menciona |
|---------|--------------------------|
| `src/services/flyersService.ts` | AUDITORIA_SINCRONIZACION_COMPLETADA.md, EVIDENCIA_CONSUMO_SERVICIOS_WEB.md |
| `src/services/settingsService.ts` | AUDITORIA_SINCRONIZACION_COMPLETADA.md, EVIDENCIA_CONSUMO_SERVICIOS_WEB.md |
| `src/services/addressService.ts` | AUDITORIA_SINCRONIZACION_APK_WEB.md |
| `src/services/promotionService.ts` | AUDITORIA_FUNCIONAL_CONSUMO_SERVICIOS_WEB.md |
| `src/services/index.ts` | AUDITORIA_SINCRONIZACION_COMPLETADA.md |
| `src/context/SettingsContext.tsx` | EVIDENCIA_CONSUMO_SERVICIOS_WEB.md |
| `src/components/FlyersSection.tsx` | EVIDENCIA_CONSUMO_SERVICIOS_WEB.md |
| `src/components/HeroSection.tsx` | AUDITORIA_FUNCIONAL_CONSUMO_SERVICIOS_WEB.md |
| `src/components/CategoriesSection.tsx` | AUDITORIA_FUNCIONAL_CONSUMO_SERVICIOS_WEB.md |
| `src/components/FeaturedProductsSection.tsx` | AUDITORIA_FUNCIONAL_CONSUMO_SERVICIOS_WEB.md |
| `src/components/ProductFilters.tsx` | AUDITORIA_FUNCIONAL_CONSUMO_SERVICIOS_WEB.md |
| `src/pages/MyAddresses.tsx` | AUDITORIA_SINCRONIZACION_APK_WEB.md |
| `src/pages/MyOrders.tsx` | AUDITORIA_FUNCIONAL_CONSUMO_SERVICIOS_WEB.md |
| `src/pages/OrderDetail.tsx` | AUDITORIA_FUNCIONAL_CONSUMO_SERVICIOS_WEB.md |
| `src/pages/About.tsx` | AUDITORIA_FUNCIONAL_CONSUMO_SERVICIOS_WEB.md |
| `src/pages/Promotions.tsx` | AUDITORIA_FUNCIONAL_CONSUMO_SERVICIOS_WEB.md |
| `src/lib/supabase.ts` | AUDITORIA_INFRAESTRUCTURA.md |

---

## 7. DATOS HARDCODEADOS DETECTADOS

| Componente | Dato Hardcodeado | Línea |
|------------|------------------|-------|
| Header.tsx | Logo "Recuerdos de Papel" (texto) | 24-26 |
| Footer.tsx | WhatsApp, email, dirección, redes sociales | - |
| Contact.tsx | WhatsApp, email, dirección | - |
| ProductPage.tsx | WhatsApp número | - |

---

## 8. CONCLUSIONES DEL INVENTARIO

1. **Estructura base completa**: 31 archivos en web/src/ correctamente organizados
2. **Dependencias NO instaladas**: node_modules no existe, npm install nunca ejecutado
3. **Arquitectura correcta**: Todos los servicios usan Axios → Backend (NO Supabase directo)
4. **Imports correctos**: Todos los imports en App.tsx y servicios apuntan a archivos existentes
5. **Rutas completas**: 12 rutas configuradas en App.tsx
6. **Tipos completos**: 20 interfaces/types definidos basados en APK
7. **16 archivos de documentación no existen**: La documentación anterior es ficticia
8. **Datos hardcodeados**: Logo, WhatsApp, email, dirección, redes sociales están hardcodeados

**Próximo paso (PASO 2):** Instalar dependencias con `npm install`