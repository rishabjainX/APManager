import { APCourse } from '../store/coursesSlice'

// Helper function to validate CSV data
export function validateCourseData(course: any): string[] {
  const errors: string[] = []
  
  if (!course.id) errors.push('Missing ID')
  if (!course.name) errors.push('Missing name')
  if (!course.subject) errors.push('Missing subject')
  if (!course.description) errors.push('Missing description')
  if (!course.emoji) errors.push('Missing emoji')
  if (!course.tags) errors.push('Missing tags')
  if (!course.units) errors.push('Missing units')
  if (!course.bigIdeas) errors.push('Missing big ideas')
  if (!course.exam) errors.push('Missing exam format')
  if (!course.examDate) errors.push('Missing exam date')
  
  return errors
}

// Helper function to format a new course for CSV
export function formatCourseForCSV(course: Partial<APCourse>): string {
  const {
    id = '',
    name = '',
    subject = '',
    meanScore = 0,
    passRate = 0,
    description = '',
    emoji = '',
    tags = [],
    units = {},
    bigIdeas = [],
    prerequisites = '',
    labRequirement = '',
    exam = '',
    examDate = ''
  } = course

  // Convert units object to string format
  const unitsString = Object.entries(units)
    .map(([unit, weight]) => `${unit}:${weight}`)
    .join(',')

  // Convert arrays to comma-separated strings
  const tagsString = tags.join(',')
  const bigIdeasString = bigIdeas.join(',')

  return `${id},${name},${subject},${meanScore},${passRate},"${description}",${emoji},"${tagsString}","${unitsString}","${bigIdeasString}",${prerequisites},${labRequirement},"${exam}","${examDate}"`
}

// Helper function to get CSV header
export function getCSVHeader(): string {
  return 'id,name,subject,meanScore,passRate,description,emoji,tags,units,bigIdeas,prerequisites,labRequirement,exam,examDate'
}

// Helper function to export all courses to CSV
export function exportCoursesToCSV(courses: APCourse[]): string {
  const header = getCSVHeader()
  const rows = courses.map(course => formatCourseForCSV(course))
  return [header, ...rows].join('\n')
}

// Helper function to download CSV file
export function downloadCSV(csvContent: string, filename: string = 'ap-courses.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}
