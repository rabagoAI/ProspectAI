from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import date, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

from database import engine, SessionLocal, Base
from models import Prospect, EmailLog, EstadoProspect
from routers import prospects as prospects_router
from routers import emails as emails_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ProspectAI API", version="1.0.0")

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in ALLOWED_ORIGINS if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prospects_router.router)
app.include_router(emails_router.router)


@app.get("/")
def root():
    return {"status": "ok", "app": "ProspectAI API"}


@app.get("/stats")
def estadisticas():
    db: Session = SessionLocal()
    try:
        total = db.query(Prospect).count()

        por_estado = (
            db.query(Prospect.estado, func.count(Prospect.id))
            .group_by(Prospect.estado)
            .all()
        )
        estado_map = {e.value: 0 for e in EstadoProspect}
        for estado, count in por_estado:
            estado_map[estado.value if hasattr(estado, "value") else estado] = count

        clientes = estado_map.get("cliente", 0)
        tasa_conversion = round((clientes / total * 100), 1) if total > 0 else 0

        hoy = date.today()
        proximos_7_dias = (
            db.query(Prospect)
            .filter(
                Prospect.proximo_seguimiento >= hoy,
                Prospect.proximo_seguimiento <= hoy + timedelta(days=7),
            )
            .all()
        )

        semana_pasada = hoy - timedelta(days=7)
        emails_semana = (
            db.query(EmailLog)
            .filter(EmailLog.fecha_envio >= semana_pasada)
            .count()
        )

        return {
            "total_prospects": total,
            "por_estado": estado_map,
            "tasa_conversion": tasa_conversion,
            "proximos_seguimientos": [
                {
                    "id": p.id,
                    "nombre": p.nombre,
                    "empresa": p.empresa,
                    "proximo_seguimiento": p.proximo_seguimiento.isoformat() if p.proximo_seguimiento else None,
                    "estado": p.estado.value if hasattr(p.estado, "value") else p.estado,
                }
                for p in proximos_7_dias
            ],
            "emails_esta_semana": emails_semana,
        }
    finally:
        db.close()
