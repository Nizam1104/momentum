// components/projects/PriorityIcon.tsx
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a lib/utils.ts for shadcn
import { Priority } from '@/types/states';

interface PriorityIconProps {
  priority: Priority;
  className?: string;
}

export function PriorityIcon({ priority, className }: PriorityIconProps) {
  const priorityStyles = {
    [Priority.URGENT]: 'text-red-500',
    [Priority.HIGH]: 'text-orange-500',
    [Priority.MEDIUM]: 'text-yellow-500',
    [Priority.LOW]: 'text-blue-500',
  };

  return (
    <Flag className={cn(priorityStyles[priority], 'h-4 w-4', className)} />
  );
}
