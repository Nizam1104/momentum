// src/stores/useUserAchievementStore.ts
import { create } from 'zustand';
import { UserAchievement } from '@/types/states';

// 2. State Interface
interface UserAchievementState {
  userAchievements: UserAchievement[];
  selectedUserAchievement: UserAchievement | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  getUserAchievements: () => UserAchievement[];
  getUserAchievementById: (id: string) => UserAchievement | undefined;
  getSelectedUserAchievement: () => UserAchievement | null;
  getUserAchievementsByUserId: (userId: string) => UserAchievement[];
  getUserAchievementsByAchievementId: (achievementId: string) => UserAchievement[];

  // 4. Setters (Actions)
  setUserAchievements: (userAchievements: UserAchievement[]) => void;
  addUserAchievement: (userAchievement: UserAchievement) => void;
  updateUserAchievement: (id: string, updates: Partial<UserAchievement>) => void;
  removeUserAchievement: (id: string) => void;
  setSelectedUserAchievement: (userAchievement: UserAchievement | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  userAchievements: [],
  selectedUserAchievement: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useUserAchievementStore = create<UserAchievementState>((set, get) => ({
  ...initialState,

  getUserAchievements: () => get().userAchievements,
  getUserAchievementById: (id) => get().userAchievements.find((ua) => ua.id === id),
  getSelectedUserAchievement: () => get().selectedUserAchievement,
  getUserAchievementsByUserId: (userId) => get().userAchievements.filter((ua) => ua.userId === userId),
  getUserAchievementsByAchievementId: (achievementId) => get().userAchievements.filter((ua) => ua.achievementId === achievementId),

  setUserAchievements: (userAchievements) => set({ userAchievements }),
  addUserAchievement: (userAchievement) => set((state) => ({ userAchievements: [...state.userAchievements, userAchievement] })),
  updateUserAchievement: (id, updates) =>
    set((state) => ({
      userAchievements: state.userAchievements.map((ua) =>
        ua.id === id ? { ...ua, ...updates } : ua
      ),
      selectedUserAchievement: state.selectedUserAchievement?.id === id ? { ...state.selectedUserAchievement, ...updates } : state.selectedUserAchievement,
    })),
  removeUserAchievement: (id) =>
    set((state) => ({
      userAchievements: state.userAchievements.filter((ua) => ua.id !== id),
      selectedUserAchievement: state.selectedUserAchievement?.id === id ? null : state.selectedUserAchievement,
    })),
  setSelectedUserAchievement: (userAchievement) => set({ selectedUserAchievement: userAchievement }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
