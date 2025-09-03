
export interface User {
    id: string;
    name?: string;
    email: string;
    emailVerified?: Date;
    image?: string;
    timezone: string;
    preferences: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Day {
    id: string;
    date: Date; // @db.Date
    userId: string;
    energyLevel?: number | null;
    moodRating?: number | null;
    productivityRating?: number | null;
    sleepHours?: number | null;
    sleepQuality?: number | null;
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
    type: NoteType;
    isPinned: boolean;
    isArchived: boolean;
    dayId?: string | null;
    projectId?: string | null;
    categoryId?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  export enum ProjectStatus {
    ACTIVE = 'ACTIVE',
    ON_HOLD = 'ON_HOLD',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    ARCHIVED = 'ARCHIVED',
  }
  
  export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
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
    updatedAt: Date;
  }


export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
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
    updatedAt: Date;
  }

  export interface TaskCompletion {
    id: string;
    dayId: string;
    taskId: string;
    completedAt: Date;
    notes?: string | null;
  }

  export enum GoalType {
    PERSONAL = 'PERSONAL',
    PROFESSIONAL = 'PROFESSIONAL',
    HEALTH = 'HEALTH',
    FINANCIAL = 'FINANCIAL',
    LEARNING = 'LEARNING',
    RELATIONSHIP = 'RELATIONSHIP',
    CREATIVE = 'CREATIVE',
  }
  
  export enum GoalStatus {
    ACTIVE = 'ACTIVE',
    PAUSED = 'PAUSED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
  }
  
  export enum DailyGoalStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    SKIPPED = 'SKIPPED',
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
    currentValue: number;
    unit?: string | null;
    userId: string;
    projectId?: string | null;
    categoryId?: string | null;
    parentId?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface DailyGoal {
    id: string;
    dayId: string;
    goalId: string;
    status: DailyGoalStatus;
    progress: number;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // src/stores/common/enums.ts

export enum NoteType {
    GENERAL = 'GENERAL',
    MEETING = 'MEETING',
    IDEA = 'IDEA',
    LEARNING = 'LEARNING',
    REFLECTION = 'REFLECTION',
    PLANNING = 'PLANNING',
  }
  
  
  export enum HabitType {
    GENERAL = 'GENERAL',
    HEALTH = 'HEALTH',
    PRODUCTIVITY = 'PRODUCTIVITY',
    MINDFULNESS = 'MINDFULNESS',
    LEARNING = 'LEARNING',
    SOCIAL = 'SOCIAL',
  }
  
  export enum TemplateType {
    DAILY_CHECKIN = 'DAILY_CHECKIN',
    PROJECT = 'PROJECT',
    GOAL = 'GOAL',
    HABIT = 'HABIT',
    NOTE = 'NOTE',
  }
  
  export interface Habit {
    id: string;
    name: string;
    description?: string | null;
    category: HabitType;
    color: string;
    targetFrequency: number;
    isActive: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface HabitLog {
    id: string;
    dayId: string;
    habitId: string;
    completed: boolean;
    count: number;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface TimeEntry {
    id: string;
    description?: string | null;
    startTime: Date;
    endTime?: Date | null;
    duration?: number | null; // in minutes
    dayId?: string | null;
    projectId?: string | null;
    taskId?: string | null;
    createdAt: Date;
    updatedAt: Date;
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

  export interface Tag {
    id: string;
    name: string;
    color: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Template {
    id: string;
    name: string;
    description?: string | null;
    type: TemplateType;
    content: Record<string, any>; // Prisma Json type
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
    criteria: Record<string, any>; // Prisma Json type
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