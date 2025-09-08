// actions/clientActions/habits.ts
"use client";
import { getSupabaseClient } from '@/lib/supabase';
import { ActionResult, Habit, HabitType, HabitLog } from './types';
import { nanoid } from 'nanoid';

const toHabit = (habit: any): Habit => {
    return {
        ...habit,
        createdAt: new Date(habit.createdAt),
        updatedAt: habit.updatedAt ? new Date(habit.updatedAt) : undefined,
    };
};

const toHabitLog = (habitLog: any): HabitLog => {
    return {
        ...habitLog,
        createdAt: new Date(habitLog.createdAt),
        updatedAt: habitLog.updatedAt ? new Date(habitLog.updatedAt) : undefined,
        habit: habitLog.habit ? toHabit(habitLog.habit) : undefined,
    };
};

export async function getAllHabits(userId: string): Promise<ActionResult<Habit[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Habit')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching habits:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toHabit) : [] };
  } catch (error) {
    console.error('Error in getAllHabits:', error);
    return { success: false, error: 'Failed to fetch habits' };
  }
}

export async function getActiveHabits(userId: string): Promise<ActionResult<Habit[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Habit')
      .select('*')
      .eq('userId', userId)
      .eq('isActive', true)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching active habits:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toHabit) : [] };
  } catch (error) {
    console.error('Error in getActiveHabits:', error);
    return { success: false, error: 'Failed to fetch active habits' };
  }
}

export async function getHabitById(habitId: string): Promise<ActionResult<Habit>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Habit')
      .select('*')
      .eq('id', habitId)
      .single();

    if (error) {
      console.error('Error fetching habit:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toHabit(data) : undefined };
  } catch (error) {
    console.error('Error in getHabitById:', error);
    return { success: false, error: 'Failed to fetch habit' };
  }
}

export async function createHabit(
  habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<Habit>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Habit')
      .insert({ ...habitData, id: nanoid() })
      .select()
      .single();

    if (error) {
      console.error('Error creating habit:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toHabit(data) : undefined };
  } catch (error) {
    console.error('Error in createHabit:', error);
    return { success: false, error: 'Failed to create habit' };
  }
}

export async function updateHabit(
  habitId: string,
  updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>
): Promise<ActionResult<Habit>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Habit')
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', habitId)
      .select()
      .single();

    if (error) {
      console.error('Error updating habit:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toHabit(data) : undefined };
  } catch (error) {
    console.error('Error in updateHabit:', error);
    return { success: false, error: 'Failed to update habit' };
  }
}

export async function deleteHabit(habitId: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    
    // First delete all habit logs associated with this habit
    await supabase
      .from('HabitLog')
      .delete()
      .eq('habitId', habitId);

    // Then delete the habit itself
    const { error } = await supabase
      .from('Habit')
      .delete()
      .eq('id', habitId);

    if (error) {
      console.error('Error deleting habit:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error('Error in deleteHabit:', error);
    return { success: false, error: 'Failed to delete habit' };
  }
}

export async function getHabitsByCategory(userId: string, category: HabitType): Promise<ActionResult<Habit[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Habit')
      .select('*')
      .eq('userId', userId)
      .eq('category', category)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching habits by category:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toHabit) : [] };
  } catch (error) {
    console.error('Error in getHabitsByCategory:', error);
    return { success: false, error: 'Failed to fetch habits by category' };
  }
}

// Habit Log functions
export async function getHabitLogs(dayId: string): Promise<ActionResult<HabitLog[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('HabitLog')
      .select(`
        *,
        habit:Habit(*)
      `)
      .eq('dayId', dayId);

    if (error) {
      console.error('Error fetching habit logs:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toHabitLog) : [] };
  } catch (error) {
    console.error('Error in getHabitLogs:', error);
    return { success: false, error: 'Failed to fetch habit logs' };
  }
}

export async function getHabitLogByHabitAndDay(habitId: string, dayId: string): Promise<ActionResult<HabitLog | null>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('HabitLog')
      .select('*')
      .eq('habitId', habitId)
      .eq('dayId', dayId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return { success: true, data: null };
      }
      console.error('Error fetching habit log:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toHabitLog(data) : null };
  } catch (error) {
    console.error('Error in getHabitLogByHabitAndDay:', error);
    return { success: false, error: 'Failed to fetch habit log' };
  }
}

export async function createOrUpdateHabitLog(
  habitLogData: Omit<HabitLog, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<HabitLog>> {
  try {
    const supabase = await getSupabaseClient();
    
    // Try to find existing habit log first
    const { data: existingLog } = await supabase
      .from('HabitLog')
      .select('id')
      .eq('habitId', habitLogData.habitId)
      .eq('dayId', habitLogData.dayId)
      .single();

    if (existingLog) {
      // Update existing log
      const { data, error } = await supabase
        .from('HabitLog')
        .update({
          ...habitLogData,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', existingLog.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating habit log:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data ? toHabitLog(data) : undefined };
    } else {
      // Create new log
      const { data, error } = await supabase
        .from('HabitLog')
        .insert({ ...habitLogData, id: nanoid() })
        .select()
        .single();

      if (error) {
        console.error('Error creating habit log:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data ? toHabitLog(data) : undefined };
    }
  } catch (error) {
    console.error('Error in createOrUpdateHabitLog:', error);
    return { success: false, error: 'Failed to create or update habit log' };
  }
}

export async function updateHabitLog(
  habitLogId: string,
  updates: Partial<Omit<HabitLog, 'id' | 'createdAt' | 'updatedAt' | 'dayId' | 'habitId'>>
): Promise<ActionResult<HabitLog>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('HabitLog')
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', habitLogId)
      .select()
      .single();

    if (error) {
      console.error('Error updating habit log:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toHabitLog(data) : undefined };
  } catch (error) {
    console.error('Error in updateHabitLog:', error);
    return { success: false, error: 'Failed to update habit log' };
  }
}

export async function deleteHabitLog(habitLogId: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from('HabitLog')
      .delete()
      .eq('id', habitLogId);

    if (error) {
      console.error('Error deleting habit log:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error('Error in deleteHabitLog:', error);
    return { success: false, error: 'Failed to delete habit log' };
  }
}

export async function getHabitStreak(habitId: string, userId: string): Promise<ActionResult<number>> {
  try {
    const supabase = await getSupabaseClient();
    
    // Get habit logs for the last 365 days in descending order
    const past365Days = new Date();
    past365Days.setDate(past365Days.getDate() - 365);
    
    const { data, error } = await supabase
      .from('HabitLog')
      .select(`
        *,
        day:Day!inner(date, userId)
      `)
      .eq('habitId', habitId)
      .eq('day.userId', userId)
      .eq('completed', true)
      .gte('day.date', past365Days.toISOString().split('T')[0])
      .order('day(date)', { ascending: false });

    if (error) {
      console.error('Error calculating habit streak:', error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: true, data: 0 };
    }

    // Calculate current streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < data.length; i++) {
      const logDate = new Date(data[i].day.date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (logDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return { success: true, data: streak };
  } catch (error) {
    console.error('Error in getHabitStreak:', error);
    return { success: false, error: 'Failed to calculate habit streak' };
  }
}