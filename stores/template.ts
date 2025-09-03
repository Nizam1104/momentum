// src/stores/useTemplateStore.ts
import { create } from 'zustand';
import { Template, TemplateType } from '@/types/states'


// 2. State Interface
interface TemplateState {
  templates: Template[];
  selectedTemplate: Template | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  getTemplates: () => Template[];
  getTemplateById: (id: string) => Template | undefined;
  getSelectedTemplate: () => Template | null;
  getTemplatesByUserId: (userId: string) => Template[];
  getTemplatesByType: (type: TemplateType) => Template[];

  // 4. Setters (Actions)
  setTemplates: (templates: Template[]) => void;
  addTemplate: (template: Template) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  removeTemplate: (id: string) => void;
  setSelectedTemplate: (template: Template | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  templates: [],
  selectedTemplate: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useTemplateStore = create<TemplateState>((set, get) => ({
  ...initialState,

  getTemplates: () => get().templates,
  getTemplateById: (id) => get().templates.find((template) => template.id === id),
  getSelectedTemplate: () => get().selectedTemplate,
  getTemplatesByUserId: (userId) => get().templates.filter((template) => template.userId === userId),
  getTemplatesByType: (type) => get().templates.filter((template) => template.type === type),

  setTemplates: (templates) => set({ templates }),
  addTemplate: (template) => set((state) => ({ templates: [...state.templates, template] })),
  updateTemplate: (id, updates) =>
    set((state) => ({
      templates: state.templates.map((template) =>
        template.id === id ? { ...template, ...updates } : template
      ),
      selectedTemplate: state.selectedTemplate?.id === id ? { ...state.selectedTemplate, ...updates } : state.selectedTemplate,
    })),
  removeTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id),
      selectedTemplate: state.selectedTemplate?.id === id ? null : state.selectedTemplate,
    })),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
