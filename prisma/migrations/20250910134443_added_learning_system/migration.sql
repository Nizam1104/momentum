-- CreateEnum
CREATE TYPE "public"."LearningTopicStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."LearningConceptStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'MASTERED');

-- AlterTable
ALTER TABLE "public"."Day" ADD COLUMN     "energyLevel" INTEGER DEFAULT 5,
ADD COLUMN     "gratitude" TEXT,
ADD COLUMN     "moodRating" INTEGER DEFAULT 5,
ADD COLUMN     "productivityRating" INTEGER DEFAULT 5,
ADD COLUMN     "sleepHours" DOUBLE PRECISION,
ADD COLUMN     "sleepQuality" INTEGER DEFAULT 5;

-- CreateTable
CREATE TABLE "public"."LearningTopic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#8B5CF6',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "public"."LearningTopicStatus" NOT NULL DEFAULT 'ACTIVE',
    "estimatedHours" DOUBLE PRECISION,
    "actualHours" DOUBLE PRECISION DEFAULT 0,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "targetDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "LearningTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LearningConcept" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "resources" JSONB DEFAULT '[]',
    "status" "public"."LearningConceptStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "understandingLevel" INTEGER NOT NULL DEFAULT 1,
    "timeSpent" DOUBLE PRECISION DEFAULT 0,
    "notes" TEXT,
    "startDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "LearningConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LearningTopicTag" (
    "topicId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "LearningTopicTag_pkey" PRIMARY KEY ("topicId","tagId")
);

-- CreateTable
CREATE TABLE "public"."LearningConceptTag" (
    "conceptId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "LearningConceptTag_pkey" PRIMARY KEY ("conceptId","tagId")
);

-- CreateIndex
CREATE INDEX "LearningTopic_userId_idx" ON "public"."LearningTopic"("userId");

-- CreateIndex
CREATE INDEX "LearningTopic_categoryId_idx" ON "public"."LearningTopic"("categoryId");

-- CreateIndex
CREATE INDEX "LearningTopic_status_idx" ON "public"."LearningTopic"("status");

-- CreateIndex
CREATE INDEX "LearningTopic_priority_idx" ON "public"."LearningTopic"("priority");

-- CreateIndex
CREATE INDEX "LearningConcept_userId_idx" ON "public"."LearningConcept"("userId");

-- CreateIndex
CREATE INDEX "LearningConcept_topicId_idx" ON "public"."LearningConcept"("topicId");

-- CreateIndex
CREATE INDEX "LearningConcept_status_idx" ON "public"."LearningConcept"("status");

-- CreateIndex
CREATE INDEX "LearningConcept_priority_idx" ON "public"."LearningConcept"("priority");

-- CreateIndex
CREATE INDEX "LearningTopicTag_topicId_idx" ON "public"."LearningTopicTag"("topicId");

-- CreateIndex
CREATE INDEX "LearningTopicTag_tagId_idx" ON "public"."LearningTopicTag"("tagId");

-- CreateIndex
CREATE INDEX "LearningConceptTag_conceptId_idx" ON "public"."LearningConceptTag"("conceptId");

-- CreateIndex
CREATE INDEX "LearningConceptTag_tagId_idx" ON "public"."LearningConceptTag"("tagId");

-- AddForeignKey
ALTER TABLE "public"."LearningTopic" ADD CONSTRAINT "LearningTopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningTopic" ADD CONSTRAINT "LearningTopic_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningConcept" ADD CONSTRAINT "LearningConcept_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningConcept" ADD CONSTRAINT "LearningConcept_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."LearningTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningTopicTag" ADD CONSTRAINT "LearningTopicTag_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."LearningTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningTopicTag" ADD CONSTRAINT "LearningTopicTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningConceptTag" ADD CONSTRAINT "LearningConceptTag_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "public"."LearningConcept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningConceptTag" ADD CONSTRAINT "LearningConceptTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
