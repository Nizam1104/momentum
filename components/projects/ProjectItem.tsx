// components/projects/ProjectItem.tsx
'use client';

import { Project } from '@/types/states';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Archive, Trash2 } from 'lucide-react';
import { PriorityIcon } from './PriorityIcon';

interface ProjectItemProps {
  project: Project;
  onSelectProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export function ProjectItem({ project, onSelectProject, onDeleteProject }: ProjectItemProps) {
  const openTasks = project.tasks.filter(t => t.status !== 'COMPLETED').length;

  return (
    <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
      <CardContent className="p-4 flex items-center justify-between" onClick={() => onSelectProject(project)}>
        <div className="flex items-center gap-4 flex-grow">
          <div className="w-2 h-8 rounded-full" style={{ backgroundColor: project.color }} />
          <div className="flex-grow">
            <p className="font-medium">{project.name}</p>
            <p className="text-sm text-muted-foreground">{openTasks} tasks remaining</p>
          </div>
        </div>
        <div className="flex items-center gap-6 w-1/3">
          <div className="flex-grow">
            <Progress value={project.progress} className="h-2" />
            <p className="text-xs text-right text-muted-foreground mt-1">{project.progress}%</p>
          </div>
          <PriorityIcon priority={project.priority} />
        </div>
        <div className="ml-4" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" /> Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteProject(project.id)} className="text-red-500">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
