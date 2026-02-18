import { CreateAppointmentDTO, Appointment } from '@/types/appointment'
import { isBefore, addMinutes, startOfDay } from 'date-fns'

export interface ValidationError {
  field: string
  message: string
}

export class AppointmentValidator {
  validate(data: CreateAppointmentDTO): ValidationError[] {
    const errors: ValidationError[] = []

    // Validar nombre del paciente
    if (!data.patientName || data.patientName.trim().length === 0) {
      errors.push({
        field: 'patientName',
        message: 'El nombre del paciente es requerido',
      })
    }

    // Validar fecha/hora
    if (!data.startTime) {
      errors.push({
        field: 'startTime',
        message: 'La fecha y hora son requeridas',
      })
    } else {
      // Permitir citas desde HOY (no solo futuro)
      const today = startOfDay(new Date())
      const appointmentDay = startOfDay(data.startTime)
      
      if (isBefore(appointmentDay, today)) {
        errors.push({
          field: 'startTime',
          message: 'No se pueden crear citas en fechas pasadas',
        })
      }
    }

    // Validar duración
    if (!data.duration || data.duration < 5) {
      errors.push({
        field: 'duration',
        message: 'La duración mínima es de 5 minutos',
      })
    }

    if (data.duration && data.duration > 480) {
      errors.push({
        field: 'duration',
        message: 'La duración máxima es de 8 horas',
      })
    }

    return errors
  }

  isValid(data: CreateAppointmentDTO): boolean {
    return this.validate(data).length === 0
  }

  validateUpdate(
    appointment: Appointment,
    updates: Partial<Appointment>
  ): ValidationError[] {
    const errors: ValidationError[] = []

    if (updates.startTime) {
      const today = startOfDay(new Date())
      const appointmentDay = startOfDay(updates.startTime)
      
      if (isBefore(appointmentDay, today)) {
        errors.push({
          field: 'startTime',
          message: 'No se pueden mover citas a fechas pasadas',
        })
      }
    }

    if (updates.duration !== undefined) {
      if (updates.duration < 5 || updates.duration > 480) {
        errors.push({
          field: 'duration',
          message: 'La duración debe estar entre 5 minutos y 8 horas',
        })
      }
    }

    return errors
  }
}

export const appointmentValidator = new AppointmentValidator()