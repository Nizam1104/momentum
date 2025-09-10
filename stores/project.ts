import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import {
  Project,
  ProjectStatus,
  Priority,
  getAllProjects,
  createProject,
  updateProject as updateProjectAction,
  deleteProject,
  updateProjectProgress as updateProjectProgressAction,
} from "@/actions/clientActions";

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
  initialLoading: boolean; // Only for initial data fetch
  error: string | null;

  // Non-blocking operation states
  isCreating: boolean;
  isUpdating: Record<string, boolean>; // Track individual item updates
  isDeleting: Record<string, boolean>; // Track individual item deletions
  isProgressUpdating: Record<string, boolean>; // Track individual progress updates

  // Actions
  setProjects: (projects: Project[]) => void;
  setSelectedProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  removeProject: (projectId: string) => void;
  updateProjectProgress: (projectId: string, progress: number) => void;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;

  // Async Actions with Supabase
  fetchProjects: (userId: string) => Promise<void>;
  createProjectAsync: (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "progress">,
  ) => Promise<void>;
  updateProjectAsync: (
    projectId: string,
    updates: Partial<
      Omit<Project, "id" | "createdAt" | "updatedAt" | "userId">
    >,
  ) => Promise<void>;
  deleteProjectAsync: (projectId: string) => Promise<void>;
  updateProjectProgressAsync: (
    projectId: string,
    progress: number,
  ) => Promise<void>;
  setFilters: (filters: Partial<ProjectState["filters"]>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  setInitialLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Operation state setters
  setCreating: (isCreating: boolean) => void;
  setItemUpdating: (projectId: string, isUpdating: boolean) => void;
  setItemDeleting: (projectId: string, isDeleting: boolean) => void;
  setProgressUpdating: (projectId: string, isUpdating: boolean) => void;

  // Helper getters for operation states
  isItemBeingUpdated: (projectId: string) => boolean;
  isItemBeingDeleted: (projectId: string) => boolean;
  isProgressBeingUpdated: (projectId: string) => boolean;

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
  initialLoading: false,
  error: null,
  isCreating: false,
  isUpdating: {},
  isDeleting: {},
  isProgressUpdating: {},
};

export const useProjectStore = create<ProjectState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // Helper getters for operation states
      isItemBeingUpdated: (projectId) => get().isUpdating[projectId] || false,
      isItemBeingDeleted: (projectId) => get().isDeleting[projectId] || false,
      isProgressBeingUpdated: (projectId) =>
        get().isProgressUpdating[projectId] || false,

      // Actions
      setProjects: (projects) => set({ projects }, false, "setProjects"),

      setSelectedProject: (selectedProject) =>
        set({ selectedProject }, false, "setSelectedProject"),

      addProject: (project) =>
        set(
          (state) => ({
            projects: [...state.projects, project],
          }),
          false,
          "addProject",
        ),

      updateProject: (projectId, updates) =>
        set(
          (state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId ? { ...project, ...updates } : project,
            ),
            selectedProject:
              state.selectedProject?.id === projectId
                ? { ...state.selectedProject, ...updates }
                : state.selectedProject,
          }),
          false,
          "updateProject",
        ),

      removeProject: (projectId) =>
        set(
          (state) => ({
            projects: state.projects.filter(
              (project) => project.id !== projectId,
            ),
            selectedProject:
              state.selectedProject?.id === projectId
                ? null
                : state.selectedProject,
          }),
          false,
          "removeProject",
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
                    status:
                      progress === 100
                        ? ProjectStatus.COMPLETED
                        : project.status,
                  }
                : project,
            ),
            selectedProject:
              state.selectedProject?.id === projectId
                ? {
                    ...state.selectedProject,
                    progress,
                    completedAt: progress === 100 ? new Date() : undefined,
                    status:
                      progress === 100
                        ? ProjectStatus.COMPLETED
                        : state.selectedProject.status,
                  }
                : state.selectedProject,
          }),
          false,
          "updateProjectProgress",
        ),

      updateProjectStatus: (projectId, status) =>
        set(
          (state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    status,
                    completedAt:
                      status === ProjectStatus.COMPLETED
                        ? new Date()
                        : undefined,
                    progress:
                      status === ProjectStatus.COMPLETED
                        ? 100
                        : project.progress,
                  }
                : project,
            ),
            selectedProject:
              state.selectedProject?.id === projectId
                ? {
                    ...state.selectedProject,
                    status,
                    completedAt:
                      status === ProjectStatus.COMPLETED
                        ? new Date()
                        : undefined,
                    progress:
                      status === ProjectStatus.COMPLETED
                        ? 100
                        : state.selectedProject.progress,
                  }
                : state.selectedProject,
          }),
          false,
          "updateProjectStatus",
        ),

      setFilters: (filters) =>
        set(
          (state) => ({ filters: { ...state.filters, ...filters } }),
          false,
          "setFilters",
        ),

      clearFilters: () => set({ filters: {} }, false, "clearFilters"),

      applyFilters: () => {
        const state = get();
        let filtered = [...state.projects];

        if (state.filters.status) {
          filtered = filtered.filter(
            (project) => project.status === state.filters.status,
          );
        }

        if (state.filters.priority) {
          filtered = filtered.filter(
            (project) => project.priority === state.filters.priority,
          );
        }

        if (state.filters.categoryId) {
          filtered = filtered.filter(
            (project) => project.categoryId === state.filters.categoryId,
          );
        }

        if (state.filters.searchTerm) {
          const searchTerm = state.filters.searchTerm.toLowerCase();
          filtered = filtered.filter(
            (project) =>
              project.name.toLowerCase().includes(searchTerm) ||
              project.description?.toLowerCase().includes(searchTerm),
          );
        }

        set({ filteredProjects: filtered }, false, "applyFilters");
      },

      setInitialLoading: (initialLoading) =>
        set({ initialLoading }, false, "setInitialLoading"),

      setError: (error) => set({ error }, false, "setError"),

      // Operation state setters
      setCreating: (isCreating) => set({ isCreating }),

      setItemUpdating: (projectId, isUpdating) =>
        set((state) => ({
          isUpdating: isUpdating
            ? { ...state.isUpdating, [projectId]: true }
            : { ...state.isUpdating, [projectId]: false },
        })),

      setItemDeleting: (projectId, isDeleting) =>
        set((state) => ({
          isDeleting: isDeleting
            ? { ...state.isDeleting, [projectId]: true }
            : { ...state.isDeleting, [projectId]: false },
        })),

      setProgressUpdating: (projectId, isUpdating) =>
        set((state) => ({
          isProgressUpdating: isUpdating
            ? { ...state.isProgressUpdating, [projectId]: true }
            : { ...state.isProgressUpdating, [projectId]: false },
        })),

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
          return userId
            ? matchesStatus && project.userId === userId
            : matchesStatus;
        });
      },

      getProjectsByPriority: (priority, userId) => {
        const state = get();
        return state.projects.filter((project) => {
          const matchesPriority = project.priority === priority;
          return userId
            ? matchesPriority && project.userId === userId
            : matchesPriority;
        });
      },

      getProjectsByCategory: (categoryId, userId) => {
        const state = get();
        return state.projects.filter((project) => {
          const matchesCategory = project.categoryId === categoryId;
          return userId
            ? matchesCategory && project.userId === userId
            : matchesCategory;
        });
      },

      getSubprojects: (parentId) => {
        const state = get();
        return state.projects.filter(
          (project) => project.parentId === parentId,
        );
      },

      getOverdueProjects: (userId) => {
        const state = get();
        const now = new Date();
        return state.projects.filter((project) => {
          const isOverdue =
            project.dueDate &&
            new Date(project.dueDate) < now &&
            project.status !== ProjectStatus.COMPLETED;
          return userId ? isOverdue && project.userId === userId : isOverdue;
        });
      },

      getProjectsCompletionRate: (userId) => {
        const state = get();
        const userProjects = state.projects.filter(
          (project) => project.userId === userId,
        );
        if (userProjects.length === 0) return 0;

        const completedProjects = userProjects.filter(
          (project) => project.status === ProjectStatus.COMPLETED,
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

      // Async Actions with Supabase
      fetchProjects: async (userId: string) => {
        set(
          { initialLoading: true, error: null },
          false,
          "fetchProjects:start",
        );
        try {
          const result = await getAllProjects(userId);
          if (result.success && result.data) {
            set(
              { projects: result.data, initialLoading: false },
              false,
              "fetchProjects:success",
            );
            get().applyFilters();
          } else {
            set(
              {
                error: result.error || "Failed to fetch projects",
                initialLoading: false,
              },
              false,
              "fetchProjects:error",
            );
          }
        } catch (error) {
          set(
            { error: "Failed to fetch projects", initialLoading: false },
            false,
            "fetchProjects:error",
          );
        }
      },

      createProjectAsync: async (projectData) => {
        get().setCreating(true);
        set({ error: null }, false, "createProject:start");
        try {
          const result = await createProject(projectData);
          if (result.success && result.data) {
            get().addProject(result.data);
            get().applyFilters();
          } else {
            set(
              { error: result.error || "Failed to create project" },
              false,
              "createProject:error",
            );
          }
        } catch (error) {
          set(
            { error: "Failed to create project" },
            false,
            "createProject:error",
          );
        } finally {
          get().setCreating(false);
        }
      },

      updateProjectAsync: async (projectId, updates) => {
        get().setItemUpdating(projectId, true);
        set({ error: null }, false, "updateProject:start");
        try {
          const result = await updateProjectAction(projectId, updates);
          if (result.success && result.data) {
            get().updateProject(projectId, result.data);
            get().applyFilters();
          } else {
            set(
              { error: result.error || "Failed to update project" },
              false,
              "updateProject:error",
            );
          }
        } catch (error) {
          set(
            { error: "Failed to update project" },
            false,
            "updateProject:error",
          );
        } finally {
          get().setItemUpdating(projectId, false);
        }
      },

      deleteProjectAsync: async (projectId) => {
        get().setItemDeleting(projectId, true);
        set({ error: null }, false, "deleteProject:start");
        try {
          const result = await deleteProject(projectId);
          if (result.success) {
            get().removeProject(projectId);
            get().applyFilters();
          } else {
            set(
              { error: result.error || "Failed to delete project" },
              false,
              "deleteProject:error",
            );
          }
        } catch (error) {
          set(
            { error: "Failed to delete project" },
            false,
            "deleteProject:error",
          );
        } finally {
          get().setItemDeleting(projectId, false);
        }
      },

      updateProjectProgressAsync: async (projectId, progress) => {
        get().setProgressUpdating(projectId, true);
        set({ error: null }, false, "updateProjectProgress:start");
        try {
          const result = await updateProjectProgressAction(projectId, progress);
          if (result.success && result.data) {
            get().updateProject(projectId, result.data);
            get().applyFilters();
          } else {
            set(
              { error: result.error || "Failed to update project progress" },
              false,
              "updateProjectProgress:error",
            );
          }
        } catch (error) {
          set(
            { error: "Failed to update project progress" },
            false,
            "updateProjectProgress:error",
          );
        } finally {
          get().setProgressUpdating(projectId, false);
        }
      },

      // Reset
      reset: () => set({ ...initialState }, false, "reset"),
    })),
    { name: "project-store" },
  ),
);
