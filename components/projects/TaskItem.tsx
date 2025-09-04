// components/projects/TaskItem.tsx
'use client';

import { Task, TaskStatus } from '@/types/states';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar, MoreHorizontal } from 'lucide-react';
import { PriorityIcon } from './PriorityIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export function TaskItem({ task, onUpdateStatus, onDelete }: TaskItemProps) {
  const isCompleted = task.status === TaskStatus.COMPLETED;

  const handleStatusChange = (checked: boolean) => {
    onUpdateStatus(task.id, checked ? TaskStatus.COMPLETED : TaskStatus.TODO);
  };

  return (
    <div className="flex items-center p-2 rounded-lg hover:bg-accent/50 transition-colors group">
      <Checkbox
        id={`task-${task.id}`}
        checked={isCompleted}
        onCheckedChange={handleStatusChange}
        className="mr-4"
      />
      <div className="flex-grow">
        <p className={cn('text-sm', isCompleted && 'line-through text-muted-foreground')}>
          {task.title}
        </p>
      </div>
      <div className="flex items-center space-x-3 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {task.dueDate && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        )}
        <PriorityIcon priority={task.priority} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
