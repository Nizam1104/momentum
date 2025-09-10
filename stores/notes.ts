// src/stores/useNoteStore.ts
import { create } from "zustand";
import { Note, NoteType } from "@/types/states";

// State Interface
interface NoteState {
  notes: Note[];
  selectedNote: Note | null;
  loading: boolean;
  error: string | null;

  // Getters (Selectors)
  getNotes: () => Note[];
  getNoteById: (id: string) => Note | undefined;
  getSelectedNote: () => Note | null;
  getNotesByDayId: (dayId: string) => Note[];
  getNotesByProjectId: (projectId: string) => Note[];
  getNotesByCategoryId: (categoryId: string) => Note[];
  getNotesByType: (type: NoteType) => Note[];
  getPinnedNotes: () => Note[];
  getArchivedNotes: () => Note[];

  // Setters (Actions)
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;
  setSelectedNote: (note: Note | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  notes: [],
  selectedNote: null,
  loading: false,
  error: null,
};

// Create Store
export const useNoteStore = create<NoteState>((set, get) => ({
  ...initialState,

  getNotes: () => get().notes,
  getNoteById: (id) => get().notes.find((note) => note.id === id),
  getSelectedNote: () => get().selectedNote,
  getNotesByDayId: (dayId) =>
    get().notes.filter((note) => note.dayId === dayId),
  getNotesByProjectId: (projectId) =>
    get().notes.filter((note) => note.projectId === projectId),
  getNotesByCategoryId: (categoryId) =>
    get().notes.filter((note) => note.categoryId === categoryId),
  getNotesByType: (type) => get().notes.filter((note) => note.type === type),
  getPinnedNotes: () =>
    get().notes.filter((note) => note.isPinned && !note.isArchived),
  getArchivedNotes: () => get().notes.filter((note) => note.isArchived),

  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updates } : note,
      ),
      selectedNote:
        state.selectedNote?.id === id
          ? { ...state.selectedNote, ...updates }
          : state.selectedNote,
    })),
  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      selectedNote: state.selectedNote?.id === id ? null : state.selectedNote,
    })),
  setSelectedNote: (note) => set({ selectedNote: note }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
