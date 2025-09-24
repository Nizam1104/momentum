"use client";

import React, { useState } from "react";
import { Project, Task as ProjectTask, TaskStatus as ProjectTaskStatus, Priority as ProjectPriority } from "./enums";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Edit,
  Trash2,
  Flag,
  CalendarDays,
  Info,
} from "lucide-react";
import { formatDate, getProjectStatusConfig, getPriorityConfig } from "./utils";
import { UniversalTaskList } from "@/components/tasks/UniversalTaskList";
import { Task, Priority as UniversalPriority, TaskStatus as UniversalTaskStatus } from "@/components/tasks/UniversalTaskItem";
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
  tasks: ProjectTask[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onAddTask: (newTask: Omit<ProjectTask, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateTask: (updatedTask: ProjectTask) => void;
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
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);


  const handleTaskSubmit = (
    taskData: Omit<ProjectTask, "id" | "createdAt" | "updatedAt"> | ProjectTask,
  ) => {
    if ("id" in taskData) {
      // It's an existing task
      onUpdateTask(taskData as ProjectTask);
    } else {
      // It's a new task
      onAddTask({ ...taskData, projectId: project.id });
    }
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  // Convert tasks to universal format
  const universalTasks: Task[] = tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    status: task.status as UniversalTaskStatus,
    priority: task.priority as UniversalPriority,
    dueDate: task.dueDate || undefined,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    projectId: task.projectId,
    completedAt: task.completedAt || undefined,
  }));

  const handleCreateTask = async (newTask: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    onAddTask({
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority as ProjectPriority,
      status: newTask.status as ProjectTaskStatus,
      dueDate: newTask.dueDate,
      projectId: project.id,
      completedAt: newTask.completedAt,
    });
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    const existingTask = tasks.find(t => t.id === taskId);
    if (!existingTask) return;

    onUpdateTask({
      ...existingTask,
      title: updates.title || existingTask.title,
      description: updates.description || existingTask.description,
      priority: updates.priority as ProjectPriority || existingTask.priority,
      status: updates.status as ProjectTaskStatus || existingTask.status,
      dueDate: updates.dueDate || existingTask.dueDate,
      completedAt: updates.completedAt || existingTask.completedAt,
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    onDeleteTask(taskId, project.id);
  };

  const handleToggleTask = async (taskId: string, currentStatus: UniversalTaskStatus) => {
    const existingTask = tasks.find(t => t.id === taskId);
    if (!existingTask) return;

    const newStatus = currentStatus === UniversalTaskStatus.COMPLETED
      ? ProjectTaskStatus.TODO
      : ProjectTaskStatus.COMPLETED;

    onUpdateTask({
      ...existingTask,
      status: newStatus,
      completedAt: newStatus === ProjectTaskStatus.COMPLETED ? new Date() : null,
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Progress</span>
              <span className="font-semibold">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
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
            initialData={editingTask}
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