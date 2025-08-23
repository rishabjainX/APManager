import { create } from 'zustand';
import { PersistStore, PersistConfig } from './persist';
import { APCourse } from '../adapters/apFramework';

export type CourseStatus = 'planned' | 'in-progress' | 'completed';

export interface BackpackCourse {
  id: string;
  courseId: string;
  status: CourseStatus;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = easiest, 5 = hardest
  addedAt: string;
  lastActivity: string;
  order: number;
}

export interface BackpackState {
  courses: BackpackCourse[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addCourse: (courseId: string, difficulty?: 1 | 2 | 3 | 4 | 5) => void;
  removeCourse: (id: string) => void;
  updateCourseStatus: (id: string, status: CourseStatus) => void;
  updateCourseDifficulty: (id: string, difficulty: 1 | 2 | 3 | 4 | 5) => void;
  reorderCourses: (fromIndex: number, toIndex: number) => void;
  updateLastActivity: (id: string) => void;
  getCourseById: (id: string) => BackpackCourse | undefined;
  getCoursesByStatus: (status: CourseStatus) => BackpackCourse[];
  clearBackpack: () => void;
}

// Persistence configuration
const backpackConfig: PersistConfig<BackpackCourse[]> = {
  key: 'backpack',
  version: 1,
};

class BackpackPersistStore extends PersistStore<BackpackCourse[]> {
  constructor() {
    super(backpackConfig);
  }
}

const persistStore = new BackpackPersistStore();

export const useBackpackStore = create<BackpackState>((set, get) => ({
  courses: [],
  isLoading: false,
  error: null,

  addCourse: (courseId: string, difficulty: 1 | 2 | 3 | 4 | 5 = 3) => {
    const { courses } = get();
    const existingCourse = courses.find(c => c.courseId === courseId);
    
    if (existingCourse) {
      set({ error: 'Course already in backpack' });
      return;
    }

    const newCourse: BackpackCourse = {
      id: `backpack-${Date.now()}`,
      courseId,
      status: 'planned',
      difficulty,
      addedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      order: courses.length,
    };

    const updatedCourses = [...courses, newCourse];
    set({ courses: updatedCourses, error: null });
    persistStore.save(updatedCourses);
  },

  removeCourse: (id: string) => {
    const { courses } = get();
    const updatedCourses = courses.filter(c => c.id !== id);
    
    // Reorder remaining courses
    const reorderedCourses = updatedCourses.map((course, index) => ({
      ...course,
      order: index,
    }));

    set({ courses: reorderedCourses });
    persistStore.save(reorderedCourses);
  },

  updateCourseStatus: (id: string, status: CourseStatus) => {
    const { courses } = get();
    const updatedCourses = courses.map(c => 
      c.id === id ? { ...c, status, lastActivity: new Date().toISOString() } : c
    );
    
    set({ courses: updatedCourses });
    persistStore.save(updatedCourses);
  },

  updateCourseDifficulty: (id: string, difficulty: 1 | 2 | 3 | 4 | 5) => {
    const { courses } = get();
    const updatedCourses = courses.map(c => 
      c.id === id ? { ...c, difficulty } : c
    );
    
    set({ courses: updatedCourses });
    persistStore.save(updatedCourses);
  },

  reorderCourses: (fromIndex: number, toIndex: number) => {
    const { courses } = get();
    const updatedCourses = [...courses];
    const [movedCourse] = updatedCourses.splice(fromIndex, 1);
    updatedCourses.splice(toIndex, 0, movedCourse);
    
    // Update order property
    const reorderedCourses = updatedCourses.map((course, index) => ({
      ...course,
      order: index,
    }));

    set({ courses: reorderedCourses });
    persistStore.save(reorderedCourses);
  },

  updateLastActivity: (id: string) => {
    const { courses } = get();
    const updatedCourses = courses.map(c => 
      c.id === id ? { ...c, lastActivity: new Date().toISOString() } : c
    );
    
    set({ courses: updatedCourses });
    persistStore.save(updatedCourses);
  },

  getCourseById: (id: string) => {
    return get().courses.find(c => c.id === id);
  },

  getCoursesByStatus: (status: CourseStatus) => {
    return get().courses.filter(c => c.status === status);
  },

  clearBackpack: () => {
    set({ courses: [] });
    persistStore.clear();
  },
}));

// Initialize from persistence
persistStore.subscribe((courses) => {
  if (courses) {
    useBackpackStore.setState({ courses });
  }
});
