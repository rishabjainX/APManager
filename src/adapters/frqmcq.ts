export interface FRQItem {
  id: string;
  courseId: string;
  unitId?: string;
  year: number;
  label: string;
  promptUrl: string;
  scoringGuidelinesUrl?: string;
}

export interface MCQItem {
  id: string;
  courseId: string;
  unitId?: string;
  source: string;
  link?: string;
  count?: number;
}

export interface PracticeAttempt {
  id: string;
  courseId: string;
  unitId: string;
  type: 'frq' | 'mcq';
  date: string;
  correctCount: number;
  totalCount: number;
  durationMinutes: number;
}

export interface FRQMCQAdapter {
  getFRQs(courseId?: string, unitId?: string): Promise<FRQItem[]>;
  getMCQs(courseId?: string, unitId?: string): Promise<MCQItem[]>;
  getPracticeAttempts(courseId?: string, unitId?: string): Promise<PracticeAttempt[]>;
  savePracticeAttempt(attempt: PracticeAttempt): Promise<void>;
}

// Static mock data for development
const staticFRQs: FRQItem[] = [
  {
    id: "frq-chem-1-1",
    courseId: "ap-chemistry",
    unitId: "unit-1",
    year: 2023,
    label: "FRQ #1",
    promptUrl: "https://apcentral.collegeboard.org/pdf/ap-chemistry-frq-2023.pdf",
    scoringGuidelinesUrl: "https://apcentral.collegeboard.org/pdf/ap-chemistry-scoring-guidelines-2023.pdf",
  },
  {
    id: "frq-chem-1-2",
    courseId: "ap-chemistry",
    unitId: "unit-1",
    year: 2022,
    label: "FRQ #2",
    promptUrl: "https://apcentral.collegeboard.org/pdf/ap-chemistry-frq-2022.pdf",
    scoringGuidelinesUrl: "https://apcentral.collegeboard.org/pdf/ap-chemistry-scoring-guidelines-2022.pdf",
  },
  {
    id: "frq-chem-2-1",
    courseId: "ap-chemistry",
    unitId: "unit-2",
    year: 2023,
    label: "FRQ #3",
    promptUrl: "https://apcentral.collegeboard.org/pdf/ap-chemistry-frq-2023.pdf",
    scoringGuidelinesUrl: "https://apcentral.collegeboard.org/pdf/ap-chemistry-scoring-guidelines-2023.pdf",
  },
  {
    id: "frq-calc-1-1",
    courseId: "ap-calculus-bc",
    unitId: "unit-1",
    year: 2023,
    label: "FRQ #1",
    promptUrl: "https://apcentral.collegeboard.org/pdf/ap-calculus-bc-frq-2023.pdf",
    scoringGuidelinesUrl: "https://apcentral.collegeboard.org/pdf/ap-calculus-bc-scoring-guidelines-2023.pdf",
  },
  {
    id: "frq-calc-2-1",
    courseId: "ap-calculus-bc",
    unitId: "unit-2",
    year: 2023,
    label: "FRQ #2",
    promptUrl: "https://apcentral.collegeboard.org/pdf/ap-calculus-bc-frq-2023.pdf",
    scoringGuidelinesUrl: "https://apcentral.collegeboard.org/pdf/ap-calculus-bc-scoring-guidelines-2023.pdf",
  },
  {
    id: "frq-world-1-1",
    courseId: "ap-world-history",
    unitId: "unit-1",
    year: 2023,
    label: "FRQ #1",
    promptUrl: "https://apcentral.collegeboard.org/pdf/ap-world-history-frq-2023.pdf",
    scoringGuidelinesUrl: "https://apcentral.collegeboard.org/pdf/ap-world-history-scoring-guidelines-2023.pdf",
  },
  {
    id: "frq-english-1-1",
    courseId: "ap-english-language",
    unitId: "unit-1",
    year: 2023,
    label: "FRQ #1",
    promptUrl: "https://apcentral.collegeboard.org/pdf/ap-english-language-frq-2023.pdf",
    scoringGuidelinesUrl: "https://apcentral.collegeboard.org/pdf/ap-english-language-scoring-guidelines-2023.pdf",
  },
];

const staticMCQs: MCQItem[] = [
  {
    id: "mcq-chem-1-1",
    courseId: "ap-chemistry",
    unitId: "unit-1",
    source: "Official Practice Exam",
    link: "https://apcentral.collegeboard.org/pdf/ap-chemistry-mcq-2023.pdf",
    count: 15,
  },
  {
    id: "mcq-chem-2-1",
    courseId: "ap-chemistry",
    unitId: "unit-2",
    source: "Released Exam",
    link: "https://apcentral.collegeboard.org/pdf/ap-chemistry-mcq-2022.pdf",
    count: 12,
  },
  {
    id: "mcq-calc-1-1",
    courseId: "ap-calculus-bc",
    unitId: "unit-1",
    source: "Official Practice Exam",
    link: "https://apcentral.collegeboard.org/pdf/ap-calculus-bc-mcq-2023.pdf",
    count: 20,
  },
  {
    id: "mcq-calc-2-1",
    courseId: "ap-calculus-bc",
    unitId: "unit-2",
    source: "Released Exam",
    link: "https://apcentral.collegeboard.org/pdf/ap-calculus-bc-mcq-2022.pdf",
    count: 18,
  },
  {
    id: "mcq-world-1-1",
    courseId: "ap-world-history",
    unitId: "unit-1",
    source: "Official Practice Exam",
    link: "https://apcentral.collegeboard.org/pdf/ap-world-history-mcq-2023.pdf",
    count: 25,
  },
  {
    id: "mcq-english-1-1",
    courseId: "ap-english-language",
    unitId: "unit-1",
    source: "Released Exam",
    link: "https://apcentral.collegeboard.org/pdf/ap-english-language-mcq-2022.pdf",
    count: 22,
  },
];

class StaticFRQMCQAdapter implements FRQMCQAdapter {
  async getFRQs(courseId?: string, unitId?: string): Promise<FRQItem[]> {
    let filtered = staticFRQs;
    
    if (courseId) {
      filtered = filtered.filter(frq => frq.courseId === courseId);
    }
    
    if (unitId) {
      filtered = filtered.filter(frq => frq.unitId === unitId);
    }
    
    return filtered;
  }

  async getMCQs(courseId?: string, unitId?: string): Promise<MCQItem[]> {
    let filtered = staticMCQs;
    
    if (courseId) {
      filtered = filtered.filter(mcq => mcq.courseId === courseId);
    }
    
    if (unitId) {
      filtered = filtered.filter(mcq => mcq.unitId === unitId);
    }
    
    return filtered;
  }

  async getPracticeAttempts(courseId?: string, unitId?: string): Promise<PracticeAttempt[]> {
    // This will be implemented with localForage persistence
    return [];
  }

  async savePracticeAttempt(attempt: PracticeAttempt): Promise<void> {
    // This will be implemented with localForage persistence
    console.log('Saving practice attempt:', attempt);
  }
}

// Export the static adapter as default
export const frqmcqAdapter = new StaticFRQMCQAdapter();
