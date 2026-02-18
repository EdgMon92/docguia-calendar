import { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useVoiceStore } from '@/store/voiceStore'
import { VoiceRecorder } from './VoiceRecorder'
import { AppointmentConfirmation } from './AppointmentConfirmation'

interface VoiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VoiceModal({ isOpen, onClose }: VoiceModalProps) {
  const { step, reset } = useVoiceStore()

  // RESET AUTOMÁTICO AL ABRIR EL MODAL
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Modal abierto - Reseteando estado')
      reset()
    }
  }, [isOpen, reset])

  const handleClose = () => {
    console.log('🚪 Cerrando modal')
    reset()
    onClose()
  }

  const getTitle = () => {
    switch (step) {
      case 'listening':
        return 'Escuchando...'
      case 'processing':
        return 'Procesando...'
      case 'confirming':
        return 'Confirmar cita'
      case 'completed':
        return '¡Cita creada!'
      case 'error':
        return 'Error'
      default:
        return 'Crear cita por voz'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        {(step === 'idle' || step === 'listening' || step === 'processing') && (
          <VoiceRecorder />
        )}

        {step === 'confirming' && <AppointmentConfirmation onClose={handleClose} />}

        {step === 'completed' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">¡Cita creada exitosamente!</h3>
            <p className="text-gray-600 mb-6">La cita ha sido agregada al calendario</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              Cerrar
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Error al crear la cita</h3>
            <p className="text-gray-600 mb-6">Por favor intenta nuevamente</p>
            <button
              onClick={() => reset()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              Reintentar
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}