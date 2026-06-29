-- DropForeignKey
ALTER TABLE "Atelier" DROP CONSTRAINT "Atelier_partenaireId_fkey";

-- DropForeignKey
ALTER TABLE "Cours" DROP CONSTRAINT "Cours_intervenanteId_fkey";

-- DropForeignKey
ALTER TABLE "Don" DROP CONSTRAINT "Don_utilisateurId_fkey";

-- DropForeignKey
ALTER TABLE "MessageContact" DROP CONSTRAINT "MessageContact_utilisateurId_fkey";

-- DropForeignKey
ALTER TABLE "Utilisateur" DROP CONSTRAINT "Utilisateur_tuteurId_fkey";

-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_tuteurId_fkey" FOREIGN KEY ("tuteurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atelier" ADD CONSTRAINT "Atelier_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cours" ADD CONSTRAINT "Cours_intervenanteId_fkey" FOREIGN KEY ("intervenanteId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreQuiz" ADD CONSTRAINT "ScoreQuiz_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Don" ADD CONSTRAINT "Don_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageContact" ADD CONSTRAINT "MessageContact_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
