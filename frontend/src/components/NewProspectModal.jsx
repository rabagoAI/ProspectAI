import { useState } from 'react'
import toast from 'react-hot-toast'
import { createProspect } from '../lib/api'
import { ESTADOS, SECTORES, SERVICIOS } from '../lib/constants'

const INITIAL = {
  nombre: '',
  empresa: '',
  email: '',
  telefono: '',
  sector: 'otro',
  estado: 'nuevo',
  servicio_interes: 'consultoria',
  notas: '',
  proximo_seguimiento: '',
}

export default function NewProspectModal({ onClose, onCreate }) {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.empresa.trim()) e.empresa = 'Requerido'
    if (!form.email.trim()) e.email = 'Requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const payload = {
        ...form,
        proximo_seguimiento: form.proximo_seguimiento || null,
        telefono: form.telefono || null,
        notas: form.notas || null,
      }
      const r = await createProspect(payload)
      toast.success(`${r.data.nombre} añadido correctamente`)
      onCreate(r.data)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const f = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }))
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Nuevo prospecto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nombre *" error={errors.nombre}>
              <input className={`field-input ${errors.nombre ? 'border-red-400' : ''}`} value={form.nombre} onChange={f('nombre')} placeholder="María López" />
            </FormField>
            <FormField label="Empresa *" error={errors.empresa}>
              <input className={`field-input ${errors.empresa ? 'border-red-400' : ''}`} value={form.empresa} onChange={f('empresa')} placeholder="Acme S.L." />
            </FormField>
            <FormField label="Email *" error={errors.email}>
              <input type="email" className={`field-input ${errors.email ? 'border-red-400' : ''}`} value={form.email} onChange={f('email')} placeholder="maria@acme.es" />
            </FormField>
            <FormField label="Teléfono">
              <input className="field-input" value={form.telefono} onChange={f('telefono')} placeholder="+34 600 000 000" />
            </FormField>
            <FormField label="Sector">
              <select className="field-input" value={form.sector} onChange={f('sector')}>
                {SECTORES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </FormField>
            <FormField label="Servicio de interés">
              <select className="field-input" value={form.servicio_interes} onChange={f('servicio_interes')}>
                {SERVICIOS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </FormField>
            <FormField label="Estado inicial">
              <select className="field-input" value={form.estado} onChange={f('estado')}>
                {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </FormField>
            <FormField label="Próximo seguimiento">
              <input type="date" className="field-input" value={form.proximo_seguimiento} onChange={f('proximo_seguimiento')} />
            </FormField>
          </div>
          <FormField label="Notas">
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} value={form.notas} onChange={f('notas')} placeholder="Contexto, referencia, cómo llegó a ti…" />
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {loading ? 'Guardando…' : 'Crear prospecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
