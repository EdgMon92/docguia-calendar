export type ViewMode = 'week' | 'day' | 'list'

export interface CalendarConfig {
  startHour: number
  endHour: number
  slotDuration: number
  workDays: number[] // AGREGAR ESTA LÍNEA
  consultorios: Consultorio[]
}

export interface Consultorio {
  id: string
  name: string
}

export interface TimeSlot {
  hour: number
  minute: number
  label: string
}

export interface DayColumn {
  date: Date
  isToday: boolean
  isWeekend: boolean
  appointments: any[]
}