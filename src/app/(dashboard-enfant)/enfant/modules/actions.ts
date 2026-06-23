// * src/app/(dashboard-enfant)/enfant/modules/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getSupabaseServer } from '@/lib/supabase';

// Helper to map DB module titles to standard slugs
function mapTitreToSlug(titre: string): string {
    const t = titre.toLowerCase();
    if (t.includes('lecture')) return 'lecture';
    if (t.includes('numérique') || t.includes('numerique')) return 'numerique';
    if (t.includes('robotique')) return 'robotique';
    if (t.includes('anglais')) return 'anglais';
    if (t.includes('civique')) return 'civique';
    if (t.includes('éco') || t.includes('eco')) return 'eco';
    return 'lecture'; // fallback
}

// Helper to safely resolve student ID
async function obtenirEtudiantId(): Promise<string> {
    try {
        const supabase = await getSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            return user.id;
        }
    } catch (e) {
        console.warn("[Actions Enfant] Impossible de récupérer la session Supabase, utilisation du fallback:", e);
    }
    
    // Fallback: chercher le premier compte ENFANT
    const defaultEnfant = await prisma.utilisateur.findFirst({
        where: { role: 'ENFANT' }
    });
    
    return defaultEnfant?.id || 'mock-uuid-enfant';
}


// Action to get child profile data
export async function obtenirProfilEnfant() {
    try {
        const studentId = await obtenirEtudiantId();
        const user = await prisma.utilisateur.findUnique({
            where: { id: studentId }
        });

        if (!user) {
            return {
                prenom: "Léa",
                nom: "Martin",
                age: 9,
                initiales: "LM",
                progression: 0,
                badgesObtenus: 0
            };
        }

        // Calcule progression globale sur tous les modules enfants
        const modules = await prisma.module.findMany({
            where: { public: 'ENFANT' },
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
                    exercicesIds.add(comp.exerciceId);
                }
            }
        }

        totalExercices = exercicesIds.size;
        let exercicesReussis = 0;

        if (totalExercices > 0) {
            const scores = await prisma.scoreQuiz.findMany({
                where: {
                    etudiantId: studentId,
                    exerciceId: { in: Array.from(exercicesIds) }
                }
            });
            const distinctExercicesCompletes = new Set(scores.map(s => s.exerciceId));
            exercicesReussis = distinctExercicesCompletes.size;
        }

        const progressionGlobale = totalExercices > 0 ? Math.round((exercicesReussis / totalExercices) * 100) : 0;

        // Calcul simple pour les badges
        let badgesCount = 0;
        if (exercicesReussis >= 1) badgesCount += 1; // 1ers pas
        if (totalExercices > 0 && exercicesReussis >= 3) {
            // Chercher s'il y a un score parfait
            const perfectScores = await prisma.scoreQuiz.findMany({
                where: {
                    etudiantId: studentId,
                    score: { gt: 0 } // On assume que si complété c'est bon pour l'instant
                },
                include: {
                    exercice: true
                }
            });
            let perfectCount = 0;
            for (const s of perfectScores) {
                if (s.exercice.type === 'QUIZ') {
                    try {
                        const questions = JSON.parse(s.exercice.instructions);
                        if (s.score === questions.length) {
                            perfectCount++;
                        }
                    } catch {
                        // ignore parsing error
                    }
                } else {
                    perfectCount++;
                }
            }
            if (perfectCount >= 1) badgesCount += 1; // Score parfait
            if (exercicesReussis >= 10) badgesCount += 1; // Assidu
            if (perfectCount >= 5) badgesCount += 1; // Expert
        }

        return {
            prenom: user.prenom,
            nom: user.nom,
            age: 9, // default child age
            initiales: `${user.prenom[0] || ''}${user.nom[0] || ''}`.toUpperCase(),
            progression: progressionGlobale,
            badgesObtenus: badgesCount || 1 // au moins 1 par défaut pour l'accueil
        };
    } catch (e) {
        console.error("Erreur obtenirProfilEnfant:", e);
        return {
            prenom: "Léa",
            nom: "Martin",
            age: 9,
            initiales: "LM",
            progression: 0,
            badgesObtenus: 0
        };
    }
}

// Action to list child modules
export async function obtenirModulesDepuisDB() {
    try {
        const studentId = await obtenirEtudiantId();

        const modules = await prisma.module.findMany({
            where: { public: 'ENFANT' },
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

        if (modules.length === 0) {
            return { source: 'mock', modules: [] };
        }

        const mappedModules = [];

        for (const mod of modules) {
            const exercicesIds = new Set<number>();
            for (const crs of mod.cours) {
                for (const comp of crs.compositions) {
                    exercicesIds.add(comp.exerciceId);
                }
            }

            const total = exercicesIds.size;
            let completed = 0;

            if (total > 0) {
                const scores = await prisma.scoreQuiz.findMany({
                    where: {
                        etudiantId: studentId,
                        exerciceId: { in: Array.from(exercicesIds) }
                    }
                });
                const completedSet = new Set(scores.map(s => s.exerciceId));
                completed = completedSet.size;
            }

            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            const slug = mapTitreToSlug(mod.titre);

            mappedModules.push({
                id: mod.id.toString(),
                dbId: mod.id,
                label: mod.titre,
                description: mod.description || '',
                progression: pct,
                slug: slug
            });
        }

        return { source: 'db', modules: mappedModules };
    } catch (e) {
        console.error("Erreur obtenirModulesDepuisDB, fallback aux mocks:", e);
        return { source: 'mock', modules: [] };
    }
}

// Action to get details of a specific module
export async function obtenirDetailsModuleDepuisDB(moduleIdStr: string) {
    try {
        const studentId = await obtenirEtudiantId();

        let dbModule = null;
        const parsedId = parseInt(moduleIdStr);

        if (!isNaN(parsedId)) {
            dbModule = await prisma.module.findUnique({
                where: { id: parsedId },
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
        }

        if (!dbModule) {
            const allModules = await prisma.module.findMany({
                where: { public: 'ENFANT' },
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

            dbModule = allModules.find(m => mapTitreToSlug(m.titre) === moduleIdStr) || null;
        }

        if (!dbModule) {
            return null;
        }

        const activites = [];
        let completedCount = 0;

        for (const crs of dbModule.cours) {
            for (const comp of crs.compositions) {
                const ex = comp.exercice;
                
                const scoreRecord = await prisma.scoreQuiz.findFirst({
                    where: {
                        etudiantId: studentId,
                        exerciceId: ex.id
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
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
                    description: ex.instructions.startsWith('[') ? "Réponds aux questions pour tester tes connaissances !" : ex.instructions,
                    type: ex.type.toLowerCase() as 'lecon' | 'quiz' | 'exercice',
                    statut: (isTermine ? 'termine' : 'verrouille') as 'termine' | 'a_faire' | 'verrouille',
                    score: scoreString,
                    parfait: parfait,
                    dbExerciceId: ex.id,
                    dbCoursId: crs.id
                });
            }
        }

        // Déterminer l'état (verrouillé / à faire) dans l'ordre séquentiel
        let unlockedNext = false;
        const finalActivites = activites.map((act) => {
            if (act.statut === 'termine') {
                return act;
            }
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
        console.error("Erreur obtenirDetailsModuleDepuisDB:", e);
        return null;
    }
}

// Action to get details of a specific activity
export async function obtenirDetailsActiviteDepuisDB(exerciceIdStr: string) {
    try {
        const parsedId = parseInt(exerciceIdStr);
        let exercice = null;

        if (!isNaN(parsedId)) {
            exercice = await prisma.exercice.findUnique({
                where: { id: parsedId },
                include: {
                    compositions: {
                        include: {
                            cours: true
                        }
                    }
                }
            });
        }

        if (!exercice) {
            return null;
        }

        const composition = exercice.compositions[0];
        const cours = composition?.cours;

        return {
            id: exercice.id.toString(),
            dbId: exercice.id,
            titre: exercice.titre,
            instructions: exercice.instructions,
            type: exercice.type, // 'LECON', 'QUIZ', 'DESSIN'
            contenu: cours?.contenu ? (typeof cours.contenu === 'string' ? JSON.parse(cours.contenu) : cours.contenu) : []
        };
    } catch (e) {
        console.error("Erreur obtenirDetailsActiviteDepuisDB:", e);
        return null;
    }
}

// Action to save activity result
export async function sauvegarderResultatActivite(exerciceIdStr: string, score: number) {
    try {
        const studentId = await obtenirEtudiantId();
        const parsedId = parseInt(exerciceIdStr);

        if (isNaN(parsedId)) {
            console.warn(`[Actions Enfant] ID d'exercice invalide pour sauvegarde: ${exerciceIdStr}`);
            return { success: false, error: "ID invalide" };
        }

        const existing = await prisma.scoreQuiz.findFirst({
            where: {
                etudiantId: studentId,
                exerciceId: parsedId
            }
        });

        if (existing) {
            await prisma.scoreQuiz.update({
                where: { id: existing.id },
                data: { score: score }
            });
        } else {
            await prisma.scoreQuiz.create({
                data: {
                    etudiantId: studentId,
                    exerciceId: parsedId,
                    score: score
                }
            });
        }

        return { success: true };
    } catch (e) {
        console.error("Erreur sauvegarderResultatActivite:", e);
        return { success: false, error: "Erreur lors de la sauvegarde" };
    }
}

// Action to get recent activity details
export async function obtenirActiviteRecente() {
    try {
        const studentId = await obtenirEtudiantId();
        const scores = await prisma.scoreQuiz.findMany({
            where: { etudiantId: studentId },
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
                titre: ex.type === 'LECON' ? "Tu as terminé la leçon" : ex.type === 'QUIZ' ? "Tu as terminé le quiz" : "Tu as terminé le dessin",
                nomActivite: ex.titre,
                module: modTitre,
                date: new Date(s.createdAt).toLocaleDateString('fr-FR'),
                score: scoreStr,
                parfait: parfait,
                type: ex.type
            };
        });
    } catch (e) {
        console.error("Erreur obtenirActiviteRecente:", e);
        return [];
    }
}
