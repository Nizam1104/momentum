// app/projects/page.tsx
'use client';

import { useState } from 'react';
import { Project, ProjectStatus, TaskStatus } from '@/types/states';
import { mockProjects } from '@/lib/mock-data';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectList } from '@/components/projects/ProjectList';
import { ProjectDetailView } from '@/components/projects/ProjectDetailView';
// ✨ NEW: Import the dialog component
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';

// This is the main component you were working on.
export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  // ✨ NEW: State to control the create project dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // ✨ UPDATED: This handler now opens the dialog
  const handleNewProject = () => {
    setIsCreateDialogOpen(true);
  };

  // ✨ NEW: Handler to process the form data and create a new project
  const handleCreateProject = (data: {
    name: string;
    description?: string;
    priority: Project['priority'];
    color: string;
    dueDate?: Date;
  }) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: data.name,
      description: data.description,
      color: data.color,
      priority: data.priority,
      dueDate: data.dueDate,
      status: ProjectStatus.ACTIVE,
      progress: 0,
      tasks: [],
    };

    setProjects([newProject, ...projects]);
    setIsCreateDialogOpen(false); // Close the dialog on successful creation
  };

  // Handler to select a project to view its details
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  // Handler to go back from detail view to the list view
  const handleBackToList = () => {
    setSelectedProject(null);
  };

  // Handler to delete a project
  const handleDeleteProject = (projectId: string) => {
    console.log(`Deleting project ${projectId}`);
    setProjects(projects.filter((p) => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  // Handler to update a project (e.g., after a task status changes)
  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    if (selectedProject?.id === updatedProject.id) {
      setSelectedProject(updatedProject);
    }
  };

  return (
    <>
      <div className="container mx-auto py-8">
        {selectedProject ? (
          <ProjectDetailView
            project={selectedProject}
            onBack={handleBackToList}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
          />
        ) : (
          <>
            <ProjectHeader onNewProject={handleNewProject} />
            <ProjectList
              projects={projects}
              onSelectProject={handleSelectProject}
              onDeleteProject={handleDeleteProject}
            />
          </>
        )}
      </div>

      {/* ✨ NEW: Render the dialog and pass the required props */}
      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateProject={handleCreateProject}
      />
    </>
  );
}
