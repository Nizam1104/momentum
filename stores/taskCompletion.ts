// src/stores/useTaskCompletionStore.ts
import { create } from "zustand";
import { TaskCompletion } from "@/types/states";

// 2. State Interface
interface TaskCompletionState {
  taskCompletions: TaskCompletion[];
  selectedTaskCompletion: TaskCompletion | null;
  initialLoading: boolean; // Only for initial data fetch
  error: string | null;

  // Non-blocking operation states
  isCreating: boolean;
  isUpdating: Record<string, boolean>; // Track individual item updates
  isDeleting: Record<string, boolean>; // Track individual item deletions

  // 3. Getters (Selectors)
  getTaskCompletions: () => TaskCompletion[];
  getTaskCompletionById: (id: string) => TaskCompletion | undefined;
  getSelectedTaskCompletion: () => TaskCompletion | null;
  getTaskCompletionsByDayId: (dayId: string) => TaskCompletion[];
  getTaskCompletionsByTaskId: (taskId: string) => TaskCompletion[];
  isItemUpdating: (id: string) => boolean;
  isItemDeleting: (id: string) => boolean;

  // 4. Setters (Actions)
  setTaskCompletions: (taskCompletions: TaskCompletion[]) => void;
  addTaskCompletion: (taskCompletion: TaskCompletion) => void;
  updateTaskCompletion: (id: string, updates: Partial<TaskCompletion>) => void;
  removeTaskCompletion: (id: string) => void;
  setSelectedTaskCompletion: (taskCompletion: TaskCompletion | null) => void;
  setInitialLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  setCreating: (isCreating: boolean) => void;
  setItemUpdating: (id: string, isUpdating: boolean) => void;
  setItemDeleting: (id: string, isDeleting: boolean) => void;
  reset: () => void;
}

const initialState = {
  taskCompletions: [],
  selectedTaskCompletion: null,
  initialLoading: false,
  error: null,
  isCreating: false,
  isUpdating: {},
  isDeleting: {},
};

// 5. Create Store
export const useTaskCompletionStore = create<TaskCompletionState>(
  (set, get) => ({
    ...initialState,

    getTaskCompletions: () => get().taskCompletions,
    getTaskCompletionById: (id) =>
      get().taskCompletions.find((tc) => tc.id === id),
    getSelectedTaskCompletion: () => get().selectedTaskCompletion,
    getTaskCompletionsByDayId: (dayId) =>
      get().taskCompletions.filter((tc) => tc.dayId === dayId),
    getTaskCompletionsByTaskId: (taskId) =>
      get().taskCompletions.filter((tc) => tc.taskId === taskId),
    isItemUpdating: (id) => get().isUpdating[id] || false,
    isItemDeleting: (id) => get().isDeleting[id] || false,

    setTaskCompletions: (taskCompletions) => set({ taskCompletions }),
    addTaskCompletion: (taskCompletion) =>
      set((state) => ({
        taskCompletions: [...state.taskCompletions, taskCompletion],
      })),
    updateTaskCompletion: (id, updates) =>
      set((state) => ({
        taskCompletions: state.taskCompletions.map((tc) =>
          tc.id === id ? { ...tc, ...updates } : tc,
        ),
        selectedTaskCompletion:
          state.selectedTaskCompletion?.id === id
            ? { ...state.selectedTaskCompletion, ...updates }
            : state.selectedTaskCompletion,
      })),
    removeTaskCompletion: (id) =>
      set((state) => ({
        taskCompletions: state.taskCompletions.filter((tc) => tc.id !== id),
        selectedTaskCompletion:
          state.selectedTaskCompletion?.id === id
            ? null
            : state.selectedTaskCompletion,
      })),
    setSelectedTaskCompletion: (taskCompletion) =>
      set({ selectedTaskCompletion: taskCompletion }),
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
  }),
);
