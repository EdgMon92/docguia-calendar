import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addWeeks,
  subWeeks,
  isToday,
  isWeekend,
  setHours,
  setMinutes,
  isSameDay as dateFnsIsSameDay,
  startOfDay,
  endOfDay,
  addMinutes,
  differenceInMinutes
} from 'date-fns'
import { es } from 'date-fns/locale'

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 }) // Domingo
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function getWeekRange(date: Date): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, { weekStartsOn: 0 }),
    end: endOfWeek(date, { weekStartsOn: 0 })
  }
}

export function formatWeekRange(date: Date): string {
  const { start, end } = getWeekRange(date)
  return `${format(start, 'd', { locale: es })} - ${format(end, 'd MMM yyyy', { locale: es })}`
}

export function goToNextWeek(date: Date): Date {
  return addWeeks(date, 1)
}

export function goToPrevWeek(date: Date): Date {
  return subWeeks(date, 1)
}

export function goToToday(): Date {
  return new Date()
}

export function isDayToday(date: Date): boolean {
  return isToday(date)
}

export function isDayWeekend(date: Date): boolean {
  return isWeekend(date)
}

export function formatDayHeader(date: Date): string {
  return format(date, 'EEE d', { locale: es })
}

export function createTimeSlot(date: Date, hour: number, minute: number = 0): Date {
  const slot = new Date(date)
  slot.setHours(hour, minute, 0, 0)
  return slot
}

export function getHourFromDate(date: Date): number {
  return date.getHours()
}

export function getMinuteFromDate(date: Date): number {
  return date.getMinutes()
}

export function calculateAppointmentPosition(
  startTime: Date,
  duration: number,
  startHour: number,
  slotHeight: number
): { top: number; height: number } {
  const minutesFromStart = differenceInMinutes(startTime, setHours(setMinutes(startTime, 0), startHour))
  const top = (minutesFromStart / 60) * slotHeight
  const height = (duration / 60) * slotHeight
  
  return { top, height }
}

export function isTimeSlotAvailable(
  date: Date,
  hour: number,
  appointments: Array<{ startTime: Date; endTime: Date }>
): boolean {
  const slotStart = createTimeSlot(date, hour)
  const slotEnd = addMinutes(slotStart, 60)
  
  return !appointments.some(apt => {
    return (
      (apt.startTime >= slotStart && apt.startTime < slotEnd) ||
      (apt.endTime > slotStart && apt.endTime <= slotEnd) ||
      (apt.startTime <= slotStart && apt.endTime >= slotEnd)
    )
  })
}