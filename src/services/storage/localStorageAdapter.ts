import { Appointment } from '@/types/appointment'
import { STORAGE_KEYS } from '@/lib/constants'

export class LocalStorageAdapter {
  private storageKey = STORAGE_KEYS.appointments

  // Método create
  create(appointment: Appointment): void {
    const appointments = this.getAll()
    appointments.push(appointment)
    this.saveAll(appointments)
  }

  // Método update
  update(id: string, updates: Partial<Appointment>): void {
    const appointments = this.getAll()
    const index = appointments.findIndex(apt => apt.id === id)
    
    if (index === -1) {
      throw new Error('Appointment not found')
    }

    appointments[index] = {
      ...appointments[index],
      ...updates,
    }

    this.saveAll(appointments)
  }

  // Método delete
  delete(id: string): void {
    const appointments = this.getAll().filter(apt => apt.id !== id)
    this.saveAll(appointments)
  }

  // Método getById
  getById(id: string): Appointment | null {
    const appointments = this.getAll()
    return appointments.find(apt => apt.id === id) || null
  }

  // Método getAll
  getAll(): Appointment[] {
    try {
      const data = localStorage.getItem(this.storageKey)
      
      if (!data) {
        return []
      }

      const parsed = JSON.parse(data)
      
      // Convertir strings de fecha a objetos Date
      return parsed.map((apt: any) => ({
        ...apt,
        startTime: new Date(apt.startTime),
        endTime: new Date(apt.endTime),
        createdAt: new Date(apt.createdAt),
        updatedAt: new Date(apt.updatedAt),
      }))
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return []
    }
  }

  // Método clearAll (para el botón "Limpiar todo")
  clearAll(): void {
    localStorage.removeItem(this.storageKey)
  }

  // Método privado para guardar todo
  private saveAll(appointments: Appointment[]): void {
    try {
      const data = JSON.stringify(appointments)
      localStorage.setItem(this.storageKey, data)
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      throw new Error('Failed to save appointments')
    }
  }
}

export const storageAdapter = new LocalStorageAdapter()