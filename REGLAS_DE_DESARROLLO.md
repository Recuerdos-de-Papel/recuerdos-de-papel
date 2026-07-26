# REGLAS DE DESARROLLO - RECUERDOS DE PAPEL

**Versión:** 1.0  
**Fecha:** 2026-07-26  
**Propósito:** Establecer reglas permanentes para el desarrollo del proyecto

---

## PRINCIPIOS FUNDAMENTALES

### 1. El APK es la Fuente de Verdad del Negocio

- El APK Android administrativo define:
  - Modelos de datos reales
  - Nombres de campos
  - Estados válidos
  - Lógica administrativa
  - Flujo de creación y modificación
  - Estructura funcional

**Regla:** La web y el backend se adaptan al APK. Nunca se modifica el APK para adaptarlo a la web.

---

### 2. El Backend es la Única Capa que Accede a Supabase

- El backend es el intermediario obligatorio entre:
  - APK Android → Backend → Supabase
  - Web Cliente → Backend → Supabase

**Regla:** 
- ❌ La web NUNCA accede directamente a Supabase
- ❌ El APK NUNCA accede directamente a Supabase
- ✅ Todas las operaciones pasan por el backend

---

### 3. Arquitectura de Cuatro Capas

```
APK ADMIN
    ↓
BACKEND (Node.js + Express + TypeScript)
    ↓
SUPABASE (PostgreSQL + Storage)
    ↓
WEB CLIENTE (React + TypeScript)
```

**Regla:** Respetar esta arquitectura en todo momento.

---

## REGLAS DE CIERRE DE FASES

### Criterio Obligatorio para Cerrar una Fase

Ninguna fase se considera completada sin cumplir TODOS estos puntos:

1. ✅ **Código implementado** - Todo el código necesario creado
2. ✅ **Auditoría técnica** - Revisión de arquitectura y tipos
3. ✅ **Auditoría funcional** - Pruebas detalladas documentadas
4. ✅ **Evidencia** - Capturas, logs o respuestas reales
5. ✅ **Corrección de errores** - Todos los problemas resueltos
6. ✅ **Acta de cierre** - Documento firmado de finalización

**Regla:** Si falta algún punto, la fase permanece abierta.

---

### Criterio Específico para Fase 6 (Web Cliente)

Además de los puntos generales, para cerrar la Fase 6 debe demostrarse:

✅ La web compila sin errores  
✅ No hay errores de TypeScript  
✅ No hay errores de Vite  
✅ Todos los endpoints consumidos responden correctamente  
✅ Login y registro funcionan  
✅ El catálogo carga correctamente  
✅ Las imágenes de productos se visualizan  
✅ El carrito funciona  
✅ El checkout genera correctamente la preferencia de Mercado Pago  
✅ Responsive validado en móvil, tablet y escritorio  
✅ **Flujo completo APK → Backend → Supabase → Web validado con evidencia real**  
✅ Todos los errores encontrados durante las pruebas fueron corregidos  
✅ `AUDITORIA_FUNCIONAL_FASE6.md` actualizado con el resultado final de cada prueba  
✅ `ESTADO_DEL_PROYECTO.md` actualizado cambiando el estado de Fase 6 a ✅ Cerrada  

---

## REGLAS DE DOCUMENTACIÓN

### 1. Auditoría Permanente

**Regla:** Todo cambio importante debe documentarse.

**Formato:** Crear `docs/AUDITORIA_CAMBIO_X.md` por cada cambio significativo.

**Contenido obligatorio:**
- Fecha
- Editor
- Archivo modificado
- Cambio realizado
- Motivo
- Problema solucionado
- Código anterior
- Código nuevo
- Prueba realizada
- Resultado
- Estado

---

### 2. Evidencia Requerida

**Regla:** Ningún documento de auditoría puede afirmar que una funcionalidad "funciona" si no existe evidencia de ejecución real.

**Evidencia válida:**
- Capturas de pantalla
- Logs de consola
- Respuestas HTTP reales
- Pruebas documentadas con resultados
- Resultados verificables

**Si solo existe el código:**
- Debe describirse como "implementado"
- Debe describirse como "pendiente de validación"
- ❌ Nunca como "funcionando" o "completado"

**Ejemplos:**
- ✅ "Código implementado, pendiente de pruebas"
- ✅ "Pruebas ejecutadas, evidencia documentada en [captura]"
- ❌ "Funciona correctamente" (sin evidencia)
- ❌ "Completado" (sin validación)

---

### 2. Estado del Proyecto

**Regla:** Mantener siempre actualizado `docs/ESTADO_DEL_PROYECTO.md`.

**Contenido obligatorio:**
- Tabla de estado de todas las fases
- Evidencia de cada fase
- Próximos pasos
- Responsables

**Actualización:** Después de cada fase completada o al detectar cambios.

---

### 3. No Eliminar Código sin Documentar

**Regla:** Antes de eliminar o reescribir código, documentar:
- Por qué se elimina
- Qué lo reemplaza
- Impacto en el sistema
- Fecha de eliminación

---

## REGLAS DE TRABAJO

### 1. No Avanzar sin Validación

**Regla:** No se avanza a la siguiente fase hasta que la fase actual tenga:
- ✅ Código implementado
- ✅ Auditoría técnica
- ✅ Auditoría funcional
- ✅ Evidencia
- ✅ Corrección de errores
- ✅ Acta de cierre

---

### 2. Evidencia antes que Código

**Regla:** No escribir código nuevo sin antes:
- Haber validado la fase anterior
- Tener evidencia de funcionamiento
- Documentar el problema a resolver

---

### 3. Reversibilidad

**Regla:** Todo cambio importante debe:
- Poder revertirse
- Quedar registrado en `AUDITORIA_CAMBIO_X.md`
- Tener un motivo documentado

---

### 4. Trazabilidad

**Regla:** Cualquier persona debe poder ver rápidamente:
- Qué está terminado
- Qué está pendiente
- Qué se modificó
- Por qué se modificó
- Qué evidencia respalda cada fase

---

## FLUJO DE TRABAJO ESTÁNDAR

### Para Cada Fase:

1. **Planificación**
   - Leer reglas de cierre de la fase
   - Crear documento de auditoría funcional
   - Definir criterios de éxito

2. **Implementación**
   - Escribir código
   - Documentar cambios en `AUDITORIA_CAMBIO_X.md`
   - Actualizar `ESTADO_DEL_PROYECTO.md`

3. **Validación**
   - Ejecutar pruebas de auditoría funcional
   - Documentar evidencia (capturas, logs)
   - Corregir errores encontrados

4. **Cierre**
   - Verificar todos los criterios de cierre
   - Actualizar `ESTADO_DEL_PROYECTO.md`
   - Marcar fase como ✅ Cerrada

5. **Siguiente Fase**
   - Solo si la fase anterior está cerrada
   - Repetir desde paso 1

---

## RESPONSABILIDADES

### Propietario del Proyecto
- Ejecutar pruebas de validación funcional
- Documentar evidencia
- Aprobar cierre de fases
- Proveer configuraciones externas (API keys, tokens)

### Desarrollo Técnico
- Implementar código
- Corregir errores
- Documentar cambios
- Mantener arquitectura

---

## PROHIBICIONES

❌ **No está permitido:**
- Avanzar de fase sin validación completa
- Eliminar código sin documentar
- Modificar el APK para adaptarlo a la web
- Acceder a Supabase desde la web directamente
- Crear código sin evidencia de necesidad
- Cerrar una fase sin evidencia funcional
- Modificar el backend sin actualizar la documentación

---

## MANTENIMIENTO

### Actualización de Reglas

- Estas reglas pueden evolucionar
- Cambios deben documentarse en `AUDITORIA_CAMBIO_X.md`
- Aprobación del propietario requerida

### Revisión Periódica

- Revisar cada 3 meses
- Ajustar según experiencia del proyecto
- Documentar cambios

---

## CONTACTO

**Dudas sobre estas reglas:** Consultar `docs/ESTADO_DEL_PROYECTO.md`  
**Estado actual:** Ver tabla de fases en `ESTADO_DEL_PROYECTO.md`  
**Cambios recientes:** Ver `docs/AUDITORIA_CAMBIO_X.md`

---

**Aceptación:** Estas reglas son de cumplimiento obligatorio para todo el equipo de desarrollo.

**Fecha de entrada en vigor:** 2026-07-26