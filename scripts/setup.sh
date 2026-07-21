#!/bin/bash

# Script de setup inicial para el monorepo

echo "🚀 Configurando Recuerdos de Papel..."

# Instalar dependencias del monorepo
echo "📦 Instalando dependencias..."
npm install

# Configurar backend
echo "🔧 Configurando backend..."
cd backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Archivo .env creado para backend"
fi

# Generar cliente Prisma
echo "🔄 Generando cliente Prisma..."
npx prisma generate

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
npx prisma migrate dev --name init

cd ..

# Configurar web
echo "🔧 Configurando web..."
cd web
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Archivo .env creado para web"
fi

cd ..

echo "✅ Setup completado!"
echo ""
echo "Para iniciar el desarrollo:"
echo "  npm run dev"
echo ""
echo "Backend: http://localhost:3000"
echo "Web: http://localhost:5173"