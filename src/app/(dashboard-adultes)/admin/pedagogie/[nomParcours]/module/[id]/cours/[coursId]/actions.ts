// * src/app/(dashboard-adultes)/admin/pedagogie/[nomParcours]/module/[id]/cours/[coursId]/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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

export async function modifierTitreCours(coursId: number, editTitre: string, moduleId: number, nomParcours: string) {
    try {
        const result = await prisma.cours.update({
            where: { id: coursId },
            data: {
                titre: editTitre
            }
        });

        revalidatePath(`/admin/pedagogie/${nomParcours}/module/${moduleId}/cours/${coursId}`);

        return { success: true }
    } catch (error) {
        return { success: false, error: "Erreur lors de la modification du titre du cours." }
    }
}

export async function modifierContenuCours(coursId: number, nouveauContenue: any[], moduleId: number, nomParcours: string) {
    try {
        const result = await prisma.cours.update({
            where: { id: coursId },
            data: { contenu: nouveauContenue }
        })

        revalidatePath(`/admin/pedagogie/${nomParcours}/module/${moduleId}/cours/${coursId}`);

        return { success: true }
    } catch (error) {
        return { success: false, error: "Erreur lors de la mise a jour du contenue." }
    }
}