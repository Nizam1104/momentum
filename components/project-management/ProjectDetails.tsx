// components/project-management/ProjectDetails.tsx
"use client";

import React, { useState } from "react";
import { Project, Task, TaskStatus, Priority } from "./enums";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  PlusCircle,
  Edit,
  Trash2,
  Flag,
  CalendarDays,
  ListTodo,
  Info,
  XCircle,
  CheckCircle,
  Hourglass,
} from "lucide-react";
import { formatDate, getProjectStatusConfig, getPriorityConfig } from "./utils";
import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectDetailsProps {
  project: Project;
  tasks: Task[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onAddTask: (newTask: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateTask: (updatedTask: Task) => void;
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
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTaskClick = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> | Task,
  ) => {
    console.log("task", taskData);
    console.log("id" in taskData);
    if ("id" in taskData) {
      // It's an existing task
      onUpdateTask(taskData as Task);
    } else {
      // It's a new task
      onAddTask({ ...taskData, projectId: project.id });
    }
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const sortedTasks = tasks.sort((a, b) => {
    // Sort by status: TODO, IN_PROGRESS, COMPLETED, CANCELLED
    const statusOrder = {
      [TaskStatus.TODO]: 1,
      [TaskStatus.IN_PROGRESS]: 2,
      [TaskStatus.COMPLETED]: 3,
      [TaskStatus.CANCELLED]: 4,
    };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    // Then by priority: URGENT, HIGH, MEDIUM, LOW
    const priorityOrder = {
      [Priority.URGENT]: 1,
      [Priority.HIGH]: 2,
      [Priority.MEDIUM]: 3,
      [Priority.LOW]: 4,
    };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // Finally by due date (earlier first)
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    return 0;
  });

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

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ListTodo className="h-5 w-5" /> Tasks
        </h2>
        <Button onClick={handleAddTaskClick}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      <Separator className="mb-4" />

      <div className="space-y-2">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={() => onDeleteTask(task.id, project.id)}
              onEdit={handleEditTask}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <ListTodo className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No tasks yet. Click "Add Task" to get started!</p>
          </div>
        )}
      </div>

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
