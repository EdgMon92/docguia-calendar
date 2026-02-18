import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Appointment } from '@/types/appointment'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { User, Calendar, Clock, Timer, FileText, Stethoscope, MapPin } from 'lucide-react'

interface EditAppointmentModalProps {
  appointment: Appointment | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, updates: Partial<Appointment>) => void
}

export function EditAppointmentModal({
  appointment,
  isOpen,
  onClose,
  onSave,
}: EditAppointmentModalProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    doctor: '',
    date: '',
    time: '',
    duration: 30,
    consultorio: '',
    service: '',
    motivo: '',
    notes: '',
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientName: appointment.patientName,
        doctor: appointment.doctor || '',
        date: format(appointment.startTime, 'yyyy-MM-dd'),
        time: format(appointment.startTime, 'HH:mm'),
        duration: appointment.duration,
        consultorio: appointment.consultorio || '',
        service: appointment.service || '',
        motivo: appointment.motivo || '',
        notes: appointment.notes || '',
      })
    }
  }, [appointment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!appointment) return

    setIsSaving(true)

    try {
      // Combinar fecha y hora
      const [year, month, day] = formData.date.split('-').map(Number)
      const [hours, minutes] = formData.time.split(':').map(Number)
      const startTime = new Date(year, month - 1, day, hours, minutes)

      const updates: Partial<Appointment> = {
        patientName: formData.patientName,
        doctor: formData.doctor || undefined,
        startTime,
        duration: formData.duration,
        consultorio: formData.consultorio || undefined,
        service: formData.service || undefined,
        motivo: formData.motivo || undefined,
        notes: formData.notes || undefined,
        updatedAt: new Date(),
      }

      onSave(appointment.id, updates)
      onClose()
    } catch (error) {
      console.error('Error updating appointment:', error)
      alert('Error al actualizar la cita')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!appointment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar cita</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Paciente */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Paciente <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => handleChange('patientName', e.target.value)}
              className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Nombre del paciente"
              required
            />
          </div>

          {/* Doctor */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Stethoscope className="w-4 h-4" />
              Doctor
            </label>
            <input
              type="text"
              value={formData.doctor}
              onChange={(e) => handleChange('doctor', e.target.value)}
              className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Nombre del doctor"
            />
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                Hora <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Duración */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Timer className="w-4 h-4" />
              Duración (minutos)
            </label>
            <input
              type="number"
              min="5"
              step="5"
              value={formData.duration}
              onChange={(e) => handleChange('duration', parseInt(e.target.value))}
              className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Consultorio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Consultorio
            </label>
            <select
              value={formData.consultorio}
              onChange={(e) => handleChange('consultorio', e.target.value)}
              className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Seleccionar consultorio...</option>
              <option value="consultorio-1">Consultorio 1</option>
              <option value="consultorio-2">Consultorio 2</option>
              <option value="consultorio-3">Consultorio 3</option>
            </select>
          </div>

          {/* Servicio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Servicio
            </label>
            <select
              value={formData.service}
              onChange={(e) => handleChange('service', e.target.value)}
              className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Seleccionar servicio...</option>
              <option value="Consulta">Consulta General</option>
              <option value="Control">Control</option>
              <option value="Limpieza">Limpieza Dental</option>
              <option value="Revisión">Revisión</option>
              <option value="Emergencia">Emergencia</option>
              <option value="Seguimiento">Seguimiento</option>
            </select>
          </div>

          {/* Motivo */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Motivo de consulta
            </label>
            <input
              type="text"
              value={formData.motivo}
              onChange={(e) => handleChange('motivo', e.target.value)}
              className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ej: Dolor de cabeza, revisión anual..."
            />
          </div>

          {/* Notas */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Notas internas
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Notas adicionales..."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              loading={isSaving}
            >
              Guardar cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}