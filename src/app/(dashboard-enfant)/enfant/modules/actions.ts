// * src/app/(dashboard-enfant)/enfant/modules/actions.ts
'use server';

import { Parcours } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSupabaseServer } from '@/lib/supabase';

// Helper to map DB module titles to standard slugs
function mapTitreToSlug(titre: string): string {
    const t = titre.toLowerCase();
    if (t.includes('lecture')) return 'lecture';
    if (t.includes('numérique') || t.includes('numerique') || t.includes('scratch') || t.includes('code') || t.includes('web') || t.includes('html')) return 'numerique';
    if (t.includes('robotique') || t.includes('robot')) return 'robotique';
    if (t.includes('anglais')) return 'anglais';
    if (t.includes('civique') || t.includes('citoyen')) return 'civique';
    if (t.includes('napoléon') || t.includes('napoleon')) return 'napoleon';
    if (t.includes('éco') || t.includes('eco')) return 'eco';
    return 'lecture'; // fallback
}

// Helper to handle and log DB connection errors cleanly
function gererErreurBaseDeDonnees(nomFonction: string, err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('getaddrinfo') || msg.includes('ECONNREFUSED') || msg.includes('pooler') || msg.includes('Can\'t reach database')) {
        console.warn(`[Base de données Hors Ligne] ${nomFonction}: Impossible de se connecter à la base de données. Utilisation des fallbacks.`);
    } else {
        console.error(`Erreur ${nomFonction}:`, err);
    }
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
    try {
        const defaultEnfant = await prisma.utilisateur.findFirst({
            where: { role: 'ENFANT' }
        });
        return defaultEnfant?.id || 'mock-uuid-enfant';
    } catch (e) {
        console.warn("[Actions Enfant] Impossible de se connecter à la base de données, utilisation du UUID fallback:", e);
        return 'mock-uuid-enfant';
    }
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
            where: {
                public: 'ENFANT',
                isPublished: true
            },
            include: {
                cours: {
                    include: {
                        exercices: true
                    }
                }
            }
        });

        let totalExercices = 0;
        const exercicesIds = new Set<number>();

        for (const mod of modules) {
            for (const crs of mod.cours) {
                for (const ex of crs.exercices) {
                    exercicesIds.add(ex.id);
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
        gererErreurBaseDeDonnees("obtenirProfilEnfant", e);
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
            where: {
                public: 'ENFANT',
                isPublished: true
            },
            include: {
                cours: {
                    include: {
                        exercices: true
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
                for (const ex of crs.exercices) {
                    exercicesIds.add(ex.id);
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
        gererErreurBaseDeDonnees("obtenirModulesDepuisDB", e);
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
                            exercices: true
                        }
                    }
                }
            });
        }

        if (!dbModule) {
            const allModules = await prisma.module.findMany({
                where: {
                    public: 'ENFANT',
                    isPublished: true
                },
                include: {
                    cours: {
                        orderBy: { ordreDansModule: 'asc' },
                        include: {
                            exercices: true
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
            // 1. Ajouter le cours (la leçon) elle-même comme activité !
            const coursKey = `cours_${crs.id}`;
            activites.push({
                id: coursKey,
                titre: crs.titre,
                description: "Découvre et apprends les notions clés de cette leçon !",
                type: 'lecon',
                statut: 'verrouille',
                score: undefined,
                parfait: false,
                dbCoursId: crs.id
            });

            // 2. Ajouter les exercices associés à ce cours
            for (const ex of crs.exercices) {
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

                const lowerType = ex.type.toUpperCase();
                const isQuizType = lowerType === 'QUIZ' || lowerType === 'QCM' || lowerType === 'VRAI_FAUX';

                if (scoreRecord && isQuizType) {
                    try {
                        const contenuParsed = typeof ex.contenu === 'string' ? JSON.parse(ex.contenu) : ex.contenu;
                        const totalQuestions = Array.isArray(contenuParsed) ? contenuParsed.length : 0;
                        if (totalQuestions > 0) {
                            scoreString = `${scoreRecord.score}/${totalQuestions}`;
                            parfait = scoreRecord.score === totalQuestions;
                        } else {
                            const questions = JSON.parse(ex.instructions);
                            scoreString = `${scoreRecord.score}/${questions.length}`;
                            parfait = scoreRecord.score === questions.length;
                        }
                    } catch {
                        scoreString = `${scoreRecord.score}`;
                    }
                } else if (scoreRecord) {
                    scoreString = "1/1";
                    parfait = true;
                }

                let actType: 'lecon' | 'quiz' | 'exercice' = 'exercice';
                if (isQuizType) {
                    actType = 'quiz';
                }

                const descStr = ex.instructions || "";
                const isInstructionJson = descStr.startsWith('[') || descStr.startsWith('{');

                activites.push({
                    id: ex.id.toString(),
                    titre: ex.titre,
                    description: isInstructionJson ? "Réponds aux questions pour tester tes connaissances !" : descStr,
                    type: actType,
                    statut: (isTermine ? 'termine' : 'verrouille') as 'termine' | 'a_faire' | 'verrouille',
                    score: scoreString,
                    parfait: parfait,
                    dbExerciceId: ex.id,
                    dbCoursId: crs.id
                });
            }
        }

        // Déterminer l'état (tout déverrouillé pour l'exploration libre)
        const finalActivites = activites.map((act) => {
            if (act.statut === 'termine') {
                return act;
            }
            return { ...act, statut: 'a_faire' as const };
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
        gererErreurBaseDeDonnees("obtenirDetailsModuleDepuisDB", e);
        return null;
    }
}

// Action to get details of a specific activity
export async function obtenirDetailsActiviteDepuisDB(exerciceIdStr: string) {
    try {
        if (exerciceIdStr.startsWith('cours_')) {
            const coursId = parseInt(exerciceIdStr.replace('cours_', ''));
            const cours = await prisma.cours.findUnique({
                where: { id: coursId }
            });
            if (!cours) return null;
            return {
                id: exerciceIdStr,
                dbId: cours.id,
                titre: cours.titre,
                instructions: "Lis attentivement le cours !",
                type: "LECON",
                contenu: cours.contenu ? (typeof cours.contenu === 'string' ? JSON.parse(cours.contenu) : cours.contenu) : []
            };
        }

        const parsedId = parseInt(exerciceIdStr);
        let exercice = null;

        if (!isNaN(parsedId)) {
            exercice = await prisma.exercice.findUnique({
                where: { id: parsedId },
                include: {
                    cours: true
                }
            });
        }

        if (!exercice) {
            return null;
        }

        let mappedType = exercice.type.toUpperCase();
        if (mappedType === 'QCM' || mappedType === 'VRAI_FAUX') {
            mappedType = 'QUIZ';
        } else if (mappedType === 'IMAGES_ORDRE') {
            mappedType = 'ORDER';
        } else if (mappedType === 'RELIE') {
            mappedType = 'MATCH';
        }

        return {
            id: exercice.id.toString(),
            dbId: exercice.id,
            titre: exercice.titre,
            instructions: exercice.instructions,
            type: mappedType, // 'LECON', 'QUIZ', 'MATCH', 'ORDER', 'DESSIN'
            contenu: exercice.contenu ? (typeof exercice.contenu === 'string' ? JSON.parse(exercice.contenu) : exercice.contenu) : []
        };
    } catch (e) {
        gererErreurBaseDeDonnees("obtenirDetailsActiviteDepuisDB", e);
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
        gererErreurBaseDeDonnees("sauvegarderResultatActivite", e);
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
                        cours: {
                            include: {
                                module: true
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
            const modTitre = ex?.cours?.module?.titre || "Module";
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
        gererErreurBaseDeDonnees("obtenirActiviteRecente", e);
        return [];
    }
}

// Action to get cumulative stats for the 6 Parcours
export async function obtenirParcoursStats() {
    try {
        const studentId = await obtenirEtudiantId();

        const modules = await prisma.module.findMany({
            where: {
                public: 'ENFANT',
                isPublished: true
            },
            include: {
                cours: {
                    include: {
                        exercices: true
                    }
                }
            }
        });

        const parcoursExercices: Record<string, Set<number>> = {
            lecture: new Set(),
            numerique: new Set(),
            robotique: new Set(),
            anglais: new Set(),
            civique: new Set(),
            eco: new Set()
        };

        const ENUM_TO_SLUG: Record<string, string> = {
            COMPREHENSION_LECTURE: 'lecture',
            NUMERIQUE: 'numerique',
            ROBOTIQUE: 'robotique',
            ANGLAIS: 'anglais',
            EDUCATION_CIVIQUE: 'civique',
            ECO_CITOYENNETE: 'eco'
        };

        for (const mod of modules) {
            for (const enumVal of mod.parcours) {
                const slug = ENUM_TO_SLUG[enumVal];
                if (slug) {
                    for (const crs of mod.cours) {
                        for (const ex of crs.exercices) {
                            parcoursExercices[slug].add(ex.id);
                        }
                    }
                }
            }
        }

        const stats: Record<string, number> = {};

        for (const [slug, exIds] of Object.entries(parcoursExercices)) {
            const total = exIds.size;
            let completed = 0;

            if (total > 0) {
                const scores = await prisma.scoreQuiz.findMany({
                    where: {
                        etudiantId: studentId,
                        exerciceId: { in: Array.from(exIds) }
                    }
                });
                completed = new Set(scores.map(s => s.exerciceId)).size;
            }

            stats[slug] = total > 0 ? Math.round((completed / total) * 100) : 0;
        }

        return stats;
    } catch (e) {
        gererErreurBaseDeDonnees("obtenirParcoursStats", e);
        return {
            lecture: 0,
            numerique: 0,
            robotique: 0,
            anglais: 0,
            civique: 0,
            eco: 0
        };
    }
}

// Action to get all published modules belonging to a Parcours
export async function obtenirModulesDuParcours(parcoursSlug: string) {
    try {
        const studentId = await obtenirEtudiantId();
        
        let targetEnum: Parcours | null = null;
        const slug = parcoursSlug.toLowerCase();
        if (slug === 'lecture') targetEnum = 'COMPREHENSION_LECTURE';
        else if (slug === 'numerique') targetEnum = 'NUMERIQUE';
        else if (slug === 'robotique') targetEnum = 'ROBOTIQUE';
        else if (slug === 'anglais') targetEnum = 'ANGLAIS';
        else if (slug === 'civique') targetEnum = 'EDUCATION_CIVIQUE';
        else if (slug === 'eco') targetEnum = 'ECO_CITOYENNETE';

        if (!targetEnum) return [];

        const modules = await prisma.module.findMany({
            where: {
                public: 'ENFANT',
                isPublished: true,
                parcours: {
                    has: targetEnum
                }
            },
            include: {
                cours: {
                    include: {
                        exercices: true
                    }
                }
            }
        });

        const mapped = [];
        for (const mod of modules) {
            const exercicesIds = new Set<number>();
            for (const crs of mod.cours) {
                for (const ex of crs.exercices) {
                    exercicesIds.add(ex.id);
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
                completed = new Set(scores.map(s => s.exerciceId)).size;
            }

            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            mapped.push({
                id: mod.id.toString(),
                dbId: mod.id,
                label: mod.titre,
                description: mod.description || '',
                progression: pct,
                slug: mapTitreToSlug(mod.titre)
            });
        }

        return mapped;
    } catch (e) {
        gererErreurBaseDeDonnees("obtenirModulesDuParcours", e);
        return [];
    }
}
