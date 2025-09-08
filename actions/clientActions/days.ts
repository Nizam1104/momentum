// actions/clientActions/days.ts
"use client";
import { getSupabaseClient } from "@/lib/supabase";
import { ActionResult, Day } from "./types";

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
        // No rows found
        return { success: true, data: null };
      }
      console.error("Error fetching today entry:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getTodayEntry:", error);
    return { success: false, error: "Failed to fetch today entry" };
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
        // No rows found
        return { success: true, data: null };
      }
      console.error("Error fetching day by date:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
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

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getAllDays:", error);
    return { success: false, error: "Failed to fetch days" };
  }
}

export async function createOrUpdateDay(
  dayData: Omit<Day, "id" | "createdAt" | "updatedAt">,
): Promise<ActionResult<Day>> {
  try {
    const supabase = await getSupabaseClient();
    const dateStr = new Date(dayData.date).toISOString().split("T")[0];

    // Try to find existing day first
    const { data: existingDay } = await supabase
      .from("Day")
      .select("*")
      .eq("userId", dayData.userId)
      .eq("date", dateStr)
      .single();

    if (existingDay) {
      // Update existing day
      const { data, error } = await supabase
        .from("Day")
        .update({
          ...dayData,
          date: dateStr,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", existingDay.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating day:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } else {
      // Create new day
      const { data, error } = await supabase
        .from("Day")
        .insert({
          ...dayData,
          date: dateStr,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating day:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    }
  } catch (error) {
    console.error("Error in createOrUpdateDay:", error);
    return { success: false, error: "Failed to create or update day" };
  }
}

export async function updateDayMetrics(
  dayId: string,
  metrics: {
    energyLevel?: number;
    moodRating?: number;
    productivityRating?: number;
    sleepHours?: number;
    sleepQuality?: number;
  },
): Promise<ActionResult<Day>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Day")
      .update({
        ...metrics,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", dayId)
      .select()
      .single();

    if (error) {
      console.error("Error updating day metrics:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in updateDayMetrics:", error);
    return { success: false, error: "Failed to update day metrics" };
  }
}

export async function updateDayReflections(
  dayId: string,
  reflections: {
    highlights?: string;
    challenges?: string;
    lessons?: string;
    gratitude?: string;
    tomorrowFocus?: string;
  },
): Promise<ActionResult<Day>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Day")
      .update({
        ...reflections,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", dayId)
      .select()
      .single();

    if (error) {
      console.error("Error updating day reflections:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in updateDayReflections:", error);
    return { success: false, error: "Failed to update day reflections" };
  }
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

    return { success: true, data };
  } catch (error) {
    console.error("Error in markDayComplete:", error);
    return { success: false, error: "Failed to mark day complete" };
  }
}

export async function getDaysInRange(
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<ActionResult<Day[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Day")
      .select("*")
      .eq("userId", userId)
      .gte("date", startDate.toISOString().split("T")[0])
      .lte("date", endDate.toISOString().split("T")[0])
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching days in range:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getDaysInRange:", error);
    return { success: false, error: "Failed to fetch days in range" };
  }
}

export async function getCompletedDays(
  userId: string,
  limit?: number,
): Promise<ActionResult<Day[]>> {
  try {
    const supabase = await getSupabaseClient();
    let query = supabase
      .from("Day")
      .select("*")
      .eq("userId", userId)
      .eq("isCompleted", true)
      .order("date", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching completed days:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getCompletedDays:", error);
    return { success: false, error: "Failed to fetch completed days" };
  }
}

export async function deleteDay(dayId: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from("Day").delete().eq("id", dayId);

    if (error) {
      console.error("Error deleting day:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in deleteDay:", error);
    return { success: false, error: "Failed to delete day" };
  }
}
