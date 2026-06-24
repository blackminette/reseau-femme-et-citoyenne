/*
  Warnings:

  - Added the required column `lieuId` to the `Atelier` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PublicCible" AS ENUM ('ENFANT', 'ADULTE');

-- AlterTable
ALTER TABLE "Atelier" ADD COLUMN     "lieuId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "public" "PublicCible" NOT NULL DEFAULT 'ADULTE';

-- CreateTable
CREATE TABLE "Lieu" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresseTexte" TEXT NOT NULL,
    "adresseIdBan" TEXT NOT NULL,
    "estExterieur" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Lieu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lieu_adresseIdBan_key" ON "Lieu"("adresseIdBan");

-- AddForeignKey
ALTER TABLE "Atelier" ADD CONSTRAINT "Atelier_lieuId_fkey" FOREIGN KEY ("lieuId") REFERENCES "Lieu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
