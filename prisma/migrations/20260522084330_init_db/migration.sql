-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'MEMBRE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tuteurId" TEXT,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atelier" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "dateAtelier" TIMESTAMP(3) NOT NULL,
    "placesMax" INTEGER NOT NULL DEFAULT 15,
    "estPrive" BOOLEAN NOT NULL DEFAULT false,
    "typePaiement" TEXT,
    "creneauVerrouille" BOOLEAN NOT NULL DEFAULT false,
    "effectifPrevu" INTEGER,
    "partenaireId" TEXT,

    CONSTRAINT "Atelier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "dateReservation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'PENDING',
    "utilisateurId" TEXT NOT NULL,
    "atelierId" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cours" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "estPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "intervenanteId" TEXT NOT NULL,

    CONSTRAINT "Cours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercice" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Exercice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Composition" (
    "id" SERIAL NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 1,
    "coursId" INTEGER NOT NULL,
    "exerciceId" INTEGER NOT NULL,

    CONSTRAINT "Composition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreQuiz" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "etudiantId" TEXT NOT NULL,
    "exerciceId" INTEGER NOT NULL,

    CONSTRAINT "ScoreQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programme" (
    "id" SERIAL NOT NULL,
    "datePlanification" TIMESTAMP(3) NOT NULL,
    "coursId" INTEGER NOT NULL,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoiteAIdees" (
    "id" SERIAL NOT NULL,
    "sujet" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "membreId" TEXT NOT NULL,

    CONSTRAINT "BoiteAIdees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Don" (
    "id" SERIAL NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "dateDon" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'COMPLETED',
    "utilisateurId" TEXT NOT NULL,

    CONSTRAINT "Don_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Temoignage" (
    "id" SERIAL NOT NULL,
    "contenu" TEXT NOT NULL,
    "estValide" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateurId" TEXT NOT NULL,

    CONSTRAINT "Temoignage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageContact" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sujet" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "envoyeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_utilisateurId_atelierId_key" ON "Reservation"("utilisateurId", "atelierId");

-- CreateIndex
CREATE UNIQUE INDEX "Composition_coursId_exerciceId_key" ON "Composition"("coursId", "exerciceId");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_tuteurId_fkey" FOREIGN KEY ("tuteurId") REFERENCES "Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atelier" ADD CONSTRAINT "Atelier_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_atelierId_fkey" FOREIGN KEY ("atelierId") REFERENCES "Atelier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cours" ADD CONSTRAINT "Cours_intervenanteId_fkey" FOREIGN KEY ("intervenanteId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Composition" ADD CONSTRAINT "Composition_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "Cours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Composition" ADD CONSTRAINT "Composition_exerciceId_fkey" FOREIGN KEY ("exerciceId") REFERENCES "Exercice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreQuiz" ADD CONSTRAINT "ScoreQuiz_exerciceId_fkey" FOREIGN KEY ("exerciceId") REFERENCES "Exercice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programme" ADD CONSTRAINT "Programme_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "Cours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoiteAIdees" ADD CONSTRAINT "BoiteAIdees_membreId_fkey" FOREIGN KEY ("membreId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Don" ADD CONSTRAINT "Don_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Temoignage" ADD CONSTRAINT "Temoignage_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
