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
  loading: boolean;
  error: string | null;

  // Getters (Selectors)
  getTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
  getSelectedTask: () => Task | null;
  getTasksByProjectId: (projectId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByCategoryId: (categoryId: string) => Task[];
  getSubtasks: (parentId: string) => Task[];

  // Setters (Actions)
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  setSelectedTask: (task: Task | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
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
  loading: false,
  error: null,
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
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),

  // Async Actions with Supabase
  fetchTasksByProject: async (projectId: string) => {
    set({ loading: true, error: null });
    try {
      const result = await getTasksByProject(projectId);
      if (result.success && result.data) {
        set({ tasks: result.data, loading: false });
      } else {
        set({ error: result.error || "Failed to fetch tasks", loading: false });
      }
    } catch (error) {
      set({ error: "Failed to fetch tasks", loading: false });
    }
  },

  createTaskAsync: async (taskData) => {
    set({ loading: true, error: null });
    try {
      const result = await createTask(taskData);
      if (result.success && result.data) {
        get().addTask(result.data);
        set({ loading: false });
      } else {
        set({ error: result.error || "Failed to create task", loading: false });
      }
    } catch (error) {
      set({ error: "Failed to create task", loading: false });
    }
  },

  updateTaskAsync: async (taskId, updates) => {
    set({ loading: true, error: null });
    try {
      const result = await updateTaskAction(taskId, updates);
      if (result.success && result.data) {
        get().updateTask(taskId, result.data);
        set({ loading: false });
      } else {
        set({ error: result.error || "Failed to update task", loading: false });
      }
    } catch (error) {
      set({ error: "Failed to update task", loading: false });
    }
  },

  deleteTaskAsync: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const result = await deleteTask(taskId);
      if (result.success) {
        get().removeTask(taskId);
        set({ loading: false });
      } else {
        set({ error: result.error || "Failed to delete task", loading: false });
      }
    } catch (error) {
      set({ error: "Failed to delete task", loading: false });
    }
  },

  updateTaskStatusAsync: async (taskId, status) => {
    set({ loading: true, error: null });
    try {
      const result = await updateTaskStatusAction(taskId, status);
      if (result.success && result.data) {
        get().updateTask(taskId, result.data);
        set({ loading: false });
      } else {
        set({
          error: result.error || "Failed to update task status",
          loading: false,
        });
      }
    } catch (error) {
      set({ error: "Failed to update task status", loading: false });
    }
  },
}));
