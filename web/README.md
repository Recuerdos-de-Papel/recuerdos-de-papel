# Web - Recuerdos de Papel

Aplicación web para clientes de la Papelería Creativa.

## Tecnologías

- React 18
- Vite
- TypeScript
- TailwindCSS
- React Router DOM
- Axios

## Requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

## Instalación

```bash
npm install
```

## Configuración

1. Copiar el archivo de variables de entorno:
```bash
cp .env.example .env
```

2. Editar .env con tus configuraciones:
```env
VITE_API_URL=http://localhost:3000/api
```

## Desarrollo

```bash
npm run dev
```

La aplicación correrá en http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Estructura

```
src/
├── components/   # Componentes reutilizables
├── pages/        # Páginas de la aplicación
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── Cart.tsx
│   └── Orders.tsx
├── hooks/        # Custom hooks
├── services/     # Servicios API
├── types/        # Tipos TypeScript
├── utils/        # Utilidades
└── assets/       # Imágenes, iconos
```

## Funcionalidades

- Ver productos
- Buscar productos
- Comprar
- Pagar (Mercado Pago - futuro)
- Consultar pedidos
- Registrarse

## Scripts

| Script | Descripción |
|--------|-------------|
| dev | Desarrollo con Vite |
| build | Build para producción |
| preview | Preview del build |
| lint | Ejecutar ESLint |
| lint:fix | Corregir errores de lint |
| format | Formatear con Prettier |