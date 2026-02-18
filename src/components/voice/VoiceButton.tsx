import { Mic } from 'lucide-react'
import { cn } from '@/lib/cn'
import { motion } from 'framer-motion'

interface VoiceButtonProps {
  onClick: () => void
  isListening?: boolean
  variant?: 'primary' | 'secondary' | 'fab'
  className?: string
}

export function VoiceButton({
  onClick,
  isListening = false,
  variant = 'primary',
  className,
}: VoiceButtonProps) {
  if (variant === 'fab') {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'w-16 h-16 rounded-full shadow-xl',
          'flex items-center justify-center',
          'transition-colors duration-200',
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-primary hover:bg-primary-600',
          className
        )}
        aria-label={isListening ? 'Detener grabación' : 'Iniciar grabación'}
      >
        <Mic className="w-8 h-8 text-white" />
        
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
        'font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        variant === 'primary' && 'bg-primary text-white hover:bg-primary-600',
        variant === 'secondary' && 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        isListening && 'animate-pulse',
        className
      )}
    >
      <Mic className="w-5 h-5" />
      <span>{isListening ? 'Grabando...' : 'Crear con voz'}</span>
    </button>
  )
}