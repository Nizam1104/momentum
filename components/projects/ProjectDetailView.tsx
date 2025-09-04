// components/projects/ProjectDetailView.tsx
'use client';

import { Project, Task, TaskStatus } from '@/types/states';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { PriorityIcon } from './PriorityIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskList } from './TaskList';

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onUpdateProject: (updatedProject: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export function ProjectDetailView({ project, onBack, onUpdateProject, onDeleteProject }: ProjectDetailViewProps) {
  
  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    console.log(`Updating task ${taskId} to status ${status}`);
    const updatedTasks = project.tasks.map(t => t.id === taskId ? { ...t, status } : t);
    onUpdateProject({ ...project, tasks: updatedTasks });
  };

  const handleDeleteTask = (taskId: string) => {
    console.log(`Deleting task ${taskId}`);
    const updatedTasks = project.tasks.filter(t => t.id !== taskId);
    onUpdateProject({ ...project, tasks: updatedTasks });
  };

  const handleAddTask = (title: string) => {
    console.log(`Adding task "${title}" to project ${project.id}`);
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      status: TaskStatus.TODO,
      priority: project.priority,
      projectId: project.id,
    };
    onUpdateProject({ ...project, tasks: [...project.tasks, newTask] });
  };

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          All Projects
        </Button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-3 h-10 rounded-full" style={{ backgroundColor: project.color }} />
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            <div className="flex items-center gap-2">
              <ProjectStatusBadge status={project.status} />
              <PriorityIcon priority={project.priority} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Archive Project</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDeleteProject(project.id)} className="text-red-500">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {project.description && (
          <p className="text-muted-foreground mt-2 max-w-2xl">{project.description}</p>
        )}
      </header>

      <main>
        <TaskList
          tasks={project.tasks}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          onDeleteTask={handleDeleteTask}
          onAddTask={handleAddTask}
        />
      </main>
    </div>
  );
}
