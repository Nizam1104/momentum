-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "dayId" TEXT,
ALTER COLUMN "projectId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Task_dayId_idx" ON "public"."Task"("dayId");

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "public"."Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
