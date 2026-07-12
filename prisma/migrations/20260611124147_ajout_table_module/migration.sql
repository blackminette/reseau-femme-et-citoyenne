/*
  Warnings:

  - You are about to drop the column `dateAtelier` on the `Atelier` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Cours` table. All the data in the column will be lost.
  - Added the required column `dateDebut` to the `Atelier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateFin` to the `Atelier` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NiveauPedagogique" AS ENUM ('NIVEAU_1', 'NIVEAU_2', 'NIVEAU_3', 'ADULTE');

-- AlterTable
ALTER TABLE "Atelier" DROP COLUMN "dateAtelier",
ADD COLUMN     "dateDebut" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateFin" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Cours" DROP COLUMN "description",
ADD COLUMN     "contenu" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "moduleId" INTEGER,
ADD COLUMN     "niveauRequis" "NiveauPedagogique" NOT NULL DEFAULT 'NIVEAU_1',
ADD COLUMN     "ordreDansModule" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "niveau" "NiveauPedagogique" DEFAULT 'NIVEAU_1';

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cours" ADD CONSTRAINT "Cours_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;
