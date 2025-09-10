// src/stores/useCategoryStore.ts
import { create } from "zustand";
import { Category } from "@/types/states";

// 2. State Interface
interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  initialLoading: boolean; // Only for initial data fetch
  error: string | null;

  // Non-blocking operation states
  isCreating: boolean;
  isUpdating: Record<string, boolean>; // Track individual item updates
  isDeleting: Record<string, boolean>; // Track individual item deletions

  // 3. Getters (Selectors)
  getCategories: () => Category[];
  getCategoryById: (id: string) => Category | undefined;
  getSelectedCategory: () => Category | null;
  getCategoriesByUserId: (userId: string) => Category[];
  isItemUpdating: (id: string) => boolean;
  isItemDeleting: (id: string) => boolean;

  // 4. Setters (Actions)
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  setSelectedCategory: (category: Category | null) => void;
  setInitialLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  setCreating: (isCreating: boolean) => void;
  setItemUpdating: (id: string, isUpdating: boolean) => void;
  setItemDeleting: (id: string, isDeleting: boolean) => void;
  reset: () => void;
}

const initialState = {
  categories: [],
  selectedCategory: null,
  initialLoading: false,
  error: null,
  isCreating: false,
  isUpdating: {},
  isDeleting: {},
};

// 5. Create Store
export const useCategoryStore = create<CategoryState>((set, get) => ({
  ...initialState,

  getCategories: () => get().categories,
  getCategoryById: (id) =>
    get().categories.find((category) => category.id === id),
  getSelectedCategory: () => get().selectedCategory,
  getCategoriesByUserId: (userId) =>
    get().categories.filter((category) => category.userId === userId),
  isItemUpdating: (id) => get().isUpdating[id] || false,
  isItemDeleting: (id) => get().isDeleting[id] || false,

  setCategories: (categories) => set({ categories }),
  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...updates } : category,
      ),
      selectedCategory:
        state.selectedCategory?.id === id
          ? { ...state.selectedCategory, ...updates }
          : state.selectedCategory,
    })),
  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
      selectedCategory:
        state.selectedCategory?.id === id ? null : state.selectedCategory,
    })),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setInitialLoading: (initialLoading) => set({ initialLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  setCreating: (isCreating) => set({ isCreating }),
  setItemUpdating: (id, isUpdating) =>
    set((state) => ({
      isUpdating: isUpdating
        ? { ...state.isUpdating, [id]: true }
        : { ...state.isUpdating, [id]: false },
    })),
  setItemDeleting: (id, isDeleting) =>
    set((state) => ({
      isDeleting: isDeleting
        ? { ...state.isDeleting, [id]: true }
        : { ...state.isDeleting, [id]: false },
    })),
  reset: () => set(initialState),
}));
