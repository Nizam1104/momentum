// components/project-management/ProjectCard.tsx
'use client';

import React from 'react';
import { Project, ProjectStatus } from './enums';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Flag, CalendarDays, CheckCircle, Hourglass } from 'lucide-react';
import { formatDate, getProjectStatusConfig, getPriorityConfig } from './utils';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
    project: Project;
    onClick: (projectId: string) => void;
    onEdit: (project: Project) => void;
    onDelete: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onEdit, onDelete }) => {
    const getStatusIcon = (status: ProjectStatus) => {
        switch (status) {
            case ProjectStatus.COMPLETED:
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case ProjectStatus.ACTIVE:
                return <Hourglass className="h-4 w-4 text-yellow-500" />;
            default:
                return <Hourglass className="h-4 w-4 text-muted-foreground" />;
        }
    };

    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 ease-in-out">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                    <CardTitle className="text-lg font-semibold leading-none tracking-tight cursor-pointer hover:text-primary" onClick={() => onClick(project.id)}>
                        {project.name}
                    </CardTitle>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(project)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(project.id)} className="text-red-600 dark:text-red-400">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-grow pt-2 pb-4">
                <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {project.description || 'No description provided.'}
                </CardDescription>
                <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center space-x-1">
                        <Flag className="h-4 w-4 text-muted-foreground" />
                        {getPriorityConfig(project.priority).text}
                    </div>
                    <div className="flex items-center space-x-1">
                        {getStatusIcon(project.status)}
                        {getProjectStatusConfig(project.status).text}
                    </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Due: {formatDate(project.dueDate)}
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Progress value={project.progress} className="h-2 flex-grow" />
                    <span className="font-medium text-muted-foreground">{project.progress}%</span>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <Button variant="outline" className="w-full" onClick={() => onClick(project.id)}>View Details</Button>
            </CardFooter>
        </Card>
    );
};
