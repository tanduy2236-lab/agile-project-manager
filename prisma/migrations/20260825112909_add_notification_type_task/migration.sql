-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "related_task_id" INTEGER,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'GENERAL';
