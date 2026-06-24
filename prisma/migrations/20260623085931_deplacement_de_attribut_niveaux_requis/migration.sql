/*
  Warnings:

  - You are about to drop the column `niveauRequis` on the `Cours` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cours" DROP COLUMN "niveauRequis";

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "niveauRequis" "NiveauPedagogique" NOT NULL DEFAULT 'NIVEAU_1';
