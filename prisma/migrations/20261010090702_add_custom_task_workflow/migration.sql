/*
  Warnings:

  - A unique constraint covering the columns `[project_id,status_key]` on the table `task_columns` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status_key` to the `task_columns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task_columns" ADD COLUMN     "status_key" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "task_column_transitions" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "from_column_id" INTEGER NOT NULL,
    "to_column_id" INTEGER NOT NULL,

    CONSTRAINT "task_column_transitions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "task_column_transitions_project_id_idx" ON "task_column_transitions"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_column_transitions_from_column_id_to_column_id_key" ON "task_column_transitions"("from_column_id", "to_column_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_columns_project_id_status_key_key" ON "task_columns"("project_id", "status_key");

-- AddForeignKey
ALTER TABLE "task_column_transitions" ADD CONSTRAINT "task_column_transitions_from_column_id_fkey" FOREIGN KEY ("from_column_id") REFERENCES "task_columns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_column_transitions" ADD CONSTRAINT "task_column_transitions_to_column_id_fkey" FOREIGN KEY ("to_column_id") REFERENCES "task_columns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
