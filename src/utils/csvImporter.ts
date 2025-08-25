import Papa from 'papaparse'

export interface APCourseFromCSV {
  id: string
  name: string
  subject: string
  meanScore: string
  passRate: string
  description: string
  emoji: string
  tags: string
  units: string
  bigIdeas: string
  prerequisites: string
  labRequirement: string
  exam: string
  examDate: string
  pdfUrl: string
}

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
  pdfUrl: string
}

// Utility functions
function computeDifficultyRating(meanScore: number, passRate: number): number {
  // 60% pass rate, 40% mean score
  const passRateScore = (passRate / 100) * 5
  const meanScoreScore = (meanScore / 5) * 5
  return (passRateScore * 0.6) + (meanScoreScore * 0.4)
}

function difficultyToStars(difficulty: number): number {
  if (difficulty >= 4.5) return 5
  if (difficulty >= 3.5) return 4
  if (difficulty >= 2.5) return 3
  if (difficulty >= 1.5) return 2
  return 1
}

function parseUnits(unitsString: string): { [key: string]: string } {
  if (!unitsString) return {}
  
  const units: { [key: string]: string } = {}
  const unitPairs = unitsString.split(',')
  
  unitPairs.forEach(pair => {
    const [unitName, weighting] = pair.split(':')
    if (unitName && weighting) {
      units[unitName.trim()] = weighting.trim()
    }
  })
  
  return units
}

function parseBigIdeas(bigIdeasString: string): string[] {
  if (!bigIdeasString) return []
  return bigIdeasString.split(',').map(idea => idea.trim()).filter(Boolean)
}

function parseTags(tagsString: string): string[] {
  if (!tagsString) return []
  return tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
}

export function importCoursesFromCSV(csvData: string): APCourse[] {
  const results = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  })

  return results.data
    .filter((row: any) => row.id && row.name) // Filter out empty rows
    .map((row: APCourseFromCSV) => {
      const meanScore = parseFloat(row.meanScore) || 0
      const passRate = parseFloat(row.passRate) || 0
      const difficultyRating = computeDifficultyRating(meanScore, passRate)
      const stars = difficultyToStars(difficultyRating)

      return {
        id: row.id,
        name: row.name,
        subject: row.subject,
        meanScore,
        passRate,
        difficultyRating,
        stars,
        description: row.description,
        emoji: row.emoji,
        tags: parseTags(row.tags),
        units: parseUnits(row.units),
        bigIdeas: parseBigIdeas(row.bigIdeas),
        prerequisites: row.prerequisites,
        labRequirement: row.labRequirement,
        exam: row.exam,
        examDate: row.examDate,
        pdfUrl: row.pdfUrl,
      }
    })
}
