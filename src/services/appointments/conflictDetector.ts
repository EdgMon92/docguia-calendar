import { Appointment } from '@/types/appointment'
import { addMinutes, isBefore, isAfter } from 'date-fns'

export interface Conflict {
  appointmentId: string
  appointment: Appointment
  type: 'overlap' | 'adjacent'
  message: string
}

export class ConflictDetector {
  detectConflicts(
    newAppointment: { startTime: Date; duration: number; consultorio?: string },
    existingAppointments: Appointment[]
  ): Conflict[] {
    const conflicts: Conflict[] = []
    const newEnd = addMinutes(newAppointment.startTime, newAppointment.duration)

    existingAppointments.forEach(existing => {
      // Si tienen consultorios diferentes, no hay conflicto
      if (
        newAppointment.consultorio &&
        existing.consultorio &&
        newAppointment.consultorio !== existing.consultorio
      ) {
        return
      }

      const existingEnd = existing.endTime

      // Detectar solapamiento
      if (this.isOverlapping(newAppointment.startTime, newEnd, existing.startTime, existingEnd)) {
        conflicts.push({
          appointmentId: existing.id,
          appointment: existing,
          type: 'overlap',
          message: `Conflicto con cita de ${existing.patientName}`,
        })
      }
    })

    return conflicts
  }

  private isOverlapping(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean {
    return (
      (isBefore(start1, end2) && isAfter(end1, start2)) ||
      (isBefore(start2, end1) && isAfter(end2, start1))
    )
  }

  hasConflicts(
    newAppointment: { startTime: Date; duration: number; consultorio?: string },
    existingAppointments: Appointment[]
  ): boolean {
    return this.detectConflicts(newAppointment, existingAppointments).length > 0
  }

  suggestAlternativeTimes(
    preferredTime: Date,
    duration: number,
    existingAppointments: Appointment[],
    consultorio?: string
  ): Date[] {
    const suggestions: Date[] = []
    const slotDuration = 30 // minutos

    // Buscar slots disponibles en el mismo día
    const dayStart = new Date(preferredTime)
    dayStart.setHours(8, 0, 0, 0)

    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const candidate = new Date(dayStart)
        candidate.setHours(hour, minute, 0, 0)

        const conflicts = this.detectConflicts(
          { startTime: candidate, duration, consultorio },
          existingAppointments
        )

        if (conflicts.length === 0) {
          suggestions.push(candidate)
          if (suggestions.length >= 5) return suggestions
        }
      }
    }

    return suggestions
  }
}

export const conflictDetector = new ConflictDetector()