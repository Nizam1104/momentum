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
  isPinned: boolean;
  isArchived: boolean;
  userId?: string | null;
  dayId?: string | null;
  projectId?: string | null;
  categoryId?: string | null;
  topicId?: string | null;
  conceptId?: string | null;
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
  userId: string;
  projectId?: string | null;
  dayId?: string | null;
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


// Learning Management System Types
export enum LearningTopicStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ON_HOLD = "ON_HOLD",
  CANCELLED = "CANCELLED",
}

export enum LearningConceptStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  COMPLETED = "COMPLETED",
  MASTERED = "MASTERED",
}

export interface LearningResource {
  title: string;
  url: string;
  type: "article" | "video" | "book" | "course" | "documentation" | "other";
  description?: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  description?: string | null;
  color: string;
  priority: Priority;
  status: LearningTopicStatus;
  startDate?: Date | null;
  targetDate?: Date | null;
  completedAt?: Date | null;
  userId: string;
  categoryId?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  concepts?: LearningConcept[];
}

export interface LearningConcept {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  resources?: LearningResource[];
  notes?: Note[];
  status: LearningConceptStatus;
  priority: Priority;
  understandingLevel: number; // 1-5 scale
  startDate?: Date | null;
  completedAt?: Date | null;
  userId: string;
  topicId: string;
  createdAt: Date;
  updatedAt?: Date | null;
}
