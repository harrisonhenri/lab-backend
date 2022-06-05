/*
  Warnings:

  - You are about to drop the column `stule` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stug]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stug` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Course_stule_key";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "stule",
ADD COLUMN     "stug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Course_stug_key" ON "Course"("stug");
