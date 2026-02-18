import { useState } from 'react'
import { useVoiceStore } from '@/store/voiceStore'
import { useAppointments } from '@/hooks/useAppointments'
import { useAppointmentStore } from '@/store/appointmentStore'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { User, Calendar, Clock, Timer, FileText, Stethoscope } from 'lucide-react' // ⭐ Agregar Stethoscope
import { cn } from '@/lib/cn'

interface AppointmentConfirmationProps {
  onClose: () => void
}

export function AppointmentConfirmation({ onClose }: AppointmentConfirmationProps) {
  const { parsedData, ambiguities, setStep, reset } = useVoiceStore()
  const { createAppointment } = useAppointments()
  const { loadAppointments } = useAppointmentStore()
  const [isCreating, setIsCreating] = useState(false)

  const handleConfirm = async () => {
    if (!parsedData?.patientName || !parsedData?.date) {
      alert('Faltan datos requeridos')
      return
    }

    setIsCreating(true)

    try {
      await createAppointment({
        patientName: parsedData.patientName,
        startTime: parsedData.date,
        duration: parsedData.duration || 30,
        service: parsedData.service,
        motivo: parsedData.motivo,
        doctor: parsedData.doctor, 
        notes: parsedData.notes,
      })

      console.log('✅ Cita creada exitosamente')

      setStep('completed')

      setTimeout(() => {
        console.log('🔄 Cerrando modal y recargando...')
        loadAppointments()
        reset()
        onClose()
      }, 1500)
    } catch (error) {
      console.error('❌ Error creating appointment:', error)
      setStep('error')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6 py-4">
      {/* Datos de la cita */}
      <div className="space-y-4">
        <ConfirmationField
          icon={User}
          label="Paciente"
          value={parsedData?.patientName || 'No especificado'}
          hasIssue={!parsedData?.patientName}
        />

        {/*Mostrar doctor */}
        {parsedData?.doctor && (
          <ConfirmationField
            icon={Stethoscope}
            label="Doctor"
            value={parsedData.doctor}
          />
        )}

        <ConfirmationField
          icon={Calendar}
          label="Fecha"
          value={
            parsedData?.date
              ? format(parsedData.date, "d 'de' MMMM, yyyy", { locale: es })
              : 'No especificada'
          }
          hasIssue={!parsedData?.date}
        />

        <ConfirmationField
          icon={Clock}
          label="Hora"
          value={parsedData?.date ? format(parsedData.date, 'h:mm a') : 'No especificada'}
          hasIssue={!parsedData?.date}
        />

        <ConfirmationField
          icon={Timer}
          label="Duración"
          value={`${parsedData?.duration || 30} minutos`}
        />

        {parsedData?.service && (
          <ConfirmationField
            icon={Clock}
            label="Servicio"
            value={parsedData.service}
          />
        )}

        {parsedData?.motivo && (
          <ConfirmationField
            icon={FileText}
            label="Motivo"
            value={parsedData.motivo}
          />
        )}
      </div>

      {/* Ambigüedades no resueltas */}
      {ambiguities.length > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-medium text-yellow-900 mb-2">
            Hay algunos datos que necesitan confirmación
          </p>
          <ul className="text-sm text-yellow-700 space-y-1">
            {ambiguities.map((amb, i) => (
              <li key={i}>• {amb.reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={() => {
            reset()
            onClose()
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={handleConfirm}
          loading={isCreating}
          disabled={!parsedData?.patientName || !parsedData?.date}
        >
          Confirmar cita
        </Button>
      </div>
    </div>
  )
}

interface ConfirmationFieldProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  hasIssue?: boolean
}

function ConfirmationField({ icon: Icon, label, value, hasIssue }: ConfirmationFieldProps) {
  return (
    <div className={cn('flex items-start gap-3', hasIssue && 'text-red-600')}>
      <Icon className="w-5 h-5 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className={cn('text-sm', hasIssue ? 'text-red-600' : 'text-gray-900')}>
          {value}
        </p>
      </div>
    </div>
  )
}