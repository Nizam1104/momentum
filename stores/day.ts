// src/stores/useDayStore.ts
import { create } from 'zustand';
import { Day } from '@/types/states';

// 2. State Interface
interface DayState {
  days: Day[];
  selectedDay: Day | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  getDays: () => Day[];
  getDayById: (id: string) => Day | undefined;
  getSelectedDay: () => Day | null;
  getDaysByUserId: (userId: string) => Day[];

  // 4. Setters (Actions)
  setDays: (days: Day[]) => void;
  addDay: (day: Day) => void;
  updateDay: (id: string, updates: Partial<Day>) => void;
  removeDay: (id: string) => void;
  setSelectedDay: (day: Day | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  days: [],
  selectedDay: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useDayStore = create<DayState>((set, get) => ({
  ...initialState,

  getDays: () => get().days,
  getDayById: (id) => get().days.find((day) => day.id === id),
  getSelectedDay: () => get().selectedDay,
  getDaysByUserId: (userId) => get().days.filter((day) => day.userId === userId),

  setDays: (days) => set({ days }),
  addDay: (day) => set((state) => ({ days: [...state.days, day] })),
  updateDay: (id, updates) =>
    set((state) => ({
      days: state.days.map((day) =>
        day.id === id ? { ...day, ...updates } : day
      ),
      selectedDay: state.selectedDay?.id === id ? { ...state.selectedDay, ...updates } : state.selectedDay,
    })),
  removeDay: (id) =>
    set((state) => ({
      days: state.days.filter((day) => day.id !== id),
      selectedDay: state.selectedDay?.id === id ? null : state.selectedDay,
    })),
  setSelectedDay: (day) => set({ selectedDay: day }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
