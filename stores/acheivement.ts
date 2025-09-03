// src/stores/useAchievementStore.ts
import { create } from 'zustand';
import { Achievement } from '@/types/states';

// 2. State Interface
interface AchievementState {
  achievements: Achievement[];
  selectedAchievement: Achievement | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  getAchievements: () => Achievement[];
  getAchievementById: (id: string) => Achievement | undefined;
  getSelectedAchievement: () => Achievement | null;
  getAchievementsByUserId: (userId: string) => Achievement[];

  // 4. Setters (Actions)
  setAchievements: (achievements: Achievement[]) => void;
  addAchievement: (achievement: Achievement) => void;
  updateAchievement: (id: string, updates: Partial<Achievement>) => void;
  removeAchievement: (id: string) => void;
  setSelectedAchievement: (achievement: Achievement | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  achievements: [],
  selectedAchievement: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useAchievementStore = create<AchievementState>((set, get) => ({
  ...initialState,

  getAchievements: () => get().achievements,
  getAchievementById: (id) => get().achievements.find((achievement) => achievement.id === id),
  getSelectedAchievement: () => get().selectedAchievement,
  getAchievementsByUserId: (userId) => get().achievements.filter((achievement) => achievement.userId === userId),

  setAchievements: (achievements) => set({ achievements }),
  addAchievement: (achievement) => set((state) => ({ achievements: [...state.achievements, achievement] })),
  updateAchievement: (id, updates) =>
    set((state) => ({
      achievements: state.achievements.map((achievement) =>
        achievement.id === id ? { ...achievement, ...updates } : achievement
      ),
      selectedAchievement: state.selectedAchievement?.id === id ? { ...state.selectedAchievement, ...updates } : state.selectedAchievement,
    })),
  removeAchievement: (id) =>
    set((state) => ({
      achievements: state.achievements.filter((achievement) => achievement.id !== id),
      selectedAchievement: state.selectedAchievement?.id === id ? null : state.selectedAchievement,
    })),
  setSelectedAchievement: (achievement) => set({ selectedAchievement: achievement }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
