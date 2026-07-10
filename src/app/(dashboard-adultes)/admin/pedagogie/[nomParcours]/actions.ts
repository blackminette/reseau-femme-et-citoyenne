// * src/app/(dashboard-adultes)/admin/pedagogie/[nomParcours]/actions.ts
'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Parcours, Difficulte } from '@prisma/client';

export async function listerTousLesModules(parcours: Parcours) {
    try {
        const modules = await prisma.module.findMany({
            where: { parcours: { has: parcours } },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                titre: true,
                description: true,
                isPublished: true,
                parcours: true,
                difficulte: true,
                _count: {
                    select: { cours: true }
                }
            }
        });

        return { success: true, data: modules };
    } catch (error) {
        console.error("Erreur Prisma (listerTousLesModules) :", error);
        return { success: false, error: "Impossible de charger les modules." };
    }
}

export async function creerModule(
    formData: { titre: string; description: string; difficulte: Difficulte },
    parcours: Parcours,
    nomParcours: string
) {
    try {
        if (!formData.titre || !formData.titre.trim()) {
            return { success: false, error: "Le titre du module est obligatoire." };
        }

        const parcoursAdultes: Parcours[] = [Parcours.NUMERIQUE_ADULTE, Parcours.ORAL];
        const publicCible = parcoursAdultes.includes(parcours) ? 'ADULTE' : 'ENFANT';

        const nouveauModule = await prisma.module.create({
            data: {
                titre: formData.titre.trim(),
                description: formData.description?.trim() || null,
                public: publicCible,
                difficulte: formData.difficulte,
                parcours: [parcours]
            },
            include: {
                _count: {
                    select: { cours: true }
                }
            }
        });

        revalidatePath(`/admin/pedagogie/${nomParcours}`);

        return { success: true, data: nouveauModule };
    } catch (error) {
        console.error("Erreur Prisma (creerModule) :", error);
        return { success: false, error: "Une erreur est survenue lors de la création du module." };
    }
}

export async function modifierModule(
    formData: { id: number; titre: string; description: string; difficulte: Difficulte },
    nomParcours: string
) {
    try {
        if (!formData.titre || !formData.titre.trim()) {
            return { success: false, error: "Le titre du module est obligatoire." };
        }

        const moduleModifie = await prisma.module.update({
            where: {
                id: formData.id,
            },
            data: {
                titre: formData.titre.trim(),
                description: formData.description?.trim() || null,
                difficulte: formData.difficulte,
            },
            include: {
                _count: {
                    select: { cours: true }
                }
            }
        });

        revalidatePath(`/admin/pedagogie/${nomParcours}`);

        return { success: true, data: moduleModifie };
    } catch (error) {
        console.error("Erreur Prisma (modifierModule) :", error);
        return { success: false, error: "Une erreur est survenue lors de la modification du module." };
    }
}

export async function supprimerModule(id: number, nomParcours: string) {
    try {
        await prisma.module.delete({
            where: { id: id },
        });

        revalidatePath(`/admin/pedagogie/${nomParcours}`);

        return { success: true };
    } catch (error) {
        console.error("Erreur Prisma (supprimerModule) :", error);
        return { success: false, error: "Une erreur est survenue lors de la suppression du module." };
    }
}

export async function activateModule(id: number, status: boolean, nomParcours: string) {
    try {
        const result = await prisma.module.update({
            where: { id: id },
            data: {
                isPublished: status
            },
            include: {
                _count: {
                    select: { cours: true }
                }
            }
        });

        revalidatePath(`/admin/pedagogie/${nomParcours}`);

        return { success: true, data: result };
    } catch (error) {
        console.error("Erreur Prisma (activateModule) :", error);
        return { success: false, error: "Une erreur est survenue lors de l'activation du module." };
    }
}