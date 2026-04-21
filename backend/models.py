from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base


class EstadoProspect(str, enum.Enum):
    nuevo = "nuevo"
    contactado = "contactado"
    interesado = "interesado"
    propuesta = "propuesta"
    cliente = "cliente"
    descartado = "descartado"


class ServicioInteres(str, enum.Enum):
    asistente_ia = "asistente_ia"
    automatizacion = "automatizacion"
    dashboard = "dashboard"
    contenido = "contenido"
    consultoria = "consultoria"


class SectorEmpresa(str, enum.Enum):
    manufactura = "manufactura"
    alimentacion = "alimentación"
    retail = "retail"
    servicios = "servicios"
    otro = "otro"


class TipoEmail(str, enum.Enum):
    primer_contacto = "primer_contacto"
    seguimiento_1 = "seguimiento_1"
    seguimiento_2 = "seguimiento_2"
    propuesta = "propuesta"
    cierre = "cierre"


class EstadoEmail(str, enum.Enum):
    enviado = "enviado"
    abierto = "abierto"
    respondido = "respondido"
    rebotado = "rebotado"


class Prospect(Base):
    __tablename__ = "prospects"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200), nullable=False)
    empresa = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False, unique=True)
    telefono = Column(String(20), nullable=True)
    sector = Column(SAEnum(SectorEmpresa), default=SectorEmpresa.otro)
    estado = Column(SAEnum(EstadoProspect), default=EstadoProspect.nuevo)
    servicio_interes = Column(SAEnum(ServicioInteres), default=ServicioInteres.consultoria)
    notas = Column(Text, nullable=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_ultimo_contacto = Column(DateTime(timezone=True), nullable=True)
    proximo_seguimiento = Column(Date, nullable=True)

    emails = relationship("EmailLog", back_populates="prospect", cascade="all, delete-orphan")


class EmailLog(Base):
    __tablename__ = "email_logs"

    id = Column(Integer, primary_key=True, index=True)
    prospect_id = Column(Integer, ForeignKey("prospects.id"), nullable=False)
    tipo = Column(SAEnum(TipoEmail), nullable=False)
    asunto = Column(String(500), nullable=False)
    cuerpo = Column(Text, nullable=False)
    fecha_envio = Column(DateTime(timezone=True), server_default=func.now())
    estado = Column(SAEnum(EstadoEmail), default=EstadoEmail.enviado)

    prospect = relationship("Prospect", back_populates="emails")
