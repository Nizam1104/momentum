"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  GripVertical,
  Star,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";

// Type definitions
export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

// Create enum-like objects for runtime use
export const TaskStatus = {
  TODO: "TODO" as const,
  IN_PROGRESS: "IN_PROGRESS" as const,
  COMPLETED: "COMPLETED" as const,
  CANCELLED: "CANCELLED" as const,
};

export const Priority = {
  LOW: "LOW" as const,
  MEDIUM: "MEDIUM" as const,
  HIGH: "HIGH" as const,
  URGENT: "URGENT" as const,
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  projectId?: string;
  completedAt?: Date | null;
}

// Priority configuration
const priorityConfig = {
  LOW: {
    label: "Low",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: Circle,
  },
  MEDIUM: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: Clock,
  },
  HIGH: {
    label: "High",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    icon: AlertTriangle,
  },
  URGENT: {
    label: "Urgent",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: AlertTriangle,
  },
};

// Status configuration
const statusConfig = {
  TODO: {
    label: "To Do",
    icon: Circle,
    color: "text-muted-foreground",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: Clock,
    color: "text-yellow-500",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: Circle,
    color: "text-red-500",
  },
};

// Component interfaces
export interface TaskItemProps {
  task: Task;
  variant?: "compact" | "detailed" | "minimal";
  showProject?: boolean;
  showDueDate?: boolean;
  showStatus?: boolean;
  draggable?: boolean;
  editable?: boolean;
  deletable?: boolean;
  onToggle?: (taskId: string, currentStatus: TaskStatus) => void;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  className?: string;
}

export const UniversalTaskItem: React.FC<TaskItemProps> = ({
  task,
  variant = "detailed",
  // showProject = false,
  showDueDate = true,
  showStatus = true,
  draggable = false,
  editable = true,
  deletable = true,
  onToggle,
  onUpdate,
  onDelete,
  onEdit,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editStatus, setEditStatus] = useState(task.status);

  const isCompleted = task.status === "COMPLETED";
  const PriorityIcon = priorityConfig[task.priority].icon;
  const StatusIcon = statusConfig[task.status].icon;

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        status: editStatus,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);
    setEditStatus(task.status);
    setIsEditing(false);
  };

  const handleToggle = () => {
    if (onToggle) {
      onToggle(task.id, task.status);
    }
  };

  // Format date
  const formatDate = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Minimal variant (like the days/items/TaskItem)
  if (variant === "minimal") {
    return (
      <TooltipProvider delayDuration={100}>
        <div className={cn(
          "flex items-center gap-2 p-2 -ml-2 rounded-md hover:bg-accent/50 transition-colors group",
          className
        )}>
          {draggable && <GripVertical className="h-4 w-4 text-muted-foreground/60 cursor-grab hover:text-muted-foreground/80 transition-colors" />}
          <Checkbox
            id={task.id}
            checked={isCompleted}
            onCheckedChange={handleToggle}
            className="rounded-[4px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label
            htmlFor={task.id}
            className={cn(
              "flex-1 text-sm font-medium leading-none cursor-pointer select-none transition-colors",
              isCompleted && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 rounded opacity-60 hover:opacity-100 transition-all duration-200",
                  task.priority === Priority.HIGH && "opacity-100 hover:scale-110"
                )}
              >
                <Star className={cn(
                  "h-3.5 w-3.5 transition-all duration-200",
                  task.priority === Priority.HIGH ? "text-amber-500 fill-amber-500" : "text-muted-foreground",
                  task.priority === Priority.URGENT && "text-red-500 fill-red-500"
                )} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              <p>Priority: {priorityConfig[task.priority].label}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border hover:shadow-md transition-all duration-200 bg-card hover:bg-card/95 group",
        isCompleted && "opacity-70",
        className
      )}>
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleToggle}
          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className={cn(
              "font-medium text-sm leading-tight truncate transition-colors",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h4>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                priorityConfig[task.priority].color
              )}
            >
              <PriorityIcon className="h-3 w-3 mr-1" />
              {priorityConfig[task.priority].label}
            </Badge>
          </div>
          {task.description && (
            <p className={cn(
              "text-xs text-muted-foreground leading-relaxed line-clamp-2",
              isCompleted && "line-through"
            )}>
              {task.description}
            </p>
          )}
          {(showDueDate && task.dueDate) && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              <span className="font-medium">{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
        {(editable || deletable) && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {editable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(task)}
                className="h-7 w-7 p-0 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            )}
            {deletable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(task.id)}
                className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Detailed variant (with inline editing)
  if (isEditing) {
    return (
      <div className={cn(
        "flex items-start space-x-3 p-4 rounded-lg border border-border/60 bg-card",
        className
      )}>
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleToggle}
          className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <div className="flex-1 space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            className="text-sm"
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Task description (optional)"
            rows={2}
            className="text-sm resize-none"
          />
          <div className="flex gap-2">
            <Select value={editPriority} onValueChange={(value: Priority) => setEditPriority(value)}>
              <SelectTrigger className="flex-1 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Priority).map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priorityConfig[priority].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={editStatus} onValueChange={(value: TaskStatus) => setEditStatus(value)}>
              <SelectTrigger className="flex-1 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TaskStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusConfig[status].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleSave} disabled={!editTitle.trim()} className="text-xs">
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="text-xs">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-4 rounded-lg border border-border/50 bg-card hover:border-border/80 hover:shadow-sm transition-all duration-200 group",
        isCompleted && "opacity-70",
        className
      )}
    >

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 mb-1 justify-between">
          <div className="flex space-x-2 items-center">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleToggle}
              className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <h4 className={cn(
              "font-medium text-base leading-tight transition-colors",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h4>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0",
                priorityConfig[task.priority].color
              )}
            >
              <PriorityIcon className="h-3 w-3 mr-1" />
              {priorityConfig[task.priority].label}
            </Badge>
            {showStatus && (
              <Badge variant="outline" className="text-xs px-2.5 py-0.5 rounded-full">
                <StatusIcon className={cn("h-3 w-3 mr-1", statusConfig[task.status].color)} />
                {statusConfig[task.status].label}
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            {editable && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-7 px-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            )}
            {deletable && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete?.(task.id)}
                className="h-7 px-2 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
        {task.description && (
          <p className={cn(
            "text-sm text-muted-foreground leading-relaxed",
            isCompleted && "line-through"
          )}>
            {task.description}
          </p>
        )}
        {(showDueDate && task.dueDate) && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <span className="font-medium">{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
