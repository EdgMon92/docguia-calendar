import { create } from 'zustand'
import { ViewMode } from '@/types/calendar'
import { goToNextWeek, goToPrevWeek, goToToday } from '@/lib/date-utils'

interface CalendarStore {
  currentDate: Date
  viewMode: ViewMode
  selectedConsultorio: string
  
  // Actions
  setCurrentDate: (date: Date) => void
  setViewMode: (mode: ViewMode) => void
  setSelectedConsultorio: (id: string) => void
  goToNext: () => void
  goToPrev: () => void
  goToTodayDate: () => void
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  currentDate: new Date(),
  viewMode: 'week',
  selectedConsultorio: 'all',

  setCurrentDate: (date) => {
    set({ currentDate: date })
  },

  setViewMode: (mode) => {
    set({ viewMode: mode })
  },

  setSelectedConsultorio: (id) => {
    set({ selectedConsultorio: id })
  },

  goToNext: () => {
    const { currentDate } = get()
    set({ currentDate: goToNextWeek(currentDate) })
  },

  goToPrev: () => {
    const { currentDate } = get()
    set({ currentDate: goToPrevWeek(currentDate) })
  },

  goToTodayDate: () => {
    set({ currentDate: goToToday() })
  },
}))