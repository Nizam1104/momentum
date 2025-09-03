// src/stores/useTimeEntryStore.ts
import { create } from 'zustand';
import { TimeEntry } from '@/types/states';

// 2. State Interface
interface TimeEntryState {
  timeEntries: TimeEntry[];
  selectedTimeEntry: TimeEntry | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  getTimeEntries: () => TimeEntry[];
  getTimeEntryById: (id: string) => TimeEntry | undefined;
  getSelectedTimeEntry: () => TimeEntry | null;
  getTimeEntriesByDayId: (dayId: string) => TimeEntry[];
  getTimeEntriesByProjectId: (projectId: string) => TimeEntry[];
  getTimeEntriesByTaskId: (taskId: string) => TimeEntry[];

  // 4. Setters (Actions)
  setTimeEntries: (timeEntries: TimeEntry[]) => void;
  addTimeEntry: (timeEntry: TimeEntry) => void;
  updateTimeEntry: (id: string, updates: Partial<TimeEntry>) => void;
  removeTimeEntry: (id: string) => void;
  setSelectedTimeEntry: (timeEntry: TimeEntry | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  timeEntries: [],
  selectedTimeEntry: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useTimeEntryStore = create<TimeEntryState>((set, get) => ({
  ...initialState,

  getTimeEntries: () => get().timeEntries,
  getTimeEntryById: (id) => get().timeEntries.find((te) => te.id === id),
  getSelectedTimeEntry: () => get().selectedTimeEntry,
  getTimeEntriesByDayId: (dayId) => get().timeEntries.filter((te) => te.dayId === dayId),
  getTimeEntriesByProjectId: (projectId) => get().timeEntries.filter((te) => te.projectId === projectId),
  getTimeEntriesByTaskId: (taskId) => get().timeEntries.filter((te) => te.taskId === taskId),

  setTimeEntries: (timeEntries) => set({ timeEntries }),
  addTimeEntry: (timeEntry) => set((state) => ({ timeEntries: [...state.timeEntries, timeEntry] })),
  updateTimeEntry: (id, updates) =>
    set((state) => ({
      timeEntries: state.timeEntries.map((te) =>
        te.id === id ? { ...te, ...updates } : te
      ),
      selectedTimeEntry: state.selectedTimeEntry?.id === id ? { ...state.selectedTimeEntry, ...updates } : state.selectedTimeEntry,
    })),
  removeTimeEntry: (id) =>
    set((state) => ({
      timeEntries: state.timeEntries.filter((te) => te.id !== id),
      selectedTimeEntry: state.selectedTimeEntry?.id === id ? null : state.selectedTimeEntry,
    })),
  setSelectedTimeEntry: (timeEntry) => set({ selectedTimeEntry: timeEntry }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
