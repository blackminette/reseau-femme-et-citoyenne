// * src/app/(dashboard-adultes)/admin/ateliers/actions.ts
'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function listerAteliers() {
    try {
        const ateliers = await prisma.atelier.findMany({
            include: { lieu: true }
        });
        return { success: true, data: ateliers }
    } catch (error) {
        return { success: false, error: "Impossible de charger le calendrier" };
    }
}

// Récupérer tous les lieux existants
export async function listerLieux() {
    try {
        const lieux = await prisma.lieu.findMany({
            orderBy: { nom: 'asc' }
        });
        return { success: true, data: lieux };
    } catch (error) {
        console.error("Erreur récupération lieux:", error);
        return { success: false, error: "Impossible de charger les lieux" };
    }
}

export async function sauvegarderAteliers(data: {
    id?: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    placesMax: number;
    lieuId: string;
    nouveauLieuNom?: string;
    nouveauLieuAdresse?: string; // Ajout de l'adresse pour le nouveau lieu
}) {
    try {
        let finalLieuId = data.lieuId;

        // Si l'utilisateur a choisi de créer un nouveau lieu
        if (data.lieuId === "nouveau" && data.nouveauLieuNom && data.nouveauLieuAdresse) {
            const nouveauLieu = await prisma.lieu.create({
                data: {
                    nom: data.nouveauLieuNom,
                    adresseTexte: data.nouveauLieuAdresse,
                    estExterieur: false // Valeur par défaut
                }
            });
            finalLieuId = nouveauLieu.id;
        }

        const donneesAtelier = {
            titre: data.title,
            description: data.description || null,
            dateDebut: data.start,
            dateFin: data.end,
            placesMax: Number(data.placesMax),
            lieuId: finalLieuId,
        };

        if (data.id) {
            const idNumerique = Number(data.id);
            await prisma.atelier.update({
                where: { id: idNumerique },
                data: donneesAtelier
            });
        } else {
            await prisma.atelier.create({
                data: donneesAtelier
            });
        }

        revalidatePath('/admin/ateliers');
        return { success: true };
    } catch (error) {
        console.error("Erreur Prisma :", error);
        return { success: false, error: "Erreur d'enregistrement dans la base de données" };
    }
}

export async function supprimerAteliers(id: string) {
    try {
        const idNumerique = Number(id);
        await prisma.atelier.delete({ where: { id: idNumerique } });
        revalidatePath('/admin/ateliers');
        return { success: true };
    } catch (error) {
        console.error("Erreur suppression :", error);
        return { success: false, error: "Impossible de supprimer l'atelier" };
    }
}