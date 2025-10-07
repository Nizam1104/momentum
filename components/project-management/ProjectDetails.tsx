"use client";

import React, { useState } from "react";
import { Project as BaseProject, Task as BaseTask, TaskStatus as BaseTaskStatus, Priority as BasePriority } from "@/types/states";
import { Task, TaskStatus, Priority } from "./enums";

// Extended Project interface with progress
interface Project extends BaseProject {
  progress: number;
}

// Type mapping between BaseTask and Task interfaces
const mapToTaskInterface = (baseTask: BaseTask): UniversalTask => ({
  id: baseTask.id,
  title: baseTask.title,
  description: baseTask.description || undefined,
  status: baseTask.status as UniversalTaskStatus,
  priority: baseTask.priority as UniversalPriority,
  dueDate: baseTask.dueDate || undefined,
  createdAt: baseTask.createdAt,
  updatedAt: baseTask.updatedAt || undefined,
  projectId: baseTask.projectId || undefined,
});


const convertBaseTaskToTaskForm = (baseTask: BaseTask): Task => ({
  id: baseTask.id,
  title: baseTask.title,
  description: baseTask.description || undefined,
  status: baseTask.status as TaskStatus,
  priority: baseTask.priority as Priority,
  dueDate: baseTask.dueDate || undefined,
  userId: baseTask.userId,
  projectId: baseTask.projectId || undefined,
  categoryId: baseTask.categoryId || undefined,
  parentId: baseTask.parentId || undefined,
  createdAt: baseTask.createdAt,
  updatedAt: baseTask.updatedAt || new Date(),
});
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Edit,
  Trash2,
  Flag,
  CalendarDays,
  Info,
} from "lucide-react";
import { formatDate, getProjectStatusConfig, getPriorityConfig } from "./utils";
import { UniversalTaskList } from "@/components/tasks/UniversalTaskList";
import { Task as UniversalTask, Priority as UniversalPriority, TaskStatus as UniversalTaskStatus } from "@/components/tasks/UniversalTaskItem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskForm } from "./TaskForm";

interface ProjectDetailsProps {
  project: Project;
  tasks: BaseTask[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onAddTask: (newTask: Omit<BaseTask, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateTask: (updatedTask: BaseTask) => void;
  onDeleteTask: (taskId: string, projectId: string) => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  tasks,
  onEditProject,
  onDeleteProject,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<BaseTask | null>(null);

  const handleTaskSubmit = (
    taskData: Omit<Task, "createdAt" | "updatedAt"> | Task,
  ) => {
    if ("id" in taskData) {
      // It's an existing task - convert back to BaseTask interface
      const taskWithId = taskData as Task;
      const baseTaskData: BaseTask = {
        id: taskWithId.id,
        title: taskWithId.title,
        description: taskWithId.description || null,
        status: taskWithId.status as BaseTaskStatus,
        priority: taskWithId.priority as BasePriority,
        dueDate: taskWithId.dueDate || null,
        userId: project.userId,
        projectId: taskWithId.projectId || project.id,
        categoryId: taskWithId.categoryId || null,
        parentId: taskWithId.parentId || null,
        createdAt: taskWithId.createdAt,
        updatedAt: new Date(),
      };
      onUpdateTask(baseTaskData);
    } else {
      // It's a new task - convert to BaseTask interface
      const taskWithoutId = taskData as Omit<Task, "createdAt" | "updatedAt">;
      const newBaseTask: Omit<BaseTask, "id" | "createdAt" | "updatedAt"> = {
        title: taskWithoutId.title,
        description: taskWithoutId.description || null,
        status: taskWithoutId.status as BaseTaskStatus,
        priority: taskWithoutId.priority as BasePriority,
        dueDate: taskWithoutId.dueDate || null,
        userId: project.userId,
        projectId: project.id,
        categoryId: taskWithoutId.categoryId || null,
        parentId: taskWithoutId.parentId || null,
      };
      onAddTask(newBaseTask);
    }
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  
  // Convert tasks to universal format
  const universalTasks: UniversalTask[] = tasks.map(task => mapToTaskInterface(task));

  const handleCreateTask = (newTask: Omit<UniversalTask, "id" | "createdAt" | "updatedAt">) => {
    const baseTask: Omit<BaseTask, "id" | "createdAt" | "updatedAt"> = {
      title: newTask.title,
      description: newTask.description || null,
      priority: newTask.priority as BasePriority,
      status: newTask.status as BaseTaskStatus,
      dueDate: newTask.dueDate || null,
      projectId: project.id,
      userId: project.userId,
      categoryId: null,
      parentId: null,
    };
    onAddTask(baseTask);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<UniversalTask>) => {
    const existingTask = tasks.find(t => t.id === taskId);
    if (!existingTask) return;

    const updatedBaseTask: BaseTask = {
      ...existingTask,
      title: updates.title || existingTask.title,
      description: updates.description !== undefined ? (updates.description || null) : existingTask.description,
      priority: (updates.priority as BasePriority) || existingTask.priority,
      status: (updates.status as BaseTaskStatus) || existingTask.status,
      dueDate: updates.dueDate !== undefined ? (updates.dueDate || null) : existingTask.dueDate,
      updatedAt: new Date(),
    };
    onUpdateTask(updatedBaseTask);
  };

  const handleDeleteTask = (taskId: string) => {
    onDeleteTask(taskId, project.id);
  };

  const handleToggleTask = (taskId: string, currentStatus: UniversalTaskStatus) => {
    const existingTask = tasks.find(t => t.id === taskId);
    if (!existingTask) return;

    const newStatus = currentStatus === UniversalTaskStatus.COMPLETED
      ? BaseTaskStatus.TODO
      : BaseTaskStatus.COMPLETED;

    onUpdateTask({
      ...existingTask,
      status: newStatus,
      updatedAt: new Date(),
    });
  };

  return (
    <ScrollArea className="h-full pr-4">
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }} />
              <div>
                <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
                {project.description && (
                  <CardDescription className="mt-1">{project.description}</CardDescription>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEditProject(project)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDeleteProject(project.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Flag className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Priority:</span>
              <span>{getPriorityConfig(project.priority).text}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Status:</span>
              <span>{getProjectStatusConfig(project.status).text}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Start:</span>
              <span>{formatDate(project.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Due:</span>
              <span>{formatDate(project.dueDate)}</span>
            </div>
          </div>
          </CardContent>
      </Card>

      <UniversalTaskList
        tasks={universalTasks}
        title="Project Tasks"
        showAddButton={true}
        showSearch={true}
        showFilters={true}
        groupBy="status"
        sortBy="priority"
        variant="compact"
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onToggleTask={handleToggleTask}
        className="mb-6"
      />

      <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
          </DialogHeader>
          <TaskForm
            initialData={editingTask ? convertBaseTaskToTaskForm(editingTask) : null}
            projectId={project.id}
            onSubmit={handleTaskSubmit}
            onCancel={() => {
              setIsTaskFormOpen(false);
              setEditingTask(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
};