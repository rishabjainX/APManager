import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParsedUnit {
  id: string;
  name: string;
  weighting: string;
  topics: ParsedTopic[];
}

export interface ParsedTopic {
  id: string;
  unitId: string;
  name: string;
  description?: string;
  learningObjectives: string[];
}

export interface ParsedCourseStructure {
  id: string;
  name: string;
  units: ParsedUnit[];
}

export class PDFParser {
  private static instance: PDFParser;
  private cache = new Map<string, ParsedCourseStructure>();

  static getInstance(): PDFParser {
    if (!PDFParser.instance) {
      PDFParser.instance = new PDFParser();
    }
    return PDFParser.instance;
  }

  async parseCoursePDF(pdfUrl: string, courseId: string): Promise<ParsedCourseStructure> {
    // Check cache first
    if (this.cache.has(courseId)) {
      return this.cache.get(courseId)!;
    }

    try {
      console.log(`Parsing PDF: ${pdfUrl}`);
      
      // Test if PDF is accessible first
      try {
        const response = await fetch(pdfUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`PDF not accessible: ${response.status} ${response.statusText}`);
        }
        console.log('PDF URL is accessible');
      } catch (fetchError) {
        console.warn('PDF fetch test failed, trying direct PDF.js loading:', fetchError);
      }
      
      // Load the PDF
      const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        httpHeaders: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      
      const pdf = await loadingTask.promise;
      
      console.log(`PDF loaded with ${pdf.numPages} pages`);
      
      // Extract text from all pages
      let fullText = '';
      for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      console.log('Extracted text length:', fullText.length);
      console.log('First 500 characters:', fullText.substring(0, 500));

      // Parse the extracted text to find course structure
      const structure = this.parseTextToStructure(fullText, courseId);
      
      // Cache the result
      this.cache.set(courseId, structure);
      
      console.log(`Successfully parsed course structure for ${courseId}:`, structure);
      return structure;
      
    } catch (error) {
      console.error('Error parsing PDF:', error);
      
      // If PDF parsing fails, return a fallback structure
      console.log('Returning fallback structure for', courseId);
      const fallbackStructure = this.createFallbackStructure(courseId);
      this.cache.set(courseId, fallbackStructure);
      return fallbackStructure;
    }
  }

  private parseTextToStructure(text: string, courseId: string): ParsedCourseStructure {
    // Clean up the text
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    console.log('Parsing text:', cleanText.substring(0, 500) + '...');

    // Try to extract course name
    const courseName = this.extractCourseName(cleanText, courseId);
    
    // Extract units and topics
    const units = this.extractUnits(cleanText);

    return {
      id: courseId,
      name: courseName,
      units
    };
  }

  private extractCourseName(text: string, courseId: string): string {
    // Try to find AP course name patterns
    const apPatterns = [
      /AP\s+([A-Za-z\s]+?)(?:\s+Course|Exam|Overview)/i,
      /Advanced\s+Placement\s+([A-Za-z\s]+?)(?:\s+Course|Exam|Overview)/i,
      /([A-Za-z\s]+?)\s+Course\s+at\s+a\s+Glance/i
    ];

    for (const pattern of apPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    // Fallback: use courseId to generate a name
    return courseId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private extractUnits(text: string): ParsedUnit[] {
    const units: ParsedUnit[] = [];
    
    // Common patterns for unit identification in AP course overviews
    const unitPatterns = [
      // Pattern 1: "Unit X: Unit Name (X%)"
      /Unit\s+(\d+):\s*([^(]+?)\s*\((\d+)%\)/gi,
      // Pattern 2: "X. Unit Name (X%)"
      /(\d+)\.\s*([^(]+?)\s*\((\d+)%\)/gi,
      // Pattern 3: "Unit X: Unit Name"
      /Unit\s+(\d+):\s*([^\n]+)/gi,
      // Pattern 4: "X. Unit Name"
      /(\d+)\.\s*([^\n]+)/gi
    ];

    let unitMatches: RegExpMatchArray[] = [];
    
    // Try each pattern
    for (const pattern of unitPatterns) {
      const matches = Array.from(text.matchAll(pattern));
      if (matches.length > 0) {
        unitMatches = matches;
        break;
      }
    }

    if (unitMatches.length === 0) {
      // Fallback: create generic units if no pattern matches
      console.log('No unit patterns found, creating generic structure');
      return this.createGenericUnits();
    }

    // Process found units
    for (const match of unitMatches) {
      const unitNumber = match[1];
      const unitName = match[2]?.trim() || `Unit ${unitNumber}`;
      const weighting = match[3] ? `${match[3]}%` : '';

      const unit: ParsedUnit = {
        id: `unit-${unitNumber}`,
        name: unitName,
        weighting,
        topics: this.extractTopicsForUnit(text, `unit-${unitNumber}`)
      };

      units.push(unit);
    }

    // Sort units by number
    units.sort((a, b) => {
      const aNum = parseInt(a.id.replace('unit-', ''));
      const bNum = parseInt(b.id.replace('unit-', ''));
      return aNum - bNum;
    });

    return units;
  }

  private extractTopicsForUnit(text: string, unitId: string): ParsedTopic[] {
    const topics: ParsedTopic[] = [];
    
    // Try to find topics within the unit context
    // This is a simplified approach - we'll look for common topic indicators
    
    // Common topic patterns
    const topicPatterns = [
      // Pattern 1: Bullet points or dashes
      /[•\-\*]\s*([^\n]+)/g,
      // Pattern 2: Numbered topics
      /(\d+)\.\s*([^\n]+)/g,
      // Pattern 3: Bold or emphasized text (simplified)
      /\*\*([^*]+)\*\*/g
    ];

    // For now, create some generic topics since parsing specific topics from PDFs is complex
    // In a real implementation, you'd need more sophisticated text analysis
    const genericTopics = [
      'Fundamental Concepts',
      'Key Principles',
      'Problem-Solving Strategies',
      'Real-World Applications',
      'Experimental Methods'
    ];

    genericTopics.forEach((topicName, index) => {
      topics.push({
        id: `${unitId}-topic-${index + 1}`,
        unitId,
        name: topicName,
        learningObjectives: [
          'Understand core concepts',
          'Apply principles to problems',
          'Analyze real-world scenarios'
        ]
      });
    });

    return topics;
  }

  private createGenericUnits(): ParsedUnit[] {
    // Create a generic structure when parsing fails
    const genericUnits = [
      'Introduction and Foundations',
      'Core Concepts and Principles',
      'Advanced Applications',
      'Problem Solving and Analysis',
      'Real-World Connections',
      'Review and Preparation'
    ];

    return genericUnits.map((name, index) => ({
      id: `unit-${index + 1}`,
      name,
      weighting: '',
      topics: [
        {
          id: `unit-${index + 1}-topic-1`,
          unitId: `unit-${index + 1}`,
          name: 'Key Concepts',
          learningObjectives: [
            'Understand fundamental principles',
            'Apply concepts to problems',
            'Develop analytical skills'
          ]
        }
      ]
    }));
  }

  // Method to clear cache (useful for testing)
  clearCache(): void {
    this.cache.clear();
  }

  // Method to get cached structure
  getCachedStructure(courseId: string): ParsedCourseStructure | undefined {
    return this.cache.get(courseId);
  }

  // Create a fallback structure when PDF parsing fails
  private createFallbackStructure(courseId: string): ParsedCourseStructure {
    const courseName = this.generateCourseName(courseId);
    
    return {
      id: courseId,
      name: courseName,
      units: [
        {
          id: 'unit-1',
          name: 'Introduction and Foundations',
          weighting: '15%',
          topics: [
            {
              id: 'unit-1-topic-1',
              unitId: 'unit-1',
              name: 'Core Concepts',
              learningObjectives: [
                'Understand fundamental principles',
                'Learn basic terminology',
                'Develop foundational skills'
              ]
            }
          ]
        },
        {
          id: 'unit-2',
          name: 'Main Content Areas',
          weighting: '70%',
          topics: [
            {
              id: 'unit-2-topic-1',
              unitId: 'unit-2',
              name: 'Key Topics',
              learningObjectives: [
                'Master essential concepts',
                'Apply principles to problems',
                'Develop analytical thinking'
              ]
            }
          ]
        },
        {
          id: 'unit-3',
          name: 'Review and Application',
          weighting: '15%',
          topics: [
            {
              id: 'unit-3-topic-1',
              unitId: 'unit-3',
              name: 'Integration',
              learningObjectives: [
                'Synthesize knowledge',
                'Apply concepts broadly',
                'Prepare for assessment'
              ]
            }
          ]
        }
      ]
    };
  }

  // Generate a readable course name from courseId
  private generateCourseName(courseId: string): string {
    return courseId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

export default PDFParser;
