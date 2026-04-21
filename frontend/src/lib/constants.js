export const ESTADOS = [
  { value: 'nuevo', label: 'Nuevo', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  { value: 'contactado', label: 'Contactado', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  { value: 'interesado', label: 'Interesado', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  { value: 'propuesta', label: 'Propuesta', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  { value: 'cliente', label: 'Cliente', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  { value: 'descartado', label: 'Descartado', color: 'bg-red-100 text-red-700', dot: 'bg-red-400' },
]

export const SECTORES = [
  { value: 'manufactura', label: 'Manufactura' },
  { value: 'alimentación', label: 'Alimentación' },
  { value: 'retail', label: 'Retail' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'otro', label: 'Otro' },
]

export const SERVICIOS = [
  { value: 'asistente_ia', label: 'Asistente IA' },
  { value: 'automatizacion', label: 'Automatización' },
  { value: 'dashboard', label: 'Dashboard de datos' },
  { value: 'contenido', label: 'Generación de contenido' },
  { value: 'consultoria', label: 'Consultoría IA' },
]

export const EMAIL_TIPOS = [
  { value: 'primer_contacto', label: 'Primer contacto', icon: '✉️' },
  { value: 'seguimiento_1', label: 'Seguimiento 1', icon: '🔔' },
  { value: 'seguimiento_2', label: 'Seguimiento 2', icon: '🔁' },
  { value: 'propuesta', label: 'Propuesta', icon: '📄' },
  { value: 'cierre', label: 'Cierre', icon: '🤝' },
]

export const getEstado = (value) => ESTADOS.find((e) => e.value === value) || ESTADOS[0]
export const getSector = (value) => SECTORES.find((s) => s.value === value)?.label || value
export const getServicio = (value) => SERVICIOS.find((s) => s.value === value)?.label || value
