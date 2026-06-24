// * src/app/(dashboard-adultes)/admin/pedagogie/enfants/[id]/cours/[coursId]/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { NiveauPedagogique } from '@prisma/client';

export async function getCours(id: number) {
    try {
        const result = await prisma.cours.findUnique({
            where: { id: id }
        })
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: "Erreur lors de la récupération du cours." }
    }
}

export async function modifierInfosCours(
    coursId: number,
    editTitre: string,
    niveauRequis: NiveauPedagogique,
    moduleId: number
) {
    try {
        const result = await prisma.cours.update({
            where: { id: coursId },
            data: {
                titre: editTitre,
                niveauRequis: niveauRequis
            }
        });

        revalidatePath(`/admin/pedagogie/enfants/${moduleId}/cours/${coursId}`);

        return { success: true }
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erreur lors de la modification du cours." }
    }
}

export async function modifierContenuCours(coursId: number, nouveauContenue: any[], moduleId: number) {
    try {
        const result = await prisma.cours.update({
            where: { id: coursId },
            data: { contenu: nouveauContenue }
        })

        revalidatePath(`/admin/pedagogie/enfants/${moduleId}/cours/${coursId}`);

        return { success: true }
    } catch (error) {
        return { success: false, error: "Erreur lors de la mise a jour du contenue." }
    }
}