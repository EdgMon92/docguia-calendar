export interface Appointment {
  id: string
  patientName: string
  startTime: Date
  endTime: Date
  duration: number
  status: AppointmentStatus
  consultorio?: string
  service?: string
  motivo?: string
  doctor?: string 
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateAppointmentDTO {
  patientName: string
  startTime: Date
  duration: number
  consultorio?: string
  service?: string
  motivo?: string 
  doctor?: string
  notes?: string
}

export interface UpdateAppointmentDTO {
  patientName?: string
  startTime?: Date
  duration?: number
  consultorio?: string
  service?: string
  motivo?: string 
  doctor?: string
  notes?: string
  status?: AppointmentStatus
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled'

export interface AppointmentFilter {
  consultorio?: string
  status?: AppointmentStatus
  dateRange?: {
    start: Date
    end: Date
  }
}