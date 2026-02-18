import { Appointment } from '@/types/appointment'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { AppointmentCard } from './AppointmentCard'
import { cn } from '@/lib/cn'
import { isDayToday } from '@/lib/date-utils'

interface CalendarGridProps {
  weekDays: Date[]
  appointments: Appointment[]
  timeSlots: number[]
  onAppointmentClick?: (appointment: Appointment) => void 
}

export function CalendarGrid({ 
  weekDays, 
  appointments, 
  timeSlots,
  onAppointmentClick 
}: CalendarGridProps) {
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(apt => {
      const aptDate = apt.startTime
      return (
        aptDate.getDate() === day.getDate() &&
        aptDate.getMonth() === day.getMonth() &&
        aptDate.getFullYear() === day.getFullYear()
      )
    })
  }

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div
        className="grid"
        style={{
          gridTemplateColumns: '80px repeat(7, minmax(120px, 1fr))',
          minWidth: 'fit-content',
        }}
      >
        {/* Header Row */}
        <div className="sticky top-0 z-10 bg-gray-50 border-b-2 border-gray-200">
          <div className="h-14 px-2 flex items-center text-xs font-medium text-gray-500 uppercase">
            Horario
          </div>
        </div>

        {weekDays.map((day) => {
          const isToday = isDayToday(day)
          return (
            <div
              key={day.toString()}
              className={cn(
                'sticky top-0 z-10 bg-gray-50 border-b-2 border-gray-200 border-l border-gray-200',
                isToday && 'bg-primary-50'
              )}
            >
              <div className="h-14 px-2 flex flex-col items-center justify-center">
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {format(day, 'EEE', { locale: es })}
                </span>
                <span
                  className={cn(
                    'text-lg font-semibold',
                    isToday ? 'text-primary' : 'text-gray-900'
                  )}
                >
                  {format(day, 'd')}
                </span>
              </div>
            </div>
          )
        })}

        {/* Time Slots */}
        {timeSlots.map((hour) => (
          <>
            {/* Time Label */}
            <div
              key={`time-${hour}`}
              className="h-16 px-2 flex items-start justify-end border-b border-gray-100 bg-gray-50"
            >
              <span className="text-xs text-gray-500">
                {format(new Date().setHours(hour, 0), 'h:mm a')}
              </span>
            </div>

            {/* Day Cells */}
            {weekDays.map((day) => {
              const dayAppointments = getAppointmentsForDay(day)
              const hourAppointments = dayAppointments.filter(
                apt => apt.startTime.getHours() === hour
              )

              return (
                <div
                  key={`${day.toString()}-${hour}`}
                  className="relative h-16 border-b border-l border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {hourAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onClick={() => onAppointmentClick?.(appointment)} // ⭐ Pasar onClick
                    />
                  ))}
                </div>
              )
            })}
          </>
        ))}
      </div>
    </div>
  )
}