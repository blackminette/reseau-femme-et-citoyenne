-- AlterTable
ALTER TABLE "MessageContact" ADD COLUMN     "utilisateurId" TEXT;

-- AddForeignKey
ALTER TABLE "MessageContact" ADD CONSTRAINT "MessageContact_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;
