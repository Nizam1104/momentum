// src/stores/useCategoryStore.ts
import { create } from 'zustand';
import { Category } from '@/types/states';

// 2. State Interface
interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  getCategories: () => Category[];
  getCategoryById: (id: string) => Category | undefined;
  getSelectedCategory: () => Category | null;
  getCategoriesByUserId: (userId: string) => Category[];

  // 4. Setters (Actions)
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  setSelectedCategory: (category: Category | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useCategoryStore = create<CategoryState>((set, get) => ({
  ...initialState,

  getCategories: () => get().categories,
  getCategoryById: (id) => get().categories.find((category) => category.id === id),
  getSelectedCategory: () => get().selectedCategory,
  getCategoriesByUserId: (userId) => get().categories.filter((category) => category.userId === userId),

  setCategories: (categories) => set({ categories }),
  addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...updates } : category
      ),
      selectedCategory: state.selectedCategory?.id === id ? { ...state.selectedCategory, ...updates } : state.selectedCategory,
    })),
  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
      selectedCategory: state.selectedCategory?.id === id ? null : state.selectedCategory,
    })),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
