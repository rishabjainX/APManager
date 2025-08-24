import coursesCSV from './courses.csv?raw'
import { importCoursesFromCSV } from '../utils/csvImporter'

// Import courses from CSV
export const allCourses = importCoursesFromCSV(coursesCSV)

// Get unique subjects
export const subjects = [...new Set(allCourses.map(course => course.subject))]

// Get unique tags
export const allTags = [...new Set(allCourses.flatMap(course => course.tags))]

// Export for use in components
export { allCourses as courses }
