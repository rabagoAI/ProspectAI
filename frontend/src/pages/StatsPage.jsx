import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getStats } from '../lib/api'
import { ESTADOS, getEstado } from '../lib/constants'

const FUNNEL_ORDER = ['nuevo', 'contactado', 'interesado', 'propuesta', 'cliente']

export default function StatsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats()
      .then((r) => setStats(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">Cargando estadísticas…</div>
  )

  if (!stats) return null

  const maxFunnel = Math.max(...FUNNEL_ORDER.map((e) => stats.por_estado[e] || 0), 1)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="Total prospects" value={stats.total_prospects} icon="👥" />
        <KpiCard label="Tasa de conversión" value={`${stats.tasa_conversion}%`} icon="📈" />
        <KpiCard label="Emails esta semana" value={stats.emails_esta_semana} icon="✉️" />
        <KpiCard label="Próximos seguimientos" value={stats.proximos_seguimientos.length} icon="📅" />
      </div>

      {/* Funnel */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Embudo de conversión</h2>
        <div className="space-y-3">
          {FUNNEL_ORDER.map((estado) => {
            const count = stats.por_estado[estado] || 0
            const pct = Math.round((count / maxFunnel) * 100)
            const e = getEstado(estado)
            return (
              <div key={estado} className="flex items-center gap-3">
                <span className="w-24 text-sm text-gray-600 text-right flex-shrink-0">{e.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 flex items-center justify-end pr-3 ${barColor(estado)}`}
                    style={{ width: `${Math.max(pct, 4)}%` }}
                  >
                    <span className="text-xs font-bold text-white">{count}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {(stats.por_estado['descartado'] || 0) > 0 && (
          <p className="text-sm text-gray-400 mt-4">
            Descartados: <strong>{stats.por_estado['descartado']}</strong>
          </p>
        )}
      </section>

      {/* Próximos seguimientos */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Próximos seguimientos (7 días)</h2>
        {stats.proximos_seguimientos.length === 0 ? (
          <p className="text-sm text-gray-400">No hay seguimientos programados esta semana.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.proximos_seguimientos.map((p) => {
              const e = getEstado(p.estado)
              return (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.nombre}</p>
                    <p className="text-xs text-gray-400">{p.empresa}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${e.color}`}>{e.label}</span>
                    <span className="text-sm text-gray-600 font-medium">
                      {p.proximo_seguimiento
                        ? format(new Date(p.proximo_seguimiento), 'd MMM', { locale: es })
                        : '—'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

function KpiCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}

function barColor(estado) {
  const map = {
    nuevo: 'bg-gray-400',
    contactado: 'bg-blue-500',
    interesado: 'bg-yellow-500',
    propuesta: 'bg-purple-500',
    cliente: 'bg-green-500',
  }
  return map[estado] || 'bg-gray-400'
}
