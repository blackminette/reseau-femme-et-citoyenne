/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_username_key" ON "Utilisateur"("username");
