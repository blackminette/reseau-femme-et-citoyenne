// * src/app/(app-avec-header)/(dashboard)/admin/reservations/actions.ts
'use server';

import { prisma } from "@/lib/prisma"; // Ajuste le chemin si nécessaire
import { revalidatePath } from "next/cache";

export type ActionResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

export interface ReservationFormatee {
    id: string;
    membreNom: string;
    enfantNom?: string;
    atelierNom: string;
    dateAtelier: string;
    heureAtelier: string;
    statut: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

/**
 * Récupère toutes les réservations avec les informations tuteur/enfant calculées dynamiquement.
 */
export async function recupererToutesLesReservations(): Promise<ActionResponse<ReservationFormatee[]>> {
    try {
        const reservations = await prisma.reservation.findMany({
            include: {
                utilisateur: {
                    include: {
                        tuteur: true // Permet de savoir si l'utilisateur qui est inscrit est un enfant
                    }
                },
                atelier: true
            },
            orderBy: {
                dateReservation: 'desc'
            }
        });

        const dataFormatee: ReservationFormatee[] = reservations.map(res => {
            const u = res.utilisateur;
            let membreNom = `${u.prenom} ${u.nom}`;
            let enfantNom: string | undefined = undefined;

            // Si l'utilisateur inscrit a un tuteur, alors u est l'enfant, et le tuteur est le membre principal
            if (u.tuteur) {
                membreNom = `${u.tuteur.prenom} ${u.tuteur.nom}`;
                enfantNom = `${u.prenom} ${u.nom}`;
            }

            return {
                id: res.id.toString(),
                membreNom,
                enfantNom,
                atelierNom: res.atelier.titre,
                // Utilisation des vraies dates de l'Atelier
                dateAtelier: res.atelier.dateDebut.toISOString().split('T')[0],
                heureAtelier: res.atelier.dateDebut.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                statut: res.statut as 'PENDING' | 'CONFIRMED' | 'CANCELLED'
            };
        });

        return { success: true, data: dataFormatee };
    } catch (error) {
        console.error("Erreur [recupererToutesLesReservations]:", error);
        return { success: false, error: "Impossible de charger les réservations." };
    }
}

/**
 * Récupère les compteurs de statistiques globales pour les réservations
 */
export async function recupererStatsReservations(): Promise<ActionResponse<{ total: number; enAttente: number; aujourdhui: number }>> {
    try {
        const debutAujourdhui = new Date();
        debutAujourdhui.setHours(0, 0, 0, 0);

        const finAujourdhui = new Date();
        finAujourdhui.setHours(23, 59, 59, 999);

        const [total, enAttente, aujourdhui] = await Promise.all([
            prisma.reservation.count(),
            prisma.reservation.count({ where: { statut: 'PENDING' } }),
            prisma.reservation.count({
                where: {
                    dateReservation: {
                        gte: debutAujourdhui,
                        lte: finAujourdhui
                    }
                }
            })
        ]);

        return {
            success: true,
            data: { total, enAttente, aujourdhui }
        };
    } catch (error) {
        console.error("Erreur [recupererStatsReservations]:", error);
        return { success: false, error: "Impossible de calculer les statistiques." };
    }
}

/**
 * Met à jour le statut d'une réservation (PENDING -> CONFIRMED / CANCELLED)
 */
export async function changerStatutReservation(
    id: string,
    nouveauStatut: 'CONFIRMED' | 'CANCELLED' | 'PENDING'
): Promise<ActionResponse<boolean>> {
    try {
        const idNumerique = parseInt(id, 10);
        if (isNaN(idNumerique)) {
            return { success: false, error: "ID invalide." };
        }

        await prisma.reservation.update({
            where: { id: idNumerique },
            data: { statut: nouveauStatut }
        });

        revalidatePath("/admin/reservations");
        return { success: true, data: true };
    } catch (error) {
        console.error("Erreur [changerStatutReservation]:", error);
        return { success: false, error: "Échec de la mise à jour." };
    }
}