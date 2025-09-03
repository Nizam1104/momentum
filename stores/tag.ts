// src/stores/useTagStore.ts
import { create } from 'zustand';
import { Tag } from '@/types/states';

// 2. State Interface
interface TagState {
  tags: Tag[];
  selectedTag: Tag | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  getTags: () => Tag[];
  getTagById: (id: string) => Tag | undefined;
  getSelectedTag: () => Tag | null;
  getTagsByUserId: (userId: string) => Tag[];

  // 4. Setters (Actions)
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  removeTag: (id: string) => void;
  setSelectedTag: (tag: Tag | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  tags: [],
  selectedTag: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useTagStore = create<TagState>((set, get) => ({
  ...initialState,

  getTags: () => get().tags,
  getTagById: (id) => get().tags.find((tag) => tag.id === id),
  getSelectedTag: () => get().selectedTag,
  getTagsByUserId: (userId) => get().tags.filter((tag) => tag.userId === userId),

  setTags: (tags) => set({ tags }),
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  updateTag: (id, updates) =>
    set((state) => ({
      tags: state.tags.map((tag) =>
        tag.id === id ? { ...tag, ...updates } : tag
      ),
      selectedTag: state.selectedTag?.id === id ? { ...state.selectedTag, ...updates } : state.selectedTag,
    })),
  removeTag: (id) =>
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
      selectedTag: state.selectedTag?.id === id ? null : state.selectedTag,
    })),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
