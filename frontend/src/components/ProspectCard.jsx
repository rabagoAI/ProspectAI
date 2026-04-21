import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format, isPast, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import StateBadge from './StateBadge'
import { getSector, getServicio } from '../lib/constants'

export default function ProspectCard({ prospect, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: prospect.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const seguimientoVencido =
    prospect.proximo_seguimiento &&
    isPast(new Date(prospect.proximo_seguimiento)) &&
    !isToday(new Date(prospect.proximo_seguimiento))

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 transition-all select-none"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{prospect.nombre}</p>
          <p className="text-xs text-gray-500 truncate">{prospect.empresa}</p>
        </div>
        {seguimientoVencido && (
          <span title="Seguimiento vencido" className="text-orange-500 text-base flex-shrink-0">⚠️</span>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100">
          {getSector(prospect.sector)}
        </span>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
          {getServicio(prospect.servicio_interes)}
        </span>
      </div>

      {prospect.proximo_seguimiento && (
        <p className={`text-xs flex items-center gap-1 ${seguimientoVencido ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
          <span>📅</span>
          {format(new Date(prospect.proximo_seguimiento), 'd MMM', { locale: es })}
        </p>
      )}
    </div>
  )
}
