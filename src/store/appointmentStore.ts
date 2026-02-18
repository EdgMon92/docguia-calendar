import { create } from 'zustand'
import { Appointment } from '@/types/appointment'
import { appointmentService } from '@/services/appointments/appointmentService'

interface AppointmentStore {
  appointments: Appointment[]
  selectedAppointment: Appointment | null
  isLoading: boolean
  error: string | null
  
  // Actions
  loadAppointments: () => void
  addAppointment: (appointment: Appointment) => void
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void
  selectAppointment: (appointment: Appointment | null) => void
  clearError: () => void
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  selectedAppointment: null,
  isLoading: false,
  error: null,

  loadAppointments: () => {
    try {
      set({ isLoading: true, error: null })
      const appointments = appointmentService.getAppointments()
      set({ appointments, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar citas',
        isLoading: false 
      })
    }
  },

  addAppointment: (appointment) => {
    set(state => ({
      appointments: [...state.appointments, appointment],
    }))
    // Recargar desde localStorage para asegurar sincronización
    const updated = appointmentService.getAppointments()
    set({ appointments: updated })
  },

  updateAppointment: (id, updates) => {
    set(state => ({
      appointments: state.appointments.map(apt =>
        apt.id === id ? { ...apt, ...updates } : apt
      ),
    }))
  },

  deleteAppointment: (id) => {
    try {
      appointmentService.deleteAppointment(id)
      set((state) => ({
        appointments: state.appointments.filter((apt) => apt.id !== id),
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error deleting appointment' 
      })
    }
  },

  selectAppointment: (appointment) => {
    set({ selectedAppointment: appointment })
  },

  clearError: () => {
    set({ error: null })
  },
}))