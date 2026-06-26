/*
  Warnings:

  - You are about to drop the column `niveauRequis` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `niveau` on the `Utilisateur` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Difficulte" AS ENUM ('FACILE', 'MOYEN', 'DIFFICILE');

-- AlterEnum
ALTER TYPE "Parcours" ADD VALUE 'BUREAUTIQUE';

-- DropIndex
DROP INDEX "Actualite_estPublic_ordre_datePublication_idx";

-- AlterTable
ALTER TABLE "Actualite" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "niveauRequis",
ADD COLUMN     "difficulte" "Difficulte" NOT NULL DEFAULT 'FACILE';

-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "niveau";

-- DropEnum
DROP TYPE "NiveauPedagogique";
