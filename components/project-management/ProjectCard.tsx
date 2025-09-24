// components/project-management/ProjectCard.tsx
'use client';

import React from 'react';
import { Project, ProjectStatus } from './enums';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Flag, CalendarDays, CheckCircle, Hourglass } from 'lucide-react';
import { formatDate, getProjectStatusConfig, getPriorityConfig } from './utils';

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
        <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick(project.id)}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                        <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(project); }}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(project.id); }} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {project.description && (
                    <CardDescription className="line-clamp-2">
                        {project.description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-1">
                        <Flag className="h-3 w-3 text-muted-foreground" />
                        <span>{getPriorityConfig(project.priority).text}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {getStatusIcon(project.status)}
                        <span>{getProjectStatusConfig(project.status).text}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <CalendarDays className="h-3 w-3" />
                    <span>Due: {formatDate(project.dueDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Progress value={project.progress} className="h-2 flex-1" />
                    <span className="text-sm font-medium">{project.progress}%</span>
                </div>
            </CardContent>
        </Card>
    );
};
