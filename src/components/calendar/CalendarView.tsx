import { useState, useEffect } from 'react'
import { useCalendar } from '@/hooks/useCalendar'
import { useAppointmentStore } from '@/store/appointmentStore'
import { appointmentService } from '@/services/appointments/appointmentService' // ⭐ Agregar
import { Appointment } from '@/types/appointment'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'
import { VoiceModal } from '../voice/VoiceModal'
import { AppointmentDetailsModal } from './AppointmentDetailsModal'
import { EditAppointmentModal } from './EditAppointmentModal' // 

export function CalendarView() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null) // 
  const { loadAppointments, deleteAppointment, updateAppointment } = useAppointmentStore()
  
  const {
    currentDate,
    viewMode,
    selectedConsultorio,
    weekDays,
    visibleAppointments,
    timeSlots,
    weekRangeLabel,
    setViewMode,
    setSelectedConsultorio,
    goToNext,
    goToPrev,
    goToTodayDate,
  } = useCalendar()

  useEffect(() => {
    loadAppointments()
  }, [currentDate, loadAppointments])

  const handleCloseModal = () => {
    console.log('🚪 Cerrando modal desde CalendarView')
    setIsVoiceModalOpen(false)
    setTimeout(() => {
      loadAppointments()
    }, 300)
  }

  const handleOpenModal = () => {
    if (isVoiceModalOpen) return
    setIsVoiceModalOpen(true)
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    console.log('📋 Cita seleccionada:', appointment)
    setSelectedAppointment(appointment)
  }

  const handleCloseDetails = () => {
    setSelectedAppointment(null)
  }

  const handleDeleteAppointment = (appointment: Appointment) => {
    deleteAppointment(appointment.id)
    loadAppointments()
  }

  // ⭐ Abrir modal de edición
  const handleEditAppointment = (appointment: Appointment) => {
    console.log('✏️ Editar cita:', appointment)
    setSelectedAppointment(null) // Cerrar modal de detalles
    setAppointmentToEdit(appointment) // Abrir modal de edición
  }

  // Cerrar modal de edición
  const handleCloseEdit = () => {
    setAppointmentToEdit(null)
  }

  // Guardar cambios de edición
  const handleSaveEdit = async (id: string, updates: Partial<Appointment>) => {
    try {
      console.log('💾 Guardando cambios:', id, updates)
      
      // Actualizar en el servicio
      const updated = appointmentService.updateAppointment(id, updates)
      
      // Actualizar en el store
      updateAppointment(id, updates)
      
      // Recargar
      loadAppointments()
      
      console.log('✅ Cita actualizada:', updated)
    } catch (error) {
      console.error('❌ Error al actualizar:', error)
      alert(error instanceof Error ? error.message : 'Error al actualizar la cita')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        weekRangeLabel={weekRangeLabel}
        selectedConsultorio={selectedConsultorio}
        onPrevWeek={goToPrev}
        onNextWeek={goToNext}
        onToday={goToTodayDate}
        onViewModeChange={setViewMode}
        onConsultorioChange={setSelectedConsultorio}
        onCreateAppointment={handleOpenModal}
      />
      
      <CalendarGrid
        weekDays={weekDays}
        appointments={visibleAppointments}
        timeSlots={timeSlots}
        onAppointmentClick={handleAppointmentClick}
      />
      
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={handleCloseModal}
      />

      {/* Modal de detalles */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={handleCloseDetails}
        onEdit={handleEditAppointment}
        onDelete={handleDeleteAppointment}
      />

      {/* Modal de edición */}
      <EditAppointmentModal
        appointment={appointmentToEdit}
        isOpen={!!appointmentToEdit}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </div>
  )
}