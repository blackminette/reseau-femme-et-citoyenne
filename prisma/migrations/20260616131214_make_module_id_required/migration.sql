/*
  Warnings:

  - Made the column `moduleId` on table `Cours` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Cours" DROP CONSTRAINT "Cours_moduleId_fkey";

-- AlterTable
ALTER TABLE "Cours" ALTER COLUMN "moduleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Cours" ADD CONSTRAINT "Cours_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
