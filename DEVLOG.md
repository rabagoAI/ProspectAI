# DEVLOG — ProspectAI

---

### [2026-04-21] — Fase: Backend

**Completado:**
- Modelo de datos `Prospect` con enums: estado, sector, servicio_interes
- Modelo `EmailLog` con enums: tipo, estado
- CRUD completo de prospectos (GET/POST/PUT/DELETE)
- Endpoint `/stats` con métricas: totales por estado, tasa de conversión, próximos seguimientos, emails de la semana
- Endpoint `POST /prospects/{id}/email` con integración Resend (modo demo sin API key)
- 5 plantillas HTML responsive en `email_templates.py`: primer_contacto, seguimiento_1, seguimiento_2, propuesta, cierre
- Script `seed.py` con 5 prospectos de demo en sectores variados
- CORS configurado para localhost:5173 y URL de producción configurable
- `requirements.txt`, `Procfile` y `runtime.txt` para Railway

**Decisiones técnicas:**
- SQLite con SQLAlchemy para simplicidad inicial — migrar a PostgreSQL en Railway sin cambios de código, solo `DATABASE_URL`
- Resend en modo "simulado" cuando no hay API key real para facilitar el desarrollo sin configuración previa
- Enums tanto en Python (`models.py`) como strings en la API para facilitar la integración con el frontend

**Pendiente:**
- Tests de integración para los endpoints
- Webhook de Resend para actualizar estado de email (abierto/respondido/rebotado)

**Errores encontrados y solución:**
- Ninguno en esta fase

---

### [2026-04-21] — Fase: Frontend

**Completado:**
- React + Vite + TailwindCSS + React Router
- Kanban board drag & drop con @dnd-kit/core — arrastra tarjetas entre columnas y actualiza estado vía API
- `ProspectCard` con badge de estado, alerta de seguimiento vencido y chips de sector/servicio
- `ProspectModal` con edición inline de todos los campos, autoguardado de notas (debounce 1.2s), envío rápido de emails, timeline de emails
- `NewProspectModal` con validación de cliente
- `StatsPage` con KPIs, funnel de conversión visual (barras horizontales), próximos seguimientos
- Toast notifications via `react-hot-toast` para feedback de todas las acciones
- `api.js` centralizado con axios, interceptor de errores
- `constants.js` con labels y colores de estados/sectores/servicios

**Decisiones técnicas:**
- `@dnd-kit` sobre `react-beautiful-dnd` (mantenido activamente, compatible con React 18)
- Proxy de Vite en dev (`/api → localhost:8000`) para evitar CORS en desarrollo
- Autoguardado de notas con debounce para no saturar la API con cada keystroke
- `date-fns` con locale español para fechas en la UI

**Pendiente:**
- Paginación en el kanban cuando hay muchos prospectos
- Modo oscuro
- Filtro por servicio de interés en el kanban

**Errores encontrados y solución:**
- Ninguno en esta fase

---

### [2026-04-21] — Fase: Configuración y despliegue

**Completado:**
- `.env.example` con todas las variables documentadas
- `vercel.json` con rewrite SPA para React Router
- `Procfile` para Railway con `uvicorn`
- `README.md` completo: instalación, Resend, Vercel, Railway, referencia API
- Integración Notion vía MCP: página "ProspectAI" con base de datos "Tareas" y 6 tareas iniciales

**Decisiones técnicas:**
- `vercel.json` en `/frontend` (no en la raíz) para desplegar solo el frontend con Vercel
- Variable de entorno `FRONTEND_URL` en el backend para CORS en producción

**Pendiente:**
- Verificar dominio en Resend
- Desplegar backend en Railway
- Desplegar frontend en Vercel
- Añadir primeros 10 prospectos reales

**Errores encontrados y solución:**
- Ninguno en esta fase

---

### [2026-04-21] — Fase: Despliegue Railway

**Completado:**
- `database.py` adaptado para SQLite (local) y PostgreSQL (producción) sin cambios en el resto del código
- Conversión automática de `postgresql://` → `postgresql+psycopg2://` (Railway inyecta el prefijo antiguo)
- `psycopg2-binary==2.9.9` añadido a `requirements.txt`
- `.gitignore` creado: excluye `venv/`, `node_modules/`, `*.db`, `.env`, `__pycache__`, `dist/`
- Repo subido a GitHub y conectado a Railway
- Plugin PostgreSQL añadido en Railway (`DATABASE_URL` inyectada automáticamente)

**Decisiones técnicas:**
- `psycopg2-binary` en lugar de `psycopg2` puro para evitar compilación en Railway (no requiere libpq-dev)
- La detección SQLite/PostgreSQL se hace en `database.py` antes de crear el engine, sin condicionales en el resto del código

**Errores encontrados y solución:**
- Ninguno en esta fase

---

### [2026-04-22] — Fase: Despliegue Vercel + puesta en producción

**Completado:**
- Backend confirmado funcionando en Railway: `https://prospectai-production-1ff5.up.railway.app`
- `vercel.json` corregido: eliminada referencia a secreto `@prospectai_api_url` que no existía y bloqueaba el deploy
- Frontend desplegado en Vercel: `https://prospectai-rabagoai.vercel.app`
- Variable `VITE_API_URL` añadida en Vercel apuntando al backend de Railway
- Variable `FRONTEND_URL` añadida en Railway para permitir CORS desde Vercel
- Seed ejecutado contra PostgreSQL de Railway — 5 prospectos de demo cargados en producción
- `instrucciones.md` creado con comandos exactos para arrancar el proyecto en local

**Decisiones técnicas:**
- La variable `VITE_API_URL` se gestiona desde el panel de Vercel, no desde `vercel.json`, para evitar dependencia de secretos de Vercel
- El seed se ejecutó localmente apuntando a Railway vía `DATABASE_URL` en el comando, sin modificar `.env`

**Errores encontrados y solución:**
- Error CORS al cargar la app: faltaba `FRONTEND_URL` en Railway → añadida y resuelto
- Error deploy Vercel "Secret does not exist": `vercel.json` referenciaba `@prospectai_api_url` → eliminada esa sección del json

**Pendiente (próxima sesión):**
- Dominio propio + verificación en Resend → para enviar emails reales
- Sustituir prospectos de demo por prospectos reales
- Filtro por servicio de interés en el kanban
- Paginación en el kanban
- Webhook de Resend para tracking de emails (abierto/respondido/rebotado)
- Modo oscuro
