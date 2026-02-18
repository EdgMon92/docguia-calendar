//export interface VoiceRecognitionState {
  //isListening: boolean
  //transcript: string
  //interimTranscript: string
  //error: string | null
  //isSupported: boolean
//}

//export interface ParsedAppointmentData {
  //patientName?: string
  //date?: Date
  //time?: string
  //duration?: number
  //service?: string
  //notes?: string
  //confidence: number
//}

//export interface Ambiguity {
  //field: string
  //value: any
  //suggestions: any[]
  //reason: string
  //resolved: boolean
//}

//export type VoiceStep = 
  // 'idle'
  // 'listening'
  // 'processing'
  // 'confirming'
  // 'completed'
  // 'error'

//export interface VoiceState {
  //step: VoiceStep
  //transcript: string
  //parsedData: ParsedAppointmentData | null
  //ambiguities: Ambiguity[]
  //error: string | null
//}

export type VoiceStep = 'idle' | 'listening' | 'processing' | 'confirming' | 'completed' | 'error'

export interface ParsedAppointmentData {
  patientName?: string
  date?: Date
  time?: string
  duration?: number
  service?: string
  motivo?: string 
  doctor?: string
  notes?: string
  confidence: number
}

export interface Ambiguity {
  field: string
  reason: string
  suggestions: any[]
  resolved?: boolean
  value?: any
}

export interface VoiceRecognitionState {
  isListening: boolean
  transcript: string
  parsedData: ParsedAppointmentData | null
  ambiguities: Ambiguity[]
  error: string | null
}

export interface VoiceState extends VoiceRecognitionState {
  step: VoiceStep
}