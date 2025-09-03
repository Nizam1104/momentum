// src/stores/useTaskCompletionStore.ts
import { create } from 'zustand';
import { TaskCompletion } from '@/types/states';

// 2. State Interface
interface TaskCompletionState {
  taskCompletions: TaskCompletion[];
  selectedTaskCompletion: TaskCompletion | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  getTaskCompletions: () => TaskCompletion[];
  getTaskCompletionById: (id: string) => TaskCompletion | undefined;
  getSelectedTaskCompletion: () => TaskCompletion | null;
  getTaskCompletionsByDayId: (dayId: string) => TaskCompletion[];
  getTaskCompletionsByTaskId: (taskId: string) => TaskCompletion[];

  // 4. Setters (Actions)
  setTaskCompletions: (taskCompletions: TaskCompletion[]) => void;
  addTaskCompletion: (taskCompletion: TaskCompletion) => void;
  updateTaskCompletion: (id: string, updates: Partial<TaskCompletion>) => void;
  removeTaskCompletion: (id: string) => void;
  setSelectedTaskCompletion: (taskCompletion: TaskCompletion | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  taskCompletions: [],
  selectedTaskCompletion: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useTaskCompletionStore = create<TaskCompletionState>((set, get) => ({
  ...initialState,

  getTaskCompletions: () => get().taskCompletions,
  getTaskCompletionById: (id) => get().taskCompletions.find((tc) => tc.id === id),
  getSelectedTaskCompletion: () => get().selectedTaskCompletion,
  getTaskCompletionsByDayId: (dayId) => get().taskCompletions.filter((tc) => tc.dayId === dayId),
  getTaskCompletionsByTaskId: (taskId) => get().taskCompletions.filter((tc) => tc.taskId === taskId),

  setTaskCompletions: (taskCompletions) => set({ taskCompletions }),
  addTaskCompletion: (taskCompletion) => set((state) => ({ taskCompletions: [...state.taskCompletions, taskCompletion] })),
  updateTaskCompletion: (id, updates) =>
    set((state) => ({
      taskCompletions: state.taskCompletions.map((tc) =>
        tc.id === id ? { ...tc, ...updates } : tc
      ),
      selectedTaskCompletion: state.selectedTaskCompletion?.id === id ? { ...state.selectedTaskCompletion, ...updates } : state.selectedTaskCompletion,
    })),
  removeTaskCompletion: (id) =>
    set((state) => ({
      taskCompletions: state.taskCompletions.filter((tc) => tc.id !== id),
      selectedTaskCompletion: state.selectedTaskCompletion?.id === id ? null : state.selectedTaskCompletion,
    })),
  setSelectedTaskCompletion: (taskCompletion) => set({ selectedTaskCompletion: taskCompletion }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
