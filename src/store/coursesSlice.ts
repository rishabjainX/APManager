import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { allCourses, subjects, allTags } from '../data/coursesData'

export interface APCourse {
  id: string
  name: string
  subject: string
  meanScore: number
  passRate: number
  difficultyRating: number
  stars: number
  description: string
  emoji: string
  tags: string[]
  units: { [key: string]: string }
  bigIdeas: string[]
  prerequisites: string
  labRequirement: string
  exam: string
  examDate: string
}

export interface CoursesState {
  courses: APCourse[]
  filteredCourses: APCourse[]
  searchQuery: string
  selectedSubject: string
  selectedDifficulty: number
  isLoading: boolean
  error: string | null
  
  // Actions
  setSearchQuery: (query: string) => void
  setSelectedSubject: (subject: string) => void
  setSelectedDifficulty: (difficulty: number) => void
  clearFilters: () => void
  applyFilters: () => void
  fetchCourses: () => Promise<void>
}

export const useCoursesStore = create<CoursesState>()(
  persist(
    (set, get) => ({
      courses: [],
      filteredCourses: [],
      searchQuery: '',
      selectedSubject: '',
      selectedDifficulty: 0,
      isLoading: false,
      error: null,

      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
        get().applyFilters()
      },

      setSelectedSubject: (subject: string) => {
        set({ selectedSubject: subject })
        get().applyFilters()
      },

      setSelectedDifficulty: (difficulty: number) => {
        set({ selectedDifficulty: difficulty })
        get().applyFilters()
      },

      clearFilters: () => {
        set({
          searchQuery: '',
          selectedSubject: '',
          selectedDifficulty: 0,
        })
        get().applyFilters()
      },

      applyFilters: () => {
        const { courses, searchQuery, selectedSubject, selectedDifficulty } = get()
        
        let filtered = [...courses]

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filtered = filtered.filter(course =>
            course.name.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query) ||
            course.tags.some(tag => tag.toLowerCase().includes(query))
          )
        }

        // Filter by subject
        if (selectedSubject) {
          filtered = filtered.filter(course => course.subject === selectedSubject)
        }

        // Filter by difficulty
        if (selectedDifficulty > 0) {
          filtered = filtered.filter(course => course.stars === selectedDifficulty)
        }

        set({ filteredCourses: filtered })
      },

      fetchCourses: async () => {
        set({ isLoading: true, error: null })
        try {
          // Use the imported data from CSV
          set({ 
            courses: allCourses,
            filteredCourses: allCourses,
            isLoading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch courses',
            isLoading: false 
          })
        }
      },
    }),
    {
      name: 'courses-storage',
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        selectedSubject: state.selectedSubject,
        selectedDifficulty: state.selectedDifficulty,
      }),
    }
  )
)
