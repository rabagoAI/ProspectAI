"""
Plantillas de email HTML responsive para ProspectAI.
Variables disponibles: {nombre}, {empresa}, {servicio}, {remitente}
"""

BASE_STYLE = """
<style>
  body { margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  .header { background: #1e293b; padding: 28px 40px; }
  .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.3px; }
  .header p { color: #94a3b8; margin: 4px 0 0; font-size: 13px; }
  .body { padding: 36px 40px; color: #374151; line-height: 1.7; font-size: 15px; }
  .body h2 { color: #1e293b; font-size: 18px; margin-top: 0; }
  .cta { display: inline-block; margin: 24px 0; background: #2563eb; color: #ffffff !important; padding: 13px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 28px 0; }
  .signature { font-size: 14px; color: #6b7280; }
  .signature strong { color: #1e293b; display: block; margin-bottom: 4px; font-size: 15px; }
  .tag { display: inline-block; background: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px; margin-bottom: 16px; }
  .footer { background: #f8fafc; padding: 18px 40px; border-top: 1px solid #e5e7eb; }
  .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
  ul { padding-left: 20px; }
  ul li { margin-bottom: 8px; }
</style>
"""


def _wrap(header_title: str, header_subtitle: str, body: str, footer_note: str = "") -> str:
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  {BASE_STYLE}
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>{header_title}</h1>
      <p>{header_subtitle}</p>
    </div>
    <div class="body">
      {body}
    </div>
    <div class="footer">
      <p>{footer_note or "Este email fue enviado desde ProspectAI · Si no desea recibir más comunicaciones, responda con BAJA en el asunto."}</p>
    </div>
  </div>
</body>
</html>"""


TEMPLATES = {
    "primer_contacto": {
        "asunto": "Una idea para {empresa} que quería compartirte",
        "html": lambda nombre, empresa, servicio, remitente: _wrap(
            header_title="Hola, {nombre} 👋".format(nombre=nombre),
            header_subtitle="Una propuesta breve para {empresa}".format(empresa=empresa),
            body="""
<span class="tag">Primer contacto</span>
<p>Hola {nombre},</p>
<p>Mi nombre es {remitente} y trabajo ayudando a empresas como {empresa} a sacar partido de la inteligencia artificial de forma práctica, sin grandes inversiones ni proyectos interminables.</p>
<p>En concreto, me especializo en <strong>{servicio}</strong>. Empresas similares a la tuya han conseguido:</p>
<ul>
  <li>Reducir tiempo en tareas repetitivas hasta un 60 %</li>
  <li>Tomar mejores decisiones con datos en tiempo real</li>
  <li>Ofrecer una experiencia más ágil a sus clientes</li>
</ul>
<p>Me gustaría explicarte en <strong>20 minutos</strong> cómo podría aplicarse esto en {empresa}, sin compromiso.</p>
<a href="mailto:{remitente}?subject=Llamada%20con%20{empresa}" class="cta">Reservar 20 minutos</a>
<hr class="divider">
<div class="signature">
  <strong>{remitente}</strong>
  Consultor IA & Automatización · Freelance<br>
  <a href="mailto:{remitente}" style="color:#2563eb;">{remitente}</a>
</div>
""".format(nombre=nombre, empresa=empresa, servicio=servicio, remitente=remitente)
        ),
    },

    "seguimiento_1": {
        "asunto": "Re: propuesta para {empresa} — ¿lo viste?",
        "html": lambda nombre, empresa, servicio, remitente: _wrap(
            header_title="Un recordatorio amable",
            header_subtitle="Para {empresa}".format(empresa=empresa),
            body="""
<span class="tag">Seguimiento · día 5</span>
<p>Hola {nombre},</p>
<p>La semana pasada te envié un email sobre cómo podría ayudar a <strong>{empresa}</strong> con <strong>{servicio}</strong>. Quizás se perdió entre otros correos, o simplemente no era el momento.</p>
<p>Lo entiendo perfectamente. Solo quería asegurarme de que lo habías visto y preguntarte si tienes alguna duda o si prefieres que te contacte en otro momento.</p>
<p>Si no es algo relevante para ti ahora mismo, dímelo sin problema — no volveré a escribirte.</p>
<a href="mailto:{remitente}?subject=Re:%20{empresa}" class="cta">Responder aquí</a>
<hr class="divider">
<div class="signature">
  <strong>{remitente}</strong>
  Consultor IA & Automatización · Freelance<br>
  <a href="mailto:{remitente}" style="color:#2563eb;">{remitente}</a>
</div>
""".format(nombre=nombre, empresa=empresa, servicio=servicio, remitente=remitente)
        ),
    },

    "seguimiento_2": {
        "asunto": "Caso real que puede interesarte, {nombre}",
        "html": lambda nombre, empresa, servicio, remitente: _wrap(
            header_title="Último intento — con algo concreto",
            header_subtitle="Para {empresa}".format(empresa=empresa),
            body="""
<span class="tag">Seguimiento · último intento</span>
<p>Hola {nombre},</p>
<p>Sé que estás ocupado/a, así que seré directo/a: este es mi último email.</p>
<p>Quería compartir un ejemplo real antes de cerrar el hilo. Una empresa del mismo sector que {empresa} implementó <strong>{servicio}</strong> en 3 semanas y consiguió:</p>
<ul>
  <li>Automatizar el 40 % de su proceso de atención al cliente</li>
  <li>Ahorrar unas 12 horas semanales en tareas administrativas</li>
  <li>Recuperar la inversión en el primer mes</li>
</ul>
<p>Si en algún momento esto cobra sentido para {empresa}, aquí estaré. Solo tienes que escribirme.</p>
<a href="mailto:{remitente}?subject=Hablemos%20de%20{empresa}" class="cta">Escribirme cuando quieras</a>
<hr class="divider">
<div class="signature">
  <strong>{remitente}</strong>
  Consultor IA & Automatización · Freelance<br>
  <a href="mailto:{remitente}" style="color:#2563eb;">{remitente}</a>
</div>
""".format(nombre=nombre, empresa=empresa, servicio=servicio, remitente=remitente)
        ),
    },

    "propuesta": {
        "asunto": "Propuesta para {empresa} — {servicio}",
        "html": lambda nombre, empresa, servicio, remitente: _wrap(
            header_title="Propuesta formal",
            header_subtitle="{servicio} para {empresa}".format(servicio=servicio, empresa=empresa),
            body="""
<span class="tag">Propuesta</span>
<p>Hola {nombre},</p>
<p>Gracias por el tiempo que dedicaste a nuestra conversación. Como prometí, aquí tienes la propuesta para <strong>{empresa}</strong>.</p>
<h2 style="font-size:16px; color:#1e293b;">¿Qué incluye?</h2>
<ul>
  <li><strong>Análisis inicial</strong> de procesos y puntos de mejora (1 semana)</li>
  <li><strong>Desarrollo e implementación</strong> de {servicio} adaptado a {empresa} (2-3 semanas)</li>
  <li><strong>Formación</strong> al equipo y documentación completa</li>
  <li><strong>Soporte</strong> durante 30 días tras la entrega</li>
</ul>
<h2 style="font-size:16px; color:#1e293b;">Inversión</h2>
<p>El coste total del proyecto es de <strong>[PRECIO]€</strong> (IVA no incluido), pagadero en dos partes: 50 % al inicio y 50 % a la entrega.</p>
<p>Esta propuesta tiene validez de <strong>15 días</strong>. Si tienes cualquier duda o quieres ajustar el alcance, dímelo y lo revisamos juntos.</p>
<a href="mailto:{remitente}?subject=Acepto%20propuesta%20{empresa}" class="cta">Aceptar propuesta</a>
<hr class="divider">
<div class="signature">
  <strong>{remitente}</strong>
  Consultor IA & Automatización · Freelance<br>
  <a href="mailto:{remitente}" style="color:#2563eb;">{remitente}</a>
</div>
""".format(nombre=nombre, empresa=empresa, servicio=servicio, remitente=remitente)
        ),
    },

    "cierre": {
        "asunto": "¿Alguna duda sobre la propuesta de {empresa}?",
        "html": lambda nombre, empresa, servicio, remitente: _wrap(
            header_title="¿Todo claro con la propuesta?",
            header_subtitle="Seguimiento post-propuesta · {empresa}".format(empresa=empresa),
            body="""
<span class="tag">Cierre</span>
<p>Hola {nombre},</p>
<p>Hace unos días te envié la propuesta para implementar <strong>{servicio}</strong> en {empresa}. Quería asegurarme de que todo está claro y de que no te ha quedado ninguna duda sin responder.</p>
<p>A veces surgen preguntas sobre el proceso, los plazos o la forma de pago que es mejor resolver antes de avanzar. Estoy disponible para una llamada rápida esta semana si lo necesitas.</p>
<p>Si la propuesta no encaja por cualquier motivo, también me lo puedes decir con total libertad — lo valoraré igualmente.</p>
<a href="mailto:{remitente}?subject=Dudas%20propuesta%20{empresa}" class="cta">Resolver mis dudas</a>
<hr class="divider">
<div class="signature">
  <strong>{remitente}</strong>
  Consultor IA & Automatización · Freelance<br>
  <a href="mailto:{remitente}" style="color:#2563eb;">{remitente}</a>
</div>
""".format(nombre=nombre, empresa=empresa, servicio=servicio, remitente=remitente)
        ),
    },
}


def get_template(tipo: str, nombre: str, empresa: str, servicio: str, remitente: str) -> dict:
    """Devuelve {'asunto': str, 'html': str} para el tipo de email indicado."""
    if tipo not in TEMPLATES:
        raise ValueError(f"Template '{tipo}' no existe. Opciones: {list(TEMPLATES.keys())}")
    t = TEMPLATES[tipo]
    return {
        "asunto": t["asunto"].format(nombre=nombre, empresa=empresa, servicio=servicio, remitente=remitente),
        "html": t["html"](nombre=nombre, empresa=empresa, servicio=servicio, remitente=remitente),
    }
