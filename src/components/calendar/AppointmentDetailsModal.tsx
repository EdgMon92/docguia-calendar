import { Appointment } from '@/types/appointment'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { User, Calendar, Clock, Timer, FileText, Stethoscope, MapPin, X, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AppointmentDetailsModalProps {
  appointment: Appointment | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (appointment: Appointment) => void
  onDelete?: (appointment: Appointment) => void
}

export function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: AppointmentDetailsModalProps) {
  if (!appointment) return null

  const handleEdit = () => {
    if (onEdit) {
      onEdit(appointment)
    }
  }

  const handleDelete = () => {
    if (onDelete && window.confirm('¿Estás seguro de eliminar esta cita?')) {
      onDelete(appointment)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalles de la cita</span>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información principal */}
          <div className="space-y-4">
            {/* Paciente */}
            <DetailField
              icon={User}
              label="Paciente"
              value={appointment.patientName}
            />

            {/* Doctor */}
            {appointment.doctor && (
              <DetailField
                icon={Stethoscope}
                label="Doctor"
                value={`Dr. ${appointment.doctor}`}
              />
            )}

            {/* Fecha */}
            <DetailField
              icon={Calendar}
              label="Fecha"
              value={format(appointment.startTime, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            />

            {/* Hora */}
            <DetailField
              icon={Clock}
              label="Hora"
              value={`${format(appointment.startTime, 'h:mm a')} - ${format(appointment.endTime, 'h:mm a')}`}
            />

            {/* Duración */}
            <DetailField
              icon={Timer}
              label="Duración"
              value={`${appointment.duration} minutos`}
            />

            {/* Consultorio */}
            {appointment.consultorio && (
              <DetailField
                icon={MapPin}
                label="Consultorio"
                value={appointment.consultorio}
              />
            )}

            {/* Motivo */}
            {appointment.motivo && (
              <DetailField
                icon={FileText}
                label="Motivo de consulta"
                value={appointment.motivo}
              />
            )}

            {/* Servicio */}
            {appointment.service && (
              <DetailField
                icon={FileText}
                label="Servicio"
                value={appointment.service}
              />
            )}

            {/* Notas */}
            {appointment.notes && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Notas</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {appointment.notes}
                </p>
              </div>
            )}
          </div>

          {/* Estado */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Estado</span>
              <StatusBadge status={appointment.status} />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {onDelete && (
              <Button
                variant="outline"
                className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            )}
            {onEdit && (
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleEdit}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface DetailFieldProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}

function DetailField({ icon: Icon, label, value }: DetailFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-base text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    scheduled: { label: 'Agendada', className: 'bg-blue-100 text-blue-700' },
    confirmed: { label: 'Confirmada', className: 'bg-green-100 text-green-700' },
    completed: { label: 'Completada', className: 'bg-gray-100 text-gray-700' },
    cancelled: { label: 'Cancelada', className: 'bg-red-100 text-red-700' },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}