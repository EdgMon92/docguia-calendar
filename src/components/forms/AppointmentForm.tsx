import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { CreateAppointmentDTO } from '@/types/appointment'
import { Search, Plus, Calendar, Clock, Timer } from 'lucide-react'

const appointmentSchema = z.object({
  patientName: z.string().min(1, 'El nombre del paciente es requerido'),
  consultorio: z.string().optional(),
  startDate: z.string().min(1, 'La fecha es requerida'),
  startTime: z.string().min(1, 'La hora es requerida'),
  duration: z.number().min(5, 'La duración mínima es 5 minutos'),
  service: z.string().optional(),
  notes: z.string().optional(),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface AppointmentFormProps {
  onSubmit: (data: CreateAppointmentDTO) => void
  onCancel: () => void
  defaultValues?: Partial<AppointmentFormData>
  isLoading?: boolean
}

export function AppointmentForm({
  onSubmit,
  onCancel,
  defaultValues,
  isLoading = false,
}: AppointmentFormProps) {
  const [showNotes, setShowNotes] = useState(false)
  const [showMotivo, setShowMotivo] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      duration: 30,
      ...defaultValues,
    },
  })

  const onFormSubmit = (data: AppointmentFormData) => {
    // Combinar fecha y hora en un objeto Date
    const [year, month, day] = data.startDate.split('-').map(Number)
    const [hours, minutes] = data.startTime.split(':').map(Number)
    const startTime = new Date(year, month - 1, day, hours, minutes)

    onSubmit({
      patientName: data.patientName,
      startTime,
      duration: data.duration,
      consultorio: data.consultorio,
      service: data.service,
      notes: data.notes,
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Paciente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paciente <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar paciente"
            className="w-full h-10 pl-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            {...register('patientName')}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        {errors.patientName && (
          <p className="mt-1 text-sm text-red-600">{errors.patientName.message}</p>
        )}
        <button
          type="button"
          className="mt-2 text-sm text-primary hover:underline flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Añadir paciente
        </button>
      </div>

      {/* Consultorio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Consultorio <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          {...register('consultorio')}
        >
          <option value="">Selecciona un consultorio</option>
          <option value="consultorio-1">Consultorio 1</option>
          <option value="consultorio-2">Consultorio 2</option>
          <option value="consultorio-3">Consultorio 3</option>
        </select>
        {errors.consultorio && (
          <p className="mt-1 text-sm text-red-600">{errors.consultorio.message}</p>
        )}
      </div>

      {/* Fecha y Hora */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register('startDate')}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hora <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="time"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register('startTime')}
            />
            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
          )}
        </div>
      </div>

      {/* Servicios */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Servicios</label>
        <select
          className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          {...register('service')}
        >
          <option value="">Seleccionar servicios...</option>
          <option value="consulta">Consulta General</option>
          <option value="control">Control</option>
          <option value="limpieza">Limpieza Dental</option>
          <option value="revision">Revisión</option>
          <option value="emergencia">Emergencia</option>
        </select>
      </div>

      {/* Duración */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duración de la cita
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              min="5"
              step="5"
              className="w-full h-10 px-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register('duration', { valueAsNumber: true })}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Timer className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">min</span>
            </div>
          </div>
        </div>
        {errors.duration && (
          <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
        )}
      </div>

      {/* Opcionales */}
      <div className="space-y-2">
        {!showNotes && (
          <button
            type="button"
            onClick={() => setShowNotes(true)}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Añadir notas internas
          </button>
        )}

        {showNotes && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas internas
            </label>
            <textarea
              rows={3}
              placeholder="Notas privadas sobre la cita..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              {...register('notes')}
            />
          </div>
        )}

        {!showMotivo && (
          <button
            type="button"
            onClick={() => setShowMotivo(true)}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Añadir Motivo de consulta
          </button>
        )}

        {showMotivo && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de consulta
            </label>
            <input
              type="text"
              placeholder="Motivo de la visita..."
              className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          loading={isLoading}
        >
          Agendar cita
        </Button>
      </div>
    </form>
  )
}