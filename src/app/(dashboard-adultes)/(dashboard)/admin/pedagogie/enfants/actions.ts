// * src/app/(dashboard-ENFANTs)/(dashboard)/admin/pedagogie/enfants/actions.ts
'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { PublicCible } from '@prisma/client';

export async function listerTousLesModules() {
    try {
        const modules = await prisma.module.findMany({
            include: {
                _count: {
                    select: { cours: true }
                }
            },
            where: { public: "ENFANT" as PublicCible },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return { success: true, data: modules };
    } catch (error) {
        console.error("Erreur Prisma (listerTousLesModules) :", error);
        return { success: false, error: "Impossible de charger les modules." };
    }
}

export async function creerModule(formData: { titre: string; description: string }) {
    try {
        if (!formData.titre || !formData.titre.trim()) {
            return { success: false, error: "Le titre du module est obligatoire." };
        }

        const nouveauModule = await prisma.module.create({
            data: {
                titre: formData.titre.trim(),
                description: formData.description.trim() || null,
                public: "ENFANT" as PublicCible,
            },
            include: {
                _count: {
                    select: { cours: true }
                }
            }
        });

        revalidatePath('/admin/pedagogie/enfants');

        return { success: true, data: nouveauModule };
    } catch (error) {
        console.error("Erreur Prisma (creerModule) :", error);
        return { success: false, error: "Une erreur est survenue lors de la création du module." };
    }
}

export async function supprimerModule(id: number) {
    try {
        await prisma.module.delete({
            where: { id: id },
        });

        revalidatePath('/admin/pedagogie/enfants');

        return { success: true };
    } catch (error) {
        console.error("Erreur Prisma (supprimerModule) :", error);
        return { success: false, error: "Une erreur est survenue lors de la suppression du module." };
    }
}