// * src/app/(dashboard-adultes)/admin/membres/actions.ts
'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function listerLesUtilisateurs(trie: string, filtre?: string) {
    try {
        const whereCondition: any = {};

        if (filtre) {
            whereCondition.OR = [
                { role: filtre },
                { nom: { contains: filtre, mode: 'insensitive' } },
                { prenom: { contains: filtre, mode: 'insensitive' } },
                { email: { contains: filtre, mode: 'insensitive' } },
            ];
        }

        const utilisateurs = await prisma.utilisateur.findMany({
            where: whereCondition,
            orderBy: {
                createdAt: trie === 'CROISSANT' ? 'asc' : 'desc',
            },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                telephone: true,
                role: true,
                createdAt: true,
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

export async function modifierUtilisateur(id: string, nouvelleDonnees: any) {
    try {
        const membreModifie = await prisma.utilisateur.update({
            where: { id: id },
            data: {
                nom: nouvelleDonnees.nom,
                prenom: nouvelleDonnees.prenom,
                email: nouvelleDonnees.email,
                telephone: nouvelleDonnees.telephone,
                role: nouvelleDonnees.role
            }
        });

        revalidatePath('/admin/membres');

        return { success: true, data: membreModifie };
    } catch (error) {
        console.error("Erreur lors de la modification :", error);
        return { success: false, error: "Impossible de modifier le membre" };
    }
}

export async function supprimerUtilisateur(id: string) {
    try {
        await prisma.utilisateur.delete({
            where: { id: id }
        });
        revalidatePath('/admin/membres');
        return { success: true };
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        return { success: false, error: "Impossible de supprimer le membre" };
    }
}