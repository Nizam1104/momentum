"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UniversalTaskList } from "@/components/tasks/UniversalTaskList";
import { Task, Priority as UniversalPriority, TaskStatus as UniversalTaskStatus } from "@/components/tasks/UniversalTaskItem";
import { useDayStore } from "@/stores/day";
import { TaskStatus, Priority } from "@/actions/clientActions/types";

export default function DayTasks() {
  const {
    selectedDay,
    tasks,
    tasksInitialLoading: tasksLoading,
    tasksError,
    createTaskAsync,
    updateTaskAsync,
    deleteTaskAsync,
    updateTaskStatusAsync,
  } = useDayStore();

  // Convert tasks to universal format
  const universalTasks: Task[] = tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    status: task.status as UniversalTaskStatus,
    priority: task.priority as UniversalPriority,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
      }));

  const handleCreateTask = async (newTask: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    if (!selectedDay) return;

    await createTaskAsync(selectedDay.id, {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority as Priority,
    });
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    await updateTaskAsync(taskId, {
      title: updates.title,
      description: updates.description,
      priority: updates.priority as Priority,
      status: updates.status as TaskStatus,
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskAsync(taskId);
  };

  const handleToggleTask = async (taskId: string, currentStatus: UniversalTaskStatus) => {
    const newStatus = currentStatus === UniversalTaskStatus.COMPLETED
      ? TaskStatus.TODO
      : TaskStatus.COMPLETED;
    await updateTaskStatusAsync(taskId, newStatus);
  };

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
    <UniversalTaskList
      tasks={universalTasks}
      loading={tasksLoading}
      error={tasksError || undefined}
      title="Today's Tasks"
      groupBy="status"
      variant="detailed"
      onCreateTask={handleCreateTask}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
      onToggleTask={handleToggleTask}
    />
  );
}