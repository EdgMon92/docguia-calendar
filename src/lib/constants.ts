import { CalendarConfig } from '@/types/calendar'

export const DEFAULT_CALENDAR_CONFIG: CalendarConfig = {
  startHour: 8,
  endHour: 20,
  slotDuration: 60,
  workDays: [1, 2, 3, 4, 5],
  consultorios: [
    { id: 'consultorio-1', name: 'Consultorio 1' },
    { id: 'consultorio-2', name: 'Consultorio 2' },
    { id: 'consultorio-3', name: 'Consultorio 3' },
  ],
}

export const APPOINTMENT_COLORS = {
  scheduled: '#8B5CF6',
  confirmed: '#10B981',
  completed: '#6B7280',
  cancelled: '#EF4444',
}

export const STATUS_LABELS = {
  scheduled: 'Agendada',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

export const VOICE_COMMANDS_EXAMPLES = [
  'Cita con María mañana a las 3pm por control',
  'Agéndame a Juan el viernes a las 9',
  'Bloquéame 30 minutos hoy a las 5',
]

export const STORAGE_KEYS = {
  appointments: 'docguia_appointments',
  settings: 'docguia_settings',
  user: 'docguia_user',
}