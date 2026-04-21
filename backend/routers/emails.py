from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
import os
import resend

import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from database import get_db
from models import Prospect, EmailLog, TipoEmail, EstadoEmail
from email_templates import get_template

router = APIRouter(tags=["emails"])


class SendEmailRequest(BaseModel):
    tipo: TipoEmail


@router.post("/prospects/{prospect_id}/email")
def enviar_email(prospect_id: int, body: SendEmailRequest, db: Session = Depends(get_db)):
    p = db.query(Prospect).filter(Prospect.id == prospect_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Prospecto no encontrado")

    api_key = os.getenv("RESEND_API_KEY", "")
    from_email = os.getenv("FROM_EMAIL", "onboarding@resend.dev")
    from_name = os.getenv("FROM_NAME", "ProspectAI")
    remitente = os.getenv("FROM_EMAIL", "paco@tudominio.com")

    servicio_label = {
        "asistente_ia": "Asistente IA",
        "automatizacion": "Automatización de procesos",
        "dashboard": "Dashboard de datos",
        "contenido": "Generación de contenido IA",
        "consultoria": "Consultoría IA",
    }.get(p.servicio_interes.value if hasattr(p.servicio_interes, "value") else p.servicio_interes, "Consultoría IA")

    template = get_template(
        tipo=body.tipo.value if hasattr(body.tipo, "value") else body.tipo,
        nombre=p.nombre,
        empresa=p.empresa,
        servicio=servicio_label,
        remitente=remitente,
    )

    email_log = EmailLog(
        prospect_id=p.id,
        tipo=body.tipo,
        asunto=template["asunto"],
        cuerpo=template["html"],
        estado=EstadoEmail.enviado,
        fecha_envio=datetime.utcnow(),
    )

    if api_key and api_key != "re_test_key":
        try:
            resend.api_key = api_key
            resend.Emails.send({
                "from": f"{from_name} <{from_email}>",
                "to": [p.email],
                "subject": template["asunto"],
                "html": template["html"],
            })
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Error enviando email: {str(e)}")
    else:
        # Modo demo — no envía email real, solo guarda log
        email_log.estado = EstadoEmail.enviado

    p.fecha_ultimo_contacto = datetime.utcnow()

    db.add(email_log)
    db.commit()
    db.refresh(email_log)

    return {
        "mensaje": "Email enviado correctamente" if (api_key and api_key != "re_test_key") else "Email simulado (sin API key real)",
        "email_log_id": email_log.id,
        "asunto": template["asunto"],
    }
