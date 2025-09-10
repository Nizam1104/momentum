// src/stores/useGoalStore.ts
import { create } from "zustand";
import { GoalType, GoalStatus } from "@/types/states";
import { Goal } from "@/types/states";

// 2. State Interface
interface GoalState {
  goals: Goal[];
  selectedGoal: Goal | null;
  initialLoading: boolean; // Only for initial data fetch
  error: string | null;

  // Non-blocking operation states
  isCreating: boolean;
  isUpdating: Record<string, boolean>; // Track individual item updates
  isDeleting: Record<string, boolean>; // Track individual item deletions

  // 3. Getters (Selectors)
  getGoals: () => Goal[];
  getGoalById: (id: string) => Goal | undefined;
  getSelectedGoal: () => Goal | null;
  getGoalsByUserId: (userId: string) => Goal[];
  getGoalsByProjectId: (projectId: string) => Goal[];
  getGoalsByCategoryId: (categoryId: string) => Goal[];
  getGoalsByType: (type: GoalType) => Goal[];
  getGoalsByStatus: (status: GoalStatus) => Goal[];
  getSubgoals: (parentId: string) => Goal[];
  isItemUpdating: (id: string) => boolean;
  isItemDeleting: (id: string) => boolean;

  // 4. Setters (Actions)
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  setSelectedGoal: (goal: Goal | null) => void;
  setInitialLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  setCreating: (isCreating: boolean) => void;
  setItemUpdating: (id: string, isUpdating: boolean) => void;
  setItemDeleting: (id: string, isDeleting: boolean) => void;
  reset: () => void;
}

const initialState = {
  goals: [],
  selectedGoal: null,
  initialLoading: false,
  error: null,
  isCreating: false,
  isUpdating: {},
  isDeleting: {},
};

// 5. Create Store
export const useGoalStore = create<GoalState>((set, get) => ({
  ...initialState,

  getGoals: () => get().goals,
  getGoalById: (id) => get().goals.find((goal) => goal.id === id),
  getSelectedGoal: () => get().selectedGoal,
  getGoalsByUserId: (userId) =>
    get().goals.filter((goal) => goal.userId === userId),
  getGoalsByProjectId: (projectId) =>
    get().goals.filter((goal) => goal.projectId === projectId),
  getGoalsByCategoryId: (categoryId) =>
    get().goals.filter((goal) => goal.categoryId === categoryId),
  getGoalsByType: (type) => get().goals.filter((goal) => goal.type === type),
  getGoalsByStatus: (status) =>
    get().goals.filter((goal) => goal.status === status),
  getSubgoals: (parentId) =>
    get().goals.filter((goal) => goal.parentId === parentId),
  isItemUpdating: (id) => get().isUpdating[id] || false,
  isItemDeleting: (id) => get().isDeleting[id] || false,

  setGoals: (goals) => set({ goals }),
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal,
      ),
      selectedGoal:
        state.selectedGoal?.id === id
          ? { ...state.selectedGoal, ...updates }
          : state.selectedGoal,
    })),
  removeGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id),
      selectedGoal: state.selectedGoal?.id === id ? null : state.selectedGoal,
    })),
  setSelectedGoal: (goal) => set({ selectedGoal: goal }),
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
