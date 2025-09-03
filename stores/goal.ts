// src/stores/useGoalStore.ts
import { create } from 'zustand';
import { GoalType, GoalStatus } from '@/types/states'
import { Goal } from '@/types/states';

// 2. State Interface
interface GoalState {
  goals: Goal[];
  selectedGoal: Goal | null;
  loading: boolean;
  error: string | null;

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

  // 4. Setters (Actions)
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  setSelectedGoal: (goal: Goal | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  goals: [],
  selectedGoal: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useGoalStore = create<GoalState>((set, get) => ({
  ...initialState,

  getGoals: () => get().goals,
  getGoalById: (id) => get().goals.find((goal) => goal.id === id),
  getSelectedGoal: () => get().selectedGoal,
  getGoalsByUserId: (userId) => get().goals.filter((goal) => goal.userId === userId),
  getGoalsByProjectId: (projectId) => get().goals.filter((goal) => goal.projectId === projectId),
  getGoalsByCategoryId: (categoryId) => get().goals.filter((goal) => goal.categoryId === categoryId),
  getGoalsByType: (type) => get().goals.filter((goal) => goal.type === type),
  getGoalsByStatus: (status) => get().goals.filter((goal) => goal.status === status),
  getSubgoals: (parentId) => get().goals.filter((goal) => goal.parentId === parentId),

  setGoals: (goals) => set({ goals }),
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      ),
      selectedGoal: state.selectedGoal?.id === id ? { ...state.selectedGoal, ...updates } : state.selectedGoal,
    })),
  removeGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id),
      selectedGoal: state.selectedGoal?.id === id ? null : state.selectedGoal,
    })),
  setSelectedGoal: (goal) => set({ selectedGoal: goal }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
