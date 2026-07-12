// * src/app/(dashboard-adultes)/admin/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function compterUtilisateurs(role: string) {
    try {
        let count
        if (role === "ALL") {
            count = await prisma.utilisateur.count();
        } else {
            count = await prisma.utilisateur.count({
                where: { role: role },
            });
        }
        return { success: true, data: count };
    } catch (error) {
        console.error('Erreur lors du comptage des utilisateurs :', error);
        return { success: false, data: null };
    }
}

export async function compterContenu() {
    try {
        const countExercice = await prisma.exercice.count()
        const countCours = await prisma.cours.count()
        const countModule = await prisma.module.count()
        const count = countExercice + countCours + countModule
        return { success: true, data: count, dataExercice: countExercice, dataCours: countCours, dataModule: countModule };
    } catch (error) {
        console.error('Erreur lors du comptage du contenu :', error);
        return { success: false, data: null }
    }
}