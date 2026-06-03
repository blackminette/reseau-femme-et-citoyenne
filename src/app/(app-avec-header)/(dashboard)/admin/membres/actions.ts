// * src/app/(app-avec-header)/(dashboard)/admin/membres/actions.ts
'use server'

import { prisma } from '@/lib/prisma';

export async function listerTousLesUtilisateurs() {
    try {
        const utilisateurs = await prisma.utilisateur.findMany({
            orderBy: {
                createdAt: 'desc', // Ordre décroissant
            },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                telephone: true,
                role: true,
                createdAt: true,
                niveau: true,
                _count: {
                    select: {
                        enfants: true,
                        reservations: true,
                        coursAnimes: true,
                        dons: true,
                    }
                },
                tuteur: {
                    select: {
                        nom: true,
                        prenom: true,
                    }
                }
            }
        });

        return { success: true, data: utilisateurs };
    } catch (error) {
        console.error("Erreur Prisma :", error);
        return { success: false, error: "Impossible de charger les membres." };
    }
}