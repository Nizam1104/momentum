// stores/day.ts
import { create } from "zustand";
import {
  Day,
  Note,
  Task,
  TaskStatus,
  Priority,
  getTodayEntry,
  getAllDays,
  getDayNotes,
  createDayNote,
  updateDayNote,
  deleteDayNote,
  getDayTasks,
  createDayTask,
  updateDayTask,
  deleteDayTask,
  updateDayTaskStatus,
  markDayComplete,
} from "@/actions/clientActions";

interface DayState {
  // Day data
  selectedDay: Day | null;
  days: Day[];

  // Notes data
  notes: Note[];

  // Tasks data
  tasks: Task[];

  // Loading states - only for initial data fetching
  initialLoading: boolean; // For fetching today's entry or all days
  notesInitialLoading: boolean; // Only for initial notes fetch
  tasksInitialLoading: boolean; // Only for initial tasks fetch

  // Non-blocking operation states
  isDayUpdating: Record<string, boolean>; // Track individual day updates
  isNoteCreating: boolean;
  isNoteUpdating: Record<string, boolean>; // Track individual note updates
  isNoteDeleting: Record<string, boolean>; // Track individual note deletions
  isTaskCreating: boolean;
  isTaskUpdating: Record<string, boolean>; // Track individual task updates
  isTaskDeleting: Record<string, boolean>; // Track individual task deletions

  // Error states
  error: string | null;
  notesError: string | null;
  tasksError: string | null;

  // Helper getters for operation states
  isDayBeingUpdated: (dayId: string) => boolean;
  isNoteBeingUpdated: (noteId: string) => boolean;
  isNoteBeingDeleted: (noteId: string) => boolean;
  isTaskBeingUpdated: (taskId: string) => boolean;
  isTaskBeingDeleted: (taskId: string) => boolean;

  // Day actions
  fetchTodayEntry: (userId: string) => Promise<void>;
  fetchAllDays: (userId: string, limit?: number) => Promise<void>;
  setSelectedDay: (day: Day | null) => void;
  markDayCompleteAsync: (dayId: string, isCompleted: boolean) => Promise<void>;

  // Note actions
  fetchDayNotes: (dayId: string) => Promise<void>;
  createNoteAsync: (
    dayId: string,
    noteData: { title?: string; content: string },
  ) => Promise<Note | null>;
  updateNoteAsync: (
    noteId: string,
    updates: { title?: string; content?: string },
  ) => Promise<void>;
  deleteNoteAsync: (noteId: string) => Promise<void>;

  // Task actions
  fetchDayTasks: (dayId: string) => Promise<void>;
  createTaskAsync: (
    dayId: string,
    taskData: { title: string; description?: string; priority?: Priority },
  ) => Promise<void>;
  updateTaskAsync: (
    taskId: string,
    updates: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: Priority;
    },
  ) => Promise<void>;
  deleteTaskAsync: (taskId: string) => Promise<void>;
  updateTaskStatusAsync: (taskId: string, status: TaskStatus) => Promise<void>;

  // Utility actions
  setInitialLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  setDayUpdating: (dayId: string, isUpdating: boolean) => void;
  setNoteCreating: (isCreating: boolean) => void;
  setNoteUpdating: (noteId: string, isUpdating: boolean) => void;
  setNoteDeleting: (noteId: string, isDeleting: boolean) => void;
  setTaskCreating: (isCreating: boolean) => void;
  setTaskUpdating: (taskId: string, isUpdating: boolean) => void;
  setTaskDeleting: (taskId: string, isDeleting: boolean) => void;
  reset: () => void;
}

const initialState = {
  selectedDay: null,
  days: [],
  notes: [],
  tasks: [],
  initialLoading: false,
  notesInitialLoading: false,
  tasksInitialLoading: false,
  isDayUpdating: {},
  isNoteCreating: false,
  isNoteUpdating: {},
  isNoteDeleting: {},
  isTaskCreating: false,
  isTaskUpdating: {},
  isTaskDeleting: {},
  error: null,
  notesError: null,
  tasksError: null,
};

export const useDayStore = create<DayState>((set, get) => ({
  ...initialState,

  // Helper getters
  isDayBeingUpdated: (dayId) => get().isDayUpdating[dayId] || false,
  isNoteBeingUpdated: (noteId) => get().isNoteUpdating[noteId] || false,
  isNoteBeingDeleted: (noteId) => get().isNoteDeleting[noteId] || false,
  isTaskBeingUpdated: (taskId) => get().isTaskUpdating[taskId] || false,
  isTaskBeingDeleted: (taskId) => get().isTaskDeleting[taskId] || false,

  // Day actions
  fetchTodayEntry: async (userId: string) => {
    set({ initialLoading: true, error: null });
    try {
      const result = await getTodayEntry(userId);
      if (result.success && result.data) {
        set({ selectedDay: result.data, initialLoading: false });

        // Automatically fetch notes and tasks for today (non-blocking)
        get().fetchDayNotes(result.data.id);
        get().fetchDayTasks(result.data.id);

        // Add to days list if not already present
        const existingDay = get().days.find((d) => d.id === result.data!.id);
        if (!existingDay) {
          set((state) => ({ days: [result.data!, ...state.days] }));
        }
      } else {
        set({
          error: result.error || "Failed to fetch today entry",
          initialLoading: false,
        });
      }
    } catch (error) {
      set({ error: "Failed to fetch today entry", initialLoading: false });
    }
  },

  fetchAllDays: async (userId: string, limit?: number) => {
    set({ initialLoading: true, error: null });
    try {
      const result = await getAllDays(userId, limit);
      if (result.success && result.data) {
        set({ days: result.data, initialLoading: false });
      } else {
        set({
          error: result.error || "Failed to fetch days",
          initialLoading: false,
        });
      }
    } catch (error) {
      set({ error: "Failed to fetch days", initialLoading: false });
    }
  },

  setSelectedDay: (day: Day | null) => {
    set({ selectedDay: day });
    if (day) {
      // Fetch notes and tasks for the selected day (non-blocking)
      get().fetchDayNotes(day.id);
      get().fetchDayTasks(day.id);
    }
  },

  markDayCompleteAsync: async (dayId: string, isCompleted: boolean) => {
    get().setDayUpdating(dayId, true);
    set({ error: null });
    try {
      const result = await markDayComplete(dayId, isCompleted);
      if (result.success && result.data) {
        // Update in days list
        set((state) => ({
          days: state.days.map((d) => (d.id === dayId ? result.data! : d)),
          selectedDay:
            state.selectedDay?.id === dayId ? result.data! : state.selectedDay,
        }));
      } else {
        set({
          error: result.error || "Failed to mark day complete",
        });
      }
    } catch (error) {
      set({ error: "Failed to mark day complete" });
    } finally {
      get().setDayUpdating(dayId, false);
    }
  },

  // Note actions
  fetchDayNotes: async (dayId: string) => {
    set({ notesInitialLoading: true, notesError: null });
    try {
      const result = await getDayNotes(dayId);
      if (result.success && result.data) {
        set({ notes: result.data, notesInitialLoading: false });
      } else {
        set({
          notesError: result.error || "Failed to fetch notes",
          notesInitialLoading: false,
        });
      }
    } catch (error) {
      set({ notesError: "Failed to fetch notes", notesInitialLoading: false });
    }
  },

  createNoteAsync: async (dayId: string, noteData) => {
    get().setNoteCreating(true);
    set({ notesError: null });
    try {
      const result = await createDayNote(dayId, {
        title: noteData.title || "",
        content: noteData.content,
        isPinned: false,
        isArchived: false,
      });

      if (result.success && result.data) {
        set((state) => ({
          notes: [result.data!, ...state.notes],
        }));
        return result.data;
      } else {
        set({
          notesError: result.error || "Failed to create note",
        });
        return null;
      }
    } catch (error) {
      set({ notesError: "Failed to create note" });
      return null;
    } finally {
      get().setNoteCreating(false);
    }
  },

  updateNoteAsync: async (noteId: string, updates) => {
    get().setNoteUpdating(noteId, true);
    set({ notesError: null });
    try {
      const result = await updateDayNote(noteId, updates);
      if (result.success && result.data) {
        set((state) => ({
          notes: state.notes.map((n) => (n.id === noteId ? result.data! : n)),
        }));
      } else {
        set({
          notesError: result.error || "Failed to update note",
        });
      }
    } catch (error) {
      set({ notesError: "Failed to update note" });
    } finally {
      get().setNoteUpdating(noteId, false);
    }
  },

  deleteNoteAsync: async (noteId: string) => {
    get().setNoteDeleting(noteId, true);
    set({ notesError: null });
    try {
      const result = await deleteDayNote(noteId);
      if (result.success) {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== noteId),
        }));
      } else {
        set({
          notesError: result.error || "Failed to delete note",
        });
      }
    } catch (error) {
      set({ notesError: "Failed to delete note" });
    } finally {
      get().setNoteDeleting(noteId, false);
    }
  },

  // Task actions
  fetchDayTasks: async (dayId: string) => {
    set({ tasksInitialLoading: true, tasksError: null });
    try {
      const result = await getDayTasks(dayId);
      if (result.success && result.data) {
        set({ tasks: result.data, tasksInitialLoading: false });
      } else {
        set({
          tasksError: result.error || "Failed to fetch tasks",
          tasksInitialLoading: false,
        });
      }
    } catch (error) {
      set({ tasksError: "Failed to fetch tasks", tasksInitialLoading: false });
    }
  },

  createTaskAsync: async (dayId: string, taskData) => {
    get().setTaskCreating(true);
    set({ tasksError: null });
    try {
      const result = await createDayTask(dayId, {
        title: taskData.title,
        description: taskData.description || "",
        priority: taskData.priority || Priority.MEDIUM,
        status: TaskStatus.TODO,
      });

      if (result.success && result.data) {
        set((state) => ({
          tasks: [result.data!, ...state.tasks],
        }));
      } else {
        set({
          tasksError: result.error || "Failed to create task",
        });
      }
    } catch (error) {
      set({ tasksError: "Failed to create task" });
    } finally {
      get().setTaskCreating(false);
    }
  },

  updateTaskAsync: async (taskId: string, updates) => {
    get().setTaskUpdating(taskId, true);
    set({ tasksError: null });
    try {
      const result = await updateDayTask(taskId, updates);
      if (result.success && result.data) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? result.data! : t)),
        }));
      } else {
        set({
          tasksError: result.error || "Failed to update task",
        });
      }
    } catch (error) {
      set({ tasksError: "Failed to update task" });
    } finally {
      get().setTaskUpdating(taskId, false);
    }
  },

  deleteTaskAsync: async (taskId: string) => {
    get().setTaskDeleting(taskId, true);
    set({ tasksError: null });
    try {
      const result = await deleteDayTask(taskId);
      if (result.success) {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        }));
      } else {
        set({
          tasksError: result.error || "Failed to delete task",
        });
      }
    } catch (error) {
      set({ tasksError: "Failed to delete task" });
    } finally {
      get().setTaskDeleting(taskId, false);
    }
  },

  updateTaskStatusAsync: async (taskId: string, status: TaskStatus) => {
    get().setTaskUpdating(taskId, true);
    set({ tasksError: null });
    try {
      const result = await updateDayTaskStatus(taskId, status);
      if (result.success && result.data) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? result.data! : t)),
        }));
      } else {
        set({
          tasksError: result.error || "Failed to update task status",
        });
      }
    } catch (error) {
      set({ tasksError: "Failed to update task status" });
    } finally {
      get().setTaskUpdating(taskId, false);
    }
  },

  // Utility actions
  setInitialLoading: (isLoading: boolean) => set({ initialLoading: isLoading }),
  setError: (errorMessage: string | null) => set({ error: errorMessage }),

  setDayUpdating: (dayId: string, isUpdating: boolean) =>
    set((state) => ({
      isDayUpdating: isUpdating
        ? { ...state.isDayUpdating, [dayId]: true }
        : { ...state.isDayUpdating, [dayId]: false },
    })),

  setNoteCreating: (isCreating: boolean) => set({ isNoteCreating: isCreating }),

  setNoteUpdating: (noteId: string, isUpdating: boolean) =>
    set((state) => ({
      isNoteUpdating: isUpdating
        ? { ...state.isNoteUpdating, [noteId]: true }
        : { ...state.isNoteUpdating, [noteId]: false },
    })),

  setNoteDeleting: (noteId: string, isDeleting: boolean) =>
    set((state) => ({
      isNoteDeleting: isDeleting
        ? { ...state.isNoteDeleting, [noteId]: true }
        : { ...state.isNoteDeleting, [noteId]: false },
    })),

  setTaskCreating: (isCreating: boolean) => set({ isTaskCreating: isCreating }),

  setTaskUpdating: (taskId: string, isUpdating: boolean) =>
    set((state) => ({
      isTaskUpdating: isUpdating
        ? { ...state.isTaskUpdating, [taskId]: true }
        : { ...state.isTaskUpdating, [taskId]: false },
    })),

  setTaskDeleting: (taskId: string, isDeleting: boolean) =>
    set((state) => ({
      isTaskDeleting: isDeleting
        ? { ...state.isTaskDeleting, [taskId]: true }
        : { ...state.isTaskDeleting, [taskId]: false },
    })),

  reset: () => set(initialState),
}));
