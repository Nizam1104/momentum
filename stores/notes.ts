// src/stores/useProjectStore.ts
import { create } from 'zustand';
import { ProjectStatus, Priority } from '@/types/states';
import { Project } from '@/types/states';

// 2. State Interface
interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;

  // 3. Getters (Selectors)
  getProjects: () => Project[];
  getProjectById: (id: string) => Project | undefined;
  getSelectedProject: () => Project | null;
  getProjectsByUserId: (userId: string) => Project[];
  getProjectsByStatus: (status: ProjectStatus) => Project[];
  getProjectsByCategoryId: (categoryId: string) => Project[];
  getSubprojects: (parentId: string) => Project[];

  // 4. Setters (Actions)
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setSelectedProject: (project: Project | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string | null) => void;
  reset: () => void;
}

const initialState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
};

// 5. Create Store
export const useProjectStore = create<ProjectState>((set, get) => ({
  ...initialState,

  getProjects: () => get().projects,
  getProjectById: (id) => get().projects.find((project) => project.id === id),
  getSelectedProject: () => get().selectedProject,
  getProjectsByUserId: (userId) => get().projects.filter((project) => project.userId === userId),
  getProjectsByStatus: (status) => get().projects.filter((project) => project.status === status),
  getProjectsByCategoryId: (categoryId) => get().projects.filter((project) => project.categoryId === categoryId),
  getSubprojects: (parentId) => get().projects.filter((project) => project.parentId === parentId),

  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      ),
      selectedProject: state.selectedProject?.id === id ? { ...state.selectedProject, ...updates } : state.selectedProject,
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
    })),
  setSelectedProject: (project) => set({ selectedProject: project }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  reset: () => set(initialState),
}));
