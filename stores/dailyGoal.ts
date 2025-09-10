// src/stores/useDailyGoalStore.ts
import { create } from "zustand";
import { DailyGoalStatus } from "@/types/states";
import { DailyGoal } from "@/types/states";

// 2. State Interface
interface DailyGoalState {
  dailyGoals: DailyGoal[];
  selectedDailyGoal: DailyGoal | null;
  initialLoading: boolean; // Only for initial data fetch
  error: string | null;

  // Non-blocking operation states
  isCreating: boolean;
  isUpdating: Record<string, boolean>; // Track individual item updates
  isDeleting: Record<string, boolean>; // Track individual item deletions

  // 3. Getters (Selectors)
  getDailyGoals: () => DailyGoal[];
  getDailyGoalById: (id: string) => DailyGoal | undefined;
  getSelectedDailyGoal: () => DailyGoal | null;
  getDailyGoalsByDayId: (dayId: string) => DailyGoal[];
  getDailyGoalsByGoalId: (goalId: string) => DailyGoal[];
  getDailyGoalsByStatus: (status: DailyGoalStatus) => DailyGoal[];
  isItemUpdating: (id: string) => boolean;
  isItemDeleting: (id: string) => boolean;

  // 4. Setters (Actions)
  setDailyGoals: (dailyGoals: DailyGoal[]) => void;
  addDailyGoal: (dailyGoal: DailyGoal) => void;
  updateDailyGoal: (id: string, updates: Partial<DailyGoal>) => void;
  removeDailyGoal: (id: string) => void;
  setSelectedDailyGoal: (dailyGoal: DailyGoal | null) => void;
  setInitialLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  setCreating: (isCreating: boolean) => void;
  setItemUpdating: (id: string, isUpdating: boolean) => void;
  setItemDeleting: (id: string, isDeleting: boolean) => void;
  reset: () => void;
}

const initialState = {
  dailyGoals: [],
  selectedDailyGoal: null,
  initialLoading: false,
  error: null,
  isCreating: false,
  isUpdating: {},
  isDeleting: {},
};

// 5. Create Store
export const useDailyGoalStore = create<DailyGoalState>((set, get) => ({
  ...initialState,

  getDailyGoals: () => get().dailyGoals,
  getDailyGoalById: (id) => get().dailyGoals.find((dg) => dg.id === id),
  getSelectedDailyGoal: () => get().selectedDailyGoal,
  getDailyGoalsByDayId: (dayId) =>
    get().dailyGoals.filter((dg) => dg.dayId === dayId),
  getDailyGoalsByGoalId: (goalId) =>
    get().dailyGoals.filter((dg) => dg.goalId === goalId),
  getDailyGoalsByStatus: (status) =>
    get().dailyGoals.filter((dg) => dg.status === status),
  isItemUpdating: (id) => get().isUpdating[id] || false,
  isItemDeleting: (id) => get().isDeleting[id] || false,

  setDailyGoals: (dailyGoals) => set({ dailyGoals }),
  addDailyGoal: (dailyGoal) =>
    set((state) => ({ dailyGoals: [...state.dailyGoals, dailyGoal] })),
  updateDailyGoal: (id, updates) =>
    set((state) => ({
      dailyGoals: state.dailyGoals.map((dg) =>
        dg.id === id ? { ...dg, ...updates } : dg,
      ),
      selectedDailyGoal:
        state.selectedDailyGoal?.id === id
          ? { ...state.selectedDailyGoal, ...updates }
          : state.selectedDailyGoal,
    })),
  removeDailyGoal: (id) =>
    set((state) => ({
      dailyGoals: state.dailyGoals.filter((dg) => dg.id !== id),
      selectedDailyGoal:
        state.selectedDailyGoal?.id === id ? null : state.selectedDailyGoal,
    })),
  setSelectedDailyGoal: (dailyGoal) => set({ selectedDailyGoal: dailyGoal }),
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
