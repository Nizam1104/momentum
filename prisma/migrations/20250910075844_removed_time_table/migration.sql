/*
  Warnings:

  - You are about to drop the `TimeSlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeSlotCompletion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeTable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TimeSlot" DROP CONSTRAINT "TimeSlot_timeTableId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimeSlot" DROP CONSTRAINT "TimeSlot_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimeSlotCompletion" DROP CONSTRAINT "TimeSlotCompletion_dayId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimeSlotCompletion" DROP CONSTRAINT "TimeSlotCompletion_timeSlotId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimeTable" DROP CONSTRAINT "TimeTable_userId_fkey";

-- DropTable
DROP TABLE "public"."TimeSlot";

-- DropTable
DROP TABLE "public"."TimeSlotCompletion";

-- DropTable
DROP TABLE "public"."TimeTable";

-- DropEnum
DROP TYPE "public"."TimeSlotCategory";

-- DropEnum
DROP TYPE "public"."TimeSlotStatus";
