-- CreateEnum
CREATE TYPE "public"."NoteType" AS ENUM ('GENERAL', 'MEETING', 'IDEA', 'LEARNING', 'REFLECTION', 'PLANNING');

-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."GoalType" AS ENUM ('PERSONAL', 'PROFESSIONAL', 'HEALTH', 'FINANCIAL', 'LEARNING', 'RELATIONSHIP', 'CREATIVE');

-- CreateEnum
CREATE TYPE "public"."GoalStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."DailyGoalStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "public"."HabitType" AS ENUM ('GENERAL', 'HEALTH', 'PRODUCTIVITY', 'MINDFULNESS', 'LEARNING', 'SOCIAL');

-- CreateEnum
CREATE TYPE "public"."TemplateType" AS ENUM ('DAILY_CHECKIN', 'PROJECT', 'GOAL', 'HABIT', 'NOTE');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "preferences" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Day" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "userId" TEXT NOT NULL,
    "energyLevel" INTEGER DEFAULT 5,
    "moodRating" INTEGER DEFAULT 5,
    "productivityRating" INTEGER DEFAULT 5,
    "sleepHours" DOUBLE PRECISION,
    "sleepQuality" INTEGER DEFAULT 5,
    "highlights" TEXT,
    "challenges" TEXT,
    "lessons" TEXT,
    "gratitude" TEXT,
    "tomorrowFocus" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Note" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "type" "public"."NoteType" NOT NULL DEFAULT 'GENERAL',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "dayId" TEXT,
    "projectId" TEXT,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "status" "public"."ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "estimatedMinutes" INTEGER,
    "actualMinutes" INTEGER,
    "projectId" TEXT NOT NULL,
    "categoryId" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TaskCompletion" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "TaskCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Goal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."GoalType" NOT NULL DEFAULT 'PERSONAL',
    "status" "public"."GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "color" TEXT NOT NULL DEFAULT '#10B981',
    "startDate" TIMESTAMP(3),
    "targetDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "isQuantifiable" BOOLEAN NOT NULL DEFAULT false,
    "targetValue" DOUBLE PRECISION,
    "currentValue" DOUBLE PRECISION DEFAULT 0,
    "unit" TEXT,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "categoryId" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DailyGoal" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "status" "public"."DailyGoalStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Habit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "public"."HabitType" NOT NULL DEFAULT 'GENERAL',
    "color" TEXT NOT NULL DEFAULT '#8B5CF6',
    "targetFrequency" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HabitLog" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "count" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HabitLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimeEntry" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "dayId" TEXT,
    "projectId" TEXT,
    "taskId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#6B7280',
    "icon" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#9CA3AF',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NoteTag" (
    "noteId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "NoteTag_pkey" PRIMARY KEY ("noteId","tagId")
);

-- CreateTable
CREATE TABLE "public"."ProjectTag" (
    "projectId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ProjectTag_pkey" PRIMARY KEY ("projectId","tagId")
);

-- CreateTable
CREATE TABLE "public"."TaskTag" (
    "taskId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "TaskTag_pkey" PRIMARY KEY ("taskId","tagId")
);

-- CreateTable
CREATE TABLE "public"."GoalTag" (
    "goalId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "GoalTag_pkey" PRIMARY KEY ("goalId","tagId")
);

-- CreateTable
CREATE TABLE "public"."HabitTag" (
    "habitId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "HabitTag_pkey" PRIMARY KEY ("habitId","tagId")
);

-- CreateTable
CREATE TABLE "public"."Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."TemplateType" NOT NULL,
    "content" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Achievement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "criteria" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Day_date_key" ON "public"."Day"("date");

-- CreateIndex
CREATE INDEX "Day_userId_date_idx" ON "public"."Day"("userId", "date");

-- CreateIndex
CREATE INDEX "Day_userId_createdAt_idx" ON "public"."Day"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Day_userId_date_key" ON "public"."Day"("userId", "date");

-- CreateIndex
CREATE INDEX "Note_dayId_idx" ON "public"."Note"("dayId");

-- CreateIndex
CREATE INDEX "Note_projectId_idx" ON "public"."Note"("projectId");

-- CreateIndex
CREATE INDEX "Note_categoryId_idx" ON "public"."Note"("categoryId");

-- CreateIndex
CREATE INDEX "Note_type_idx" ON "public"."Note"("type");

-- CreateIndex
CREATE INDEX "Note_createdAt_idx" ON "public"."Note"("createdAt");

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "public"."Project"("userId");

-- CreateIndex
CREATE INDEX "Project_categoryId_idx" ON "public"."Project"("categoryId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "public"."Project"("status");

-- CreateIndex
CREATE INDEX "Project_dueDate_idx" ON "public"."Project"("dueDate");

-- CreateIndex
CREATE INDEX "Project_parentId_idx" ON "public"."Project"("parentId");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "public"."Task"("projectId");

-- CreateIndex
CREATE INDEX "Task_categoryId_idx" ON "public"."Task"("categoryId");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "public"."Task"("status");

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "public"."Task"("dueDate");

-- CreateIndex
CREATE INDEX "Task_parentId_idx" ON "public"."Task"("parentId");

-- CreateIndex
CREATE INDEX "TaskCompletion_dayId_idx" ON "public"."TaskCompletion"("dayId");

-- CreateIndex
CREATE INDEX "TaskCompletion_taskId_idx" ON "public"."TaskCompletion"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskCompletion_dayId_taskId_key" ON "public"."TaskCompletion"("dayId", "taskId");

-- CreateIndex
CREATE INDEX "Goal_userId_idx" ON "public"."Goal"("userId");

-- CreateIndex
CREATE INDEX "Goal_projectId_idx" ON "public"."Goal"("projectId");

-- CreateIndex
CREATE INDEX "Goal_categoryId_idx" ON "public"."Goal"("categoryId");

-- CreateIndex
CREATE INDEX "Goal_type_idx" ON "public"."Goal"("type");

-- CreateIndex
CREATE INDEX "Goal_status_idx" ON "public"."Goal"("status");

-- CreateIndex
CREATE INDEX "Goal_targetDate_idx" ON "public"."Goal"("targetDate");

-- CreateIndex
CREATE INDEX "Goal_parentId_idx" ON "public"."Goal"("parentId");

-- CreateIndex
CREATE INDEX "DailyGoal_dayId_idx" ON "public"."DailyGoal"("dayId");

-- CreateIndex
CREATE INDEX "DailyGoal_goalId_idx" ON "public"."DailyGoal"("goalId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyGoal_dayId_goalId_key" ON "public"."DailyGoal"("dayId", "goalId");

-- CreateIndex
CREATE INDEX "Habit_userId_idx" ON "public"."Habit"("userId");

-- CreateIndex
CREATE INDEX "Habit_category_idx" ON "public"."Habit"("category");

-- CreateIndex
CREATE INDEX "HabitLog_dayId_idx" ON "public"."HabitLog"("dayId");

-- CreateIndex
CREATE INDEX "HabitLog_habitId_idx" ON "public"."HabitLog"("habitId");

-- CreateIndex
CREATE UNIQUE INDEX "HabitLog_dayId_habitId_key" ON "public"."HabitLog"("dayId", "habitId");

-- CreateIndex
CREATE INDEX "TimeEntry_dayId_idx" ON "public"."TimeEntry"("dayId");

-- CreateIndex
CREATE INDEX "TimeEntry_projectId_idx" ON "public"."TimeEntry"("projectId");

-- CreateIndex
CREATE INDEX "TimeEntry_taskId_idx" ON "public"."TimeEntry"("taskId");

-- CreateIndex
CREATE INDEX "TimeEntry_startTime_idx" ON "public"."TimeEntry"("startTime");

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "public"."Category"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_name_key" ON "public"."Category"("userId", "name");

-- CreateIndex
CREATE INDEX "Tag_userId_idx" ON "public"."Tag"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_userId_name_key" ON "public"."Tag"("userId", "name");

-- CreateIndex
CREATE INDEX "NoteTag_noteId_idx" ON "public"."NoteTag"("noteId");

-- CreateIndex
CREATE INDEX "NoteTag_tagId_idx" ON "public"."NoteTag"("tagId");

-- CreateIndex
CREATE INDEX "ProjectTag_projectId_idx" ON "public"."ProjectTag"("projectId");

-- CreateIndex
CREATE INDEX "ProjectTag_tagId_idx" ON "public"."ProjectTag"("tagId");

-- CreateIndex
CREATE INDEX "TaskTag_taskId_idx" ON "public"."TaskTag"("taskId");

-- CreateIndex
CREATE INDEX "TaskTag_tagId_idx" ON "public"."TaskTag"("tagId");

-- CreateIndex
CREATE INDEX "GoalTag_goalId_idx" ON "public"."GoalTag"("goalId");

-- CreateIndex
CREATE INDEX "GoalTag_tagId_idx" ON "public"."GoalTag"("tagId");

-- CreateIndex
CREATE INDEX "HabitTag_habitId_idx" ON "public"."HabitTag"("habitId");

-- CreateIndex
CREATE INDEX "HabitTag_tagId_idx" ON "public"."HabitTag"("tagId");

-- CreateIndex
CREATE INDEX "Template_userId_idx" ON "public"."Template"("userId");

-- CreateIndex
CREATE INDEX "Template_type_idx" ON "public"."Template"("type");

-- CreateIndex
CREATE INDEX "Achievement_userId_idx" ON "public"."Achievement"("userId");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_idx" ON "public"."UserAchievement"("userId");

-- CreateIndex
CREATE INDEX "UserAchievement_achievementId_idx" ON "public"."UserAchievement"("achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "public"."UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- AddForeignKey
ALTER TABLE "public"."Day" ADD CONSTRAINT "Day_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "public"."Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskCompletion" ADD CONSTRAINT "TaskCompletion_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "public"."Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskCompletion" ADD CONSTRAINT "TaskCompletion_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Goal" ADD CONSTRAINT "Goal_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Goal" ADD CONSTRAINT "Goal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Goal" ADD CONSTRAINT "Goal_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DailyGoal" ADD CONSTRAINT "DailyGoal_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "public"."Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DailyGoal" ADD CONSTRAINT "DailyGoal_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "public"."Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Habit" ADD CONSTRAINT "Habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitLog" ADD CONSTRAINT "HabitLog_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "public"."Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitLog" ADD CONSTRAINT "HabitLog_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "public"."Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeEntry" ADD CONSTRAINT "TimeEntry_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "public"."Day"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeEntry" ADD CONSTRAINT "TimeEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeEntry" ADD CONSTRAINT "TimeEntry_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NoteTag" ADD CONSTRAINT "NoteTag_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "public"."Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NoteTag" ADD CONSTRAINT "NoteTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectTag" ADD CONSTRAINT "ProjectTag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectTag" ADD CONSTRAINT "ProjectTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskTag" ADD CONSTRAINT "TaskTag_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskTag" ADD CONSTRAINT "TaskTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GoalTag" ADD CONSTRAINT "GoalTag_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "public"."Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GoalTag" ADD CONSTRAINT "GoalTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitTag" ADD CONSTRAINT "HabitTag_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "public"."Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitTag" ADD CONSTRAINT "HabitTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Template" ADD CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Achievement" ADD CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "public"."Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
