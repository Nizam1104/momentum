/*
  Warnings:

  - You are about to drop the `TaskCompletion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TaskCompletion" DROP CONSTRAINT "TaskCompletion_dayId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TaskCompletion" DROP CONSTRAINT "TaskCompletion_taskId_fkey";

-- DropTable
DROP TABLE "public"."TaskCompletion";
