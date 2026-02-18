import { ParsedAppointmentData } from '@/types/voice'
import { PARSING_PATTERNS, DEFAULT_VALUES } from '@/config/voice.config'
import { dateExtractor } from './dateExtractor'

export class VoiceParser {
  parse(transcript: string): ParsedAppointmentData {
    const cleaned = transcript.trim().toLowerCase()
    
    console.log('🔍 Parsing transcript:', cleaned)
    
    const parsedData: ParsedAppointmentData = {
      confidence: 0,
    }

    let totalConfidence = 0
    let fieldCount = 0

    // Extraer fecha y hora PRIMERO
    const dateTimeResult = dateExtractor.extract(cleaned)
    if (dateTimeResult.date || dateTimeResult.time) {
      const combined = dateExtractor.combineDateTime(
        dateTimeResult.date,
        dateTimeResult.time
      )
      if (combined) {
        parsedData.date = combined
        parsedData.time = dateTimeResult.time || undefined
        totalConfidence += dateTimeResult.confidence
        fieldCount++
        console.log('📅 Fecha/hora parseada:', combined)
      }
    }

    // Extraer paciente
    const patientResult = this.extractPatient(cleaned)
    if (patientResult.value) {
      parsedData.patientName = patientResult.value
      totalConfidence += patientResult.confidence
      fieldCount++
      console.log('👤 Paciente:', patientResult.value)
    }

    // Extraer doctor
    const doctorResult = this.extractDoctor(cleaned)
    if (doctorResult.value) {
      parsedData.doctor = doctorResult.value
      totalConfidence += doctorResult.confidence
      fieldCount++
      console.log('👨‍⚕️ Doctor:', doctorResult.value)
    }

    // Extraer duración
    const durationResult = this.extractDuration(cleaned)
    if (durationResult.value) {
      parsedData.duration = durationResult.value
      totalConfidence += durationResult.confidence
      fieldCount++
      console.log('⏱️ Duración:', durationResult.value)
    }

    // Extraer servicio
    const serviceResult = this.extractService(cleaned)
    if (serviceResult.value) {
      parsedData.service = serviceResult.value
      totalConfidence += serviceResult.confidence
      fieldCount++
      console.log('🏥 Servicio:', serviceResult.value)
    }

    // ⭐ NUEVO: Extraer motivo
    const motivoResult = this.extractMotivo(cleaned)
    if (motivoResult.value) {
      parsedData.motivo = motivoResult.value
      totalConfidence += motivoResult.confidence
      fieldCount++
      console.log('📋 Motivo:', motivoResult.value)
    }

    // Extraer notas adicionales
    parsedData.notes = this.extractNotes(cleaned)

    // Calcular confianza promedio
    parsedData.confidence = fieldCount > 0 ? totalConfidence / fieldCount : 0

    console.log('✅ Resultado final del parsing:', parsedData)

    return parsedData
  }

  private extractPatient(text: string): { value: string | null; confidence: number } {
    const stopWords = [
      'para', 'el', 'la', 'los', 'las', 'un', 'una',
      'mañana', 'hoy', 'pasado', 'tarde', 'noche',
      'lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes', 'sábado', 'sabado', 'domingo',
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
      'a', 'de', 'en', 'por', 'con', 'sin',
      'hora', 'horas', 'minuto', 'minutos',
      'am', 'pm', 'cita', 'agendar', 'agenda', 'agéndame', 'pon', 'poner'
    ]

    // Patrón 1: "con [Nombre]" o "para [Nombre]"
    let match = text.match(/(?:con|para)\s+([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)?)/i)
    if (match) {
      const fullName = match[1].trim()
      const words = fullName.split(/\s+/)
      const firstName = words[0]
      const lastName = words[1] && !stopWords.includes(words[1].toLowerCase()) ? words[1] : ''
      
      const cleanName = (firstName + (lastName ? ' ' + lastName : '')).trim()
      
      return {
        value: this.capitalizeName(cleanName),
        confidence: 0.8,
      }
    }

    // Patrón 2: Nombre al inicio
    match = text.match(/^([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)?)\s+(?:el|la|mañana|hoy|para|a)/i)
    if (match) {
      const fullName = match[1].trim()
      const words = fullName.split(/\s+/)
      const firstName = words[0]
      const lastName = words[1] && !stopWords.includes(words[1].toLowerCase()) ? words[1] : ''
      
      const cleanName = (firstName + (lastName ? ' ' + lastName : '')).trim()
      
      if (stopWords.includes(cleanName.toLowerCase())) {
        return { value: null, confidence: 0 }
      }
      
      return {
        value: this.capitalizeName(cleanName),
        confidence: 0.6,
      }
    }

    return { value: null, confidence: 0 }
  }

  private extractDuration(text: string): { value: number | null; confidence: number } {
    // Buscar duración explícita
    let match = text.match(/(\d+)\s*(minutos?|mins?|horas?|hrs?)/i)
    if (match) {
      const amount = parseInt(match[1])
      const unit = match[2].toLowerCase()

      let minutes = amount
      if (unit.includes('hora') || unit.includes('hr')) {
        minutes = amount * 60
      }

      return {
        value: minutes,
        confidence: 0.9,
      }
    }

    // Buscar expresiones implícitas
    match = text.match(/(media hora|hora y media|cuarto de hora)/i)
    if (match) {
      const expression = match[1].toLowerCase()
      const durationMap: Record<string, number> = {
        'media hora': 30,
        'hora y media': 90,
        'cuarto de hora': 15,
      }

      return {
        value: durationMap[expression] || DEFAULT_VALUES.duration,
        confidence: 0.7,
      }
    }

    // Default
    return {
      value: DEFAULT_VALUES.duration,
      confidence: 0.3,
    }
  }

  private extractService(text: string): { value: string | null; confidence: number } {
    const match = text.match(/(?:por|para)\s+(control|consulta|limpieza|revisión|revision|emergencia|seguimiento)/i)
    
    if (match) {
      return {
        value: this.capitalizeFirst(match[1]),
        confidence: 0.7,
      }
    }

    return { value: null, confidence: 0 }
  }

  private extractMotivo(text: string): { value: string | null; confidence: number } {
    let match = text.match(/(?:motivo(?:\s+de)?|porque)\s+([a-záéíóúñ\s]+?)(?:\s+(?:el|la|mañana|hoy|para|a las|con)|$)/i)
    if (match) {
      const motivo = match[1].trim()
      if (motivo.length > 3) {
        return {
          value: this.capitalizeFirst(motivo),
          confidence: 0.8,
        }
      }
    }

    // Patrón 2: Después de "por" pero no es servicio
    match = text.match(/por\s+([a-záéíóúñ\s]{4,}?)(?:\s+(?:el|la|mañana|hoy|a las|con)|$)/i)
    if (match) {
      const potentialMotivo = match[1].trim()
      // No es un servicio conocido
      const services = ['control', 'consulta', 'limpieza', 'revisión', 'revision', 'emergencia', 'seguimiento']
      if (!services.includes(potentialMotivo.toLowerCase())) {
        return {
          value: this.capitalizeFirst(potentialMotivo),
          confidence: 0.6,
        }
      }
    }

    return { value: null, confidence: 0 }
  }

  private extractDoctor(text: string): { value: string | null; confidence: number } {
    // Patrón 1: "con el doctor [nombre]" o "con la doctora [nombre]"
    let match = text.match(/con\s+(?:el\s+)?(?:doctor|dr\.?|doctora|dra\.?)\s+([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)?)/i)
    if (match) {
      const doctorName = match[1].trim()
      return {
        value: this.capitalizeName(doctorName),
        confidence: 0.9,
      }
    }

    // Patrón 2: "para el doctor [nombre]" o "para la doctora [nombre]"
    match = text.match(/para\s+(?:el\s+)?(?:doctor|dr\.?|doctora|dra\.?)\s+([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)?)/i)
    if (match) {
      const doctorName = match[1].trim()
      return {
        value: this.capitalizeName(doctorName),
        confidence: 0.9,
      }
    }

    // Patrón 3: "doctor [nombre]" al final o en medio
    match = text.match(/(?:doctor|dr\.?|doctora|dra\.?)\s+([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)?)/i)
    if (match) {
      const doctorName = match[1].trim()
      // Evitar confundir con palabras comunes
      const commonWords = ['el', 'la', 'los', 'las', 'de', 'del']
      if (!commonWords.includes(doctorName.toLowerCase())) {
        return {
          value: this.capitalizeName(doctorName),
          confidence: 0.7,
        }
      }
    }

    return { value: null, confidence: 0 }
  }

  private extractNotes(text: string): string | undefined {
    return text.length > 10 ? text : undefined
  }

  private capitalizeName(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
}

export const voiceParser = new VoiceParser()