// * src/app/(dashboard-adultes)/admin/pedagogie/actions.ts
'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { PublicCible } from '@prisma/client';

export interface ModuleData {
    id: number;
    titre: string;
    description: string | null;
    public: PublicCible;
    cours: Array<{
        id: number;
        titre: string;
        estPublic: boolean;
        ordreDansModule: number;
        exercices: Array<{
            id: number;
            titre: string;
            type: string;
            instructions: string;
            contenu: any;
            ordre: number;
        }>;
    }>;
}

// Get all modules by target public (ENFANT or ADULTE)
export async function listerModulesParPublic(targetPublic: 'ENFANT' | 'ADULTE') {
    try {
        const modules = await prisma.module.findMany({
            where: { public: targetPublic as PublicCible },
            include: {
                cours: {
                    orderBy: { ordreDansModule: 'asc' },
                    include: {
                        exercices: {
                            orderBy: { ordre: 'asc' }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: modules as unknown as ModuleData[] };
    } catch (error) {
        console.error("Erreur (listerModulesParPublic):", error);
        return { success: false, error: "Impossible de récupérer les modules." };
    }
}

// Create a new Cours / Lesson under a specific module
export async function ajouterCoursDansModule(formData: {
    moduleId: number;
    titre: string;
    contenuHTML?: string;
    estPublic?: boolean;
    intervenanteId?: string; // fallback if needed
}) {
    try {
        if (!formData.titre || !formData.titre.trim()) {
            return { success: false, error: "Le titre du cours est requis." };
        }

        // Retrieve last order index in module
        const count = await prisma.cours.count({
            where: { moduleId: formData.moduleId }
        });

        // Let's get a valid user with role INTERVENANT or ADMIN to link the cours as intervenanteId
        let creator = await prisma.utilisateur.findFirst({
            where: { role: 'INTERVENANT' }
        });
        if (!creator) {
            creator = await prisma.utilisateur.findFirst({
                where: { role: 'ADMIN' }
            });
        }
        if (!creator) {
            creator = await prisma.utilisateur.findFirst();
        }

        if (!creator) {
            return { success: false, error: "Aucun utilisateur trouvé en base pour lier le cours." };
        }

        const nouveauCours = await prisma.cours.create({
            data: {
                titre: formData.titre.trim(),
                estPublic: formData.estPublic !== undefined ? formData.estPublic : true,
                moduleId: formData.moduleId,
                ordreDansModule: count + 1,
                intervenanteId: creator.id,
                contenu: formData.contenuHTML ? [formData.contenuHTML] : []
            }
        });

        revalidatePath('/admin/pedagogie/adultes');
        revalidatePath('/admin/pedagogie/enfants');

        return { success: true, data: nouveauCours };
    } catch (error) {
        console.error("Erreur (ajouterCoursDansModule):", error);
        return { success: false, error: "Erreur lors de l'ajout du cours." };
    }
}

// Create a new Exercice under a specific Cours / Lesson
export async function ajouterExerciceDansCours(formData: {
    coursId: number;
    titre: string;
    instructions: string;
    type: 'QUIZ' | 'DESSIN' | 'TEXTE' | 'COMPLEMENT';
    contenu: string; // JSON string
    competence?: string; // Compétence associée
}) {
    try {
        if (!formData.titre || !formData.titre.trim()) {
            return { success: false, error: "Le titre de l'exercice est requis." };
        }

        let parsedContenu = [];
        if (formData.contenu && formData.contenu.trim()) {
            try {
                parsedContenu = JSON.parse(formData.contenu);
            } catch (e) {
                return { success: false, error: "Le format JSON du contenu est invalide." };
            }
        }

        // Get last order index in cours
        const count = await prisma.exercice.count({
            where: { coursId: formData.coursId }
        });

        const nouvelExercice = await prisma.exercice.create({
            data: {
                titre: formData.titre.trim(),
                instructions: formData.instructions.trim(),
                type: formData.type,
                contenu: parsedContenu,
                coursId: formData.coursId,
                ordre: count + 1,
                competence: formData.competence?.trim() || null
            }
        });

        revalidatePath('/admin/pedagogie/adultes');
        revalidatePath('/admin/pedagogie/enfants');

        return { success: true, data: nouvelExercice };
    } catch (error) {
        console.error("Erreur (ajouterExerciceDansCours):", error);
        return { success: false, error: "Erreur lors de l'ajout de l'exercice." };
    }
}

// Edit an existing Cours / Lesson
export async function modifierCoursDansModule(formData: {
    coursId: number;
    titre: string;
    contenuHTML?: string;
    estPublic?: boolean;
}) {
    try {
        if (!formData.titre || !formData.titre.trim()) {
            return { success: false, error: "Le titre du cours est requis." };
        }

        const coursModifie = await prisma.cours.update({
            where: { id: formData.coursId },
            data: {
                titre: formData.titre.trim(),
                estPublic: formData.estPublic !== undefined ? formData.estPublic : true,
                contenu: formData.contenuHTML ? [formData.contenuHTML] : []
            }
        });

        revalidatePath('/admin/pedagogie/adultes');
        revalidatePath('/admin/pedagogie/enfants');

        return { success: true, data: coursModifie };
    } catch (error) {
        console.error("Erreur (modifierCoursDansModule):", error);
        return { success: false, error: "Erreur lors de la modification du cours." };
    }
}
