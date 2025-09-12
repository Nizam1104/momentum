/*
  Warnings:

  - You are about to drop the column `notes` on the `LearningConcept` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."LearningConcept" DROP COLUMN "notes";

-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "conceptId" TEXT,
ADD COLUMN     "topicId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."LearningTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "public"."LearningConcept"("id") ON DELETE SET NULL ON UPDATE CASCADE;
