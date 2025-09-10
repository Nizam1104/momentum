// src/stores/useTagStore.ts
import { create } from "zustand";
import { Tag } from "@/types/states";

// 2. State Interface
interface TagState {
  tags: Tag[];
  selectedTag: Tag | null;
  initialLoading: boolean; // Only for initial data fetch
  error: string | null;

  // Non-blocking operation states
  isCreating: boolean;
  isUpdating: Record<string, boolean>; // Track individual item updates
  isDeleting: Record<string, boolean>; // Track individual item deletions

  // 3. Getters (Selectors)
  getTags: () => Tag[];
  getTagById: (id: string) => Tag | undefined;
  getSelectedTag: () => Tag | null;
  getTagsByUserId: (userId: string) => Tag[];
  isItemUpdating: (id: string) => boolean;
  isItemDeleting: (id: string) => boolean;

  // 4. Setters (Actions)
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  removeTag: (id: string) => void;
  setSelectedTag: (tag: Tag | null) => void;
  setInitialLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  setCreating: (isCreating: boolean) => void;
  setItemUpdating: (id: string, isUpdating: boolean) => void;
  setItemDeleting: (id: string, isDeleting: boolean) => void;
  reset: () => void;
}

const initialState = {
  tags: [],
  selectedTag: null,
  initialLoading: false,
  error: null,
  isCreating: false,
  isUpdating: {},
  isDeleting: {},
};

// 5. Create Store
export const useTagStore = create<TagState>((set, get) => ({
  ...initialState,

  getTags: () => get().tags,
  getTagById: (id) => get().tags.find((tag) => tag.id === id),
  getSelectedTag: () => get().selectedTag,
  getTagsByUserId: (userId) =>
    get().tags.filter((tag) => tag.userId === userId),
  isItemUpdating: (id) => get().isUpdating[id] || false,
  isItemDeleting: (id) => get().isDeleting[id] || false,

  setTags: (tags) => set({ tags }),
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  updateTag: (id, updates) =>
    set((state) => ({
      tags: state.tags.map((tag) =>
        tag.id === id ? { ...tag, ...updates } : tag,
      ),
      selectedTag:
        state.selectedTag?.id === id
          ? { ...state.selectedTag, ...updates }
          : state.selectedTag,
    })),
  removeTag: (id) =>
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
      selectedTag: state.selectedTag?.id === id ? null : state.selectedTag,
    })),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
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
