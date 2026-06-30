-- CreateTable
CREATE TABLE "ProgressionFormation" (
    "id" SERIAL NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "moduleCle" TEXT NOT NULL,
    "etapeActuelle" INTEGER NOT NULL DEFAULT 0,
    "totalEtapes" INTEGER NOT NULL DEFAULT 1,
    "scoreQuiz" INTEGER,
    "totalQuiz" INTEGER,
    "terminee" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgressionFormation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgressionFormation_utilisateurId_moduleCle_key" ON "ProgressionFormation"("utilisateurId", "moduleCle");

-- AddForeignKey
ALTER TABLE "ProgressionFormation" ADD CONSTRAINT "ProgressionFormation_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
