// src/stores/useHabitLogStore.ts
import { create } from 'zustand';
import { HabitLog } from '@/types/states';

// 2. State Interface
interface HabitLogState {
  habitLogs: HabitLog[];
  selectedHabitLog: HabitLog | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  getHabitLogs: () => HabitLog[];
  getHabitLogById: (id: string) => HabitLog | undefined;
  getSelectedHabitLog: () => HabitLog | null;
  getHabitLogsByDayId: (dayId: string) => HabitLog[];
  getHabitLogsByHabitId: (habitId: string) => HabitLog[];

  // 4. Setters (Actions)
  setHabitLogs: (habitLogs: HabitLog[]) => void;
  addHabitLog: (habitLog: HabitLog) => void;
  updateHabitLog: (id: string, updates: Partial<HabitLog>) => void;
  removeHabitLog: (id: string) => void;
  setSelectedHabitLog: (habitLog: HabitLog | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  habitLogs: [],
  selectedHabitLog: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useHabitLogStore = create<HabitLogState>((set, get) => ({
  ...initialState,

  getHabitLogs: () => get().habitLogs,
  getHabitLogById: (id) => get().habitLogs.find((hl) => hl.id === id),
  getSelectedHabitLog: () => get().selectedHabitLog,
  getHabitLogsByDayId: (dayId) => get().habitLogs.filter((hl) => hl.dayId === dayId),
  getHabitLogsByHabitId: (habitId) => get().habitLogs.filter((hl) => hl.habitId === habitId),

  setHabitLogs: (habitLogs) => set({ habitLogs }),
  addHabitLog: (habitLog) => set((state) => ({ habitLogs: [...state.habitLogs, habitLog] })),
  updateHabitLog: (id, updates) =>
    set((state) => ({
      habitLogs: state.habitLogs.map((hl) =>
        hl.id === id ? { ...hl, ...updates } : hl
      ),
      selectedHabitLog: state.selectedHabitLog?.id === id ? { ...state.selectedHabitLog, ...updates } : state.selectedHabitLog,
    })),
  removeHabitLog: (id) =>
    set((state) => ({
      habitLogs: state.habitLogs.filter((hl) => hl.id !== id),
      selectedHabitLog: state.selectedHabitLog?.id === id ? null : state.selectedHabitLog,
    })),
  setSelectedHabitLog: (habitLog) => set({ selectedHabitLog: habitLog }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
