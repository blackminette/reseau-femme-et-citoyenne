// * src/app/(dashboard-adultes)/admin/apprenants/actions.ts
'use server'

import { prisma } from '@/lib/prisma';

export async function listerLesApprenants() {
    try {
        const apprenants = await prisma.utilisateur.findMany({
            where: {
                role: {
                    in: ['ETUDIANT', 'ENFANT']
                }
            },
            select: {
                id: true,
                nom: true,
                prenom: true,
                username: true,
                telephone: true,
                role: true,
                isActive: true,
                createdAt: true,
                _count: {
                    select: {
                        reservations: true,
                    }
                },
                tuteur: {
                    select: {
                        nom: true,
                        prenom: true,
                    }
                },
                ScoreQuiz: {
                    select: {
                        id: true,
                        score: true,
                        createdAt: true,
                        exercice: {
                            select: {
                                id: true,
                                titre: true,
                                cours: {
                                    select: {
                                        id: true,
                                        titre: true,
                                        module: {
                                            select: {
                                                id: true,
                                                titre: true,
                                                parcours: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return { success: true, data: apprenants };
    } catch (error) {
        console.error("Erreur listerLesApprenants :", error);
        return { success: false, error: "Impossible de charger les apprenants." };
    }
}