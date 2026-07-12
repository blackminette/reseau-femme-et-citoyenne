// * src/app/(dashboard-adultes)/membre/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getSupabaseServer } from '@/lib/supabase';

// Helper pour mapper les titres de module en slugs
function mapTitreToSlug(titre: string): string {
    const t = titre.toLowerCase();
    if (t.includes('numérique') || t.includes('numerique')) return 'numerique';
    if (t.includes('lecture')) return 'lecture';
    if (t.includes('robotique')) return 'robotique';
    if (t.includes('anglais')) return 'anglais';
    if (t.includes('civique')) return 'civique';
    if (t.includes('éco') || t.includes('eco')) return 'eco';
    if (t.includes('communication')) return 'communication';
    if (t.includes('juridique') || t.includes('droit')) return 'juridique';
    return 'numerique'; // fallback
}

// Helper pour récupérer l'ID du membre connecté
async function obtenirMembreId(): Promise<string> {
    try {
        const supabase = await getSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            return user.id;
        }
    } catch (e) {
        console.warn("[Actions Membre] Impossible de récupérer la session Supabase, utilisation du fallback:", e);
    }

    // Fallback : chercher le premier compte MEMBRE
    const defaultMembre = await prisma.utilisateur.findFirst({
        where: { role: 'MEMBRE' }
    });

    return defaultMembre?.id || 'mock-uuid-membre';
}

// Action pour obtenir le profil du membre
export async function obtenirProfilMembre() {
    try {
        const membreId = await obtenirMembreId();
        const user = await prisma.utilisateur.findUnique({
            where: { id: membreId }
        });

        if (!user) {
            return {
                prenom: "Sophie",
                nom: "Martin",
                initiales: "SM",
                progression: 0,
                badgesObtenus: 0
            };
        }

        // Calcule progression globale sur tous les modules adultes
        const modules = await prisma.module.findMany({
            where: { public: 'ADULTE' },
            include: {
                cours: {
                    include: {
                        compositions: {
                            include: {
                                exercice: true
                            }
                        }
                    }
                }
            }
        });

        let totalExercices = 0;
        const exercicesIds = new Set<number>();

        for (const mod of modules) {
            for (const crs of mod.cours) {
                for (const comp of crs.compositions) {
                    totalExercices++;
                    exercicesIds.add(comp.exercice.id);
                }
            }
        }

        const scores = await prisma.scoreQuiz.findMany({
            where: {
                etudiantId: membreId,
                exerciceId: { in: Array.from(exercicesIds) }
            }
        });

        const completedIds = new Set(scores.map(s => s.exerciceId));
        const progression = totalExercices > 0 ? Math.round((completedIds.size / totalExercices) * 100) : 0;

        const parfaits = scores.filter(s => {
            // Vérifier si score parfait
            return s.score > 0;
        });

        return {
            prenom: user.prenom,
            nom: user.nom,
            initiales: `${user.prenom[0]}${user.nom[0]}`.toUpperCase(),
            progression: progression,
            badgesObtenus: parfaits.length > 0 ? Math.min(parfaits.length, 4) : 0
        };
    } catch (e) {
        console.error("Erreur obtenirProfilMembre:", e);
        return null;
    }
}

// Action pour obtenir les modules depuis la BDD (filtré ADULTE)
export async function obtenirModulesAdulteDepuisDB() {
    try {
        const membreId = await obtenirMembreId();

        const dbModules = await prisma.module.findMany({
            where: { public: 'ADULTE' },
            include: {
                cours: {
                    orderBy: { ordreDansModule: 'asc' },
                    include: {
                        compositions: {
                            include: {
                                exercice: true
                            }
                        }
                    }
                }
            }
        });

        if (dbModules.length === 0) {
            return { modules: [], source: 'mock' as const };
        }

        const modulesAvecProgression = await Promise.all(dbModules.map(async (mod) => {
            let totalEx = 0;
            let completedEx = 0;

            for (const crs of mod.cours) {
                for (const comp of crs.compositions) {
                    totalEx++;
                    const score = await prisma.scoreQuiz.findFirst({
                        where: {
                            etudiantId: membreId,
                            exerciceId: comp.exercice.id
                        }
                    });
                    if (score) completedEx++;
                }
            }

            return {
                id: mod.id.toString(),
                label: mod.titre,
                slug: mapTitreToSlug(mod.titre),
                progression: totalEx > 0 ? Math.round((completedEx / totalEx) * 100) : 0
            };
        }));

        return { modules: modulesAvecProgression, source: 'db' as const };
    } catch (e) {
        console.error("Erreur obtenirModulesAdulteDepuisDB:", e);
        return { modules: [], source: 'mock' as const };
    }
}

// Action pour obtenir les détails d'un module spécifique
export async function obtenirDetailsModuleAdulte(moduleIdStr: string) {
    try {
        const membreId = await obtenirMembreId();
        const parsedId = parseInt(moduleIdStr);
        let dbModule = null;

        if (!isNaN(parsedId)) {
            dbModule = await prisma.module.findUnique({
                where: { id: parsedId },
                include: {
                    cours: {
                        orderBy: { ordreDansModule: 'asc' },
                        include: {
                            compositions: {
                                include: { exercice: true }
                            }
                        }
                    }
                }
            });
        }

        if (!dbModule) {
            const allModules = await prisma.module.findMany({
                where: { public: 'ADULTE' },
                include: {
                    cours: {
                        orderBy: { ordreDansModule: 'asc' },
                        include: {
                            compositions: {
                                include: { exercice: true }
                            }
                        }
                    }
                }
            });

            dbModule = allModules.find(m => mapTitreToSlug(m.titre) === moduleIdStr) || null;
        }

        if (!dbModule) return null;

        const activites = [];
        let completedCount = 0;

        for (const crs of dbModule.cours) {
            for (const comp of crs.compositions) {
                const ex = comp.exercice;

                const scoreRecord = await prisma.scoreQuiz.findFirst({
                    where: { etudiantId: membreId, exerciceId: ex.id },
                    orderBy: { createdAt: 'desc' }
                });

                const isTermine = !!scoreRecord;
                if (isTermine) completedCount++;

                let scoreString = undefined;
                let parfait = false;

                if (scoreRecord && ex.type === 'QUIZ') {
                    try {
                        const questions = JSON.parse(ex.instructions);
                        scoreString = `${scoreRecord.score}/${questions.length}`;
                        parfait = scoreRecord.score === questions.length;
                    } catch {
                        scoreString = `${scoreRecord.score}`;
                    }
                } else if (scoreRecord) {
                    scoreString = "1/1";
                    parfait = true;
                }

                activites.push({
                    id: ex.id.toString(),
                    titre: ex.titre,
                    description: ex.instructions.startsWith('[') ? "Répondez aux questions pour tester vos connaissances !" : ex.instructions,
                    type: ex.type.toLowerCase() as 'lecon' | 'quiz' | 'exercice',
                    statut: (isTermine ? 'termine' : 'verrouille') as 'termine' | 'a_faire' | 'verrouille',
                    score: scoreString,
                    parfait: parfait,
                    dbExerciceId: ex.id,
                    dbCoursId: crs.id
                });
            }
        }

        // Déterminer l'état séquentiel (verrouillé / à faire)
        let unlockedNext = false;
        const finalActivites = activites.map((act) => {
            if (act.statut === 'termine') return act;
            if (!unlockedNext) {
                unlockedNext = true;
                return { ...act, statut: 'a_faire' as const };
            }
            return { ...act, statut: 'verrouille' as const };
        });

        const total = finalActivites.length;
        const progression = total > 0 ? Math.round((completedCount / total) * 100) : 0;

        return {
            id: dbModule.id.toString(),
            dbId: dbModule.id,
            label: dbModule.titre,
            description: dbModule.description || '',
            slug: mapTitreToSlug(dbModule.titre),
            progression: progression,
            activites: finalActivites
        };
    } catch (e) {
        console.error("Erreur obtenirDetailsModuleAdulte:", e);
        return null;
    }
}

// Action pour obtenir les détails d'une activité
export async function obtenirDetailsActiviteAdulte(exerciceIdStr: string) {
    try {
        const parsedId = parseInt(exerciceIdStr);
        if (isNaN(parsedId)) return null;

        const exercice = await prisma.exercice.findUnique({
            where: { id: parsedId },
            include: {
                compositions: {
                    include: {
                        cours: true
                    }
                }
            }
        });

        if (!exercice) return null;

        const composition = exercice.compositions[0];
        const cours = composition?.cours;

        return {
            id: exercice.id.toString(),
            dbId: exercice.id,
            titre: exercice.titre,
            instructions: exercice.instructions,
            type: exercice.type,
            contenu: cours?.contenu ? (typeof cours.contenu === 'string' ? JSON.parse(cours.contenu as string) : cours.contenu) : []
        };
    } catch (e) {
        console.error("Erreur obtenirDetailsActiviteAdulte:", e);
        return null;
    }
}

// Action pour sauvegarder le résultat d'une activité
export async function sauvegarderResultatAdulte(exerciceIdStr: string, score: number) {
    try {
        const membreId = await obtenirMembreId();
        const parsedId = parseInt(exerciceIdStr);
        if (isNaN(parsedId)) return { success: false, error: "ID invalide" };

        const existing = await prisma.scoreQuiz.findFirst({
            where: { etudiantId: membreId, exerciceId: parsedId }
        });

        if (existing) {
            await prisma.scoreQuiz.update({
                where: { id: existing.id },
                data: { score: score }
            });
        } else {
            await prisma.scoreQuiz.create({
                data: {
                    etudiantId: membreId,
                    exerciceId: parsedId,
                    score: score
                }
            });
        }

        return { success: true };
    } catch (e) {
        console.error("Erreur sauvegarderResultatAdulte:", e);
        return { success: false, error: "Erreur lors de la sauvegarde" };
    }
}

// Action pour obtenir l'activité récente
export async function obtenirActiviteRecenteAdulte() {
    try {
        const membreId = await obtenirMembreId();
        const scores = await prisma.scoreQuiz.findMany({
            where: { etudiantId: membreId },
            include: {
                exercice: {
                    include: {
                        compositions: {
                            include: {
                                cours: {
                                    include: {
                                        module: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 4
        });

        return scores.map(s => {
            const ex = s.exercice;
            const comp = ex.compositions[0];
            const modTitre = comp?.cours?.module?.titre || "Module";
            let scoreStr = "1/1";
            let parfait = true;

            if (ex.type === 'QUIZ') {
                try {
                    const questions = JSON.parse(ex.instructions);
                    scoreStr = `${s.score}/${questions.length}`;
                    parfait = s.score === questions.length;
                } catch {
                    scoreStr = `${s.score}`;
                }
            }

            return {
                id: s.id,
                titre: ex.type === 'LECON' ? "Vous avez terminé la leçon" : ex.type === 'QUIZ' ? "Vous avez terminé le quiz" : "Vous avez terminé l'exercice",
                nomActivite: ex.titre,
                module: modTitre,
                date: new Date(s.createdAt).toLocaleDateString('fr-FR'),
                score: scoreStr,
                parfait: parfait,
                type: ex.type
            };
        });
    } catch (e) {
        console.error("Erreur obtenirActiviteRecenteAdulte:", e);
        return [];
    }
}
