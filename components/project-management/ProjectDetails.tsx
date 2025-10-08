"use client";

import React from "react";
import { Project as BaseProject, Task as BaseTask, TaskStatus as BaseTaskStatus, Priority as BasePriority } from "@/types/states";

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
import { ScrollArea } from "@/components/ui/scroll-area";

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

    const updatedBaseTask: BaseTask = {
      ...existingTask,
      status: newStatus,
      updatedAt: new Date(),
    };
    onUpdateTask(updatedBaseTask);
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
        variant="detailed"
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onToggleTask={handleToggleTask}
        className="mb-6"
      />
    </ScrollArea>
  );
};