/*
  Warnings:

  - You are about to drop the column `isActive` on the `Utilisateur` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exercice" ADD COLUMN     "competence" TEXT;

-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "isActive";

-- CreateTable
CREATE TABLE "TentativeExercice" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "bonnesReponses" INTEGER NOT NULL,
    "mauvaisesReponses" INTEGER NOT NULL,
    "dureeSecondes" INTEGER,
    "assistee" BOOLEAN NOT NULL DEFAULT false,
    "etudiantId" TEXT NOT NULL,
    "exerciceId" INTEGER NOT NULL,

    CONSTRAINT "TentativeExercice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TentativeExercice" ADD CONSTRAINT "TentativeExercice_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TentativeExercice" ADD CONSTRAINT "TentativeExercice_exerciceId_fkey" FOREIGN KEY ("exerciceId") REFERENCES "Exercice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
