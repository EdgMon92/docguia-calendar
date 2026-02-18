import { Appointment } from '@/types/appointment'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { AppointmentCard } from './AppointmentCard'
import { cn } from '@/lib/cn'
import { isDayToday, isDayWeekend } from '@/lib/date-utils'

interface CalendarDayProps {
  date: Date
  appointments: Appointment[]
  onTimeSlotClick?: (date: Date, hour: number) => void
}

export function CalendarDay({ date, appointments, onTimeSlotClick }: CalendarDayProps) {
  const isToday = isDayToday(date)
  const isWeekend = isDayWeekend(date)

  return (
    <div
      className={cn(
        'flex flex-col border-r border-gray-200 last:border-r-0',
        isWeekend && 'bg-gray-50',
        isToday && 'bg-primary-50'
      )}
    >
      {/* Day Header */}
      <div className="sticky top-0 z-10 p-2 border-b-2 border-gray-200 bg-white">
        <div className="text-center">
          <div className="text-xs font-medium text-gray-500 uppercase">
            {format(date, 'EEE', { locale: es })}
          </div>
          <div
            className={cn(
              'text-2xl font-semibold',
              isToday ? 'text-primary' : 'text-gray-900'
            )}
          >
            {format(date, 'd')}
          </div>
        </div>
      </div>

      {/* Appointments Container */}
      <div className="flex-1 relative">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
          />
        ))}
      </div>
    </div>
  )
}