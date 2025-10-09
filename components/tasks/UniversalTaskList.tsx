"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, ListTodo, Search } from "lucide-react";
import { UniversalTaskItem, Task, TaskStatus, Priority, Priority as PriorityEnum, TaskStatus as TaskStatusEnum } from "./UniversalTaskItem";

export interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  error?: string;
  title?: string;
  description?: string;
  showAddButton?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  groupBy?: "status" | "priority" | "dueDate" | "none";
  sortBy?: "priority" | "dueDate" | "createdAt" | "status";
  sortOrder?: "asc" | "desc";
  variant?: "compact" | "detailed" | "minimal";
  showProject?: boolean;
  showDueDate?: boolean;
  showStatus?: boolean;
  draggable?: boolean;
  editable?: boolean;
  deletable?: boolean;
  onCreateTask?: (newTask: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
  onToggleTask?: (taskId: string, currentStatus: TaskStatus) => void;
  className?: string;
}

export const UniversalTaskList: React.FC<TaskListProps> = ({
  tasks,
  loading = false,
  error,
  title = "Tasks",
  description,
  showAddButton = true,
  showSearch = true,
  showFilters = true,
  groupBy = "status",
  sortBy = "priority",
  sortOrder = "asc",
  // variant = "detailed",
  showProject = false,
  showDueDate = true,
  showStatus = true,
  draggable = false,
  editable = true,
  deletable = true,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
  className,
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: Priority;
    status: TaskStatus;
    dueDate: string;
  }>({
    title: "",
    description: "",
    priority: PriorityEnum.MEDIUM,
    status: TaskStatusEnum.TODO,
    dueDate: "",
  });

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case "priority":
          const priorityOrder = { [PriorityEnum.URGENT]: 1, [PriorityEnum.HIGH]: 2, [PriorityEnum.MEDIUM]: 3, [PriorityEnum.LOW]: 4 };
          compareValue = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "dueDate":
          if (a.dueDate && b.dueDate) {
            compareValue = a.dueDate.getTime() - b.dueDate.getTime();
          } else if (a.dueDate) {
            compareValue = -1;
          } else if (b.dueDate) {
            compareValue = 1;
          }
          break;
        case "status":
          const statusOrder = { [TaskStatus.TODO]: 1, [TaskStatus.IN_PROGRESS]: 2, [TaskStatus.COMPLETED]: 3, [TaskStatus.CANCELLED]: 4 };
          compareValue = statusOrder[a.status] - statusOrder[b.status];
          break;
        case "createdAt":
          const aTime = a.createdAt?.getTime() || 0;
          const bTime = b.createdAt?.getTime() || 0;
          compareValue = aTime - bTime;
          break;
      }

      return sortOrder === "asc" ? compareValue : -compareValue;
    });

  // Group tasks
  const groupedTasks = groupBy === "none"
    ? { "All Tasks": filteredTasks }
    : filteredTasks.reduce((groups, task) => {
        let groupKey: string;

        switch (groupBy) {
          case "status":
            groupKey = task.status;
            break;
          case "priority":
            groupKey = task.priority;
            break;
          case "dueDate":
            if (!task.dueDate) {
              groupKey = "No due date";
            } else {
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              const nextWeek = new Date(today);
              nextWeek.setDate(nextWeek.getDate() + 7);

              if (task.dueDate < today) {
                groupKey = "Overdue";
              } else if (task.dueDate.toDateString() === today.toDateString()) {
                groupKey = "Today";
              } else if (task.dueDate.toDateString() === tomorrow.toDateString()) {
                groupKey = "Tomorrow";
              } else if (task.dueDate <= nextWeek) {
                groupKey = "This Week";
              } else {
                groupKey = "Later";
              }
            }
            break;
          default:
            groupKey = "All Tasks";
        }

        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(task);
        return groups;
      }, {} as Record<string, Task[]>);

  // Task counts
  const completedCount = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
  const pendingCount = tasks.filter(task => task.status !== TaskStatus.COMPLETED).length;

  const handleCreateTask = () => {
    if (!formData.title.trim()) return;

    const newTask: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority as Priority,
      status: formData.status as TaskStatus,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    };

    onCreateTask?.(newTask);

    setFormData({
      title: "",
      description: "",
      priority: PriorityEnum.MEDIUM,
      status: TaskStatusEnum.TODO,
      dueDate: "",
    });
    setShowCreateDialog(false);
  };

  // Loading state
  if (loading) {
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

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading tasks</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{pendingCount} pending</span>
              <span>•</span>
              <span>{completedCount} completed</span>
            </div>
          </div>

          {showAddButton && onCreateTask && (
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
                  <DialogDescription>Add a new task to your list.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder="Task title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Task description (optional)"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as Priority }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={PriorityEnum.LOW}>Low</SelectItem>
                          <SelectItem value={PriorityEnum.MEDIUM}>Medium</SelectItem>
                          <SelectItem value={PriorityEnum.HIGH}>High</SelectItem>
                          <SelectItem value={PriorityEnum.URGENT}>Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Due Date</label>
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask} disabled={!formData.title.trim()}>
                    Create Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {(showSearch || showFilters) && (
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {showSearch && (
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}
            {showFilters && (
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | "all")}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
                    <SelectItem value={TaskStatus.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={(value: Priority | "all") => setPriorityFilter(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value={PriorityEnum.LOW}>Low</SelectItem>
                    <SelectItem value={PriorityEnum.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={PriorityEnum.HIGH}>High</SelectItem>
                    <SelectItem value={PriorityEnum.URGENT}>Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filteredTasks.length === 0 ? (
          <Alert>
            <AlertTitle>No tasks found</AlertTitle>
            <AlertDescription>
              {tasks.length === 0
                ? "Click \"Add Task\" to create your first task."
                : "Try adjusting your search or filters to find what you're looking for."
              }
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
              <div key={groupName} className="space-y-3">
                {groupBy !== "none" && (
                  <>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-muted-foreground">{groupName}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {groupTasks.length}
                      </Badge>
                    </div>
                    <Separator className="mb-3" />
                  </>
                )}
                <div className="space-y-2">
                  {groupTasks.map((task) => (
                    <UniversalTaskItem
                      key={task.id}
                      task={task}
                      showProject={showProject}
                      showDueDate={showDueDate}
                      showStatus={showStatus}
                      draggable={draggable}
                      editable={editable}
                      deletable={deletable}
                      onToggle={onToggleTask}
                      onUpdate={onUpdateTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};