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

export enum NoteType {
  GENERAL = "GENERAL",
  MEETING = "MEETING",
  IDEA = "IDEA",
  LEARNING = "LEARNING",
  REFLECTION = "REFLECTION",
  PLANNING = "PLANNING",
}

export enum GoalType {
  PERSONAL = "PERSONAL",
  PROFESSIONAL = "PROFESSIONAL",
  HEALTH = "HEALTH",
  FINANCIAL = "FINANCIAL",
  LEARNING = "LEARNING",
  RELATIONSHIP = "RELATIONSHIP",
  CREATIVE = "CREATIVE",
}

export enum GoalStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum DailyGoalStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  SKIPPED = "SKIPPED",
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
  estimatedMinutes?: number;
  actualMinutes?: number;
  projectId?: string;
  dayId?: string;
  categoryId?: string;
  parentId?: string;
}

export interface Goal extends BaseEntity {
  title: string;
  description?: string;
  type: GoalType;
  status: GoalStatus;
  priority: Priority;
  color: string;
  startDate?: Date;
  targetDate?: Date;
  completedAt?: Date;
  isQuantifiable: boolean;
  targetValue?: number;
  currentValue: number;
  unit?: string;
  userId: string;
  projectId?: string;
  categoryId?: string;
  parentId?: string;
}

export interface Note extends BaseEntity {
  title?: string;
  content: string;
  type: NoteType;
  isPinned: boolean;
  isArchived: boolean;
  dayId?: string;
  projectId?: string;
  categoryId?: string;
}

export interface Day extends BaseEntity {
  date: Date;
  userId: string;
  energyLevel?: number;
  moodRating?: number;
  productivityRating?: number;
  sleepHours?: number;
  sleepQuality?: number;
  highlights?: string;
  challenges?: string;
  lessons?: string;
  gratitude?: string;
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

export interface Tag extends BaseEntity {
  name: string;
  color: string;
  userId: string;
}

export interface DailyGoal extends BaseEntity {
  dayId: string;
  goalId: string;
  status: DailyGoalStatus;
  progress: number;
  notes?: string;
}

export interface TaskCompletion extends BaseEntity {
  dayId: string;
  taskId: string;
  completedAt: Date;
  notes?: string;
}
