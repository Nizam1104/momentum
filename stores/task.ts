// src/stores/useTaskStore.ts
import { create } from "zustand";
import {
  Task,
  TaskStatus,
  Priority,
  getTasksByProject,
  createTask,
  updateTask as updateTaskAction,
  deleteTask,
  updateTaskStatus as updateTaskStatusAction,
} from "@/actions/clientActions";

// State Interface
interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  initialLoading: boolean; // Only for initial data fetch
  error: string | null;

  // Non-blocking operation states
  isCreating: boolean;
  isUpdating: Record<string, boolean>; // Track individual item updates
  isDeleting: Record<string, boolean>; // Track individual item deletions
  isStatusUpdating: Record<string, boolean>; // Track individual status updates

  // Getters (Selectors)
  getTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
  getSelectedTask: () => Task | null;
  getTasksByProjectId: (projectId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByCategoryId: (categoryId: string) => Task[];
  getSubtasks: (parentId: string) => Task[];
  isItemUpdating: (id: string) => boolean;
  isItemDeleting: (id: string) => boolean;
  isItemStatusUpdating: (id: string) => boolean;

  // Setters (Actions)
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  setSelectedTask: (task: Task | null) => void;
  setInitialLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  setCreating: (isCreating: boolean) => void;
  setItemUpdating: (id: string, isUpdating: boolean) => void;
  setItemDeleting: (id: string, isDeleting: boolean) => void;
  setItemStatusUpdating: (id: string, isUpdating: boolean) => void;
  reset: () => void;

  // Async Actions with Supabase
  fetchTasksByProject: (projectId: string) => Promise<void>;
  createTaskAsync: (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateTaskAsync: (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<void>;
  deleteTaskAsync: (taskId: string) => Promise<void>;
  updateTaskStatusAsync: (taskId: string, status: TaskStatus) => Promise<void>;
}

const initialState = {
  tasks: [],
  selectedTask: null,
  initialLoading: false,
  error: null,
  isCreating: false,
  isUpdating: {},
  isDeleting: {},
  isStatusUpdating: {},
};

// Create Store
export const useTaskStore = create<TaskState>((set, get) => ({
  ...initialState,

  getTasks: () => get().tasks,
  getTaskById: (id) => get().tasks.find((task) => task.id === id),
  getSelectedTask: () => get().selectedTask,
  getTasksByProjectId: (projectId) =>
    get().tasks.filter((task) => task.projectId === projectId),
  getTasksByStatus: (status) =>
    get().tasks.filter((task) => task.status === status),
  getTasksByCategoryId: (categoryId) =>
    get().tasks.filter((task) => task.categoryId === categoryId),
  getSubtasks: (parentId) =>
    get().tasks.filter((task) => task.parentId === parentId),
  isItemUpdating: (id) => get().isUpdating[id] || false,
  isItemDeleting: (id) => get().isDeleting[id] || false,
  isItemStatusUpdating: (id) => get().isStatusUpdating[id] || false,

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task,
      ),
      selectedTask:
        state.selectedTask?.id === id
          ? { ...state.selectedTask, ...updates }
          : state.selectedTask,
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
      selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
    })),
  setSelectedTask: (task) => set({ selectedTask: task }),
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
  setItemStatusUpdating: (id, isUpdating) =>
    set((state) => ({
      isStatusUpdating: isUpdating
        ? { ...state.isStatusUpdating, [id]: true }
        : { ...state.isStatusUpdating, [id]: false },
    })),
  reset: () => set(initialState),

  // Async Actions with Supabase
  fetchTasksByProject: async (projectId: string) => {
    set({ initialLoading: true, error: null });
    try {
      const result = await getTasksByProject(projectId);
      if (result.success && result.data) {
        set({ tasks: result.data, initialLoading: false });
      } else {
        set({
          error: result.error || "Failed to fetch tasks",
          initialLoading: false,
        });
      }
    } catch (error) {
      set({ error: "Failed to fetch tasks", initialLoading: false });
    }
  },

  createTaskAsync: async (taskData) => {
    get().setCreating(true);
    set({ error: null });
    try {
      const result = await createTask(taskData);
      if (result.success && result.data) {
        get().addTask(result.data);
      } else {
        set({ error: result.error || "Failed to create task" });
      }
    } catch (error) {
      set({ error: "Failed to create task" });
    } finally {
      get().setCreating(false);
    }
  },

  updateTaskAsync: async (taskId, updates) => {
    get().setItemUpdating(taskId, true);
    set({ error: null });
    try {
      const result = await updateTaskAction(taskId, updates);
      if (result.success && result.data) {
        get().updateTask(taskId, result.data);
      } else {
        set({ error: result.error || "Failed to update task" });
      }
    } catch (error) {
      set({ error: "Failed to update task" });
    } finally {
      get().setItemUpdating(taskId, false);
    }
  },

  deleteTaskAsync: async (taskId) => {
    get().setItemDeleting(taskId, true);
    set({ error: null });
    try {
      const result = await deleteTask(taskId);
      if (result.success) {
        get().removeTask(taskId);
      } else {
        set({ error: result.error || "Failed to delete task" });
      }
    } catch (error) {
      set({ error: "Failed to delete task" });
    } finally {
      get().setItemDeleting(taskId, false);
    }
  },

  updateTaskStatusAsync: async (taskId, status) => {
    get().setItemStatusUpdating(taskId, true);
    set({ error: null });
    try {
      const result = await updateTaskStatusAction(taskId, status);
      if (result.success && result.data) {
        get().updateTask(taskId, result.data);
      } else {
        set({
          error: result.error || "Failed to update task status",
        });
      }
    } catch (error) {
      set({ error: "Failed to update task status" });
    } finally {
      get().setItemStatusUpdating(taskId, false);
    }
  },
}));
