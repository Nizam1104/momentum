// actions/clientActions/goals.ts
"use client";
import { getSupabaseClient } from '@/lib/supabase';
import { ActionResult, Goal, GoalStatus, GoalType, DailyGoal, DailyGoalStatus } from './types';
import { nanoid } from 'nanoid';

const toGoal = (goal: any): Goal => {
    return {
        ...goal,
        createdAt: new Date(goal.createdAt),
        updatedAt: goal.updatedAt ? new Date(goal.updatedAt) : undefined,
        startDate: goal.startDate ? new Date(goal.startDate) : undefined,
        targetDate: goal.targetDate ? new Date(goal.targetDate) : undefined,
        completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
    };
};

const toDailyGoal = (dailyGoal: any): DailyGoal => {
    return {
        ...dailyGoal,
        createdAt: new Date(dailyGoal.createdAt),
        updatedAt: dailyGoal.updatedAt ? new Date(dailyGoal.updatedAt) : undefined,
        goal: dailyGoal.goal ? toGoal(dailyGoal.goal) : undefined,
    };
};

export async function getAllGoals(userId: string): Promise<ActionResult<Goal[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Goal')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toGoal) : [] };
  } catch (error) {
    console.error('Error in getAllGoals:', error);
    return { success: false, error: 'Failed to fetch goals' };
  }
}

export async function getGoalById(goalId: string): Promise<ActionResult<Goal>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Goal')
      .select('*')
      .eq('id', goalId)
      .single();

    if (error) {
      console.error('Error fetching goal:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toGoal(data) : undefined };
  } catch (error) {
    console.error('Error in getGoalById:', error);
    return { success: false, error: 'Failed to fetch goal' };
  }
}

export async function createGoal(
  goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<Goal>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Goal')
      .insert({ ...goalData, id: nanoid() })
      .select()
      .single();

    if (error) {
      console.error('Error creating goal:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toGoal(data) : undefined };
  } catch (error) {
    console.error('Error in createGoal:', error);
    return { success: false, error: 'Failed to create goal' };
  }
}

export async function updateGoal(
  goalId: string,
  updates: Partial<Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>
): Promise<ActionResult<Goal>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Goal')
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
        ...(updates.status === GoalStatus.COMPLETED && { completedAt: new Date().toISOString() })
      })
      .eq('id', goalId)
      .select()
      .single();

    if (error) {
      console.error('Error updating goal:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toGoal(data) : undefined };
  } catch (error) {
    console.error('Error in updateGoal:', error);
    return { success: false, error: 'Failed to update goal' };
  }
}

export async function deleteGoal(goalId: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    
    // First delete all daily goals associated with this goal
    await supabase
      .from('DailyGoal')
      .delete()
      .eq('goalId', goalId);

    // Then delete sub-goals
    await supabase
      .from('Goal')
      .delete()
      .eq('parentId', goalId);

    // Finally delete the goal itself
    const { error } = await supabase
      .from('Goal')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('Error deleting goal:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error('Error in deleteGoal:', error);
    return { success: false, error: 'Failed to delete goal' };
  }
}

export async function getGoalsByStatus(userId: string, status: GoalStatus): Promise<ActionResult<Goal[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Goal')
      .select('*')
      .eq('userId', userId)
      .eq('status', status)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching goals by status:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toGoal) : [] };
  } catch (error) {
    console.error('Error in getGoalsByStatus:', error);
    return { success: false, error: 'Failed to fetch goals by status' };
  }
}

export async function getGoalsByType(userId: string, type: GoalType): Promise<ActionResult<Goal[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Goal')
      .select('*')
      .eq('userId', userId)
      .eq('type', type)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching goals by type:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toGoal) : [] };
  } catch (error) {
    console.error('Error in getGoalsByType:', error);
    return { success: false, error: 'Failed to fetch goals by type' };
  }
}

export async function updateGoalProgress(goalId: string, currentValue: number): Promise<ActionResult<Goal>> {
  try {
    const supabase = await getSupabaseClient();
    
    // Get the goal first to check if it's quantifiable
    const { data: goal } = await supabase
      .from('Goal')
      .select('*')
      .eq('id', goalId)
      .single();

    if (!goal) {
      return { success: false, error: 'Goal not found' };
    }

    const updateData: any = {
      currentValue,
      updatedAt: new Date().toISOString(),
    };

    // Check if goal is completed
    if (goal.isQuantifiable && goal.targetValue && currentValue >= goal.targetValue) {
      updateData.status = GoalStatus.COMPLETED;
      updateData.completedAt = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('Goal')
      .update(updateData)
      .eq('id', goalId)
      .select()
      .single();

    if (error) {
      console.error('Error updating goal progress:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toGoal(data) : undefined };
  } catch (error) {
    console.error('Error in updateGoalProgress:', error);
    return { success: false, error: 'Failed to update goal progress' };
  }
}

export async function getSubGoals(parentId: string): Promise<ActionResult<Goal[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Goal')
      .select('*')
      .eq('parentId', parentId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching sub-goals:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toGoal) : [] };
  } catch (error) {
    console.error('Error in getSubGoals:', error);
    return { success: false, error: 'Failed to fetch sub-goals' };
  }
}

// Daily Goal functions
export async function getDailyGoals(dayId: string): Promise<ActionResult<DailyGoal[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('DailyGoal')
      .select(`
        *,
        goal:Goal(*)
      `)
      .eq('dayId', dayId);

    if (error) {
      console.error('Error fetching daily goals:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toDailyGoal) : [] };
  } catch (error) {
    console.error('Error in getDailyGoals:', error);
    return { success: false, error: 'Failed to fetch daily goals' };
  }
}

export async function createDailyGoal(
  dailyGoalData: Omit<DailyGoal, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<DailyGoal>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('DailyGoal')
      .insert({ ...dailyGoalData, id: nanoid() })
      .select()
      .single();

    if (error) {
      console.error('Error creating daily goal:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toDailyGoal(data) : undefined };
  } catch (error) {
    console.error('Error in createDailyGoal:', error);
    return { success: false, error: 'Failed to create daily goal' };
  }
}

export async function updateDailyGoal(
  dailyGoalId: string,
  updates: Partial<Omit<DailyGoal, 'id' | 'createdAt' | 'updatedAt' | 'dayId' | 'goalId'>>
): Promise<ActionResult<DailyGoal>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('DailyGoal')
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', dailyGoalId)
      .select()
      .single();

    if (error) {
      console.error('Error updating daily goal:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toDailyGoal(data) : undefined };
  } catch (error) {
    console.error('Error in updateDailyGoal:', error);
    return { success: false, error: 'Failed to update daily goal' };
  }
}

export async function deleteDailyGoal(dailyGoalId: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from('DailyGoal')
      .delete()
      .eq('id', dailyGoalId);

    if (error) {
      console.error('Error deleting daily goal:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error('Error in deleteDailyGoal:', error);
    return { success: false, error: 'Failed to delete daily goal' };
  }
}

export async function getActiveGoals(userId: string): Promise<ActionResult<Goal[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Goal')
      .select('*')
      .eq('userId', userId)
      .eq('status', GoalStatus.ACTIVE)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching active goals:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toGoal) : [] };
  } catch (error) {
    console.error('Error in getActiveGoals:', error);
    return { success: false, error: 'Failed to fetch active goals' };
  }
}