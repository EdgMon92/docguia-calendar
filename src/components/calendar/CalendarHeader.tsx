import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Plus, HelpCircle, Trash2 } from 'lucide-react' // ⭐ Agregar Trash2
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { ViewMode } from '@/types/calendar'
import { storageAdapter } from '@/services/storage/localStorageAdapter' 

interface CalendarHeaderProps {
  currentDate: Date
  viewMode: ViewMode
  weekRangeLabel: string
  selectedConsultorio: string
  onPrevWeek: () => void
  onNextWeek: () => void
  onToday: () => void
  onViewModeChange: (mode: ViewMode) => void
  onConsultorioChange: (id: string) => void
  onCreateAppointment: () => void
}

export function CalendarHeader({
  currentDate,
  viewMode,
  weekRangeLabel,
  selectedConsultorio,
  onPrevWeek,
  onNextWeek,
  onToday,
  onViewModeChange,
  onConsultorioChange,
  onCreateAppointment,
}: CalendarHeaderProps) {
  
  // Función para limpiar todas las citas
  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de eliminar todas las citas?')) {
      storageAdapter.clearAll()
      window.location.reload()
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 gap-4 flex-wrap">
      {/* Título */}
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-gray-500" />
        <h1 className="text-xl font-semibold text-gray-900">Calendario</h1>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Controles centrales */}
      <div className="flex items-center gap-4">
        {/* Navegación de fecha */}
        <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={onToday}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hoy
          </button>

          <div className="flex items-center px-3 py-2 border-x border-gray-200 gap-2">
            <button
              onClick={onPrevWeek}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm font-medium text-gray-900 min-w-[140px] text-center">
              {weekRangeLabel}
            </span>

            <button
              onClick={onNextWeek}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selector de vista */}
        <div className="inline-flex items-center bg-white border border-gray-200 rounded-lg p-1">
          {(['week', 'day', 'list'] as ViewMode[]).map((mode) => {
            const labels = { week: 'Semana', day: 'Día', list: 'Lista' }
            return (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                  viewMode === mode
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {labels[mode]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-3">
        {/* BOTÓN PARA LIMPIAR */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleClearAll}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Limpiar todo
        </Button>

        <select
          value={selectedConsultorio}
          onChange={(e) => onConsultorioChange(e.target.value)}
          className="h-10 px-3 pr-8 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="all">Todos los consultorios</option>
          <option value="consultorio-1">Consultorio 1</option>
          <option value="consultorio-2">Consultorio 2</option>
        </select>

        <Button variant="ghost" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>

        <Button variant="primary" size="md" onClick={onCreateAppointment}>
          Agendar Cita
          <Plus className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </header>
  )
}