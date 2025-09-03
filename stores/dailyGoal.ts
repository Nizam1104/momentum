// src/stores/useDailyGoalStore.ts
import { create } from 'zustand';
import { DailyGoalStatus } from '@/types/states'
import { DailyGoal } from '@/types/states';


// 2. State Interface
interface DailyGoalState {
  dailyGoals: DailyGoal[];
  selectedDailyGoal: DailyGoal | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  getDailyGoals: () => DailyGoal[];
  getDailyGoalById: (id: string) => DailyGoal | undefined;
  getSelectedDailyGoal: () => DailyGoal | null;
  getDailyGoalsByDayId: (dayId: string) => DailyGoal[];
  getDailyGoalsByGoalId: (goalId: string) => DailyGoal[];
  getDailyGoalsByStatus: (status: DailyGoalStatus) => DailyGoal[];

  // 4. Setters (Actions)
  setDailyGoals: (dailyGoals: DailyGoal[]) => void;
  addDailyGoal: (dailyGoal: DailyGoal) => void;
  updateDailyGoal: (id: string, updates: Partial<DailyGoal>) => void;
  removeDailyGoal: (id: string) => void;
  setSelectedDailyGoal: (dailyGoal: DailyGoal | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  dailyGoals: [],
  selectedDailyGoal: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useDailyGoalStore = create<DailyGoalState>((set, get) => ({
  ...initialState,

  getDailyGoals: () => get().dailyGoals,
  getDailyGoalById: (id) => get().dailyGoals.find((dg) => dg.id === id),
  getSelectedDailyGoal: () => get().selectedDailyGoal,
  getDailyGoalsByDayId: (dayId) => get().dailyGoals.filter((dg) => dg.dayId === dayId),
  getDailyGoalsByGoalId: (goalId) => get().dailyGoals.filter((dg) => dg.goalId === goalId),
  getDailyGoalsByStatus: (status) => get().dailyGoals.filter((dg) => dg.status === status),

  setDailyGoals: (dailyGoals) => set({ dailyGoals }),
  addDailyGoal: (dailyGoal) => set((state) => ({ dailyGoals: [...state.dailyGoals, dailyGoal] })),
  updateDailyGoal: (id, updates) =>
    set((state) => ({
      dailyGoals: state.dailyGoals.map((dg) =>
        dg.id === id ? { ...dg, ...updates } : dg
      ),
      selectedDailyGoal: state.selectedDailyGoal?.id === id ? { ...state.selectedDailyGoal, ...updates } : state.selectedDailyGoal,
    })),
  removeDailyGoal: (id) =>
    set((state) => ({
      dailyGoals: state.dailyGoals.filter((dg) => dg.id !== id),
      selectedDailyGoal: state.selectedDailyGoal?.id === id ? null : state.selectedDailyGoal,
    })),
  setSelectedDailyGoal: (dailyGoal) => set({ selectedDailyGoal: dailyGoal }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
