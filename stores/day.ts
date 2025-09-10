// stores/day.ts
import { create } from "zustand";
import {
  Day,
  Note,
  Task,
  NoteType,
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

  // Loading states
  loading: boolean;
  notesLoading: boolean;
  tasksLoading: boolean;

  // Error states
  error: string | null;
  notesError: string | null;
  tasksError: string | null;

  // Day actions
  fetchTodayEntry: (userId: string) => Promise<void>;
  fetchAllDays: (userId: string, limit?: number) => Promise<void>;
  setSelectedDay: (day: Day | null) => void;
  markDayCompleteAsync: (dayId: string, isCompleted: boolean) => Promise<void>;

  // Note actions
  fetchDayNotes: (dayId: string) => Promise<void>;
  createNoteAsync: (
    dayId: string,
    noteData: { title?: string; content: string; type?: NoteType },
  ) => Promise<void>;
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
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  selectedDay: null,
  days: [],
  notes: [],
  tasks: [],
  loading: false,
  notesLoading: false,
  tasksLoading: false,
  error: null,
  notesError: null,
  tasksError: null,
};

export const useDayStore = create<DayState>((set, get) => ({
  ...initialState,

  // Day actions
  fetchTodayEntry: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const result = await getTodayEntry(userId);
      console.log("res day", result);
      if (result.success && result.data) {
        set({ selectedDay: result.data, loading: false });

        // Automatically fetch notes and tasks for today
        await get().fetchDayNotes(result.data.id);
        await get().fetchDayTasks(result.data.id);

        // Add to days list if not already present
        const existingDay = get().days.find((d) => d.id === result.data!.id);
        if (!existingDay) {
          set((state) => ({ days: [result.data!, ...state.days] }));
        }
      } else {
        set({
          error: result.error || "Failed to fetch today entry",
          loading: false,
        });
      }
    } catch (error) {
      set({ error: "Failed to fetch today entry", loading: false });
    }
  },

  fetchAllDays: async (userId: string, limit?: number) => {
    set({ loading: true, error: null });
    try {
      const result = await getAllDays(userId, limit);
      if (result.success && result.data) {
        set({ days: result.data, loading: false });
      } else {
        set({ error: result.error || "Failed to fetch days", loading: false });
      }
    } catch (error) {
      set({ error: "Failed to fetch days", loading: false });
    }
  },

  setSelectedDay: (day: Day | null) => {
    set({ selectedDay: day });
    if (day) {
      // Fetch notes and tasks for the selected day
      get().fetchDayNotes(day.id);
      get().fetchDayTasks(day.id);
    }
  },

  markDayCompleteAsync: async (dayId: string, isCompleted: boolean) => {
    set({ loading: true, error: null });
    try {
      const result = await markDayComplete(dayId, isCompleted);
      if (result.success && result.data) {
        // Update in days list
        set((state) => ({
          days: state.days.map((d) => (d.id === dayId ? result.data! : d)),
          selectedDay:
            state.selectedDay?.id === dayId ? result.data! : state.selectedDay,
          loading: false,
        }));
      } else {
        set({
          error: result.error || "Failed to mark day complete",
          loading: false,
        });
      }
    } catch (error) {
      set({ error: "Failed to mark day complete", loading: false });
    }
  },

  // Note actions
  fetchDayNotes: async (dayId: string) => {
    set({ notesLoading: true, notesError: null });
    try {
      const result = await getDayNotes(dayId);
      if (result.success && result.data) {
        set({ notes: result.data, notesLoading: false });
      } else {
        set({
          notesError: result.error || "Failed to fetch notes",
          notesLoading: false,
        });
      }
    } catch (error) {
      set({ notesError: "Failed to fetch notes", notesLoading: false });
    }
  },

  createNoteAsync: async (dayId: string, noteData) => {
    set({ notesLoading: true, notesError: null });
    try {
      const result = await createDayNote(dayId, {
        title: noteData.title || "",
        content: noteData.content,
        type: noteData.type || NoteType.GENERAL,
        isPinned: false,
        isArchived: false,
      });

      if (result.success && result.data) {
        set((state) => ({
          notes: [result.data!, ...state.notes],
          notesLoading: false,
        }));
      } else {
        set({
          notesError: result.error || "Failed to create note",
          notesLoading: false,
        });
      }
    } catch (error) {
      set({ notesError: "Failed to create note", notesLoading: false });
    }
  },

  updateNoteAsync: async (noteId: string, updates) => {
    set({ notesLoading: true, notesError: null });
    try {
      const result = await updateDayNote(noteId, updates);
      if (result.success && result.data) {
        set((state) => ({
          notes: state.notes.map((n) => (n.id === noteId ? result.data! : n)),
          notesLoading: false,
        }));
      } else {
        set({
          notesError: result.error || "Failed to update note",
          notesLoading: false,
        });
      }
    } catch (error) {
      set({ notesError: "Failed to update note", notesLoading: false });
    }
  },

  deleteNoteAsync: async (noteId: string) => {
    set({ notesLoading: true, notesError: null });
    try {
      const result = await deleteDayNote(noteId);
      if (result.success) {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== noteId),
          notesLoading: false,
        }));
      } else {
        set({
          notesError: result.error || "Failed to delete note",
          notesLoading: false,
        });
      }
    } catch (error) {
      set({ notesError: "Failed to delete note", notesLoading: false });
    }
  },

  // Task actions
  fetchDayTasks: async (dayId: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const result = await getDayTasks(dayId);
      if (result.success && result.data) {
        set({ tasks: result.data, tasksLoading: false });
      } else {
        set({
          tasksError: result.error || "Failed to fetch tasks",
          tasksLoading: false,
        });
      }
    } catch (error) {
      set({ tasksError: "Failed to fetch tasks", tasksLoading: false });
    }
  },

  createTaskAsync: async (dayId: string, taskData) => {
    set({ tasksLoading: true, tasksError: null });
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
          tasksLoading: false,
        }));
      } else {
        set({
          tasksError: result.error || "Failed to create task",
          tasksLoading: false,
        });
      }
    } catch (error) {
      set({ tasksError: "Failed to create task", tasksLoading: false });
    }
  },

  updateTaskAsync: async (taskId: string, updates) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const result = await updateDayTask(taskId, updates);
      if (result.success && result.data) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? result.data! : t)),
          tasksLoading: false,
        }));
      } else {
        set({
          tasksError: result.error || "Failed to update task",
          tasksLoading: false,
        });
      }
    } catch (error) {
      set({ tasksError: "Failed to update task", tasksLoading: false });
    }
  },

  deleteTaskAsync: async (taskId: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const result = await deleteDayTask(taskId);
      if (result.success) {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
          tasksLoading: false,
        }));
      } else {
        set({
          tasksError: result.error || "Failed to delete task",
          tasksLoading: false,
        });
      }
    } catch (error) {
      set({ tasksError: "Failed to delete task", tasksLoading: false });
    }
  },

  updateTaskStatusAsync: async (taskId: string, status: TaskStatus) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const result = await updateDayTaskStatus(taskId, status);
      if (result.success && result.data) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? result.data! : t)),
          tasksLoading: false,
        }));
      } else {
        set({
          tasksError: result.error || "Failed to update task status",
          tasksLoading: false,
        });
      }
    } catch (error) {
      set({ tasksError: "Failed to update task status", tasksLoading: false });
    }
  },

  // Utility actions
  setLoading: (isLoading: boolean) => set({ loading: isLoading }),
  setError: (errorMessage: string | null) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
