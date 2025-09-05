// components/project-management/TaskItem.tsx
"use client";

import React from "react";
import { Task, TaskStatus } from "./enums";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Edit,
  Trash2,
  CalendarDays,
  Flag,
  CheckCircle,
  Hourglass,
  XCircle,
  ListTodo,
} from "lucide-react";
import { formatDate, getPriorityConfig, getTaskStatusConfig } from "./utils";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onUpdate,
  onDelete,
  onEdit,
}) => {
  const handleToggleComplete = (checked: boolean) => {
    onUpdate({
      ...task,
      status: checked ? TaskStatus.COMPLETED : TaskStatus.TODO,
      completedAt: checked ? new Date() : null,
    });
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case TaskStatus.IN_PROGRESS:
        return <Hourglass className="h-4 w-4 text-yellow-500" />;
      case TaskStatus.CANCELLED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <ListTodo className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="grid grid-cols-9 items-center px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
      <div className="flex-1 grid gap-2 items-start w-full px-4 col-span-8">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.status === TaskStatus.COMPLETED}
            onCheckedChange={handleToggleComplete}
            className="mr-4 h-5 w-5 border border-gray-600"
          />
          <div className="flex flex-col gap-y-2">
            <label
              htmlFor={`task-${task.id}`}
              className={cn(
                "text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                task.status === TaskStatus.COMPLETED &&
                  "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </label>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {task.description}
              </p>
            )}
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Flag className="h-3 w-3" />
                {getPriorityConfig(task.priority).text}
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(task.status)}
                {getTaskStatusConfig(task.status).text}
              </div>
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-4">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit(task)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(task.id)}
            className="text-red-600 dark:text-red-400"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};
