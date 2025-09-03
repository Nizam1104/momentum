// src/stores/useUserStore.ts
import { create } from 'zustand';

// 1. Import User type from its defined location
import { User } from '@/types/states';

// 2. State Interface
interface UserState {
  // User can be null if not logged in or not yet loaded
  user: User | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  // Allow setting user to null (e.g., for logout)
  setUser: (user: User | null) => void;
  // Return User or null
  getUser: () => User | null;

  updateUser: (updates: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}


const initialState = {
  user: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useUserStore = create<UserState>((set, get) => ({
  ...initialState,

  setUser: (user) => set({ user }),

  getUser: () => get().user,

  updateUser: (updates) =>
    set((state) => {
      if (!state.user) {
        return {};
      }
      return {
        user: {
          ...state.user,
          ...updates,
        },
      };
    }),

  setLoading: (isLoading) => set({ loading: isLoading }),

  setError: (errorMessage) => set({ error: errorMessage }),

  reset: () => set(initialState),
}));
