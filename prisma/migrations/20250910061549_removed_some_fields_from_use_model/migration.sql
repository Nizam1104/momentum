/*
  Warnings:

  - You are about to drop the column `energyLevel` on the `Day` table. All the data in the column will be lost.
  - You are about to drop the column `gratitude` on the `Day` table. All the data in the column will be lost.
  - You are about to drop the column `moodRating` on the `Day` table. All the data in the column will be lost.
  - You are about to drop the column `productivityRating` on the `Day` table. All the data in the column will be lost.
  - You are about to drop the column `sleepHours` on the `Day` table. All the data in the column will be lost.
  - You are about to drop the column `sleepQuality` on the `Day` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Day" DROP COLUMN "energyLevel",
DROP COLUMN "gratitude",
DROP COLUMN "moodRating",
DROP COLUMN "productivityRating",
DROP COLUMN "sleepHours",
DROP COLUMN "sleepQuality";
