// actions/clientActions/days.ts
"use client";
import { getSupabaseClient } from "@/lib/supabase";
import {
  ActionResult,
  Day,
  Note,
  Task,
  NoteType,
  TaskStatus,
  Priority,
} from "./types";
import { nanoid } from "nanoid";
import { getUserId } from "@/utils/shared";

const toDay = (day: any): Day => {
  return {
    ...day,
    date: new Date(day.date),
    createdAt: new Date(day.createdAt),
    updatedAt: new Date(day.updatedAt),
  };
};

const toNote = (note: any): Note => {
  return {
    ...note,
    createdAt: new Date(note.createdAt),
    updatedAt: note.updatedAt ? new Date(note.updatedAt) : undefined,
  };
};

const toTask = (task: any): Task => {
  return {
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  };
};

export async function getTodayEntry(
  userId: string,
): Promise<ActionResult<Day | null>> {
  try {
    const supabase = await getSupabaseClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("Day")
      .select("*")
      .eq("userId", userId)
      .eq("date", today.toISOString().split("T")[0])
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found - create a new day entry with default learnings note
        return await createTodayEntry(userId);
      }
      console.error("Error fetching today entry:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: toDay(data) };
  } catch (error) {
    console.error("Error in getTodayEntry:", error);
    return { success: false, error: "Failed to fetch today entry" };
  }
}

export async function createTodayEntry(
  userId: string,
): Promise<ActionResult<Day>> {
  try {
    const supabase = await getSupabaseClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = today.toISOString().split("T")[0];

    // Create the day entry
    const { data: dayData, error: dayError } = await supabase
      .from("Day")
      .insert({
        id: nanoid(),
        date: dateStr,
        userId,
        isCompleted: false,
      })
      .select()
      .single();

    if (dayError) {
      console.error("Error creating day entry:", dayError);
      return { success: false, error: dayError.message };
    }

    // Create the default "Learnings" note
    await createDefaultLearningsNote(dayData.id);

    return { success: true, data: toDay(dayData) };
  } catch (error) {
    console.error("Error in createTodayEntry:", error);
    return { success: false, error: "Failed to create today entry" };
  }
}

export async function createDefaultLearningsNote(
  dayId: string,
): Promise<ActionResult<Note>> {
  try {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
      .from("Note")
      .insert({
        id: nanoid(),
        title: "Learnings",
        content: "What did I learn today?\n\n",
        type: NoteType.LEARNING,
        isPinned: true,
        isArchived: false,
        dayId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating default learnings note:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: toNote(data) };
  } catch (error) {
    console.error("Error in createDefaultLearningsNote:", error);
    return { success: false, error: "Failed to create default learnings note" };
  }
}

export async function getDayByDate(
  userId: string,
  date: Date,
): Promise<ActionResult<Day | null>> {
  try {
    const supabase = await getSupabaseClient();
    const dateStr = date.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("Day")
      .select("*")
      .eq("userId", userId)
      .eq("date", dateStr)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return { success: true, data: null };
      }
      console.error("Error fetching day by date:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: toDay(data) };
  } catch (error) {
    console.error("Error in getDayByDate:", error);
    return { success: false, error: "Failed to fetch day by date" };
  }
}

export async function getAllDays(
  userId: string,
  limit?: number,
): Promise<ActionResult<Day[]>> {
  try {
    const supabase = await getSupabaseClient();
    let query = supabase
      .from("Day")
      .select("*")
      .eq("userId", userId)
      .order("date", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching all days:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toDay) : [] };
  } catch (error) {
    console.error("Error in getAllDays:", error);
    return { success: false, error: "Failed to fetch days" };
  }
}

// Notes for a specific day
export async function getDayNotes(
  dayId: string,
): Promise<ActionResult<Note[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Note")
      .select("*")
      .eq("dayId", dayId)
      .eq("isArchived", false)
      .order("isPinned", { ascending: false })
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching day notes:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toNote) : [] };
  } catch (error) {
    console.error("Error in getDayNotes:", error);
    return { success: false, error: "Failed to fetch day notes" };
  }
}

export async function createDayNote(
  dayId: string,
  noteData: Omit<Note, "id" | "createdAt" | "updatedAt" | "dayId">,
): Promise<ActionResult<Note>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Note")
      .insert({
        ...noteData,
        id: nanoid(),
        dayId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating day note:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: toNote(data) };
  } catch (error) {
    console.error("Error in createDayNote:", error);
    return { success: false, error: "Failed to create day note" };
  }
}

export async function updateDayNote(
  noteId: string,
  updates: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>,
): Promise<ActionResult<Note>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Note")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", noteId)
      .select()
      .single();

    if (error) {
      console.error("Error updating day note:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: toNote(data) };
  } catch (error) {
    console.error("Error in updateDayNote:", error);
    return { success: false, error: "Failed to update day note" };
  }
}

export async function deleteDayNote(
  noteId: string,
): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from("Note").delete().eq("id", noteId);

    if (error) {
      console.error("Error deleting day note:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in deleteDayNote:", error);
    return { success: false, error: "Failed to delete day note" };
  }
}

// Tasks for a specific day
export async function getDayTasks(
  dayId: string,
): Promise<ActionResult<Task[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Task")
      .select("*")
      .eq("dayId", dayId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching day tasks:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toTask) : [] };
  } catch (error) {
    console.error("Error in getDayTasks:", error);
    return { success: false, error: "Failed to fetch day tasks" };
  }
}

export async function createDayTask(
  dayId: string,
  taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "dayId">,
): Promise<ActionResult<Task>> {
  try {
    const supabase = await getSupabaseClient();
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("Task")
      .insert({
        ...taskData,
        userId,
        id: nanoid(),
        dayId,
        status: TaskStatus.TODO,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating day task:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: toTask(data) };
  } catch (error) {
    console.error("Error in createDayTask:", error);
    return { success: false, error: "Failed to create day task" };
  }
}

export async function updateDayTask(
  taskId: string,
  updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
): Promise<ActionResult<Task>> {
  try {
    const supabase = await getSupabaseClient();
    const updateData: any = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.status === TaskStatus.COMPLETED) {
      updateData.completedAt = new Date().toISOString();
    } else if (
      updates.status === TaskStatus.TODO ||
      updates.status === TaskStatus.IN_PROGRESS ||
      updates.status === TaskStatus.CANCELLED
    ) {
      updateData.completedAt = null;
    }

    const { data, error } = await supabase
      .from("Task")
      .update(updateData)
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      console.error("Error updating day task:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: toTask(data) };
  } catch (error) {
    console.error("Error in updateDayTask:", error);
    return { success: false, error: "Failed to update day task" };
  }
}

export async function deleteDayTask(
  taskId: string,
): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from("Task").delete().eq("id", taskId);

    if (error) {
      console.error("Error deleting day task:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in deleteDayTask:", error);
    return { success: false, error: "Failed to delete day task" };
  }
}

export async function updateDayTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<ActionResult<Task>> {
  return updateDayTask(taskId, { status });
}

export async function markDayComplete(
  dayId: string,
  isCompleted: boolean = true,
): Promise<ActionResult<Day>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Day")
      .update({
        isCompleted,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", dayId)
      .select()
      .single();

    if (error) {
      console.error("Error marking day complete:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: toDay(data) };
  } catch (error) {
    console.error("Error in markDayComplete:", error);
    return { success: false, error: "Failed to mark day complete" };
  }
}
