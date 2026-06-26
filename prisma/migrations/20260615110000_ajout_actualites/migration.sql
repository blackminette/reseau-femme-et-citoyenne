-- CreateTable
CREATE TABLE "Actualite" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "datePublication" TIMESTAMP(3) NOT NULL,
    "extrait" TEXT NOT NULL,
    "ctaLabel" TEXT NOT NULL DEFAULT 'Lire la suite',
    "ctaHref" TEXT NOT NULL DEFAULT '/ateliers',
    "ordre" INTEGER NOT NULL DEFAULT 1,
    "estPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Actualite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Actualite_estPublic_ordre_datePublication_idx" ON "Actualite"("estPublic", "ordre", "datePublication");
