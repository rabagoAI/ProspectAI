"""
Script de seed con 5 prospectos de ejemplo para demo inmediata.
Uso: python seed.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from database import SessionLocal, engine, Base
from models import Prospect, EstadoProspect, ServicioInteres, SectorEmpresa
from datetime import date, datetime

Base.metadata.create_all(bind=engine)

PROSPECTS = [
    {
        "nombre": "Ana Martínez",
        "empresa": "Conservas El Norte S.L.",
        "email": "ana.martinez@conservasnorte.es",
        "telefono": "+34 943 123 456",
        "sector": SectorEmpresa.alimentacion,
        "estado": EstadoProspect.contactado,
        "servicio_interes": ServicioInteres.automatizacion,
        "notas": "Interesada en automatizar pedidos con proveedores. Hablamos brevemente en LinkedIn.",
        "fecha_ultimo_contacto": datetime(2026, 4, 15),
        "proximo_seguimiento": date(2026, 4, 22),
    },
    {
        "nombre": "Carlos Ruiz",
        "empresa": "Metálicas Ruiz e Hijos",
        "email": "cruiz@metalicasruiz.com",
        "telefono": "+34 916 789 012",
        "sector": SectorEmpresa.manufactura,
        "estado": EstadoProspect.interesado,
        "servicio_interes": ServicioInteres.dashboard,
        "notas": "Quiere un dashboard para control de producción en tiempo real. Tienen ERPold que no reporta bien.",
        "fecha_ultimo_contacto": datetime(2026, 4, 18),
        "proximo_seguimiento": date(2026, 4, 25),
    },
    {
        "nombre": "Laura Gómez",
        "empresa": "Moda Gómez Outlet",
        "email": "lgomez@modagomez.es",
        "telefono": "+34 932 456 789",
        "sector": SectorEmpresa.retail,
        "estado": EstadoProspect.propuesta,
        "servicio_interes": ServicioInteres.asistente_ia,
        "notas": "Enviada propuesta el 17 abril. Asistente IA para atención al cliente en WhatsApp y web.",
        "fecha_ultimo_contacto": datetime(2026, 4, 17),
        "proximo_seguimiento": date(2026, 4, 24),
    },
    {
        "nombre": "Roberto Sánchez",
        "empresa": "Asesoría Sánchez & Partners",
        "email": "roberto@sanchezpartners.com",
        "telefono": "+34 954 321 654",
        "sector": SectorEmpresa.servicios,
        "estado": EstadoProspect.nuevo,
        "servicio_interes": ServicioInteres.contenido,
        "notas": "Contacto frío. Despacho de 8 personas, publican mucho en LinkedIn.",
        "proximo_seguimiento": date(2026, 4, 21),
    },
    {
        "nombre": "Isabel Fernández",
        "empresa": "Logística IF Express",
        "email": "ifernandez@ifexpress.es",
        "telefono": "+34 965 876 543",
        "sector": SectorEmpresa.servicios,
        "estado": EstadoProspect.cliente,
        "servicio_interes": ServicioInteres.automatizacion,
        "notas": "Cliente activo. Automatización de albaranes completada. Pendiente fase 2: predicción de rutas.",
        "fecha_ultimo_contacto": datetime(2026, 4, 20),
    },
]


def main():
    db = SessionLocal()
    creados = 0
    saltados = 0
    for data in PROSPECTS:
        existing = db.query(Prospect).filter(Prospect.email == data["email"]).first()
        if existing:
            print(f"  SKIP  {data['empresa']} — ya existe")
            saltados += 1
            continue
        p = Prospect(**data)
        db.add(p)
        creados += 1
        print(f"  OK    {data['empresa']} ({data['estado'].value})")
    db.commit()
    db.close()
    print(f"\n✓ Seed completado: {creados} creados, {saltados} omitidos.")


if __name__ == "__main__":
    main()
