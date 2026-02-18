import { create } from 'zustand'
import { VoiceStep, ParsedAppointmentData, Ambiguity } from '@/types/voice'

interface VoiceStore {
  step: VoiceStep
  transcript: string
  parsedData: ParsedAppointmentData | null
  ambiguities: Ambiguity[]
  error: string | null
  
  setStep: (step: VoiceStep) => void
  setTranscript: (transcript: string) => void
  setParsedData: (data: ParsedAppointmentData) => void
  setAmbiguities: (ambiguities: Ambiguity[]) => void
  resolveAmbiguity: (field: string, value: any) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useVoiceStore = create<VoiceStore>((set, get) => ({
  step: 'idle',
  transcript: '',
  parsedData: null,
  ambiguities: [],
  error: null,

  setStep: (step) => {
    console.log('📍 Cambiando step a:', step) // Debug
    set({ step })
  },

  setTranscript: (transcript) => {
    console.log('📝 Actualizando transcript:', transcript) // Debug
    set({ transcript })
  },

  setParsedData: (data) => {
    console.log('💾 Guardando parsedData:', data) // Debug
    set({ parsedData: data })
  },

  setAmbiguities: (ambiguities) => {
    console.log('⚠️ Guardando ambigüedades:', ambiguities) // Debug
    set({ ambiguities })
  },

  resolveAmbiguity: (field, value) => {
    set(state => ({
      ambiguities: state.ambiguities.map(amb =>
        amb.field === field ? { ...amb, value, resolved: true } : amb
      ),
    }))
  },

  setError: (error) => {
    console.log('❌ Error:', error) // Debug
    set({ error })
  },

  reset: () => {
    console.log('🔄 RESET completo del voiceStore') // Debug
    set({
      step: 'idle',
      transcript: '',
      parsedData: null,
      ambiguities: [],
      error: null,
    })
  },
}))