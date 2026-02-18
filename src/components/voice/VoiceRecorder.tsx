import { useEffect, useState } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition'
import { useVoiceStore } from '@/store/voiceStore'
import { cn } from '@/lib/cn'

export function VoiceRecorder() {
  const { isListening, isSupported, transcript, startListening, stopListening } = useVoiceRecognition()
  const { step } = useVoiceStore()
  const [recordingTime, setRecordingTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isListening) {
      interval = setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => clearInterval(interval)
  }, [isListening])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isSupported) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">El reconocimiento de voz no está disponible en este navegador</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Botón de micrófono */}
      <div className="relative mb-8">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={step === 'processing'}
          className={cn(
            'relative w-32 h-32 rounded-full',
            'flex items-center justify-center',
            'transition-all duration-300',
            'focus:outline-none focus:ring-4 focus:ring-primary/20',
            isListening
              ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse'
              : step === 'processing'
              ? 'bg-gray-400'
              : 'bg-primary hover:bg-primary-600 shadow-xl'
          )}
        >
          {step === 'processing' ? (
            <Loader2 className="w-16 h-16 text-white animate-spin" />
          ) : isListening ? (
            <MicOff className="w-16 h-16 text-white" />
          ) : (
            <Mic className="w-16 h-16 text-white" />
          )}
        </button>

        {isListening && (
          <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-20" />
        )}
      </div>

      {/* Timer */}
      {isListening && (
        <div className="text-2xl font-mono font-semibold text-gray-900 mb-4">
          {formatTime(recordingTime)}
        </div>
      )}

      {/* Instrucciones */}
      <p className="text-center text-gray-600 max-w-md mb-6">
        {step === 'processing'
          ? 'Procesando tu solicitud...'
          : isListening
          ? 'Escuchando... Di la información de la cita'
          : 'Presiona el micrófono y dicta la información de la cita'}
      </p>

      {/* Transcript preview */}
      {transcript && (
        <div className="w-full max-w-md p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">{transcript}</p>
        </div>
      )}

      {/* Ejemplos */}
      {!transcript && !isListening && (
        <div className="w-full max-w-md mt-6">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Ejemplos:</p>
          <ul className="space-y-1 text-xs text-gray-600">
            <li>• "Cita con María mañana a las 3pm por control"</li>
            <li>• "Agéndame a Juan el viernes a las 9"</li>
            <li>• "30 minutos hoy a las 5 con Carlos"</li>
          </ul>
        </div>
      )}
    </div>
  )
}