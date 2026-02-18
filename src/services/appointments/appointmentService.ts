import { Appointment, CreateAppointmentDTO } from '@/types/appointment'
import { storageAdapter } from '@/services/storage/localStorageAdapter'
import { appointmentValidator } from './validator'
import { conflictDetector } from './conflictDetector'
import { addMinutes } from 'date-fns'

export class AppointmentService {
  createAppointment(data: CreateAppointmentDTO): Appointment {
    // Validar datos
    const errors = appointmentValidator.validate(data)
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(', '))
    }

    // Calcular hora de fin
    const endTime = addMinutes(data.startTime, data.duration)

    // Crear cita
    const appointment: Appointment = {
      id: this.generateId(),
      patientName: data.patientName,
      startTime: data.startTime,
      endTime,
      duration: data.duration,
      status: 'scheduled',
      consultorio: data.consultorio,
      service: data.service,
      motivo: data.motivo,
      doctor: data.doctor,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Detectar conflictos
    const existingAppointments = this.getAppointments()
    const conflicts = conflictDetector.detectConflicts(appointment, existingAppointments)

    if (conflicts.length > 0) {
      throw new Error('Existe un conflicto de horario con otra cita')
    }

    // Guardar
    storageAdapter.create(appointment)

    return appointment
  }

  // ⭐ NUEVO MÉTODO: Actualizar cita
  updateAppointment(id: string, updates: Partial<Appointment>): Appointment {
    const existing = storageAdapter.getById(id)
    if (!existing) {
      throw new Error('Cita no encontrada')
    }

    // Si se actualiza fecha/hora/duración, recalcular endTime
    let endTime = existing.endTime
    if (updates.startTime || updates.duration) {
      const startTime = updates.startTime || existing.startTime
      const duration = updates.duration || existing.duration
      endTime = addMinutes(startTime, duration)
    }

    const updated: Appointment = {
      ...existing,
      ...updates,
      endTime,
      updatedAt: new Date(),
    }

    // Validar si hay cambios en fecha/hora
    if (updates.startTime || updates.duration) {
      const allAppointments = this.getAppointments().filter(apt => apt.id !== id)
      const conflicts = conflictDetector.detectConflicts(updated, allAppointments)

      if (conflicts.length > 0) {
        throw new Error('Existe un conflicto de horario con otra cita')
      }
    }

    storageAdapter.update(id, updated)
    return updated
  }

  deleteAppointment(id: string): void {
    storageAdapter.delete(id)
  }

  getAppointments(): Appointment[] {
    return storageAdapter.getAll()
  }

  getAppointmentById(id: string): Appointment | null {
    return storageAdapter.getById(id)
  }

  getAppointmentsByDate(date: Date): Appointment[] {
    return this.getAppointments().filter(apt => {
      return (
        apt.startTime.getDate() === date.getDate() &&
        apt.startTime.getMonth() === date.getMonth() &&
        apt.startTime.getFullYear() === date.getFullYear()
      )
    })
  }

  getAppointmentsByDateRange(start: Date, end: Date): Appointment[] {
    return this.getAppointments().filter(apt => {
      return apt.startTime >= start && apt.startTime <= end
    })
  }

  private generateId(): string {
    return `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export const appointmentService = new AppointmentService()