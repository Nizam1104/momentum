// components/project-management/mock-data.ts

import { Project, Task, ProjectStatus, TaskStatus, Priority } from '@/types/states';

const MOCK_USER_ID = 'user_123'; // A placeholder user ID

export const mockProjects: Project[] = [
    {
        id: 'proj_1',
        name: 'Develop Next.js App',
        description: 'Build a comprehensive daily check-in and project management application.',
        color: '#FF6B6B',
        status: ProjectStatus.ACTIVE,
        priority: Priority.URGENT,
        userId: MOCK_USER_ID,
        createdAt: new Date('2024-07-25'),
        updatedAt: new Date('2024-09-01'),
    },
    {
        id: 'proj_2',
        name: 'Learn Rust Programming',
        description: 'Deep dive into Rust language fundamentals.',
        color: '#4ECDC4',
        status: ProjectStatus.ON_HOLD,
        priority: Priority.MEDIUM,
        userId: MOCK_USER_ID,
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-09-05'),
    },
];

export const mockTasks: Task[] = [
    {
        id: 'task_1_1',
        title: 'Set up Next.js project structure',
        description: 'Initialize project and configure dependencies.',
        status: TaskStatus.COMPLETED,
        priority: Priority.HIGH,
        dueDate: new Date('2024-08-05'),
        userId: MOCK_USER_ID,
        projectId: 'proj_1',
        createdAt: new Date('2024-08-01'),
        updatedAt: new Date('2024-08-04'),
    },
    {
        id: 'task_1_2',
        title: 'Implement Project Management UI',
        description: 'Create components for project management.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.URGENT,
        dueDate: new Date('2024-09-10'),
        userId: MOCK_USER_ID,
        projectId: 'proj_1',
        createdAt: new Date('2024-08-06'),
        updatedAt: new Date('2024-09-05'),
    },
];
