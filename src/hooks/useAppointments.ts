import { useEffect } from 'react'
import { useAppointmentStore } from '@/store/appointmentStore'
import { appointmentService } from '@/services/appointments/appointmentService'
import { CreateAppointmentDTO } from '@/types/appointment'

export function useAppointments() {
  const {
    appointments,
    selectedAppointment,
    isLoading,
    error,
    loadAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    selectAppointment,
    clearError,
  } = useAppointmentStore()

  // Cargar citas al montar
  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  const createAppointment = async (data: CreateAppointmentDTO) => {
    try {
      const appointment = await appointmentService.createAppointment(data)
      addAppointment(appointment)
      return appointment
    } catch (error) {
      throw error
    }
  }

  const removeAppointment = async (id: string) => {
    try {
      await appointmentService.deleteAppointment(id)
      deleteAppointment(id)
    } catch (error) {
      throw error
    }
  }

  return {
    appointments,
    selectedAppointment,
    isLoading,
    error,
    createAppointment,
    updateAppointment,
    removeAppointment,
    selectAppointment,
    clearError,
  }
}