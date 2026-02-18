import { CalendarConfig } from '@/types/calendar'

export const calendarConfig: CalendarConfig = {
  startHour: 8,
  endHour: 20,
  slotDuration: 60,
  workingDays: [1, 2, 3, 4, 5],
  defaultDuration: 30,
}

export const VIEW_MODES = {
  WEEK: 'week',
  DAY: 'day',
  LIST: 'list',
} as const

export const CONSULTORIOS = [
  { id: 'all', name: 'Todos los consultorios' },
  { id: 'consultorio-1', name: 'Consultorio 1' },
  { id: 'consultorio-2', name: 'Consultorio 2' },
  { id: 'consultorio-3', name: 'Consultorio 3' },
]