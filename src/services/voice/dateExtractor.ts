import * as chrono from 'chrono-node'
import { addDays, setHours, setMinutes, startOfDay, getDay } from 'date-fns'

export interface ExtractedDateTime {
  date: Date | null
  time: string | null
  confidence: number
}

export class DateExtractor {
  extract(text: string): ExtractedDateTime {
    const now = new Date()
    let confidence = 0
    let extractedDate: Date | null = null
    let extractedTime: string | null = null

    console.log('📆 Extrayendo fecha de:', text) // Debug

    // PRIMERO: Buscar días de la semana manualmente (chrono a veces falla)
    const dayMatch = this.extractWeekday(text, now)
    if (dayMatch) {
      extractedDate = dayMatch.date
      confidence += 0.8
      console.log('📅 Día de la semana encontrado:', dayMatch) // Debug
    }

    // SEGUNDO: Buscar fechas relativas (hoy, mañana, pasado mañana)
    if (!extractedDate) {
      const relativeMatch = this.extractRelativeDate(text, now)
      if (relativeMatch) {
        extractedDate = relativeMatch.date
        confidence += relativeMatch.confidence
        console.log('📅 Fecha relativa encontrada:', relativeMatch) // Debug
      }
    }

    // TERCERO: Usar chrono-node como fallback
    if (!extractedDate) {
      const parsed = chrono.es.parse(text, now, { forwardDate: true })
      if (parsed.length > 0) {
        const result = parsed[0]
        extractedDate = result.start.date()
        const hasDate = result.start.isCertain('day')
        if (hasDate) {
          confidence += 0.7
          console.log('📅 Chrono parseó fecha:', extractedDate) // Debug
        }
      }
    }

    // CUARTO: Extraer la hora
    const timeResult = this.extractTime(text)
    if (timeResult.time) {
      extractedTime = timeResult.time
      confidence += timeResult.confidence
      console.log('🕐 Hora encontrada:', timeResult.time) // Debug
    }

    const finalConfidence = confidence / (extractedDate && extractedTime ? 2 : 1)

    return {
      date: extractedDate,
      time: extractedTime,
      confidence: Math.min(finalConfidence, 1),
    }
  }

  private extractWeekday(text: string, baseDate: Date): { date: Date; confidence: number } | null {
    const lowerText = text.toLowerCase()
    
    const dayPatterns = {
      'domingo': 0,
      'lunes': 1,
      'martes': 2,
      'miércoles': 3,
      'miercoles': 3,
      'jueves': 4,
      'viernes': 5,
      'sábado': 6,
      'sabado': 6,
    }

    for (const [dayName, targetDay] of Object.entries(dayPatterns)) {
      // Buscar "el viernes", "para el viernes", "viernes", etc.
      const regex = new RegExp(`(?:el\\s+)?${dayName}`, 'i')
      if (regex.test(lowerText)) {
        const date = this.getNextWeekday(baseDate, targetDay)
        console.log(`✅ Encontrado: ${dayName} -> ${date}`) // Debug
        return { date, confidence: 0.9 }
      }
    }

    return null
  }

  private extractRelativeDate(text: string, baseDate: Date): { date: Date; confidence: number } | null {
    const lowerText = text.toLowerCase()

    if (lowerText.includes('hoy')) {
      return { date: startOfDay(baseDate), confidence: 0.9 }
    }

    if (lowerText.includes('mañana') && !lowerText.includes('pasado mañana')) {
      return { date: startOfDay(addDays(baseDate, 1)), confidence: 0.9 }
    }

    if (lowerText.includes('pasado mañana') || lowerText.includes('pasadomañana')) {
      return { date: startOfDay(addDays(baseDate, 2)), confidence: 0.9 }
    }

    return null
  }

  private extractTime(text: string): { time: string | null; confidence: number } {
    const lowerText = text.toLowerCase()

    // Buscar hora explícita: "a las 3", "3 pm", "15:30", etc.
    let match = lowerText.match(/(?:a las|a)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.?m\.?|p\.?m\.?)?/i)
    
    if (!match) {
      // Intentar sin "a las": "10 de la mañana", "3 pm"
      match = lowerText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.?m\.?|p\.?m\.?)?/i)
    }

    if (match) {
      let hour = parseInt(match[1])
      const minute = match[2] ? parseInt(match[2]) : 0
      const meridiem = match[3]?.toLowerCase().replace(/\./g, '')

      // Determinar AM/PM
      if (meridiem) {
        if (meridiem.includes('pm') && hour < 12) {
          hour += 12
        } else if (meridiem.includes('am') && hour === 12) {
          hour = 0
        }
      } else {
        // Sin AM/PM especificado - asumir basado en contexto
        if (lowerText.includes('mañana') || lowerText.includes('madrugada')) {
          // Ya está en formato correcto (AM)
          if (hour === 12) hour = 0
        } else if (lowerText.includes('tarde') || lowerText.includes('noche')) {
          if (hour < 12) hour += 12
        } else {
          // Heurística: si es menor que 7, probablemente sea PM
          if (hour >= 1 && hour < 7) {
            hour += 12
          }
        }
      }

      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      console.log(`🕐 Hora parseada: ${match[1]}:${minute} ${meridiem || 'sin AM/PM'} -> ${timeStr}`) // Debug
      
      return {
        time: timeStr,
        confidence: meridiem ? 0.9 : 0.6, // Menos confianza si no hay AM/PM
      }
    }

    // Momentos del día como fallback
    if (lowerText.includes('mañana') && !lowerText.includes('de mañana')) {
      return { time: '09:00', confidence: 0.3 }
    }
    if (lowerText.includes('tarde')) {
      return { time: '15:00', confidence: 0.3 }
    }
    if (lowerText.includes('noche')) {
      return { time: '19:00', confidence: 0.3 }
    }

    return { time: null, confidence: 0 }
  }

  private getNextWeekday(from: Date, targetDay: number): Date {
    const currentDay = getDay(from)
    let daysToAdd = targetDay - currentDay

    // Si el día ya pasó esta semana, ir a la próxima semana
    if (daysToAdd <= 0) {
      daysToAdd += 7
    }

    const result = startOfDay(addDays(from, daysToAdd))
    console.log(`📅 getNextWeekday: desde ${from.toLocaleDateString()} (día ${currentDay}) hasta día ${targetDay} = +${daysToAdd} días = ${result.toLocaleDateString()}`) // Debug
    
    return result
  }

  combineDateTime(date: Date | null, time: string | null): Date | null {
    if (!date && !time) return null
    
    const baseDate = date || new Date()
    
    if (time) {
      const [hours, minutes] = time.split(':').map(Number)
      const result = setMinutes(setHours(startOfDay(baseDate), hours), minutes)
      console.log(`🔗 Combinando: ${baseDate.toLocaleDateString()} + ${time} = ${result}`) // Debug
      return result
    }
    
    return startOfDay(baseDate)
  }
}

export const dateExtractor = new DateExtractor()