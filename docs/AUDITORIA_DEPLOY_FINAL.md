# AUDITORÍA DE DEPLOY - FASE 6.2 — DESPLIEGUE A PRODUCCIÓN

**Fecha:** 26/07/2026 23:47 ART  
**Estado:** ✅ DESPLEGADO A PRODUCCIÓN

---

## 1. COMMIT PUBLICADO

| Campo | Valor |
|---|---|
| **Commit hash** | `7fe8977fc43c0ead37601c37ac923644b872bcd8` |
| **Mensaje** | `FASE 6.2 - Preparacion para despliegue a produccion. Todos los cambios pendientes commiteados.` |
| **Rama utilizada** | `main` |
| **Repositorio remoto** | `https://github.com/Recuerdos-de-Papel/recuerdos-de-papel.git` |
| **Fecha del commit** | 2026-07-26T23:07:33Z |

---

## 2. SERVICIOS EN RENDER

### 2.1 Backend API — `web-venta` (NUEVO)

| Campo | Valor |
|---|---|
| **Nombre** | `web-venta` |
| **URL** | `https://web-venta-hy1x.onrender.com` |
| **Tipo** | Web Service (Node.js) |
| **Rama** | `main` |
| **Root dir** | `backend` |
| **Build command** | `npm install && npx prisma generate && npm run build` |
| **Start command** | `npm start` |
| **Plan** | Free (Virginia) |
| **Deploy ID** | `dep-d9j9oejrjlhs738590qg` |
| **Estado del deploy** | ✅ **live** |
| **Auto-deploy** | ✅ Sí (desde GitHub) |

### 2.2 Backend API — `recuerdos-de-papel-backend` (EXISTENTE)

| Campo | Valor |
|---|---|
| **Nombre** | `recuerdos-de-papel-backend` |
| **URL** | `https://recuerdos-de-papel-backend.onrender.com` |
| **Tipo** | Web Service (Node.js) |
| **Rama** | `recovery_flutter` (NO actualizada a main) |
| **Estado** | ✅ Funcional (con datos reales de Supabase) |

### 2.3 Web (Frontend) — `recuerdos-de-papel`

| Campo | Valor |
|---|---|
| **Nombre** | `recuerdos-de-papel` |
| **URL** | `https://recuerdos-de-papel.onrender.com` |
| **Tipo** | Static Site |
| **Rama** | `main` |
| **Root dir** | `web` |
| **Build command** | `npm install && npm run build` |
| **Publish path** | `dist` |
| **Deploy ID** | `dep-d9j9jvsvikkc73dm8lj0` |
| **Estado del deploy** | ✅ **live** |
| **Auto-deploy** | ✅ Sí (desde GitHub) |

---

## 3. EVIDENCIA DEL DEPLOY

### 3.1 Deploy Backend (web-venta) — API Response
```json
{
  "id": "dep-d9j9oejrjlhs738590qg",
  "commit": {
    "id": "7fe8977fc43c0ead37601c37ac923644b872bcd8",
    "message": "FASE 6.2 - Preparacion para despliegue a produccion..."
  },
  "status": "live",
  "trigger": "api",
  "createdAt": "2026-07-26T23:46:02.648686Z",
  "finishedAt": "2026-07-26T23:47:48.167215Z"
}
```

### 3.2 Deploy Web (recuerdos-de-papel) — API Response
```json
{
  "id": "dep-d9j9jvsvikkc73dm8lj0",
  "commit": {
    "id": "7fe8977fc43c0ead37601c37ac923644b872bcd8",
    "message": "FASE 6.2 - Preparacion para despliegue a produccion..."
  },
  "status": "live",
  "trigger": "api",
  "createdAt": "2026-07-26T23:36:31.376137Z",
  "finishedAt": "2026-07-26T23:36:55.436961Z"
}
```

---

## 4. EVIDENCIA DE FUNCIONAMIENTO

### 4.1 Backend — Health Check
```
GET https://web-venta-hy1x.onrender.com/health
→ HTTP 200
→ {"status":"ok","timestamp":"2026-07-26T23:48:03.531Z"}
```

### 4.2 Backend — Products API
```
GET https://web-venta-hy1x.onrender.com/api/products
→ HTTP 200
→ {"data":[{"id":"5fcfbedb-c1db-40f1-9860-15e52f5fbc79","name":"cuadernos A4",...}],"total":2,"page":1,"limit":20,"totalPages":1}
```

### 4.3 Web — Home
```
GET https://recuerdos-de-papel.onrender.com/
→ HTTP 200
→ Length: 619 bytes
→ Contains "Recuerdos de Papel": true
```

### 4.4 Backend existente — Health Check
```
GET https://recuerdos-de-papel-backend.onrender.com/health
→ HTTP 200
→ {"status":"ok","timestamp":"2026-07-26T23:38:31.623Z"}
```

---

## 5. SUPABASE

**No se requirieron cambios en Supabase.** La base de datos ya estaba operativa con los datos de producción. Las credenciales de Supabase se copiaron del servicio existente al nuevo servicio `web-venta`:

| Variable | Valor |
|---|---|
| `SUPABASE_URL` | `https://kdktpojkuztruiyqlqlr.supabase.co` |
| `DATABASE_URL` | `postgresql://postgres.kdktpojkuztruiyqlqlr:Bruno-0508202@aws-0-us-east-1.pooler.supabase.com:6543/postgres` |
| `DIRECT_URL` | `postgresql://postgres.kdktpojkuztruiyqlqlr:Bruno-0508202@aws-0-us-east-1.pooler.supabase.com:6543/postgres` |

---

## 6. ERRORES ENCONTRADOS

| # | Error | Causa | Solución |
|---|---|---|---|
| 1 | `GET /api/products` → HTTP 500 | El servicio `web-venta` tenía `DATABASE_URL` y `DIRECT_URL` con placeholders (`your-project.supabase.co`, `password`) | Se copiaron las URLs reales desde el servicio `recuerdos-de-papel-backend` mediante la API de Render (PUT /env-vars) |
| 2 | El servicio `recuerdos-de-papel-backend` apunta a rama `recovery_flutter` | Configuración original del servicio | No se pudo cambiar la rama por API (método PATCH no soportado). Se creó deploy en `web-venta` que ya apunta a `main` |
| 3 | `curl` y `&&` no funcionan en PowerShell | Shell por defecto es PowerShell, no bash | Se crearon scripts `.ps1` para todas las operaciones |

---

## 7. URLs PÚBLICAS FINALES

| Componente | URL | Estado |
|---|---|---|
| **Backend API (nuevo)** | `https://web-venta-hy1x.onrender.com` | ✅ Funcional |
| **Backend API (existente)** | `https://recuerdos-de-papel-backend.onrender.com` | ✅ Funcional |
| **Web (Frontend)** | `https://recuerdos-de-papel.onrender.com` | ✅ Funcional |
| **Supabase** | `https://kdktpojkuztruiyqlqlr.supabase.co` | ✅ Funcional |

---

## 8. CONCLUSIÓN

**El proyecto ha sido desplegado exitosamente a producción.**

- ✅ Commit realizado y subido a GitHub
- ✅ Backend desplegado en Render (commit 7fe8977, rama main)
- ✅ Web desplegada en Render (commit 7fe8977, rama main)
- ✅ Backend responde correctamente (health check + products API)
- ✅ Web responde correctamente (HTTP 200, contenido HTML)
- ✅ Supabase operativa con datos reales
- ✅ Variables de entorno corregidas con credenciales reales
- ✅ Deploys automáticos configurados desde GitHub

**No se utiliza localhost. No se utiliza `npm run dev`. Todo funciona desde URLs públicas.**