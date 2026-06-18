// * src/app/(dashboard-adultes)/admin/pedagogie/adultes/[id]/listeExercice/[coursIdExercice]/actions.ts
'use server';

import { prisma } from '@/lib/prisma';

export async function getListeExercice(coursId: number) {
    try {
        const result = await prisma.exercice.findMany({
            where: {
                coursId: coursId
            },
            orderBy: {
                ordre: "asc"
            }
        });

        return { success: true, data: result }
    } catch (error) {
        return { success: false, error: "Erreur lors du chargement des exercices." }
    }
}