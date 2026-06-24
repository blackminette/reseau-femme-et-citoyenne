// * src/app/(dashboard-adultes)/admin/pedagogie/adultes/[id]/listeExercice/[coursIdExercice]/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getListeExercice(coursId: number) {
    try {
        const result = await prisma.exercice.findMany({
            where: { coursId: coursId },
            orderBy: { ordre: "asc" }
        });
        return { success: true, data: result };
    } catch (error) {
        console.error("Erreur dans getListeExercice :", error);
        return { success: false, error: "Erreur lors du chargement des exercices." };
    }
}

export async function creerExercice(coursId: number, data: { titre: string, type: string, ordre: number }, moduleId: number) {
    try {
        if (!coursId || isNaN(coursId)) {
            return { success: false, error: "L'identifiant du cours est invalide ou manquant." };
        }

        const result = await prisma.exercice.create({
            data: {
                coursId: coursId,
                titre: data.titre,
                type: data.type,
                ordre: data.ordre,
                instructions: "Consigne"
            }
        });

        const path = `/admin/pedagogie/adultes/${moduleId}/listeExercice/${coursId}`;
        console.log("Revalidation du chemin :", path);
        revalidatePath(path, 'page');

        return { success: true };
    } catch (error) {
        console.error("Erreur dans creerExercice :", error);
        return { success: false, error: "Erreur lors de la création de l'exercice." };
    }
}

export async function supprimerExercice(exerciceId: number, coursId: number, moduleId: number) {
    try {
        if (!exerciceId || isNaN(exerciceId)) {
            return { success: false, error: "L'identifiant de l'exercice est invalide ou manquant." };
        }

        await prisma.exercice.delete({
            where: { id: exerciceId }
        });

        const path = `/admin/pedagogie/adultes/${moduleId}/listeExercice/${coursId}`;
        revalidatePath(path, 'page');

        return { success: true };
    } catch (error) {
        console.error("Erreur dans supprimerExercice :", error);
        return { success: false, error: "Erreur lors de la suppression de l'exercice." };
    }
}

export async function changerOrdreExercice(
    exerciceId: number,
    direction: 'HAUT' | 'BAS',
    coursId: number,
    moduleId: number
) {
    try {
        const exerciceActuel = await prisma.exercice.findUnique({ where: { id: exerciceId } });
        if (!exerciceActuel) return { success: false, error: "Exercice introuvable." };

        const exerciceVoisin = await prisma.exercice.findFirst({
            where: {
                coursId: coursId,
                ordre: direction === 'HAUT'
                    ? { lt: exerciceActuel.ordre }
                    : { gt: exerciceActuel.ordre }
            },
            orderBy: {
                ordre: direction === 'HAUT' ? 'desc' : 'asc'
            }
        });

        if (!exerciceVoisin) return { success: true, message: "Déplacement non nécessaire." };

        const ordreActuel = exerciceActuel.ordre;
        const ordreVoisin = exerciceVoisin.ordre;

        await prisma.$transaction([
            prisma.exercice.update({
                where: { id: exerciceActuel.id },
                data: { ordre: -1 }
            }),
            prisma.exercice.update({
                where: { id: exerciceVoisin.id },
                data: { ordre: ordreActuel }
            }),
            prisma.exercice.update({
                where: { id: exerciceActuel.id },
                data: { ordre: ordreVoisin }
            })
        ]);

        const path = `/admin/pedagogie/adultes/${moduleId}/listeExercice/${coursId}`;
        revalidatePath(path, 'page');

        return { success: true };
    } catch (error) {
        console.error("Erreur dans changerOrdreExercice :", error);
        return { success: false, error: "Erreur lors du réarrangement des exercices." };
    }
}