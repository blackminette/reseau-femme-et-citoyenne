// * src/app/(dashboard-adultes)/admin/pedagogie/[nomParcours]/module/[id]/listeExercice/[coursIdExercice]/exercice/[exerciceId]/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getExercice(id: number) {
    try {
        const result = await prisma.exercice.findUnique({
            where: { id: id }
        })
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: "Erreur lors de la récupération de l'exercice." }
    }
}

export async function modifierTitreExercice(exerciceId: number, editTitre: string, moduleId: number, nomParcours: string) {
    try {
        const result = await prisma.exercice.update({
            where: { id: exerciceId },
            data: {
                titre: editTitre
            }
        });

        revalidatePath(`/admin/pedagogie/${nomParcours}/module/${moduleId}`);

        return { success: true }
    } catch (error) {
        return { success: false, error: "Erreur lors de la modification du titre de l'exercice." }
    }
}

export async function modifierContenuExercice(exerciceId: number, nouveauContenue: any[], moduleId: number, nomParcours: string) {
    try {
        const result = await prisma.exercice.update({
            where: { id: exerciceId },
            data: { contenu: nouveauContenue }
        })

        revalidatePath(`/admin/pedagogie/${nomParcours}/module/${moduleId}`);

        return { success: true }
    } catch (error) {
        return { success: false, error: "Erreur lors de la mise a jour du contenue." }
    }
}