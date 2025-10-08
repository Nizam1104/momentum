-- CreateEnum
CREATE TYPE "public"."RoadStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."Road" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."RoadStatus" NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Road_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Milestone" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "roadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Road_userId_idx" ON "public"."Road"("userId");

-- CreateIndex
CREATE INDEX "Road_status_idx" ON "public"."Road"("status");

-- CreateIndex
CREATE INDEX "Road_dueDate_idx" ON "public"."Road"("dueDate");

-- CreateIndex
CREATE INDEX "Milestone_roadId_idx" ON "public"."Milestone"("roadId");

-- CreateIndex
CREATE INDEX "Milestone_isCompleted_idx" ON "public"."Milestone"("isCompleted");

-- CreateIndex
CREATE INDEX "Milestone_order_idx" ON "public"."Milestone"("order");

-- AddForeignKey
ALTER TABLE "public"."Road" ADD CONSTRAINT "Road_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Milestone" ADD CONSTRAINT "Milestone_roadId_fkey" FOREIGN KEY ("roadId") REFERENCES "public"."Road"("id") ON DELETE CASCADE ON UPDATE CASCADE;
