import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { Project, ProjectStatus, Priority } from '@/types/states';

interface ProjectState {
  // State
  projects: Project[];
  selectedProject: Project | null;
  filteredProjects: Project[];
  filters: {
    status?: ProjectStatus;
    priority?: Priority;
    categoryId?: string;
    searchTerm?: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setProjects: (projects: Project[]) => void;
  setSelectedProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  removeProject: (projectId: string) => void;
  updateProjectProgress: (projectId: string, progress: number) => void;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
  setFilters: (filters: Partial<ProjectState['filters']>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Getters
  getProjectById: (projectId: string) => Project | undefined;
  getProjectsByUserId: (userId: string) => Project[];
  getProjectsByStatus: (status: ProjectStatus, userId?: string) => Project[];
  getProjectsByPriority: (priority: Priority, userId?: string) => Project[];
  getProjectsByCategory: (categoryId: string, userId?: string) => Project[];
  getSubprojects: (parentId: string) => Project[];
  getOverdueProjects: (userId?: string) => Project[];
  getProjectsCompletionRate: (userId: string) => number;
  getActiveProjectsCount: (userId?: string) => number;

  // Reset
  reset: () => void;
}

const initialState = {
  projects: [],
  selectedProject: null,
  filteredProjects: [],
  filters: {},
  isLoading: false,
  error: null,
};

export const useProjectStore = create<ProjectState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // Actions
      setProjects: (projects) =>
        set({ projects }, false, 'setProjects'),

      setSelectedProject: (selectedProject) =>
        set({ selectedProject }, false, 'setSelectedProject'),

      addProject: (project) =>
        set(
          (state) => ({
            projects: [...state.projects, project],
          }),
          false,
          'addProject'
        ),

      updateProject: (projectId, updates) =>
        set(
          (state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId ? { ...project, ...updates } : project
            ),
            selectedProject:
              state.selectedProject?.id === projectId
                ? { ...state.selectedProject, ...updates }
                : state.selectedProject,
          }),
          false,
          'updateProject'
        ),

      removeProject: (projectId) =>
        set(
          (state) => ({
            projects: state.projects.filter((project) => project.id !== projectId),
            selectedProject:
              state.selectedProject?.id === projectId ? null : state.selectedProject,
          }),
          false,
          'removeProject'
        ),

      updateProjectProgress: (projectId, progress) =>
        set(
          (state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    progress,
                    completedAt: progress === 100 ? new Date() : undefined,
                    status: progress === 100 ? ProjectStatus.COMPLETED : project.status,
                  }
                : project
            ),
            selectedProject:
              state.selectedProject?.id === projectId
                ? {
                    ...state.selectedProject,
                    progress,
                    completedAt: progress === 100 ? new Date() : undefined,
                    status: progress === 100 ? ProjectStatus.COMPLETED : state.selectedProject.status,
                  }
                : state.selectedProject,
          }),
          false,
          'updateProjectProgress'
        ),

      updateProjectStatus: (projectId, status) =>
        set(
          (state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    status,
                    completedAt: status === ProjectStatus.COMPLETED ? new Date() : undefined,
                    progress: status === ProjectStatus.COMPLETED ? 100 : project.progress,
                  }
                : project
            ),
            selectedProject:
              state.selectedProject?.id === projectId
                ? {
                    ...state.selectedProject,
                    status,
                    completedAt: status === ProjectStatus.COMPLETED ? new Date() : undefined,
                    progress: status === ProjectStatus.COMPLETED ? 100 : state.selectedProject.progress,
                  }
                : state.selectedProject,
          }),
          false,
          'updateProjectStatus'
        ),

      setFilters: (filters) =>
        set(
          (state) => ({ filters: { ...state.filters, ...filters } }),
          false,
          'setFilters'
        ),

      clearFilters: () =>
        set({ filters: {} }, false, 'clearFilters'),

      applyFilters: () => {
        const state = get();
        let filtered = [...state.projects];

        if (state.filters.status) {
          filtered = filtered.filter((project) => project.status === state.filters.status);
        }

        if (state.filters.priority) {
          filtered = filtered.filter((project) => project.priority === state.filters.priority);
        }

        if (state.filters.categoryId) {
          filtered = filtered.filter((project) => project.categoryId === state.filters.categoryId);
        }

        if (state.filters.searchTerm) {
          const searchTerm = state.filters.searchTerm.toLowerCase();
          filtered = filtered.filter(
            (project) =>
              project.name.toLowerCase().includes(searchTerm) ||
              project.description?.toLowerCase().includes(searchTerm)
          );
        }

        set({ filteredProjects: filtered }, false, 'applyFilters');
      },

      setLoading: (isLoading) =>
        set({ isLoading }, false, 'setLoading'),

      setError: (error) =>
        set({ error }, false, 'setError'),

      // Getters
      getProjectById: (projectId) => {
        const state = get();
        return state.projects.find((project) => project.id === projectId);
      },

      getProjectsByUserId: (userId) => {
        const state = get();
        return state.projects.filter((project) => project.userId === userId);
      },

      getProjectsByStatus: (status, userId) => {
        const state = get();
        return state.projects.filter((project) => {
          const matchesStatus = project.status === status;
          return userId ? matchesStatus && project.userId === userId : matchesStatus;
        });
      },

      getProjectsByPriority: (priority, userId) => {
        const state = get();
        return state.projects.filter((project) => {
          const matchesPriority = project.priority === priority;
          return userId ? matchesPriority && project.userId === userId : matchesPriority;
        });
      },

      getProjectsByCategory: (categoryId, userId) => {
        const state = get();
        return state.projects.filter((project) => {
          const matchesCategory = project.categoryId === categoryId;
          return userId ? matchesCategory && project.userId === userId : matchesCategory;
        });
      },

      getSubprojects: (parentId) => {
        const state = get();
        return state.projects.filter((project) => project.parentId === parentId);
      },

      getOverdueProjects: (userId) => {
        const state = get();
        const now = new Date();
        return state.projects.filter((project) => {
          const isOverdue = project.dueDate && new Date(project.dueDate) < now && 
                           project.status !== ProjectStatus.COMPLETED;
          return userId ? isOverdue && project.userId === userId : isOverdue;
        });
      },

      getProjectsCompletionRate: (userId) => {
        const state = get();
        const userProjects = state.projects.filter((project) => project.userId === userId);
        if (userProjects.length === 0) return 0;
        
        const completedProjects = userProjects.filter(
          (project) => project.status === ProjectStatus.COMPLETED
        );
        return (completedProjects.length / userProjects.length) * 100;
      },

      getActiveProjectsCount: (userId) => {
        const state = get();
        return state.projects.filter((project) => {
          const isActive = project.status === ProjectStatus.ACTIVE;
          return userId ? isActive && project.userId === userId : isActive;
        }).length;
      },

      // Reset
      reset: () =>
        set({ ...initialState }, false, 'reset'),
    })),
    { name: 'project-store' }
  )
);