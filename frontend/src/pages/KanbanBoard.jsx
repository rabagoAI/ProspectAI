import { useState, useEffect, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import toast from 'react-hot-toast'
import { getProspects, updateProspect } from '../lib/api'
import { ESTADOS } from '../lib/constants'
import ProspectCard from '../components/ProspectCard'
import ProspectModal from '../components/ProspectModal'
import NewProspectModal from '../components/NewProspectModal'

function KanbanColumn({ estado, prospects, onCardClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: estado.value })
  const ids = prospects.map((p) => p.id)

  return (
    <div className="flex flex-col min-w-[220px] w-[220px] flex-shrink-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${estado.dot}`} />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{estado.label}</span>
        </div>
        <span className="text-xs text-gray-400 font-medium bg-gray-100 rounded-full px-2 py-0.5">
          {prospects.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[120px] rounded-xl p-2 space-y-2 transition-colors ${
          isOver ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-100/60'
        }`}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {prospects.map((p) => (
            <ProspectCard key={p.id} prospect={p} onClick={() => onCardClick(p)} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export default function KanbanBoard() {
  const [prospects, setProspects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState(null)
  const [selectedProspect, setSelectedProspect] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [filterSector, setFilterSector] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  useEffect(() => {
    loadProspects()
  }, [filterSector])

  const loadProspects = async () => {
    setLoading(true)
    try {
      const params = filterSector ? { sector: filterSector } : {}
      const r = await getProspects(params)
      setProspects(r.data)
    } finally {
      setLoading(false)
    }
  }

  const byEstado = useMemo(() => {
    const map = {}
    ESTADOS.forEach((e) => { map[e.value] = [] })
    prospects.forEach((p) => {
      if (map[p.estado]) map[p.estado].push(p)
    })
    return map
  }, [prospects])

  const activeProspect = useMemo(() => prospects.find((p) => p.id === activeId), [prospects, activeId])

  const handleDragStart = ({ active }) => setActiveId(active.id)

  const handleDragEnd = async ({ active, over }) => {
    setActiveId(null)
    if (!over) return

    const fromEstado = prospects.find((p) => p.id === active.id)?.estado
    const toEstado = ESTADOS.find((e) => e.value === over.id)?.value || over.id

    if (!fromEstado || fromEstado === toEstado) return

    setProspects((prev) =>
      prev.map((p) => (p.id === active.id ? { ...p, estado: toEstado } : p))
    )

    try {
      await updateProspect(active.id, { estado: toEstado })
      toast.success(`Movido a ${ESTADOS.find((e) => e.value === toEstado)?.label}`)
    } catch {
      setProspects((prev) =>
        prev.map((p) => (p.id === active.id ? { ...p, estado: fromEstado } : p))
      )
    }
  }

  const handleUpdate = (updated) => {
    setProspects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setSelectedProspect(updated)
  }

  const handleDelete = (id) => {
    setProspects((prev) => prev.filter((p) => p.id !== id))
  }

  const handleCreate = (newP) => {
    setProspects((prev) => [newP, ...prev])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-gray-900">Pipeline de ventas</h1>
          <span className="text-sm text-gray-400">{prospects.length} prospectos</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
          >
            <option value="">Todos los sectores</option>
            <option value="manufactura">Manufactura</option>
            <option value="alimentación">Alimentación</option>
            <option value="retail">Retail</option>
            <option value="servicios">Servicios</option>
            <option value="otro">Otro</option>
          </select>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo prospecto
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">Cargando…</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-3 h-full min-h-0">
              {ESTADOS.map((estado) => (
                <KanbanColumn
                  key={estado.value}
                  estado={estado}
                  prospects={byEstado[estado.value] || []}
                  onCardClick={setSelectedProspect}
                />
              ))}
            </div>

            <DragOverlay>
              {activeProspect && (
                <div className="rotate-2 shadow-xl">
                  <ProspectCard prospect={activeProspect} onClick={() => {}} />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {selectedProspect && (
        <ProspectModal
          prospect={selectedProspect}
          onClose={() => setSelectedProspect(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      {showNew && (
        <NewProspectModal
          onClose={() => setShowNew(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}
