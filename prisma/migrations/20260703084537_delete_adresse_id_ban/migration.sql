/*
  Warnings:

  - You are about to drop the column `adresseIdBan` on the `Lieu` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Lieu_adresseIdBan_key";

-- AlterTable
ALTER TABLE "Lieu" DROP COLUMN "adresseIdBan";
