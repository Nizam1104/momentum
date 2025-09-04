// components/projects/ProjectHeader.tsx
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProjectHeaderProps {
  onNewProject: () => void;
}

export function ProjectHeader({ onNewProject }: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
      <Button onClick={onNewProject}>
        <Plus className="h-4 w-4 mr-2" />
        New Project
      </Button>
    </div>
  );
}
