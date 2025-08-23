import { create } from 'zustand';
import { PersistStore, PersistConfig } from './persist';
import { generateId } from '../utils/id';
import { extractTitleFromMarkdown, extractTagsFromMarkdown } from '../utils/markdown';

export interface Note {
  id: string;
  courseId: string;
  unitId: string;
  title: string;
  bodyMarkdown: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createNote: (courseId: string, unitId: string, title?: string, bodyMarkdown?: string) => Note;
  updateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'bodyMarkdown' | 'tags'>>) => void;
  deleteNote: (id: string) => void;
  getNotesByCourse: (courseId: string) => Note[];
  getNotesByUnit: (courseId: string, unitId: string) => Note[];
  getNoteById: (id: string) => Note | undefined;
  searchNotes: (query: string, courseId?: string, unitId?: string) => Note[];
  getTagsByCourse: (courseId: string) => string[];
  getTagsByUnit: (courseId: string, unitId: string) => string[];
  exportNotes: () => string;
  importNotes: (jsonData: string) => void;
  clearNotes: () => void;
}

// Persistence configuration
const notesConfig: PersistConfig<Note[]> = {
  key: 'notes',
  version: 1,
};

class NotesPersistStore extends PersistStore<Note[]> {
  constructor() {
    super(notesConfig);
  }
}

const persistStore = new NotesPersistStore();

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,

  createNote: (courseId: string, unitId: string, title?: string, bodyMarkdown?: string) => {
    const { notes } = get();
    const now = new Date().toISOString();
    
    const newNote: Note = {
      id: generateId(),
      courseId,
      unitId,
      title: title || 'Untitled Note',
      bodyMarkdown: bodyMarkdown || '# Untitled Note\n\nStart writing your notes here...',
      tags: [],
      createdAt: now,
      updatedAt: now,
    };

    const updatedNotes = [...notes, newNote];
    set({ notes: updatedNotes, error: null });
    persistStore.save(updatedNotes);
    
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
    persistStore.save(updatedNotes);
  },

  deleteNote: (id: string) => {
    const { notes } = get();
    const updatedNotes = notes.filter(n => n.id !== id);
    
    set({ notes: updatedNotes });
    persistStore.save(updatedNotes);
  },

  getNotesByCourse: (courseId: string) => {
    return get().notes.filter(n => n.courseId === courseId);
  },

  getNotesByUnit: (courseId: string, unitId: string) => {
    return get().notes.filter(n => n.courseId === courseId && n.unitId === unitId);
  },

  getNoteById: (id: string) => {
    return get().notes.find(n => n.id === id);
  },

  searchNotes: (query: string, courseId?: string, unitId?: string) => {
    const { notes } = get();
    const searchQuery = query.toLowerCase();
    
    return notes.filter(note => {
      // Filter by course and unit if specified
      if (courseId && note.courseId !== courseId) return false;
      if (unitId && note.unitId !== unitId) return false;
      
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

  exportNotes: () => {
    const { notes } = get();
    const exportData = {
      version: 1,
      timestamp: new Date().toISOString(),
      notes,
    };
    return JSON.stringify(exportData, null, 2);
  },

  importNotes: (jsonData: string) => {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.notes || !Array.isArray(importData.notes)) {
        throw new Error('Invalid notes data format');
      }

      const { notes } = get();
      const importedNotes = importData.notes as Note[];
      
      // Merge imported notes with existing ones, avoiding duplicates
      const existingIds = new Set(notes.map(n => n.id));
      const newNotes = importedNotes.filter(n => !existingIds.has(n.id));
      
      const updatedNotes = [...notes, ...newNotes];
      set({ notes: updatedNotes, error: null });
      persistStore.save(updatedNotes);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to import notes' });
    }
  },

  clearNotes: () => {
    set({ notes: [] });
    persistStore.clear();
  },
}));

// Initialize from persistence
persistStore.subscribe((notes) => {
  if (notes) {
    useNotesStore.setState({ notes });
  }
});
