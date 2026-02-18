export const voiceConfig = {
  language: 'es-CO',
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
  maxRecordingTime: 60000, // 60 segundos
}

export const PARSING_PATTERNS = {
  time: {
    explicit: /(\d{1,2}):?(\d{2})?\s*(am|pm)?/i,
    relative: /(ma[ñn]ana|hoy|pasado ma[ñn]ana|en \d+ (d[ií]as?|horas?))/i,
    descriptive: /(tarde|ma[ñn]ana|mediod[ií]a|noche)/i,
  },
  duration: {
    explicit: /(\d+)\s*(minutos?|mins?|horas?|hrs?)/i,
    implicit: /(media hora|hora y media|cuarto de hora)/i,
  },
  patient: {
    withName: /(con|para|de)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)/i,
    direct: /^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)\s+(ma[ñn]ana|hoy|el|a las)/i,
  },
  service: {
    keywords: /(por|para)\s+(control|consulta|limpieza|revisi[óo]n|emergencia|seguimiento)/i,
  },
}

export const DEFAULT_VALUES = {
  duration: 30,
  time: '09:00',
  ampm: 'AM',
}

export const AMBIGUITY_THRESHOLDS = {
  lowConfidence: 0.6,
  mediumConfidence: 0.8,
}