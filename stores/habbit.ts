// src/stores/useHabitStore.ts
import { create } from 'zustand';
import { HabitType } from '@/types/states'
import { Habit } from '@/types/states';

// 2. State Interface
interface HabitState {
  habits: Habit[];
  selectedHabit: Habit | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  getHabits: () => Habit[];
  getHabitById: (id: string) => Habit | undefined;
  getSelectedHabit: () => Habit | null;
  getHabitsByUserId: (userId: string) => Habit[];
  getHabitsByCategory: (category: HabitType) => Habit[];
  getActiveHabits: () => Habit[];

  // 4. Setters (Actions)
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  removeHabit: (id: string) => void;
  setSelectedHabit: (habit: Habit | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  habits: [],
  selectedHabit: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useHabitStore = create<HabitState>((set, get) => ({
  ...initialState,

  getHabits: () => get().habits,
  getHabitById: (id) => get().habits.find((habit) => habit.id === id),
  getSelectedHabit: () => get().selectedHabit,
  getHabitsByUserId: (userId) => get().habits.filter((habit) => habit.userId === userId),
  getHabitsByCategory: (category) => get().habits.filter((habit) => habit.category === category),
  getActiveHabits: () => get().habits.filter((habit) => habit.isActive),

  setHabits: (habits) => set({ habits }),
  addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
  updateHabit: (id, updates) =>
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id ? { ...habit, ...updates } : habit
      ),
      selectedHabit: state.selectedHabit?.id === id ? { ...state.selectedHabit, ...updates } : state.selectedHabit,
    })),
  removeHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((habit) => habit.id !== id),
      selectedHabit: state.selectedHabit?.id === id ? null : state.selectedHabit,
    })),
  setSelectedHabit: (habit) => set({ selectedHabit: habit }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
