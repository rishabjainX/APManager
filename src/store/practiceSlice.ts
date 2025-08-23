import { create } from 'zustand';
import { PersistStore, PersistConfig } from './persist';
import { generateId } from '../utils/id';
import { PracticeAttempt } from '../adapters/frqmcq';

export interface PracticeSession {
  id: string;
  courseId: string;
  unitId: string;
  type: 'frq' | 'mcq';
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  questions: PracticeQuestion[];
  isActive: boolean;
}

export interface PracticeQuestion {
  id: string;
  questionId: string;
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpentSeconds: number;
}

export interface PracticeState {
  attempts: PracticeAttempt[];
  activeSession: PracticeSession | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startSession: (courseId: string, unitId: string, type: 'frq' | 'mcq', questionCount: number) => PracticeSession;
  endSession: (sessionId: string, answers: Array<{ questionId: string; isCorrect: boolean; timeSpentSeconds: number }>) => void;
  updateQuestionAnswer: (sessionId: string, questionId: string, answer: string) => void;
  getAttemptsByCourse: (courseId: string) => PracticeAttempt[];
  getAttemptsByUnit: (courseId: string, unitId: string) => PracticeAttempt[];
  getAttemptsByType: (type: 'frq' | 'mcq') => PracticeAttempt[];
  getAccuracyByUnit: (courseId: string, unitId: string) => { correct: number; total: number; percentage: number };
  getAccuracyByCourse: (courseId: string) => { correct: number; total: number; percentage: number };
  getStreakByUnit: (courseId: string, unitId: string) => number;
  exportAttempts: () => string;
  importAttempts: (jsonData: string) => void;
  clearAttempts: () => void;
}

// Persistence configuration
const attemptsConfig: PersistConfig<PracticeAttempt[]> = {
  key: 'practice_attempts',
  version: 1,
};

class AttemptsPersistStore extends PersistStore<PracticeAttempt[]> {
  constructor() {
    super(attemptsConfig);
  }
}

const persistStore = new AttemptsPersistStore();

export const usePracticeStore = create<PracticeState>((set, get) => ({
  attempts: [],
  activeSession: null,
  isLoading: false,
  error: null,

  startSession: (courseId: string, unitId: string, type: 'frq' | 'mcq', questionCount: number) => {
    const session: PracticeSession = {
      id: generateId(),
      courseId,
      unitId,
      type,
      startTime: new Date().toISOString(),
      durationMinutes: 0,
      questions: Array.from({ length: questionCount }, (_, index) => ({
        id: generateId(),
        questionId: `${type}-${courseId}-${unitId}-${index + 1}`,
        timeSpentSeconds: 0,
      })),
      isActive: true,
    };

    set({ activeSession: session });
    return session;
  },

  endSession: (sessionId: string, answers: Array<{ questionId: string; isCorrect: boolean; timeSpentSeconds: number }>) => {
    const { activeSession, attempts } = get();
    
    if (!activeSession || activeSession.id !== sessionId) {
      set({ error: 'Active session not found' });
      return;
    }

    // Update questions with answers
    const updatedQuestions = activeSession.questions.map(q => {
      const answer = answers.find(a => a.questionId === q.questionId);
      return answer ? { ...q, ...answer } : q;
    });

    const endTime = new Date().toISOString();
    const durationMinutes = (new Date(endTime).getTime() - new Date(activeSession.startTime).getTime()) / (1000 * 60);
    
    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalCount = answers.length;

    // Create practice attempt
    const attempt: PracticeAttempt = {
      id: generateId(),
      courseId: activeSession.courseId,
      unitId: activeSession.unitId,
      type: activeSession.type,
      date: endTime,
      correctCount,
      totalCount,
      durationMinutes: Math.round(durationMinutes * 100) / 100,
    };

    const updatedAttempts = [...attempts, attempt];
    
    set({ 
      attempts: updatedAttempts, 
      activeSession: null,
      error: null 
    });
    
    persistStore.save(updatedAttempts);
  },

  updateQuestionAnswer: (sessionId: string, questionId: string, answer: string) => {
    const { activeSession } = get();
    
    if (!activeSession || activeSession.id !== sessionId) {
      return;
    }

    const updatedQuestions = activeSession.questions.map(q => 
      q.questionId === questionId ? { ...q, userAnswer: answer } : q
    );

    set({ 
      activeSession: { ...activeSession, questions: updatedQuestions } 
    });
  },

  getAttemptsByCourse: (courseId: string) => {
    return get().attempts.filter(a => a.courseId === courseId);
  },

  getAttemptsByUnit: (courseId: string, unitId: string) => {
    return get().attempts.filter(a => a.courseId === courseId && a.unitId === unitId);
  },

  getAttemptsByType: (type: 'frq' | 'mcq') => {
    return get().attempts.filter(a => a.type === type);
  },

  getAccuracyByUnit: (courseId: string, unitId: string) => {
    const unitAttempts = get().getAttemptsByUnit(courseId, unitId);
    const total = unitAttempts.reduce((sum, a) => sum + a.totalCount, 0);
    const correct = unitAttempts.reduce((sum, a) => sum + a.correctCount, 0);
    
    return {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  },

  getAccuracyByCourse: (courseId: string) => {
    const courseAttempts = get().getAttemptsByCourse(courseId);
    const total = courseAttempts.reduce((sum, a) => sum + a.totalCount, 0);
    const correct = courseAttempts.reduce((sum, a) => sum + a.correctCount, 0);
    
    return {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  },

  getStreakByUnit: (courseId: string, unitId: string) => {
    const unitAttempts = get().getAttemptsByUnit(courseId, unitId);
    
    // Sort by date descending (most recent first)
    const sortedAttempts = unitAttempts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    for (const attempt of sortedAttempts) {
      const accuracy = attempt.correctCount / attempt.totalCount;
      if (accuracy >= 0.7) { // 70% or higher considered a "pass"
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },

  exportAttempts: () => {
    const { attempts } = get();
    const exportData = {
      version: 1,
      timestamp: new Date().toISOString(),
      attempts,
    };
    return JSON.stringify(exportData, null, 2);
  },

  importAttempts: (jsonData: string) => {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.attempts || !Array.isArray(importData.attempts)) {
        throw new Error('Invalid attempts data format');
      }

      const { attempts } = get();
      const importedAttempts = importData.attempts as PracticeAttempt[];
      
      // Merge imported attempts with existing ones, avoiding duplicates
      const existingIds = new Set(attempts.map(a => a.id));
      const newAttempts = importedAttempts.filter(a => !existingIds.has(a.id));
      
      const updatedAttempts = [...attempts, ...newAttempts];
      set({ attempts: updatedAttempts, error: null });
      persistStore.save(updatedAttempts);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to import attempts' });
    }
  },

  clearAttempts: () => {
    set({ attempts: [] });
    persistStore.clear();
  },
}));

// Initialize from persistence
persistStore.subscribe((attempts) => {
  if (attempts) {
    usePracticeStore.setState({ attempts });
  }
});
