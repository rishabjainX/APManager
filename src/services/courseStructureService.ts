import PDFParser, { ParsedCourseStructure } from '../utils/pdfParser';

// Mapping of course IDs to their PDF URLs
export const COURSE_PDF_URLS: Record<string, string> = {
  'physics-1-algebra-based': 'https://apcentral.collegeboard.org/media/pdf/ap-physics-1-course-at-a-glance.pdf',
  'chemistry': 'https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-at-a-glance.pdf',
  'biology': 'https://apcentral.collegeboard.org/media/pdf/ap-biology-course-at-a-glance.pdf',
  'calculus-ab': 'https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-course-at-a-glance.pdf',
  'calculus-bc': 'https://apcentral.collegeboard.org/media/pdf/ap-calculus-bc-course-at-a-glance.pdf',
  'statistics': 'https://apcentral.collegeboard.org/media/pdf/ap-statistics-course-at-a-glance.pdf',
  'computer-science-a': 'https://apcentral.collegeboard.org/media/pdf/ap-computer-science-a-course-at-a-glance.pdf',
  'english-literature': 'https://apcentral.collegeboard.org/media/pdf/ap-english-literature-and-composition-course-at-a-glance.pdf',
  'english-language': 'https://apcentral.collegeboard.org/media/pdf/ap-english-language-and-composition-course-at-a-glance.pdf',
  'us-history': 'https://apcentral.collegeboard.org/media/pdf/ap-united-states-history-course-at-a-glance.pdf',
  'world-history': 'https://apcentral.collegeboard.org/media/pdf/ap-world-history-modern-course-at-a-glance.pdf',
};

export class CourseStructureService {
  private static instance: CourseStructureService;
  private pdfParser: PDFParser;
  private structureCache = new Map<string, ParsedCourseStructure>();
  private loadingStates = new Map<string, boolean>();
  private errorStates = new Map<string, string>();

  private constructor() {
    this.pdfParser = PDFParser.getInstance();
  }

  static getInstance(): CourseStructureService {
    if (!CourseStructureService.instance) {
      CourseStructureService.instance = new CourseStructureService();
    }
    return CourseStructureService.instance;
  }

  /**
   * Get course structure for a specific course
   */
  async getCourseStructure(courseId: string): Promise<ParsedCourseStructure> {
    // Check if we have a cached structure
    if (this.structureCache.has(courseId)) {
      return this.structureCache.get(courseId)!;
    }

    // Check if we're already loading this course
    if (this.loadingStates.get(courseId)) {
      throw new Error('Course structure is already being loaded');
    }

    // Check if we have a PDF URL for this course
    const pdfUrl = COURSE_PDF_URLS[courseId];
    if (!pdfUrl) {
      throw new Error(`No PDF URL available for course: ${courseId}`);
    }

    try {
      // Set loading state
      this.loadingStates.set(courseId, true);
      this.errorStates.delete(courseId);

      console.log(`Loading course structure for ${courseId} from ${pdfUrl}`);

      // Parse the PDF
      const structure = await this.pdfParser.parseCoursePDF(pdfUrl, courseId);
      
      // Cache the result
      this.structureCache.set(courseId, structure);
      
      console.log(`Successfully loaded course structure for ${courseId}`);
      return structure;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.errorStates.set(courseId, errorMessage);
      throw error;
    } finally {
      this.loadingStates.delete(courseId);
    }
  }

  /**
   * Check if a course structure is available
   */
  isCourseStructureAvailable(courseId: string): boolean {
    return COURSE_PDF_URLS.hasOwnProperty(courseId);
  }

  /**
   * Check if a course structure is currently loading
   */
  isCourseStructureLoading(courseId: string): boolean {
    return this.loadingStates.get(courseId) || false;
  }

  /**
   * Check if there was an error loading a course structure
   */
  getCourseStructureError(courseId: string): string | undefined {
    return this.errorStates.get(courseId);
  }

  /**
   * Get all available course IDs that have PDF structures
   */
  getAvailableCourseIds(): string[] {
    return Object.keys(COURSE_PDF_URLS);
  }

  /**
   * Add a new course PDF URL
   */
  addCoursePDF(courseId: string, pdfUrl: string): void {
    COURSE_PDF_URLS[courseId] = pdfUrl;
    // Clear any cached structure for this course
    this.structureCache.delete(courseId);
    this.errorStates.delete(courseId);
  }

  /**
   * Remove a course PDF URL
   */
  removeCoursePDF(courseId: string): void {
    delete COURSE_PDF_URLS[courseId];
    this.structureCache.delete(courseId);
    this.errorStates.delete(courseId);
    this.loadingStates.delete(courseId);
  }

  /**
   * Clear all cached structures
   */
  clearCache(): void {
    this.structureCache.clear();
    this.pdfParser.clearCache();
  }

  /**
   * Get cached structure if available
   */
  getCachedStructure(courseId: string): ParsedCourseStructure | undefined {
    return this.structureCache.get(courseId);
  }

  /**
   * Preload course structures for better performance
   */
  async preloadCourseStructures(courseIds: string[]): Promise<void> {
    const promises = courseIds
      .filter(id => this.isCourseStructureAvailable(id))
      .map(id => this.getCourseStructure(id).catch(error => {
        console.warn(`Failed to preload course structure for ${id}:`, error);
      }));

    await Promise.allSettled(promises);
  }
}

export default CourseStructureService;
