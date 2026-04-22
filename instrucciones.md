# Instrucciones de desarrollo — ProspectAI

## Arrancar el proyecto en local

Necesitas **dos terminales abiertas**: una para el backend y otra para el frontend.

---

### Terminal 1 — Backend (FastAPI)

```bash
cd ~/Claude/ProspectAI/backend
source venv/bin/activate
uvicorn main:app --reload
```

El backend queda en: `http://localhost:8000`
Documentación interactiva: `http://localhost:8000/docs`

> Si es la primera vez (o quieres datos de demo):
> ```bash
> python seed.py
> ```

---

### Terminal 2 — Frontend (React + Vite)

```bash
cd ~/Claude/ProspectAI/frontend
npm run dev
```

La app queda en: `http://localhost:5173`

> El proxy de Vite redirige `/api/*` → `http://localhost:8000` automáticamente. No hace falta configurar nada más en local.

---

## Requisitos previos (solo la primera vez)

### Backend
```bash
cd ~/Claude/ProspectAI/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend
```bash
cd ~/Claude/ProspectAI/frontend
npm install
```

### Variables de entorno
Crea `backend/.env` con:

```env
# Email (Resend) — sin esto el envío funciona en modo simulado
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
FROM_EMAIL=paco@tudominio.com
FROM_NAME=Francisco García

# Solo necesario en producción (Railway)
# DATABASE_URL=postgresql+psycopg2://...
# FRONTEND_URL=https://tu-app.vercel.app
```

> Sin `.env`, el backend arranca igualmente usando SQLite local y emails en modo simulado.

---

## Producción

| Servicio  | Plataforma | URL                          |
|-----------|------------|------------------------------|
| Backend   | Railway    | Variable `RAILWAY_PUBLIC_DOMAIN` |
| Frontend  | Vercel     | Configurado en `frontend/vercel.json` |

Variables a añadir en Railway: `RESEND_API_KEY`, `FROM_EMAIL`, `FROM_NAME`, `FRONTEND_URL`

---

## Comandos útiles

| Acción                        | Comando                              |
|-------------------------------|--------------------------------------|
| Activar entorno virtual       | `source backend/venv/bin/activate`   |
| Cargar datos de demo          | `cd backend && python seed.py`       |
| Ver logs del backend          | Se muestran en la Terminal 1         |
| Build del frontend            | `cd frontend && npm run build`       |
| Ver API docs                  | `http://localhost:8000/docs`         |
