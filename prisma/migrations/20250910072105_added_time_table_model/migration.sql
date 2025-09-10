-- CreateEnum
CREATE TYPE "public"."TimeSlotCategory" AS ENUM ('WORK', 'PERSONAL', 'HEALTH', 'LEARNING', 'BREAK', 'MEETING', 'EXERCISE', 'MEAL', 'COMMUTE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."TimeSlotStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED', 'PARTIAL');

-- CreateTable
CREATE TABLE "public"."TimeTable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TimeTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimeSlot" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "category" "public"."TimeSlotCategory" NOT NULL DEFAULT 'WORK',
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,
    "daysOfWeek" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "timeTableId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimeSlotCompletion" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "timeSlotId" TEXT NOT NULL,
    "status" "public"."TimeSlotStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "actualDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TimeSlotCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimeTable_userId_idx" ON "public"."TimeTable"("userId");

-- CreateIndex
CREATE INDEX "TimeTable_isActive_idx" ON "public"."TimeTable"("isActive");

-- CreateIndex
CREATE INDEX "TimeSlot_timeTableId_idx" ON "public"."TimeSlot"("timeTableId");

-- CreateIndex
CREATE INDEX "TimeSlot_userId_idx" ON "public"."TimeSlot"("userId");

-- CreateIndex
CREATE INDEX "TimeSlot_startTime_idx" ON "public"."TimeSlot"("startTime");

-- CreateIndex
CREATE INDEX "TimeSlot_category_idx" ON "public"."TimeSlot"("category");

-- CreateIndex
CREATE INDEX "TimeSlotCompletion_dayId_idx" ON "public"."TimeSlotCompletion"("dayId");

-- CreateIndex
CREATE INDEX "TimeSlotCompletion_timeSlotId_idx" ON "public"."TimeSlotCompletion"("timeSlotId");

-- CreateIndex
CREATE INDEX "TimeSlotCompletion_status_idx" ON "public"."TimeSlotCompletion"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TimeSlotCompletion_dayId_timeSlotId_key" ON "public"."TimeSlotCompletion"("dayId", "timeSlotId");

-- AddForeignKey
ALTER TABLE "public"."TimeTable" ADD CONSTRAINT "TimeTable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeSlot" ADD CONSTRAINT "TimeSlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeSlot" ADD CONSTRAINT "TimeSlot_timeTableId_fkey" FOREIGN KEY ("timeTableId") REFERENCES "public"."TimeTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeSlotCompletion" ADD CONSTRAINT "TimeSlotCompletion_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "public"."Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeSlotCompletion" ADD CONSTRAINT "TimeSlotCompletion_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "public"."TimeSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
