// src/stores/useTaskStore.ts
import { create } from 'zustand';
import { TaskStatus, Priority } from '@/types/states';
import { Task } from '@/types/states';


// 2. State Interface
interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  getTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
  getSelectedTask: () => Task | null;
  getTasksByProjectId: (projectId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByCategoryId: (categoryId: string) => Task[];
  getSubtasks: (parentId: string) => Task[];

  // 4. Setters (Actions)
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  setSelectedTask: (task: Task | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useTaskStore = create<TaskState>((set, get) => ({
  ...initialState,

  getTasks: () => get().tasks,
  getTaskById: (id) => get().tasks.find((task) => task.id === id),
  getSelectedTask: () => get().selectedTask,
  getTasksByProjectId: (projectId) => get().tasks.filter((task) => task.projectId === projectId),
  getTasksByStatus: (status) => get().tasks.filter((task) => task.status === status),
  getTasksByCategoryId: (categoryId) => get().tasks.filter((task) => task.categoryId === categoryId),
  getSubtasks: (parentId) => get().tasks.filter((task) => task.parentId === parentId),

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
      selectedTask: state.selectedTask?.id === id ? { ...state.selectedTask, ...updates } : state.selectedTask,
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
}));
