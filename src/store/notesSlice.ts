import { create } from 'zustand';
import type { PersistStore, PersistConfig } from './persist';
import { generateId } from '../utils/id';
import { extractTitleFromMarkdown, extractTagsFromMarkdown } from '../utils/markdown';

export interface Note {
  id: string;
  courseId: string;
  unitId: string;
  topicId: string;
  title: string;
  bodyMarkdown: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TopicStatus {
  courseId: string;
  unitId: string;
  topicId: string;
  status: 'not-started' | 'reviewing-in-class' | 'lesson-taught' | 'reviewing' | 'done';
  lastUpdated: string;
}

export interface NotesState {
  notes: Note[];
  topicStatuses: TopicStatus[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createNote: (courseId: string, unitId: string, topicId: string, title?: string, bodyMarkdown?: string) => Note;
  updateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'bodyMarkdown' | 'tags'>>) => void;
  deleteNote: (id: string) => void;
  getNotesByCourse: (courseId: string) => Note[];
  getNotesByUnit: (courseId: string, unitId: string) => Note[];
  getNotesByTopic: (courseId: string, unitId: string, topicId: string) => Note[];
  getNoteById: (id: string) => Note | undefined;
  searchNotes: (query: string, courseId?: string, unitId?: string, topicId?: string) => Note[];
  getTagsByCourse: (courseId: string) => string[];
  getTagsByUnit: (courseId: string, unitId: string) => string[];
  
  // Topic Status Management
  updateTopicStatus: (courseId: string, unitId: string, topicId: string, status: TopicStatus['status']) => void;
  getTopicStatus: (courseId: string, unitId: string, topicId: string) => TopicStatus['status'];
  getTopicStatusesByCourse: (courseId: string) => TopicStatus[];
  getTopicStatusesByUnit: (courseId: string, unitId: string) => TopicStatus[];
  
  // Export/Import
  exportNotes: () => string;
  importNotes: (jsonData: string) => void;
  clearNotes: () => void;
}

// Persistence configuration
const notesConfig: PersistConfig<{ notes: Note[]; topicStatuses: TopicStatus[] }> = {
  key: 'notes',
  version: 1,
};

class NotesPersistStore extends PersistStore<{ notes: Note[]; topicStatuses: TopicStatus[] }> {
  constructor() {
    super(notesConfig);
  }
}

const persistStore = new NotesPersistStore();

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  topicStatuses: [],
  isLoading: false,
  error: null,

  createNote: (courseId: string, unitId: string, topicId: string, title?: string, bodyMarkdown?: string) => {
    const { notes } = get();
    const now = new Date().toISOString();
    
    const newNote: Note = {
      id: generateId(),
      courseId,
      unitId,
      topicId,
      title: title || 'Untitled Note',
      bodyMarkdown: bodyMarkdown || '# Untitled Note\n\nStart writing your notes here...',
      tags: [],
      createdAt: now,
      updatedAt: now,
    };

    const updatedNotes = [...notes, newNote];
    set({ notes: updatedNotes, error: null });
    persistStore.save({ notes: updatedNotes, topicStatuses: get().topicStatuses });
    
    return newNote;
  },

  updateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'bodyMarkdown' | 'tags'>>) => {
    const { notes } = get();
    const noteIndex = notes.findIndex(n => n.id === id);
    
    if (noteIndex === -1) {
      set({ error: 'Note not found' });
      return;
    }

    const note = notes[noteIndex];
    const updatedNote: Note = {
      ...note,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Auto-extract title and tags from markdown if bodyMarkdown is updated
    if (updates.bodyMarkdown !== undefined) {
      updatedNote.title = extractTitleFromMarkdown(updates.bodyMarkdown);
      updatedNote.tags = extractTagsFromMarkdown(updates.bodyMarkdown);
    }

    const updatedNotes = [...notes];
    updatedNotes[noteIndex] = updatedNote;
    
    set({ notes: updatedNotes, error: null });
    persistStore.save({ notes: updatedNotes, topicStatuses: get().topicStatuses });
  },

  deleteNote: (id: string) => {
    const { notes } = get();
    const updatedNotes = notes.filter(n => n.id !== id);
    
    set({ notes: updatedNotes });
    persistStore.save({ notes: updatedNotes, topicStatuses: get().topicStatuses });
  },

  getNotesByCourse: (courseId: string) => {
    return get().notes.filter(n => n.courseId === courseId);
  },

  getNotesByUnit: (courseId: string, unitId: string) => {
    return get().notes.filter(n => n.courseId === courseId && n.unitId === unitId);
  },

  getNotesByTopic: (courseId: string, unitId: string, topicId: string) => {
    return get().notes.filter(n => n.courseId === courseId && n.unitId === unitId && n.topicId === topicId);
  },

  getNoteById: (id: string) => {
    return get().notes.find(n => n.id === id);
  },

  searchNotes: (query: string, courseId?: string, unitId?: string, topicId?: string) => {
    const { notes } = get();
    const searchQuery = query.toLowerCase();
    
    return notes.filter(note => {
      // Filter by course, unit, and topic if specified
      if (courseId && note.courseId !== courseId) return false;
      if (unitId && note.unitId !== unitId) return false;
      if (topicId && note.topicId !== topicId) return false;
      
      // Search in title, body, and tags
      return (
        note.title.toLowerCase().includes(searchQuery) ||
        note.bodyMarkdown.toLowerCase().includes(searchQuery) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    });
  },

  getTagsByCourse: (courseId: string) => {
    const { notes } = get();
    const courseNotes = notes.filter(n => n.courseId === courseId);
    const allTags = courseNotes.flatMap(n => n.tags);
    return [...new Set(allTags)].sort();
  },

  getTagsByUnit: (courseId: string, unitId: string) => {
    const { notes } = get();
    const unitNotes = notes.filter(n => n.courseId === courseId && n.unitId === unitId);
    const allTags = unitNotes.flatMap(n => n.tags);
    return [...new Set(allTags)].sort();
  },

  // Topic Status Management
  updateTopicStatus: (courseId: string, unitId: string, topicId: string, status: TopicStatus['status']) => {
    const { topicStatuses } = get();
    const now = new Date().toISOString();
    
    const existingIndex = topicStatuses.findIndex(
      ts => ts.courseId === courseId && ts.unitId === unitId && ts.topicId === topicId
    );
    
    const newStatus: TopicStatus = {
      courseId,
      unitId,
      topicId,
      status,
      lastUpdated: now,
    };
    
    let updatedStatuses: TopicStatus[];
    if (existingIndex >= 0) {
      updatedStatuses = [...topicStatuses];
      updatedStatuses[existingIndex] = newStatus;
    } else {
      updatedStatuses = [...topicStatuses, newStatus];
    }
    
    set({ topicStatuses: updatedStatuses });
    persistStore.save({ notes: get().notes, topicStatuses: updatedStatuses });
  },

  getTopicStatus: (courseId: string, unitId: string, topicId: string) => {
    const { topicStatuses } = get();
    const status = topicStatuses.find(
      ts => ts.courseId === courseId && ts.unitId === unitId && ts.topicId === topicId
    );
    return status ? status.status : 'not-started';
  },

  getTopicStatusesByCourse: (courseId: string) => {
    return get().topicStatuses.filter(ts => ts.courseId === courseId);
  },

  getTopicStatusesByUnit: (courseId: string, unitId: string) => {
    return get().topicStatuses.filter(ts => ts.courseId === courseId && ts.unitId === unitId);
  },

  exportNotes: () => {
    const { notes, topicStatuses } = get();
    const exportData = {
      version: 1,
      timestamp: new Date().toISOString(),
      notes,
      topicStatuses,
    };
    return JSON.stringify(exportData, null, 2);
  },

  importNotes: (jsonData: string) => {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.notes || !Array.isArray(importData.notes)) {
        throw new Error('Invalid notes data format');
      }

      const { notes, topicStatuses } = get();
      const importedNotes = importData.notes as Note[];
      const importedStatuses = importData.topicStatuses as TopicStatus[] || [];
      
      // Merge imported notes with existing ones, avoiding duplicates
      const existingIds = new Set(notes.map(n => n.id));
      const newNotes = importedNotes.filter(n => !existingIds.has(n.id));
      
      // Merge imported statuses with existing ones
      const existingStatusKeys = new Set(
        topicStatuses.map(ts => `${ts.courseId}-${ts.unitId}-${ts.topicId}`)
      );
      const newStatuses = importedStatuses.filter(
        ts => !existingStatusKeys.has(`${ts.courseId}-${ts.unitId}-${ts.topicId}`)
      );
      
      const updatedNotes = [...notes, ...newNotes];
      const updatedStatuses = [...topicStatuses, ...newStatuses];
      
      set({ notes: updatedNotes, topicStatuses: updatedStatuses, error: null });
      persistStore.save({ notes: updatedNotes, topicStatuses: updatedStatuses });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to import notes' });
    }
  },

  clearNotes: () => {
    set({ notes: [], topicStatuses: [] });
    persistStore.clear();
  },
}));

// Initialize from persistence
persistStore.subscribe((data) => {
  if (data) {
    useNotesStore.setState({ 
      notes: data.notes || [], 
      topicStatuses: data.topicStatuses || [] 
    });
  }
});
