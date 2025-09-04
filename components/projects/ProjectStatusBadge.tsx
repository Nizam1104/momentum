// components/projects/ProjectStatusBadge.tsx
import { Badge } from '@/components/ui/badge';
import { ProjectStatus } from '@/types/states';
import { cn } from '@/lib/utils';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const statusStyles: Record<ProjectStatus, string> = {
    [ProjectStatus.ACTIVE]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    [ProjectStatus.ON_HOLD]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
    [ProjectStatus.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300 dark:border-green-700',
    [ProjectStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300 dark:border-red-700',
    [ProjectStatus.ARCHIVED]: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 border-gray-300 dark:border-gray-700',
  };

  return (
    <Badge variant="outline" className={cn('capitalize', statusStyles[status])}>
      {status.toLowerCase().replace('_', ' ')}
    </Badge>
  );
}
