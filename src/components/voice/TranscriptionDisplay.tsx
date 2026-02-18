import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'

interface TranscriptionDisplayProps {
  text: string
  isListening: boolean
}

export function TranscriptionDisplay({ text, isListening }: TranscriptionDisplayProps) {
  if (!text && !isListening) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3">
          {isListening && (
            <div className="flex-shrink-0">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Volume2 className="w-5 h-5 text-primary" />
              </motion.div>
            </div>
          )}
          
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {isListening ? 'Transcribiendo...' : 'Transcripción'}
            </p>
            <p className="text-base text-gray-900">
              {text || 'Esperando...'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}