from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, EmailStr

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from database import get_db
from models import Prospect, EmailLog, EstadoProspect, ServicioInteres, SectorEmpresa, EstadoEmail

router = APIRouter(prefix="/prospects", tags=["prospects"])


# ── Schemas ──────────────────────────────────────────────────────────────────

class ProspectCreate(BaseModel):
    nombre: str
    empresa: str
    email: str
    telefono: Optional[str] = None
    sector: SectorEmpresa = SectorEmpresa.otro
    estado: EstadoProspect = EstadoProspect.nuevo
    servicio_interes: ServicioInteres = ServicioInteres.consultoria
    notas: Optional[str] = None
    proximo_seguimiento: Optional[date] = None


class ProspectUpdate(BaseModel):
    nombre: Optional[str] = None
    empresa: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    sector: Optional[SectorEmpresa] = None
    estado: Optional[EstadoProspect] = None
    servicio_interes: Optional[ServicioInteres] = None
    notas: Optional[str] = None
    proximo_seguimiento: Optional[date] = None


class EmailLogOut(BaseModel):
    id: int
    tipo: str
    asunto: str
    cuerpo: str
    fecha_envio: datetime
    estado: str

    class Config:
        from_attributes = True


class ProspectOut(BaseModel):
    id: int
    nombre: str
    empresa: str
    email: str
    telefono: Optional[str]
    sector: str
    estado: str
    servicio_interes: str
    notas: Optional[str]
    fecha_creacion: datetime
    fecha_ultimo_contacto: Optional[datetime]
    proximo_seguimiento: Optional[date]
    emails: List[EmailLogOut] = []

    class Config:
        from_attributes = True


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("", response_model=List[ProspectOut])
def listar_prospects(
    estado: Optional[EstadoProspect] = Query(None),
    sector: Optional[SectorEmpresa] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Prospect)
    if estado:
        q = q.filter(Prospect.estado == estado)
    if sector:
        q = q.filter(Prospect.sector == sector)
    return q.order_by(Prospect.fecha_creacion.desc()).all()


@router.post("", response_model=ProspectOut, status_code=201)
def crear_prospect(data: ProspectCreate, db: Session = Depends(get_db)):
    existing = db.query(Prospect).filter(Prospect.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un prospecto con ese email")
    p = Prospect(**data.model_dump())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


@router.get("/{prospect_id}", response_model=ProspectOut)
def obtener_prospect(prospect_id: int, db: Session = Depends(get_db)):
    p = db.query(Prospect).filter(Prospect.id == prospect_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Prospecto no encontrado")
    return p


@router.put("/{prospect_id}", response_model=ProspectOut)
def actualizar_prospect(prospect_id: int, data: ProspectUpdate, db: Session = Depends(get_db)):
    p = db.query(Prospect).filter(Prospect.id == prospect_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Prospecto no encontrado")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(p, field, value)
    db.commit()
    db.refresh(p)
    return p


@router.delete("/{prospect_id}", status_code=204)
def eliminar_prospect(prospect_id: int, db: Session = Depends(get_db)):
    p = db.query(Prospect).filter(Prospect.id == prospect_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Prospecto no encontrado")
    db.delete(p)
    db.commit()


@router.get("/{prospect_id}/emails", response_model=List[EmailLogOut])
def historial_emails(prospect_id: int, db: Session = Depends(get_db)):
    p = db.query(Prospect).filter(Prospect.id == prospect_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Prospecto no encontrado")
    return db.query(EmailLog).filter(EmailLog.prospect_id == prospect_id).order_by(EmailLog.fecha_envio.desc()).all()
