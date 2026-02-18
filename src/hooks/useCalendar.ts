import { useMemo } from 'react'
import { useCalendarStore } from '@/store/calendarStore'
import { useAppointmentStore } from '@/store/appointmentStore'
import { getWeekDays, getWeekRange, formatWeekRange } from '@/lib/date-utils'
import { calendarConfig } from '@/config/calendar.config'

export function useCalendar() {
  const {
    currentDate,
    viewMode,
    selectedConsultorio,
    setCurrentDate,
    setViewMode,
    setSelectedConsultorio,
    goToNext,
    goToPrev,
    goToTodayDate,
  } = useCalendarStore()

  const { appointments } = useAppointmentStore()

  // Calcular días de la semana
  const weekDays = useMemo(() => {
    return getWeekDays(currentDate)
  }, [currentDate])

  // Filtrar citas por rango de fechas
  const visibleAppointments = useMemo(() => {
    const { start, end } = getWeekRange(currentDate)
    
    return appointments.filter(apt => {
      const aptDate = apt.startTime
      
      // Filtrar por rango de fechas
      const inRange = aptDate >= start && aptDate <= end
      
      // Filtrar por consultorio
      const matchesConsultorio =
        selectedConsultorio === 'all' ||
        apt.consultorio === selectedConsultorio
      
      return inRange && matchesConsultorio
    })
  }, [appointments, currentDate, selectedConsultorio])

  // Generar slots de tiempo
  const timeSlots = useMemo(() => {
    const slots = []
    for (
      let hour = calendarConfig.startHour;
      hour < calendarConfig.endHour;
      hour++
    ) {
      slots.push(hour)
    }
    return slots
  }, [])

  const weekRangeLabel = useMemo(() => {
    return formatWeekRange(currentDate)
  }, [currentDate])

  return {
    currentDate,
    viewMode,
    selectedConsultorio,
    weekDays,
    visibleAppointments,
    timeSlots,
    weekRangeLabel,
    setCurrentDate,
    setViewMode,
    setSelectedConsultorio,
    goToNext,
    goToPrev,
    goToTodayDate,
  }
}