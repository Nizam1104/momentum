"use client";

import { UniversalTaskItem, Task } from "@/components/tasks/UniversalTaskItem";

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskItem = ({ task, onUpdate, onDelete }: TaskItemProps) => {
  const handleUpdate = (taskId: string, updates: Partial<Task>) => {
    onUpdate({ ...task, ...updates });
  };

  return (
    <UniversalTaskItem
      task={task}
      onUpdate={handleUpdate}
      onDelete={onDelete}
      showDueDate={true}
      showStatus={true}
      editable={true}
      deletable={true}
    />
  );
};