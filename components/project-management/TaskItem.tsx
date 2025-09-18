"use client";

import { UniversalTaskItem, Task } from "@/components/tasks/UniversalTaskItem";

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem = ({ task, onUpdate, onDelete, onEdit }: TaskItemProps) => {
  const handleUpdate = (taskId: string, updates: Partial<Task>) => {
    onUpdate({ ...task, ...updates });
  };

  const handleEdit = (taskToEdit: Task) => {
    onEdit(taskToEdit);
  };

  return (
    <UniversalTaskItem
      task={task}
      variant="compact"
      onUpdate={handleUpdate}
      onDelete={onDelete}
      onEdit={handleEdit}
      showDueDate={true}
      showStatus={true}
      editable={true}
      deletable={true}
    />
  );
};