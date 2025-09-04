// components/projects/ProjectList.tsx
import { Project } from '@/types/states';
import { ProjectItem } from './ProjectItem';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export function ProjectList({ projects, onSelectProject, onDeleteProject }: ProjectListProps) {
  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          onSelectProject={onSelectProject}
          onDeleteProject={onDeleteProject}
        />
      ))}
    </div>
  );
}
