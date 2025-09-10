/*
  Warnings:

  - You are about to drop the `Achievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Habit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HabitLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HabitTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Template` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAchievement` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Achievement" DROP CONSTRAINT "Achievement_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Habit" DROP CONSTRAINT "Habit_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."HabitLog" DROP CONSTRAINT "HabitLog_dayId_fkey";

-- DropForeignKey
ALTER TABLE "public"."HabitLog" DROP CONSTRAINT "HabitLog_habitId_fkey";

-- DropForeignKey
ALTER TABLE "public"."HabitTag" DROP CONSTRAINT "HabitTag_habitId_fkey";

-- DropForeignKey
ALTER TABLE "public"."HabitTag" DROP CONSTRAINT "HabitTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Template" DROP CONSTRAINT "Template_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimeEntry" DROP CONSTRAINT "TimeEntry_dayId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimeEntry" DROP CONSTRAINT "TimeEntry_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimeEntry" DROP CONSTRAINT "TimeEntry_taskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserAchievement" DROP CONSTRAINT "UserAchievement_achievementId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserAchievement" DROP CONSTRAINT "UserAchievement_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "public"."Task" ALTER COLUMN "userId" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Achievement";

-- DropTable
DROP TABLE "public"."Habit";

-- DropTable
DROP TABLE "public"."HabitLog";

-- DropTable
DROP TABLE "public"."HabitTag";

-- DropTable
DROP TABLE "public"."Template";

-- DropTable
DROP TABLE "public"."TimeEntry";

-- DropTable
DROP TABLE "public"."UserAchievement";

-- DropEnum
DROP TYPE "public"."HabitType";

-- DropEnum
DROP TYPE "public"."TemplateType";

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
