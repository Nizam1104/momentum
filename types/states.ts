export interface User {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  timezone: string;
  preferences?: Record<string, any> | null;
  createdAt: Date;
  updatedAt?: Date | null;
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
  updatedAt?: Date | null;
}

export interface Note {
  id: string;
  title?: string | null;
  content: string;
  type: NoteType;
  isPinned: boolean;
  isArchived: boolean;
  dayId?: string | null;
  projectId?: string | null;
  categoryId?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
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
  progress: number;
  userId: string;
  categoryId?: string | null;
  parentId?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
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
  completedAt?: Date | null;
  estimatedMinutes?: number | null;
  actualMinutes?: number | null;
  projectId: string;
  categoryId?: string | null;
  parentId?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface TaskCompletion {
  id: string;
  dayId: string;
  taskId: string;
  completedAt: Date;
  notes?: string | null;
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

export interface Goal {
  id: string;
  title: string;
  description?: string | null;
  type: GoalType;
  status: GoalStatus;
  priority: Priority;
  color: string;
  startDate?: Date | null;
  targetDate?: Date | null;
  completedAt?: Date | null;
  isQuantifiable: boolean;
  targetValue?: number | null;
  currentValue?: number | null;
  unit?: string | null;
  userId: string;
  projectId?: string | null;
  categoryId?: string | null;
  parentId?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface DailyGoal {
  id: string;
  dayId: string;
  goalId: string;
  status: DailyGoalStatus;
  progress: number;
  notes?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

// src/stores/common/enums.ts

export enum NoteType {
  GENERAL = "GENERAL",
  MEETING = "MEETING",
  IDEA = "IDEA",
  LEARNING = "LEARNING",
  REFLECTION = "REFLECTION",
  PLANNING = "PLANNING",
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  icon?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

// TimeTable System Types
export enum TimeSlotCategory {
  WORK = "WORK",
  PERSONAL = "PERSONAL",
  HEALTH = "HEALTH",
  LEARNING = "LEARNING",
  BREAK = "BREAK",
  MEETING = "MEETING",
  EXERCISE = "EXERCISE",
  MEAL = "MEAL",
  COMMUTE = "COMMUTE",
  OTHER = "OTHER",
}

export enum TimeSlotStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  SKIPPED = "SKIPPED",
  PARTIAL = "PARTIAL",
}

export interface TimeTable {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  isTemplate: boolean;
  userId: string;
  createdAt: Date;
  updatedAt?: Date | null;
  timeSlots?: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  title: string;
  description?: string | null;
  startTime: string; // "HH:MM" format
  endTime: string; // "HH:MM" format
  category: TimeSlotCategory;
  color: string;
  priority: Priority;
  isRecurring: boolean;
  daysOfWeek: string[]; // ["monday", "tuesday", ...]
  isActive: boolean;
  userId: string;
  timeTableId: string;
  createdAt: Date;
  updatedAt?: Date | null;
  completions?: TimeSlotCompletion[];
}

export interface TimeSlotCompletion {
  id: string;
  dayId: string;
  timeSlotId: string;
  status: TimeSlotStatus;
  startedAt?: Date | null;
  completedAt?: Date | null;
  notes?: string | null;
  actualDuration?: number | null; // in minutes
  createdAt: Date;
  updatedAt?: Date | null;
}
