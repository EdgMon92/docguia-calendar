import { Appointment } from '@/types/appointment'
import { format } from 'date-fns'
import { cn } from '@/lib/cn'
import { MoreVertical, Stethoscope } from 'lucide-react' 

interface AppointmentCardProps {
  appointment: Appointment
  onClick?: () => void
}

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'absolute inset-x-1 rounded-md p-2 cursor-pointer',
        'border-l-4 bg-primary-50 border-primary',
        'hover:shadow-md transition-shadow group overflow-hidden'
      )}
      style={{
        top: '2px',
        height: `${(appointment.duration / 60) * 64 - 4}px`,
      }}
    >
      <div className="flex items-start justify-between h-full">
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Nombre del paciente */}
          <p className="text-sm font-medium text-primary-700 truncate">
            {appointment.patientName}
          </p>
          
          {/* Hora */}
          <p className="text-xs text-gray-600">
            {format(appointment.startTime, 'h:mm a')} -{' '}
            {format(appointment.endTime, 'h:mm a')}
          </p>
          
          {/* Doctor */}
          {appointment.doctor && (
            <div className="flex items-center gap-1 mt-1">
              <Stethoscope className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600 truncate">
                Dr. {appointment.doctor}
              </span>
            </div>
          )}
          
          {/* Motivo o servicio */}
          {(appointment.motivo || appointment.service) && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-white/60 truncate">
              {appointment.motivo || appointment.service}
            </span>
          )}
        </div>
        
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  )
}