// * src/app/(dashboard-adultes)/admin/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function compterUtilisateurs(role: string) {
    try {
        const count = await prisma.utilisateur.count({
            where: { role: role },
        });
        return { success: true, data: { count } };
    } catch (error) {
        console.error('Erreur lors du comptage des utilisateurs :', error);
        return { success: false, data: null };
    }
}

export async function compterContenu() {
    try {
        const countExercice = await prisma.exercice.count()
        const countCours = await prisma.cours.count()
        const count = countExercice + countCours
        return { success: true, data: count };
    } catch (error) {
        console.error('Erreur lors du comptage du contenu :', error);
        return { success: false, data: null }
    }
}

export async function recupererModulesPedagogiques() {
    try {
        const result = await prisma.module.findMany({
            orderBy: {
                createdAt: "asc"
            }
        })
        return { success: true, data: result }
    } catch (error) {
        return { success: false, error: "Erreur lors de la récupération des modules." }
    }
}