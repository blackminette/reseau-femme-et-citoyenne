// * src/app/(dashboard-adultes)/admin/pedagogie/adultes/[id]/cours/[coursId]/actions.ts
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

export async function modifierTitreCours(id: number, editTitre: string, moduleId: number) {
    try {
        const result = await prisma.cours.update({
            where: { id: id },
            data: {
                titre: editTitre
            }
        });

        revalidatePath(`/admin/pedagogie/adultes/${moduleId}/cours/${id}`)

        return { success: true }
    } catch (error) {
        return { success: false, error: "Erreur lors de la modification du titre du cours." }
    }
}