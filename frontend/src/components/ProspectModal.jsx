import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { updateProspect, deleteProspect, sendEmail, getEmailHistory } from '../lib/api'
import { ESTADOS, SECTORES, SERVICIOS, EMAIL_TIPOS, getEstado } from '../lib/constants'
import StateBadge from './StateBadge'

export default function ProspectModal({ prospect: initial, onClose, onUpdate, onDelete }) {
  const [prospect, setProspect] = useState(initial)
  const [emails, setEmails] = useState([])
  const [saving, setSaving] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(null)
  const [loadingEmails, setLoadingEmails] = useState(true)
  const [notesTimer, setNotesTimer] = useState(null)

  useEffect(() => {
    getEmailHistory(initial.id)
      .then((r) => setEmails(r.data))
      .finally(() => setLoadingEmails(false))
  }, [initial.id])

  const handleField = (field, value) => {
    setProspect((p) => ({ ...p, [field]: value }))
  }

  const handleSave = async (fields) => {
    setSaving(true)
    try {
      const r = await updateProspect(prospect.id, fields)
      setProspect(r.data)
      onUpdate(r.data)
      toast.success('Guardado')
    } finally {
      setSaving(false)
    }
  }

  const handleNotes = (value) => {
    handleField('notas', value)
    if (notesTimer) clearTimeout(notesTimer)
    setNotesTimer(setTimeout(() => handleSave({ notas: value }), 1200))
  }

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar a ${prospect.nombre}? Esta acción no se puede deshacer.`)) return
    await deleteProspect(prospect.id)
    toast.success('Prospecto eliminado')
    onDelete(prospect.id)
    onClose()
  }

  const handleSendEmail = async (tipo) => {
    setSendingEmail(tipo)
    try {
      const r = await sendEmail(prospect.id, tipo)
      toast.success(r.data.mensaje)
      const updated = await getEmailHistory(prospect.id)
      setEmails(updated.data)
    } finally {
      setSendingEmail(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{prospect.nombre}</h2>
            <p className="text-sm text-gray-500">{prospect.empresa}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-colors text-sm"
              title="Eliminar"
            >
              🗑️
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Campos editables */}
          <section className="grid grid-cols-2 gap-4">
            <Field label="Nombre">
              <input
                className="field-input"
                value={prospect.nombre}
                onChange={(e) => handleField('nombre', e.target.value)}
                onBlur={() => handleSave({ nombre: prospect.nombre })}
              />
            </Field>
            <Field label="Empresa">
              <input
                className="field-input"
                value={prospect.empresa}
                onChange={(e) => handleField('empresa', e.target.value)}
                onBlur={() => handleSave({ empresa: prospect.empresa })}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                className="field-input"
                value={prospect.email}
                onChange={(e) => handleField('email', e.target.value)}
                onBlur={() => handleSave({ email: prospect.email })}
              />
            </Field>
            <Field label="Teléfono">
              <input
                className="field-input"
                value={prospect.telefono || ''}
                onChange={(e) => handleField('telefono', e.target.value)}
                onBlur={() => handleSave({ telefono: prospect.telefono })}
              />
            </Field>
            <Field label="Sector">
              <select
                className="field-input"
                value={prospect.sector}
                onChange={(e) => handleSave({ sector: e.target.value })}
              >
                {SECTORES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Servicio de interés">
              <select
                className="field-input"
                value={prospect.servicio_interes}
                onChange={(e) => handleSave({ servicio_interes: e.target.value })}
              >
                {SERVICIOS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Estado">
              <select
                className="field-input"
                value={prospect.estado}
                onChange={(e) => handleSave({ estado: e.target.value })}
              >
                {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </Field>
            <Field label="Próximo seguimiento">
              <input
                type="date"
                className="field-input"
                value={prospect.proximo_seguimiento || ''}
                onChange={(e) => handleSave({ proximo_seguimiento: e.target.value || null })}
              />
            </Field>
          </section>

          {/* Notas */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Notas {saving && <span className="text-blue-500 normal-case font-normal">· guardando…</span>}
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={prospect.notas || ''}
              onChange={(e) => handleNotes(e.target.value)}
              placeholder="Añade notas sobre este prospecto…"
            />
          </section>

          {/* Envío de emails */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Enviar email</h3>
            <div className="flex flex-wrap gap-2">
              {EMAIL_TIPOS.map((t) => (
                <button
                  key={t.value}
                  disabled={sendingEmail !== null}
                  onClick={() => handleSendEmail(t.value)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{t.icon}</span>
                  {sendingEmail === t.value ? 'Enviando…' : t.label}
                </button>
              ))}
            </div>
          </section>

          {/* Timeline emails */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Historial de emails</h3>
            {loadingEmails ? (
              <p className="text-sm text-gray-400">Cargando…</p>
            ) : emails.length === 0 ? (
              <p className="text-sm text-gray-400">No hay emails enviados todavía.</p>
            ) : (
              <div className="space-y-2">
                {emails.map((e) => (
                  <div key={e.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{e.asunto}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {format(new Date(e.fecha_envio), 'd MMM yyyy, HH:mm')} · {e.tipo.replace('_', ' ')}
                      </p>
                    </div>
                    <EmailEstadoBadge estado={e.estado} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      {children}
    </div>
  )
}

function EmailEstadoBadge({ estado }) {
  const map = {
    enviado: 'bg-blue-100 text-blue-700',
    abierto: 'bg-green-100 text-green-700',
    respondido: 'bg-purple-100 text-purple-700',
    rebotado: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${map[estado] || 'bg-gray-100 text-gray-600'}`}>
      {estado}
    </span>
  )
}
