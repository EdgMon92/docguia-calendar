import { useState } from 'react'
import { Ambiguity } from '@/types/voice'
import { Button } from '@/components/ui/button'
import { AlertCircle, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface AmbiguityResolverProps {
  ambiguities: Ambiguity[]
  onResolve: (field: string, value: any) => void
  onContinue: () => void
}

export function AmbiguityResolver({
  ambiguities,
  onResolve,
  onContinue,
}: AmbiguityResolverProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentAmbiguity = ambiguities[currentIndex]

  if (!currentAmbiguity) {
    return null
  }

  const handleSelect = (value: any) => {
    onResolve(currentAmbiguity.field, value)
    
    // Ir a la siguiente ambigüedad o continuar
    if (currentIndex < ambiguities.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onContinue()
    }
  }

  const getIcon = () => {
    switch (currentAmbiguity.field) {
      case 'date':
        return Calendar
      case 'time':
        return Clock
      default:
        return AlertCircle
    }
  }

  const Icon = getIcon()

  return (
    <div className="space-y-6 py-4">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>
          Pregunta {currentIndex + 1} de {ambiguities.length}
        </span>
        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / ambiguities.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Ambiguity Question */}
      <div className="text-center">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-6 h-6 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Necesitamos aclarar algo
        </h3>
        <p className="text-gray-600">{currentAmbiguity.reason}</p>
      </div>

      {/* Suggestions */}
      {currentAmbiguity.suggestions.length > 0 && (
        <div className="space-y-2">
          {currentAmbiguity.field === 'time' && Array.isArray(currentAmbiguity.suggestions) ? (
            // Para tiempo con AM/PM
            currentAmbiguity.suggestions.map((suggestion: any, index: number) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-auto py-3 justify-start"
                onClick={() => handleSelect(suggestion.time)}
              >
                <Clock className="w-5 h-5 mr-3 text-gray-400" />
                <div className="text-left">
                  <div className="font-medium">{suggestion.label}</div>
                </div>
              </Button>
            ))
          ) : currentAmbiguity.field === 'date' ? (
            // Para fechas
            currentAmbiguity.suggestions.map((date: Date, index: number) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-auto py-3 justify-start"
                onClick={() => handleSelect(date)}
              >
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <div className="text-left">
                  <div className="font-medium">
                    {format(date, "EEEE, d 'de' MMMM", { locale: es })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(date, 'yyyy')}
                  </div>
                </div>
              </Button>
            ))
          ) : (
            // Para otros tipos
            currentAmbiguity.suggestions.map((value: any, index: number) => (
              <Button
                key={index}
                variant="outline"
                className="w-full py-3"
                onClick={() => handleSelect(value)}
              >
                {typeof value === 'object' ? JSON.stringify(value) : value}
              </Button>
            ))
          )}
        </div>
      )}

      {/* Manual input option */}
      <div className="pt-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => {
            const manualValue = prompt(`Ingresa manualmente: ${currentAmbiguity.field}`)
            if (manualValue) {
              handleSelect(manualValue)
            }
          }}
        >
          Ingresar manualmente
        </Button>
      </div>
    </div>
  )
}