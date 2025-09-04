// lib/mock-data.ts

import { Project, ProjectStatus, Priority, TaskStatus } from '@/types/states';

export const mockProjects: Project[] = [
    {
        id: 'proj-1',
        name: 'Website Redesign',
        description: 'Complete overhaul of the company website to improve user experience and modernize the design.',
        color: 'hsl(210 40% 96.1%)', // slate-100
        status: ProjectStatus.ACTIVE,
        priority: Priority.HIGH,
        dueDate: new Date('2025-11-15'),
        progress: 65,
        tasks: [
            { id: 'task-1-1', title: 'Finalize new sitemap and user flow', status: TaskStatus.COMPLETED, priority: Priority.HIGH, projectId: 'proj-1', dueDate: new Date('2025-09-10') },
            { id: 'task-1-2', title: 'Develop wireframes for key pages', status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, projectId: 'proj-1', dueDate: new Date('2025-09-20') },
            { id: 'task-1-3', title: 'Create high-fidelity mockups in Figma', status: TaskStatus.TODO, priority: Priority.MEDIUM, projectId: 'proj-1', dueDate: new Date('2025-10-05') },
            { id: 'task-1-4', title: 'Develop front-end components', status: TaskStatus.TODO, priority: Priority.HIGH, projectId: 'proj-1', dueDate: new Date('2025-10-25') },
            { id: 'task-1-5', title: 'User acceptance testing', status: TaskStatus.TODO, priority: Priority.MEDIUM, projectId: 'proj-1' },
        ],
    },
    {
        id: 'proj-2',
        name: 'Q4 Marketing Campaign',
        description: 'Launch a multi-channel marketing campaign for the new product line.',
        color: 'hsl(142.1 76.2% 36.3%)', // green-600
        status: ProjectStatus.ACTIVE,
        priority: Priority.URGENT,
        dueDate: new Date('2025-12-01'),
        progress: 20,
        tasks: [
            { id: 'task-2-1', title: 'Define campaign goals and KPIs', status: TaskStatus.COMPLETED, priority: Priority.URGENT, projectId: 'proj-2', dueDate: new Date('2025-09-05') },
            { id: 'task-2-2', title: 'Create ad copy and visuals', status: TaskStatus.TODO, priority: Priority.HIGH, projectId: 'proj-2', dueDate: new Date('2025-09-18') },
            { id: 'task-2-3', title: 'Setup social media ad campaigns', status: TaskStatus.TODO, priority: Priority.MEDIUM, projectId: 'proj-2' },
        ],
    },
    {
        id: 'proj-3',
        name: 'Mobile App Development (iOS)',
        description: 'Build the first version of our native iOS application.',
        color: 'hsl(221.2 83.2% 53.3%)', // blue-600
        status: ProjectStatus.ON_HOLD,
        priority: Priority.MEDIUM,
        dueDate: new Date('2026-02-28'),
        progress: 10,
        tasks: [
             { id: 'task-3-1', title: 'Setup Xcode project and CI/CD pipeline', status: TaskStatus.COMPLETED, priority: Priority.HIGH, projectId: 'proj-3' },
        ],
    },
    {
        id: 'proj-4',
        name: 'API Documentation Update',
        description: 'Update and publish new documentation for the v3 API.',
        color: 'hsl(24.6 95% 53.1%)', // orange-500
        status: ProjectStatus.COMPLETED,
        priority: Priority.LOW,
        dueDate: new Date('2025-08-30'),
        progress: 100,
        tasks: [],
    },
];
