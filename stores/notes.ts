// src/stores/useNoteStore.ts
import { create } from "zustand";
import { Note } from "@/types/states";

// State Interface
interface NoteState {
  notes: Note[];
  selectedNote: Note | null;
  initialLoading: boolean; // Only for initial data fetch
  error: string | null;

  // Non-blocking operation states
  isCreating: boolean;
  isUpdating: Record<string, boolean>; // Track individual item updates
  isDeleting: Record<string, boolean>; // Track individual item deletions

  // Getters (Selectors)
  getNotes: () => Note[];
  getNoteById: (id: string) => Note | undefined;
  getSelectedNote: () => Note | null;
  getNotesByDayId: (dayId: string) => Note[];
  getNotesByProjectId: (projectId: string) => Note[];
  getNotesByCategoryId: (categoryId: string) => Note[];
  getPinnedNotes: () => Note[];
  getArchivedNotes: () => Note[];
  isItemUpdating: (id: string) => boolean;
  isItemDeleting: (id: string) => boolean;

  // Setters (Actions)
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;
  setSelectedNote: (note: Note | null) => void;
  setInitialLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  setCreating: (isCreating: boolean) => void;
  setItemUpdating: (id: string, isUpdating: boolean) => void;
  setItemDeleting: (id: string, isDeleting: boolean) => void;
  reset: () => void;
}

const initialState = {
  notes: [],
  selectedNote: null,
  initialLoading: false,
  error: null,
  isCreating: false,
  isUpdating: {},
  isDeleting: {},
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
  getPinnedNotes: () =>
    get().notes.filter((note) => note.isPinned && !note.isArchived),
  getArchivedNotes: () => get().notes.filter((note) => note.isArchived),
  isItemUpdating: (id) => get().isUpdating[id] || false,
  isItemDeleting: (id) => get().isDeleting[id] || false,

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
  setInitialLoading: (initialLoading) => set({ initialLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  setCreating: (isCreating) => set({ isCreating }),
  setItemUpdating: (id, isUpdating) =>
    set((state) => ({
      isUpdating: isUpdating
        ? { ...state.isUpdating, [id]: true }
        : { ...state.isUpdating, [id]: false },
    })),
  setItemDeleting: (id, isDeleting) =>
    set((state) => ({
      isDeleting: isDeleting
        ? { ...state.isDeleting, [id]: true }
        : { ...state.isDeleting, [id]: false },
    })),
  reset: () => set(initialState),
}));
