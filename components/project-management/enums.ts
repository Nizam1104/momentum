// components/project-management/enums.ts

// Re-exporting interfaces and enums from the provided data states
// This ensures type safety and consistency across the application.

export interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  timezone: string;
  preferences: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Day {
  id: string;
  date: Date; // @db.Date
  userId: string;
  highlights?: string | null;
  challenges?: string | null;
  lessons?: string | null;
  gratitude?: string | null;
  tomorrowFocus?: string | null;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title?: string | null;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  dayId?: string | null;
  projectId?: string | null;
  categoryId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  ARCHIVED = "ARCHIVED",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  status: ProjectStatus;
  priority: Priority;
  startDate?: Date | null;
  dueDate?: Date | null;
  completedAt?: Date | null;
  progress: number; // 0-100
  userId: string;
  categoryId?: string | null;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date | null;
  userId: string;
  projectId?: string | null;
  categoryId?: string | null;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCompletion {
  id: string;
  dayId: string;
  taskId: string;
  completedAt: Date;
  notes?: string | null;
}


export interface Category {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  icon?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  criteria: Record<string, unknown>; // Prisma Json type
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: Date;
}
