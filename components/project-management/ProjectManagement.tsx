// components/project-management/ProjectManagement.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Project, Task, ProjectStatus, TaskStatus } from './enums';
import { mockProjects, mockTasks } from './mock-data';
import { ProjectCard } from './ProjectCard';
import { ProjectDetails } from './ProjectDetails';
import { ProjectForm } from './ProjectForm';
import { Button } from '@/components/ui/button';
// Import ChevronLeft and ChevronRight for the toggle button
import { PlusCircle, LayoutGrid, List, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { calculateProjectProgress, generateId } from './utils';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { Info } from 'lucide-react';

export default function ProjectManagement() {
    const [projects, setProjects] = useState<Project[]>(mockProjects);
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    // State to manage sidebar collapse
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Memoize projects with updated progress
    const projectsWithProgress = useMemo(() => {
        return projects.map(project => ({
            ...project,
            progress: calculateProjectProgress(project.id, tasks),
        }));
    }, [projects, tasks]);

    const selectedProject = useMemo(() => {
        return projectsWithProgress.find(p => p.id === selectedProjectId);
    }, [selectedProjectId, projectsWithProgress]);

    const selectedProjectTasks = useMemo(() => {
        return tasks.filter(task => task.projectId === selectedProjectId);
    }, [selectedProjectId, tasks]);

    // --- Project Handlers ---

    const handleCreateProject = useCallback((newProjectData: Omit<Project, 'id' | 'userId' | 'progress' | 'createdAt' | 'updatedAt' | 'completedAt'>) => {
        const newProject: Project = {
            ...newProjectData,
            id: generateId('proj'),
            userId: 'user_123', // Mock user ID
            progress: 0, // Initial progress
            createdAt: new Date(),
            updatedAt: new Date(),
            completedAt: null,
        };
        setProjects(prev => [...prev, newProject]);
        setIsProjectFormOpen(false);
    }, []);

    const handleUpdateProject = useCallback((updatedProject: Project) => {
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        setIsProjectFormOpen(false);
        setEditingProject(null);
    }, []);

    const handleDeleteProject = useCallback((projectId: string) => {
        if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
            setProjects(prev => prev.filter(p => p.id !== projectId));
            setTasks(prev => prev.filter(t => t.projectId !== projectId)); // Delete associated tasks
            if (selectedProjectId === projectId) {
                setSelectedProjectId(null); // Deselect if the current project is deleted
            }
        }
    }, [selectedProjectId]);

    const handleEditProjectClick = useCallback((project: Project) => {
        setEditingProject(project);
        setIsProjectFormOpen(true);
    }, []);

    // --- Task Handlers ---

    const handleAddTask = useCallback((newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTask: Task = {
            ...newTaskData,
            id: generateId('task'),
            createdAt: new Date(),
            updatedAt: new Date(),
            completedAt: newTaskData.status === TaskStatus.COMPLETED ? new Date() : null,
        };
        setTasks(prev => [...prev, newTask]);
    }, []);

    const handleUpdateTask = useCallback((updatedTask: Task) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? {
            ...updatedTask,
            completedAt: updatedTask.status === TaskStatus.COMPLETED && !t.completedAt ? new Date() : updatedTask.completedAt,
            updatedAt: new Date(),
        } : t));
    }, []);

    const handleDeleteTask = useCallback((taskId: string, projectId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setTasks(prev => prev.filter(t => t.id !== taskId));
        }
    }, []);

    return (
        <div className="flex h-full overflow-hidden bg-background">
            {/* Left Sidebar: Project List */}
            <div className={`
                ${isSidebarOpen ? 'w-full md:w-1/3 lg:w-1/3 p-6' : 'w-16 p-4'}
                border-r bg-card/50 flex flex-col overflow-hidden transition-all duration-300 ease-in-out
            `}>
                <div className={`flex items-center justify-between ${isSidebarOpen ? 'mb-6' : 'mb-0'}`}>
                    {isSidebarOpen ? (
                        <>
                            <h1 className="text-xl font-extrabold flex items-center gap-2">
                                <FolderOpen className="h-7 w-7 text-primary" /> Projects
                            </h1>
                            <div className="flex items-center gap-2">
                                <Button size={'sm'} onClick={() => { setEditingProject(null); setIsProjectFormOpen(true); }}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> New Project
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center w-full gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                            <FolderOpen className="h-7 w-7 text-primary" />
                        </div>
                    )}
                </div>

                {isSidebarOpen && (
                    <>
                        <Separator className="mb-6" />

                        <ScrollArea className="flex-grow pr-4 -mr-4"> {/* Adjust padding for scrollbar */}
                            <div className="grid gap-4">
                                {projectsWithProgress.length > 0 ? (
                                    projectsWithProgress.map(project => (
                                        <ProjectCard
                                            key={project.id}
                                            project={project}
                                            onClick={setSelectedProjectId}
                                            onEdit={handleEditProjectClick}
                                            onDelete={handleDeleteProject}
                                        />
                                    ))
                                ) : (
                                    <Alert>
                                        <Info className="h-4 w-4" />
                                        <AlertTitle>No Projects Found</AlertTitle>
                                        <AlertDescription>
                                            Start by creating your first project to organize your work.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </ScrollArea>
                    </>
                )}
            </div>

            {/* Right Content Area: Project Details or Placeholder */}
            <div className="flex-1 p-6 overflow-hidden">
                {selectedProject ? (
                    <ProjectDetails
                        project={selectedProject}
                        tasks={selectedProjectTasks}
                        onEditProject={handleEditProjectClick}
                        onDeleteProject={handleDeleteProject}
                        onAddTask={handleAddTask}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <LayoutGrid className="h-24 w-24 mb-6 text-primary/50" />
                        <h2 className="text-2xl font-semibold mb-2">Select a Project</h2>
                        <p className="max-w-md">
                            Choose a project from the left sidebar to view its details and manage tasks, or create a new project to get started.
                        </p>
                    </div>
                )}
            </div>

            {/* Project Form Dialog */}
            <Dialog open={isProjectFormOpen} onOpenChange={setIsProjectFormOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
                    </DialogHeader>
                    <ProjectForm
                        initialData={editingProject}
                        onSubmit={(data) => {
                            if ('id' in data) { // Check if it's an existing project (has an ID)
                                handleUpdateProject(data as Project);
                            } else {
                                handleCreateProject(data as Omit<Project, 'id' | 'userId' | 'progress' | 'createdAt' | 'updatedAt' | 'completedAt'>);
                            }
                        }}
                        onCancel={() => { setIsProjectFormOpen(false); setEditingProject(null); }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
