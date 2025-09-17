"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PlusCircle,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Trash2,
  Edit,
} from "lucide-react";
import { useDayStore } from "@/stores/day";
import { TaskStatus, Priority } from "@/actions/clientActions/types";

const priorityConfig = {
  [Priority.LOW]: {
    label: "Low",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: Circle,
  },
  [Priority.MEDIUM]: {
    label: "Medium",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: Clock,
  },
  [Priority.HIGH]: {
    label: "High",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    icon: AlertTriangle,
  },
  [Priority.URGENT]: {
    label: "Urgent",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: AlertTriangle,
  },
};

interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
}

export default function DayTasks() {
  const {
    selectedDay,
    tasks,
    tasksLoading,
    tasksError,
    createTaskAsync,
    updateTaskAsync,
    deleteTaskAsync,
    updateTaskStatusAsync,
  } = useDayStore();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: Priority.MEDIUM,
  });

  const completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.COMPLETED,
  );
  const pendingTasks = tasks.filter(
    (task) => task.status !== TaskStatus.COMPLETED,
  );

  const handleCreateTask = async () => {
    if (!selectedDay || !formData.title.trim()) return;

    await createTaskAsync(selectedDay.id, {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
    });

    setFormData({
      title: "",
      description: "",
      priority: Priority.MEDIUM,
    });
    setShowCreateDialog(false);
  };

  const handleUpdateTask = async (
    taskId: string,
    updates: Partial<TaskFormData>,
  ) => {
    await updateTaskAsync(taskId, updates);
    setEditingTask(null);
  };

  const handleToggleTaskStatus = async (
    taskId: string,
    currentStatus: TaskStatus,
  ) => {
    const newStatus =
      currentStatus === TaskStatus.COMPLETED
        ? TaskStatus.TODO
        : TaskStatus.COMPLETED;
    await updateTaskStatusAsync(taskId, newStatus);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskAsync(taskId);
  };

  if (tasksLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tasksError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading tasks</AlertTitle>
        <AlertDescription>{tasksError}</AlertDescription>
      </Alert>
    );
  }

  if (!selectedDay) {
    return (
      <Alert>
        <AlertTitle>No Day Selected</AlertTitle>
        <AlertDescription>
          Please select a day to view and manage tasks.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">Today's Tasks</CardTitle>
          <CardDescription>
            {pendingTasks.length} pending, {completedTasks.length} completed
          </CardDescription>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task for today.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Task title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Task description (optional)"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: value as Priority,
                    }))
                  }
                >
                  <SelectTrigger>
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
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTask}
                disabled={!formData.title.trim()}
              >
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <Alert>
            <AlertTitle>No tasks yet</AlertTitle>
            <AlertDescription>
              Click "Add Task" to create your first task for today.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Pending
                </h4>
                {pendingTasks.map((task, index) => (
                  <TaskItem
                    key={`task.id-${index}`}
                    task={task}
                    onToggle={handleToggleTaskStatus}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    isEditing={editingTask === task.id}
                    setEditing={setEditingTask}
                  />
                ))}
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Completed
                </h4>
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTaskStatus}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    isEditing={editingTask === task.id}
                    setEditing={setEditingTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
  };
  onToggle: (taskId: string, currentStatus: TaskStatus) => void;
  onUpdate: (taskId: string, updates: Partial<TaskFormData>) => void;
  onDelete: (taskId: string) => void;
  isEditing: boolean;
  setEditing: (taskId: string | null) => void;
}

function TaskItem({
  task,
  onToggle,
  onUpdate,
  onDelete,
  isEditing,
  setEditing,
}: TaskItemProps) {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || "",
  );
  const [editPriority, setEditPriority] = useState(task.priority);

  const isCompleted = task.status === TaskStatus.COMPLETED;
  const IconComponent = isCompleted ? CheckCircle2 : Circle;
  const PriorityIcon = priorityConfig[task.priority].icon;

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
    });
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);
    setEditing(null);
  };

  if (isEditing) {
    return (
      <div className="flex items-start space-x-3 p-3  rounded-lg">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={() => onToggle(task.id, task.status)}
          className="mt-1"
        />
        <div className="flex-1 space-y-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Task description (optional)"
          />
          <Select
            value={editPriority}
            onValueChange={(value) => setEditPriority(value as Priority)}
          >
            <SelectTrigger>
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
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={!editTitle.trim()}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start space-x-3 p-3  rounded-lg transition-opacity ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={() => onToggle(task.id, task.status)}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-medium ${isCompleted ? "line-through" : ""}`}>
            {task.title}
          </h4>
          <Badge
            variant="secondary"
            className={priorityConfig[task.priority].color}
          >
            <PriorityIcon className="h-3 w-3 mr-1" />
            {priorityConfig[task.priority].label}
          </Badge>
        </div>
        {task.description && (
          <p
            className={`text-sm text-muted-foreground ${isCompleted ? "line-through" : ""}`}
          >
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditing(task.id)}
            className="h-6 px-2"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(task.id)}
            className="h-6 px-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
