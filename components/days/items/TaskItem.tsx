"use client";

import { UniversalTaskItem, Task } from "@/components/tasks/UniversalTaskItem";

interface CompactTaskItemProps {
  task: Task;
}

export default function CompactTaskItem({ task }: CompactTaskItemProps) {
  return (
    <UniversalTaskItem
      task={task}
      variant="minimal"
      draggable={true}
    />
  );
}