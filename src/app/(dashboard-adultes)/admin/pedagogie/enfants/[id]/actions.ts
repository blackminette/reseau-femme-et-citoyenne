// * src/app/(dashboard-adultes)/admin/pedagogie/enfants/[id]/actions.ts
'use server';

import React from 'react';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSupabaseServer } from '@/lib/supabase';

export async function getModuleAndCours(id: number) {
    try {
        const result = await prisma.module.findUnique({
            where: { id: id },
            include: {
                cours: {
                    orderBy: {
                        ordreDansModule: 'asc'
                    }
                }
            }
        })
        return { success: true, data: result }
    } catch (error) {
        return { success: false, error: "Erreur lors de la récupération du module" }
    }
}

export async function creerCours(id: number, formData: { titre: string }) {
    try {
        if (!formData.titre || !formData.titre.trim()) {
            return { success: false, error: "Le titre du cours est obligatoire." };
        }

        const supabase = await getSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Vous devez être connecté pour créer un cours." };
        }

        const result = await prisma.cours.create({
            data: {
                titre: formData.titre,
                intervenanteId: user.id,
                moduleId: id
            }
        })

        revalidatePath(`/admin/pedagogie/enfants/${id}`);

        return { success: true, data: result }
    } catch (error) {
        return { success: false, error: "Erreur lors de la création du cours." }
    }
}

export async function supprimerCours(id: number) {
    try {
        const result = await prisma.cours.delete({
            where: { id: id }
        })

        revalidatePath(`/admin/pedagogie/enfants/${id}`);

        return { success: true }
    } catch (error) {
        return { success: false, error: "Erreur lors de la suppression du cours." }
    }
}

export async function changerOrdreCours(coursId: number, direction: 'HAUT' | 'BAS', moduleId: number) {
    try {
        const coursActuel = await prisma.cours.findUnique({ where: { id: coursId } });
        if (!coursActuel) return { success: false, error: "Cours introuvable" };

        const coursVoisin = await prisma.cours.findFirst({
            where: {
                moduleId: coursActuel.moduleId,
                ordreDansModule: direction === 'HAUT'
                    ? { lt: coursActuel.ordreDansModule } // Strictement inférieur
                    : { gt: coursActuel.ordreDansModule } // Strictement supérieur
            },
            orderBy: {
                ordreDansModule: direction === 'HAUT' ? 'desc' : 'asc'
            }
        });

        if (!coursVoisin) return { success: false, error: "Déplacement impossible" };

        await prisma.$transaction([
            prisma.cours.update({ where: { id: coursActuel.id }, data: { ordreDansModule: coursVoisin.ordreDansModule } }),
            prisma.cours.update({ where: { id: coursVoisin.id }, data: { ordreDansModule: coursActuel.ordreDansModule } })
        ]);

        revalidatePath(`/admin/pedagogie/enfants/${moduleId}`);

        return { success: true, data: true };
    } catch (error) {
        return { success: false, error: "Erreur lors de la réorganisation des cours." }
    }

}