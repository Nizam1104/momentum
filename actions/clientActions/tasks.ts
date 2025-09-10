// actions/clientActions/tasks.ts
"use client";
import { getSupabaseClient } from "@/lib/supabase";
import { ActionResult, Task, TaskStatus, Priority } from "./types";
import { nanoid } from "nanoid";
import { getUserId } from "@/utils/shared";

const toTask = (task: any): Task => {
  return {
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  };
};

export async function getTasksByProject(
  projectId: string,
): Promise<ActionResult<Task[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Task")
      .select("*")
      .eq("projectId", projectId)
      .order("createdAt", { ascending: false });

    console.log("tasks fetched", data);

    if (error) {
      console.error("Error fetching tasks:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toTask) : [] };
  } catch (error) {
    console.error("Error in getTasksByProject:", error);
    return { success: false, error: "Failed to fetch tasks" };
  }
}

export async function getTaskById(taskId: string): Promise<ActionResult<Task>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Task")
      .select("*")
      .eq("id", taskId)
      .single();

    if (error) {
      console.error("Error fetching task:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toTask(data) : undefined };
  } catch (error) {
    console.error("Error in getTaskById:", error);
    return { success: false, error: "Failed to fetch task" };
  }
}

export async function createTask(
  taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
): Promise<ActionResult<Task>> {
  try {
    console.log('mnv:: 123')
    const supabase = await getSupabaseClient();
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("Task")
      .insert({
        ...taskData,
        userId,
        id: nanoid(),
        dayId: nanoid()
      })
      .select()
      .single();

    // console.log("Created task:", data);
    console.log("Created task:", error);

    if (error) {
      console.error("Error creating task:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toTask(data) : undefined };
  } catch (error) {
    console.error("Error in createTask:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTask(
  taskId: string,
  updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
): Promise<ActionResult<Task>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Task")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
        ...(updates.status === TaskStatus.COMPLETED && {
          completedAt: new Date().toISOString(),
        }),
      })
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toTask(data) : undefined };
  } catch (error) {
    console.error("Error in updateTask:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function deleteTask(
  taskId: string,
): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();

    // First delete all subtasks
    await supabase.from("Task").delete().eq("parentId", taskId);

    // Then delete the task itself
    const { error } = await supabase.from("Task").delete().eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in deleteTask:", error);
    return { success: false, error: "Failed to delete task" };
  }
}

export async function getSubTasks(
  parentId: string,
): Promise<ActionResult<Task[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Task")
      .select("*")
      .eq("parentId", parentId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching sub-tasks:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toTask) : [] };
  } catch (error) {
    console.error("Error in getSubTasks:", error);
    return { success: false, error: "Failed to fetch sub-tasks" };
  }
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<ActionResult<Task>> {
  try {
    const supabase = await getSupabaseClient();
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (status === TaskStatus.COMPLETED) {
      updateData.completedAt = new Date().toISOString();
    } else {
      updateData.completedAt = null;
    }

    const { data, error } = await supabase
      .from("Task")
      .update(updateData)
      .eq("id", taskId)
      .select()
      .single();

    if (error) {
      console.error("Error updating task status:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toTask(data) : undefined };
  } catch (error) {
    console.error("Error in updateTaskStatus:", error);
    return { success: false, error: "Failed to update task status" };
  }
}

export async function getTasksByStatus(
  projectId: string,
  status: TaskStatus,
): Promise<ActionResult<Task[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Task")
      .select("*")
      .eq("projectId", projectId)
      .eq("status", status)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching tasks by status:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toTask) : [] };
  } catch (error) {
    console.error("Error in getTasksByStatus:", error);
    return { success: false, error: "Failed to fetch tasks by status" };
  }
}

export async function getTasksByPriority(
  projectId: string,
  priority: Priority,
): Promise<ActionResult<Task[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Task")
      .select("*")
      .eq("projectId", projectId)
      .eq("priority", priority)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching tasks by priority:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toTask) : [] };
  } catch (error) {
    console.error("Error in getTasksByPriority:", error);
    return { success: false, error: "Failed to fetch tasks by priority" };
  }
}

export async function getOverdueTasks(
  projectId: string,
): Promise<ActionResult<Task[]>> {
  try {
    const supabase = await getSupabaseClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("Task")
      .select("*")
      .eq("projectId", projectId)
      .neq("status", TaskStatus.COMPLETED)
      .lt("dueDate", now)
      .not("dueDate", "is", null)
      .order("dueDate", { ascending: true });

    if (error) {
      console.error("Error fetching overdue tasks:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toTask) : [] };
  } catch (error) {
    console.error("Error in getOverdueTasks:", error);
    return { success: false, error: "Failed to fetch overdue tasks" };
  }
}

export async function getUpcomingTasks(
  projectId: string,
  days: number = 7,
): Promise<ActionResult<Task[]>> {
  try {
    const supabase = await getSupabaseClient();
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from("Task")
      .select("*")
      .eq("projectId", projectId)
      .neq("status", TaskStatus.COMPLETED)
      .gte("dueDate", now.toISOString())
      .lte("dueDate", futureDate.toISOString())
      .not("dueDate", "is", null)
      .order("dueDate", { ascending: true });

    if (error) {
      console.error("Error fetching upcoming tasks:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toTask) : [] };
  } catch (error) {
    console.error("Error in getUpcomingTasks:", error);
    return { success: false, error: "Failed to fetch upcoming tasks" };
  }
}
