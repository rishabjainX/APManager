import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BackpackState {
  selectedCourses: string[] // Just store course IDs for now
  
  // Actions
  addCourse: (courseId: string) => void
  removeCourse: (courseId: string) => void
  isInBackpack: (courseId: string) => boolean
  clearBackpack: () => void
}

export const useBackpackStore = create<BackpackState>()(
  persist(
    (set, get) => ({
      selectedCourses: [],

      addCourse: (courseId: string) => {
        const { selectedCourses } = get()
        if (!selectedCourses.includes(courseId)) {
          set({ selectedCourses: [...selectedCourses, courseId] })
        }
      },

      removeCourse: (courseId: string) => {
        const { selectedCourses } = get()
        set({ 
          selectedCourses: selectedCourses.filter(id => id !== courseId) 
        })
      },

      isInBackpack: (courseId: string) => {
        const { selectedCourses } = get()
        return selectedCourses.includes(courseId)
      },

      clearBackpack: () => {
        set({ selectedCourses: [] })
      },
    }),
    {
      name: 'backpack-storage',
    }
  )
)
