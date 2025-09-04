// components/projects/TaskList.tsx
'use client';

import { Task, TaskStatus } from '@/types/states';
import { TaskItem } from './TaskItem';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Input } from '../ui/input';

interface TaskListProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (title: string) => void;
}

export function TaskList({ tasks, onUpdateTaskStatus, onDeleteTask, onAddTask }: TaskListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED);
  const openTasks = tasks.filter(t => t.status !== TaskStatus.COMPLETED);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-2">
      {openTasks.map(task => (
        <TaskItem key={task.id} task={task} onUpdateStatus={onUpdateTaskStatus} onDelete={onDeleteTask} />
      ))}

      {isAdding ? (
        <div className="p-2">
          <Input
            placeholder="e.g., Design the login page"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            autoFocus
            className="mb-2"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAddTask}>Add Task</Button>
          </div>
        </div>
      ) : (
        <Button variant="ghost" className="w-full justify-start text-primary" onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      )}

      {completedTasks.length > 0 && (
        <>
          <Separator className="my-4" />
          <h4 className="text-sm font-medium text-muted-foreground px-2">Completed</h4>
          {completedTasks.map(task => (
            <TaskItem key={task.id} task={task} onUpdateStatus={onUpdateTaskStatus} onDelete={onDeleteTask} />
          ))}
        </>
      )}
    </div>
  );
}
