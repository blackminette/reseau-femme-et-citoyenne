// * src/app/(dashboard-adultes)/(dashboard)/admin/pedagogie/adultes/actions.ts
'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function listerTousLesModules() {
    try {
        const modules = await prisma.module.findMany({
            include: {
                _count: {
                    select: { cours: true } // Compte le nombre de cours par module au niveau de la BDD
                }
            },
            orderBy: {
                createdAt: 'desc', // Les plus récents en premier
            }
        });

        return { success: true, data: modules };
    } catch (error) {
        console.error("Erreur Prisma :", error);
        return { success: false, error: "Impossible de charger les modules." };
    }
}

export async function creerModule(formData: { titre: string; description: string }) {
    try {
        if (!formData.titre.trim()) {
            return { success: false, error: "Le titre du module est obligatoire." };
        }

        const nouveauModule = await prisma.module.create({
            data: {
                titre: formData.titre.trim(),
                description: formData.description.trim() || null,
            },
        });

        revalidatePath('/admin/pedagogie/adultes');

        return { success: true, data: nouveauModule };
    } catch (error) {
        console.error("Erreur lors de la création du module :", error);
        return { success: false, error: "Une erreur est survenue lors de la création du module." };
    }
}