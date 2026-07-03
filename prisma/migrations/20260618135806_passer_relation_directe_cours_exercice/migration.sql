/*
  Warnings:

  - You are about to drop the `Composition` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coursId` to the `Exercice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Composition" DROP CONSTRAINT "Composition_coursId_fkey";

-- DropForeignKey
ALTER TABLE "Composition" DROP CONSTRAINT "Composition_exerciceId_fkey";

-- AlterTable
ALTER TABLE "Exercice" ADD COLUMN     "coursId" INTEGER NOT NULL,
ADD COLUMN     "ordre" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "Composition";

-- AddForeignKey
ALTER TABLE "Exercice" ADD CONSTRAINT "Exercice_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "Cours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
