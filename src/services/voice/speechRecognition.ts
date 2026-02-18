import { voiceConfig } from '@/config/voice.config'

export class SpeechRecognitionService {
  private recognition: any = null
  private isSupported: boolean = false

  constructor() {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.isSupported = true
      this.configure()
    } else {
      console.warn('Speech Recognition API not supported')
    }
  }

  private configure() {
    if (!this.recognition) return

    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'es-CO'
    this.recognition.maxAlternatives = 1
  }

  start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ): void {
    if (!this.isSupported) {
      onError('El reconocimiento de voz no está soportado en este navegador')
      return
    }

    this.recognition.onresult = (event: any) => {
      console.log('Speech recognition result:', event)
      
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        console.log('Transcript:', transcript, 'isFinal:', event.results[i].isFinal)
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      onResult(
        finalTranscript || interimTranscript,
        !!finalTranscript
      )
    }

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      
      const errorMessages: Record<string, string> = {
        'no-speech': 'No se detectó voz. Intenta de nuevo.',
        'audio-capture': 'No se pudo acceder al micrófono.',
        'not-allowed': 'Permiso de micrófono denegado.',
        'network': 'Error de red. Verifica tu conexión.',
        'aborted': 'Grabación cancelada.',
      }

      onError(errorMessages[event.error] || 'Error al reconocer la voz')
    }

    this.recognition.onstart = () => {
      console.log('Speech recognition started')
    }

    this.recognition.onend = () => {
      console.log('Speech recognition ended')
    }

    try {
      this.recognition.start()
      console.log('Starting speech recognition...')
    } catch (error) {
      console.error('Error starting recognition:', error)
      onError('No se pudo iniciar el reconocimiento de voz')
    }
  }

  stop(): void {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  isAvailable(): boolean {
    return this.isSupported
  }
}

export const speechRecognitionService = new SpeechRecognitionService()