# ProspectAI

CRM minimalista para freelancers de tecnología/IA que buscan clientes PYMEs en España.

## Stack
- **Frontend**: React + Vite + TailwindCSS + @dnd-kit
- **Backend**: FastAPI + SQLite (SQLAlchemy)
- **Email**: Resend API
- **Deploy**: Vercel (frontend) + Railway (backend)

---

## Instalación local

### 1. Clonar y copiar variables de entorno

```bash
git clone <repo>
cd ProspectAI
cp .env.example .env
# Edita .env con tus valores reales
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Arrancar el servidor
uvicorn main:app --reload
# → http://localhost:8000
# → Docs: http://localhost:8000/docs

# Cargar datos de demo (opcional)
python seed.py
```

### 3. Frontend

```bash
cd frontend
npm install

# Crear .env.local con la URL del backend
echo "VITE_API_URL=http://localhost:8000" > .env.local

npm run dev
# → http://localhost:5173
```

---

## Configurar Resend (envío de emails)

1. Regístrate en [resend.com](https://resend.com)
2. Verifica tu dominio en *Domains* → añade los registros DNS
3. Crea una API Key en *API Keys*
4. Añade en `.env`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxx
   FROM_EMAIL=paco@tudominio.com
   FROM_NAME=Francisco García
   ```

> Si no configuras Resend, los emails se **simulan** (se guardan en la base de datos sin enviarse).

---

## Despliegue

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod

# En el dashboard de Vercel, añade la variable de entorno:
# VITE_API_URL=https://tu-backend.railway.app
```

O conecta el repositorio GitHub a Vercel con estas settings:
- **Framework**: Vite
- **Root directory**: `frontend`
- **Build command**: `npm run build`
- **Output directory**: `dist`

### Backend → Railway

1. Crea un nuevo proyecto en [railway.app](https://railway.app)
2. Conecta el repositorio → selecciona la carpeta `backend`
3. Railway detecta el `Procfile` automáticamente
4. Añade las variables de entorno en el dashboard de Railway
5. Copia la URL generada y úsala como `VITE_API_URL` en Vercel

---

## Estructura del proyecto

```
ProspectAI/
├── frontend/
│   ├── src/
│   │   ├── components/    # ProspectCard, ProspectModal, NewProspectModal
│   │   ├── pages/         # KanbanBoard, StatsPage
│   │   └── lib/           # api.js, constants.js
│   └── vercel.json
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── email_templates.py
│   ├── seed.py
│   ├── routers/
│   │   ├── prospects.py
│   │   └── emails.py
│   ├── requirements.txt
│   └── Procfile
├── .env.example
└── README.md
```

---

## API reference

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/prospects` | Listar prospectos (filtros: `estado`, `sector`) |
| POST | `/prospects` | Crear prospecto |
| GET | `/prospects/{id}` | Obtener prospecto |
| PUT | `/prospects/{id}` | Actualizar |
| DELETE | `/prospects/{id}` | Eliminar |
| POST | `/prospects/{id}/email` | Enviar email (`tipo` en body) |
| GET | `/prospects/{id}/emails` | Historial de emails |
| GET | `/stats` | Métricas y estadísticas |

Documentación interactiva: `http://localhost:8000/docs`
