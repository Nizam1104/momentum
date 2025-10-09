// components/project-management/ProjectManagement.tsx
"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProjectStore } from "@/stores/project";
import { useTaskStore } from "@/stores/task";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetails } from "./ProjectDetails";
import { ProjectForm } from "./ProjectForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PlusCircle,
  LayoutGrid,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import {
  TaskStatus,
} from "@/types/states";
import type {
  Project as BaseProject,
  Task,
} from "@/types/states";

// Extended Project interface with progress
interface Project extends BaseProject {
  progress: number;
}

export default function ProjectManagement() {
  const { data: session } = useSession();

  // Store selectors
  const {
    projects,
    initialLoading: projectLoading,
    error: projectError,
    fetchProjects,
    createProjectAsync,
    updateProjectAsync,
    deleteProjectAsync,
  } = useProjectStore();

  const {
    tasks,
    initialLoading: taskLoading,
    error: taskError,
    fetchTasksByProject,
    createTaskAsync,
    updateTaskAsync,
    deleteTaskAsync,
  } = useTaskStore();

  // Local state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch projects when component mounts and user is available
  useEffect(() => {
    if (session?.user?.id && isClient) {
      fetchProjects(session.user.id);
    }
  }, [session?.user?.id, isClient, fetchProjects]);

  // Fetch tasks when a project is selected
  useEffect(() => {
    if (selectedProjectId) {
      fetchTasksByProject(selectedProjectId);
    }
  }, [selectedProjectId, fetchTasksByProject]);

  const selectedProjectTasks = useMemo(() => {
    return tasks.filter((task) => task.projectId === selectedProjectId).map(task => ({
      ...task,
      projectId: task.projectId || '',
      description: task.description || undefined,
      dueDate: task.dueDate || undefined,
      categoryId: task.categoryId || undefined,
      parentId: task.parentId || undefined,
    }));
  }, [selectedProjectId, tasks]);

  // Calculate project progress
  const projectsWithProgress = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = tasks.filter(
        (task) => task.projectId === project.id,
      );
      const completedTasks = projectTasks.filter(
        (task) => task.status === TaskStatus.COMPLETED,
      );
      const progress =
        projectTasks.length > 0
          ? (completedTasks.length / projectTasks.length) * 100
          : 0;

      return {
        ...project,
        progress: Math.round(progress),
      };
    });
  }, [projects, tasks]);

  const currentSelectedProject = useMemo(() => {
    return projectsWithProgress.find((p) => p.id === selectedProjectId);
  }, [selectedProjectId, projectsWithProgress]);

  // Project Handlers
  const handleCreateProject = useCallback(
    async (
      newProjectData: Omit<
        Project,
        "id" | "createdAt" | "updatedAt" | "progress"
      >,
    ) => {
      if (session?.user?.id) {
        await createProjectAsync({
          ...newProjectData,
          description: newProjectData.description || undefined,
          startDate: newProjectData.startDate || undefined,
          dueDate: newProjectData.dueDate || undefined,
          completedAt: newProjectData.completedAt || undefined,
          categoryId: newProjectData.categoryId || undefined,
          parentId: newProjectData.parentId || undefined,
          userId: session.user.id,
        });
        setIsProjectFormOpen(false);
      }
    },
    [session?.user?.id, createProjectAsync],
  );

  const handleUpdateProject = useCallback(
    async (updatedProject: Project) => {
      await updateProjectAsync(updatedProject.id, {
        ...updatedProject,
        description: updatedProject.description || undefined,
        startDate: updatedProject.startDate || undefined,
        dueDate: updatedProject.dueDate || undefined,
        completedAt: updatedProject.completedAt || undefined,
        categoryId: updatedProject.categoryId || undefined,
        parentId: updatedProject.parentId || undefined,
      });
      setIsProjectFormOpen(false);
      setEditingProject(null);
    },
    [updateProjectAsync],
  );

  const handleDeleteProject = useCallback(
    async (projectId: string) => {
      if (
        window.confirm(
          "Are you sure you want to delete this project and all its tasks?",
        )
      ) {
        await deleteProjectAsync(projectId);
        if (selectedProjectId === projectId) {
          setSelectedProjectId(null);
        }
      }
    },
    [selectedProjectId, deleteProjectAsync],
  );

  const handleEditProjectClick = useCallback((project: Project) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  }, []);

  const handleProjectSelect = useCallback(
    (projectId: string) => {
      setSelectedProjectId(projectId);
    },
    [],
  );

  // Task Handlers
  const handleAddTask = useCallback(
    async (newTaskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      await createTaskAsync({
        ...newTaskData,
        description: newTaskData.description || undefined,
        dueDate: newTaskData.dueDate || undefined,
        completedAt: newTaskData.completedAt || undefined,
        categoryId: newTaskData.categoryId || undefined,
        parentId: newTaskData.parentId || undefined,
        projectId: newTaskData.projectId || undefined,
        dayId: newTaskData.dayId || undefined,
      });
    },
    [createTaskAsync],
  );

  const handleUpdateTask = useCallback(
    async (updatedTask: Task) => {
      await updateTaskAsync(updatedTask.id, {
        ...updatedTask,
        description: updatedTask.description || undefined,
        dueDate: updatedTask.dueDate || undefined,
        completedAt: updatedTask.completedAt || undefined,
        categoryId: updatedTask.categoryId || undefined,
        parentId: updatedTask.parentId || undefined,
        projectId: updatedTask.projectId || undefined,
        dayId: updatedTask.dayId || undefined,
      });
    },
    [updateTaskAsync],
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        await deleteTaskAsync(taskId);
      }
    },
    [deleteTaskAsync],
  );

  const isLoading = projectLoading || taskLoading;
  const hasError = projectError || taskError;

  if (!isClient) {
    return (
      <div className="flex h-full">
        <div className="w-1/3 p-6 -r flex flex-col">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {hasError && (
        <Alert className="absolute top-4 right-4 w-auto z-50" variant="destructive">
          <AlertDescription>{projectError || taskError}</AlertDescription>
        </Alert>
      )}

      {/* Left Sidebar: Project List */}
      <div className={`${isSidebarOpen ? "w-1/3 p-6" : "w-16 p-4"} -r flex flex-col transition-all`}>
        <div className={`flex items-center justify-between ${isSidebarOpen ? "mb-6" : "mb-0"}`}>
          {isSidebarOpen ? (
            <>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <FolderOpen className="h-6 w-6" /> Projects
              </h1>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => {
                  setEditingProject(null);
                  setIsProjectFormOpen(true);
                }}>
                  <PlusCircle className="mr-2 h-4 w-4" /> New
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center w-full gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                <ChevronRight className="h-5 w-5" />
              </Button>
              <FolderOpen className="h-6 w-6" />
            </div>
          )}
        </div>

        {isSidebarOpen && (
          <>
            <Separator className="mb-6" />
            <ScrollArea className="flex-1">
              <div className="space-y-4">
                {isLoading && projects.length === 0 ? (
                  [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                ) : projectsWithProgress.length > 0 ? (
                  projectsWithProgress.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={handleProjectSelect}
                      onEdit={handleEditProjectClick}
                      onDelete={handleDeleteProject}
                    />
                  ))
                ) : (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Projects</AlertTitle>
                    <AlertDescription>Create your first project to get started.</AlertDescription>
                  </Alert>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 px-4 py-2  overflow-auto">
        {currentSelectedProject ? (
          <ProjectDetails
            project={currentSelectedProject}
            tasks={selectedProjectTasks}
            onEditProject={handleEditProjectClick}
            onDeleteProject={handleDeleteProject}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <LayoutGrid className="h-16 w-16 mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">Select a Project</h2>
            <p className="text-sm max-w-md">
              Choose a project from the sidebar to view details and manage tasks.
            </p>
          </div>
        )}
      </div>

      {/* Project Form Dialog */}
      <Dialog open={isProjectFormOpen} onOpenChange={setIsProjectFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Create New Project"}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            initialData={editingProject}
            onSubmit={(data) => {
              if ("id" in data) {
                handleUpdateProject(data as Project);
              } else {
                handleCreateProject(
                  data as Omit<
                    Project,
                    "id" | "createdAt" | "updatedAt" | "progress"
                  >,
                );
              }
            }}
            onCancel={() => {
              setIsProjectFormOpen(false);
              setEditingProject(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
