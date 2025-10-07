// actions/clientActions/types.ts
export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Common enums based on Prisma schema
export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  ARCHIVED = "ARCHIVED",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}


// Base interfaces for entities
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  timezone: string;
  preferences?: any;
}

export interface Project extends BaseEntity {
  name: string;
  description?: string;
  color: string;
  status: ProjectStatus;
  priority: Priority;
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  progress: number;
  userId: string;
  categoryId?: string;
  parentId?: string;
}

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  completedAt?: Date;
  userId: string;
  projectId?: string;
  dayId?: string;
  categoryId?: string;
  parentId?: string;
}

export interface Note extends BaseEntity {
  title?: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  dayId?: string;
  projectId?: string;
  categoryId?: string;
  conceptId?: string;
  userId?: string;
}

export interface Day extends BaseEntity {
  date: Date;
  userId: string;
  highlights?: string;
  challenges?: string;
  lessons?: string;
  tomorrowFocus?: string;
  isCompleted: boolean;
}

export interface Category extends BaseEntity {
  name: string;
  description?: string;
  color: string;
  icon?: string;
  userId: string;
}
