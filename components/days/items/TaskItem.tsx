"use client";

import { UniversalTaskItem, Task } from "@/components/tasks/UniversalTaskItem";

interface CompactTaskItemProps {
  task: Task;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
}

export default function CompactTaskItem({ task, onUpdate, onDelete }: CompactTaskItemProps) {
  return (
    <UniversalTaskItem
      task={task}
      variant="minimal"
      draggable={true}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
}