import { cn } from '@/lib/cn'

interface TimeSlotProps {
  hour: number
  date: Date
  isAvailable?: boolean
  onClick?: () => void
}

export function TimeSlot({ hour, date, isAvailable = true, onClick }: TimeSlotProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'h-16 border-b border-l border-gray-100',
        'transition-colors cursor-pointer',
        isAvailable ? 'hover:bg-gray-50' : 'bg-gray-50 cursor-not-allowed',
        'relative'
      )}
    >
      {/* Slot está vacío por defecto - los appointments se renderizarán aquí */}
    </div>
  )
}