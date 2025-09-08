// src/stores/useDayStore.ts
import { create } from 'zustand';
import { 
  Day,
  getTodayEntry,
  getDayByDate,
  getAllDays,
  createOrUpdateDay,
  updateDayMetrics,
  updateDayReflections,
  markDayComplete
} from '@/actions/clientActions';

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
  
  // Async Actions with Supabase
  fetchTodayEntry: (userId: string) => Promise<void>;
  fetchDayByDate: (userId: string, date: Date) => Promise<void>;
  fetchAllDays: (userId: string, limit?: number) => Promise<void>;
  createOrUpdateDayAsync: (dayData: Omit<Day, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDayMetricsAsync: (dayId: string, metrics: any) => Promise<void>;
  updateDayReflectionsAsync: (dayId: string, reflections: any) => Promise<void>;
  markDayCompleteAsync: (dayId: string, isCompleted: boolean) => Promise<void>;
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

  // Async Actions with Supabase
  fetchTodayEntry: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const result = await getTodayEntry(userId);
      if (result.success) {
        if (result.data) {
          set({ selectedDay: result.data, loading: false });
          const existingDay = get().days.find(d => d.id === result.data.id);
          if (!existingDay) {
            get().addDay(result.data);
          }
        } else {
          set({ selectedDay: null, loading: false });
        }
      } else {
        set({ error: result.error || 'Failed to fetch today entry', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch today entry', loading: false });
    }
  },

  fetchDayByDate: async (userId: string, date: Date) => {
    set({ loading: true, error: null });
    try {
      const result = await getDayByDate(userId, date);
      if (result.success) {
        if (result.data) {
          set({ selectedDay: result.data, loading: false });
          const existingDay = get().days.find(d => d.id === result.data.id);
          if (!existingDay) {
            get().addDay(result.data);
          }
        } else {
          set({ selectedDay: null, loading: false });
        }
      } else {
        set({ error: result.error || 'Failed to fetch day', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch day', loading: false });
    }
  },

  fetchAllDays: async (userId: string, limit?: number) => {
    set({ loading: true, error: null });
    try {
      const result = await getAllDays(userId, limit);
      if (result.success && result.data) {
        set({ days: result.data, loading: false });
      } else {
        set({ error: result.error || 'Failed to fetch days', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch days', loading: false });
    }
  },

  createOrUpdateDayAsync: async (dayData) => {
    set({ loading: true, error: null });
    try {
      const result = await createOrUpdateDay(dayData);
      if (result.success && result.data) {
        const existingIndex = get().days.findIndex(d => d.date === result.data.date && d.userId === result.data.userId);
        if (existingIndex >= 0) {
          get().updateDay(result.data.id, result.data);
        } else {
          get().addDay(result.data);
        }
        set({ selectedDay: result.data, loading: false });
      } else {
        set({ error: result.error || 'Failed to create or update day', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to create or update day', loading: false });
    }
  },

  updateDayMetricsAsync: async (dayId: string, metrics: any) => {
    set({ loading: true, error: null });
    try {
      const result = await updateDayMetrics(dayId, metrics);
      if (result.success && result.data) {
        get().updateDay(dayId, result.data);
        set({ loading: false });
      } else {
        set({ error: result.error || 'Failed to update day metrics', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to update day metrics', loading: false });
    }
  },

  updateDayReflectionsAsync: async (dayId: string, reflections: any) => {
    set({ loading: true, error: null });
    try {
      const result = await updateDayReflections(dayId, reflections);
      if (result.success && result.data) {
        get().updateDay(dayId, result.data);
        set({ loading: false });
      } else {
        set({ error: result.error || 'Failed to update day reflections', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to update day reflections', loading: false });
    }
  },

  markDayCompleteAsync: async (dayId: string, isCompleted: boolean) => {
    set({ loading: true, error: null });
    try {
      const result = await markDayComplete(dayId, isCompleted);
      if (result.success && result.data) {
        get().updateDay(dayId, result.data);
        set({ loading: false });
      } else {
        set({ error: result.error || 'Failed to mark day complete', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to mark day complete', loading: false });
    }
  },
}));
