import { Ambiguity, ParsedAppointmentData } from '@/types/voice'
import { AMBIGUITY_THRESHOLDS, DEFAULT_VALUES } from '@/config/voice.config'
import { addHours, setHours, setMinutes } from 'date-fns'

export class AmbiguityHandler {
  detectAmbiguities(data: ParsedAppointmentData): Ambiguity[] {
    const ambiguities: Ambiguity[] = []

    // Verificar nombre del paciente
    if (!data.patientName || data.patientName.length < 3) {
      ambiguities.push({
        field: 'patientName',
        value: data.patientName,
        suggestions: [],
        reason: 'No se pudo identificar el nombre del paciente claramente',
        resolved: false,
      })
    }

    // Verificar fecha
    if (!data.date) {
      ambiguities.push({
        field: 'date',
        value: null,
        suggestions: this.suggestDates(),
        reason: 'No se especificó una fecha',
        resolved: false,
      })
    }

    // Verificar hora - detectar ambigüedad AM/PM
    if (data.time) {
      const hour = parseInt(data.time.split(':')[0])
      
      // Si la hora está entre 1 y 12, puede ser ambigua
      if (hour >= 1 && hour <= 12) {
        ambiguities.push({
          field: 'time',
          value: data.time,
          suggestions: this.suggestAmPm(data.time),
          reason: 'No está claro si es AM o PM',
          resolved: false,
        })
      }
    } else if (data.date) {
      ambiguities.push({
        field: 'time',
        value: null,
        suggestions: this.suggestTimes(),
        reason: 'No se especificó una hora',
        resolved: false,
      })
    }

    // Verificar duración con baja confianza
    if (data.confidence < AMBIGUITY_THRESHOLDS.mediumConfidence) {
      if (data.duration === DEFAULT_VALUES.duration) {
        ambiguities.push({
          field: 'duration',
          value: data.duration,
          suggestions: [15, 30, 45, 60],
          reason: 'No se especificó duración, usando valor predeterminado',
          resolved: false,
        })
      }
    }

    return ambiguities
  }

  private suggestDates(): Date[] {
    const today = new Date()
    const suggestions: Date[] = []

    // Hoy
    suggestions.push(today)

    // Mañana
    suggestions.push(addHours(today, 24))

    // Próximos días laborales
    for (let i = 2; i <= 5; i++) {
      const day = addHours(today, i * 24)
      const dayOfWeek = day.getDay()
      // Excluir fines de semana
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        suggestions.push(day)
      }
    }

    return suggestions.slice(0, 5)
  }

  private suggestTimes(): string[] {
    return [
      '09:00',
      '10:00',
      '11:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ]
  }

  private suggestAmPm(time: string): Array<{ time: string; label: string }> {
    const [hourStr, minute] = time.split(':')
    let hour = parseInt(hourStr)

    const suggestions = []

    // Versión AM
    if (hour === 12) {
      suggestions.push({
        time: `00:${minute}`,
        label: `12:${minute} AM (medianoche)`,
      })
    } else {
      suggestions.push({
        time: `${hour.toString().padStart(2, '0')}:${minute}`,
        label: `${hour}:${minute} AM (mañana)`,
      })
    }

    // Versión PM
    const pmHour = hour === 12 ? 12 : hour + 12
    suggestions.push({
      time: `${pmHour.toString().padStart(2, '0')}:${minute}`,
      label: `${hour}:${minute} PM (tarde)`,
    })

    return suggestions
  }

  resolveAmbiguity(
    ambiguities: Ambiguity[],
    field: string,
    value: any
  ): Ambiguity[] {
    return ambiguities.map(amb =>
      amb.field === field
        ? { ...amb, value, resolved: true }
        : amb
    )
  }

  hasUnresolvedAmbiguities(ambiguities: Ambiguity[]): boolean {
    return ambiguities.some(amb => !amb.resolved)
  }
}

export const ambiguityHandler = new AmbiguityHandler()