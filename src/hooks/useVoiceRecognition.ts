import { useState, useCallback, useRef } from 'react'
import { speechRecognitionService } from '@/services/voice/speechRecognition'
import { voiceParser } from '@/services/voice/voiceParser'
import { ambiguityHandler } from '@/services/voice/ambiguityHandler'
import { useVoiceStore } from '@/store/voiceStore'

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [isSupported] = useState(speechRecognitionService.isAvailable())
  const transcriptRef = useRef('')
  
  const {
    transcript,
    setTranscript,
    setParsedData,
    setAmbiguities,
    setError,
    setStep,
    reset,
  } = useVoiceStore()

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('El reconocimiento de voz no está disponible en este navegador')
      return
    }

    // LIMPIAR TODO AL INICIAR
    reset()
    transcriptRef.current = ''
    
    setIsListening(true)
    setStep('listening')
    setError(null)

    console.log('🎤 Iniciando grabación...')

    speechRecognitionService.start(
      (text, isFinal) => {
        console.log('📝 Transcript recibido:', text, 'isFinal:', isFinal)
        transcriptRef.current = text
        setTranscript(text)

        if (isFinal) {
          console.log('✅ Transcript final:', text)
          processTranscript(text)
        }
      },
      (error) => {
        console.error('❌ Error de voz:', error)
        setError(error)
        setIsListening(false)
        setStep('error')
      }
    )
  }, [isSupported, setTranscript, setParsedData, setAmbiguities, setError, setStep, reset])

  const stopListening = useCallback(() => {
    console.log('🛑 Deteniendo grabación...')
    speechRecognitionService.stop()
    setIsListening(false)
    
    if (transcriptRef.current) {
      console.log('📋 Procesando transcript final:', transcriptRef.current)
      processTranscript(transcriptRef.current)
    }
  }, [])

  const processTranscript = useCallback(
    (text: string) => {
      setStep('processing')
      console.log('🔄 Procesando texto:', text)

      try {
        // Parsear el texto
        const parsed = voiceParser.parse(text)
        console.log('✨ Datos parseados:', parsed)
        setParsedData(parsed)

        // Detectar ambigüedades
        const ambiguities = ambiguityHandler.detectAmbiguities(parsed)
        console.log('⚠️ Ambigüedades detectadas:', ambiguities)
        setAmbiguities(ambiguities)

        // Decidir siguiente paso
        setStep('confirming')
      } catch (error) {
        console.error('💥 Error procesando transcript:', error)
        setError('Error al procesar el comando de voz')
        setStep('error')
      }
    },
    [setParsedData, setAmbiguities, setError, setStep]
  )

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
  }
}