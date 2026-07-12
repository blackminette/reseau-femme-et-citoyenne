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
                    totalExercices++;
                    exercicesIds.add(ex.id);
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
                        exercices: true
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
                for (const ex of crs.exercices) {
                    totalEx++;
                    const score = await prisma.scoreQuiz.findFirst({
                        where: {
                            etudiantId: membreId,
                            exerciceId: ex.id
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
                            exercices: true
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
                            exercices: true
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
            for (const ex of crs.exercices) {

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
                cours: true
            }
        });

        if (!exercice) return null;

        const cours = exercice.cours;

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
            const cours = ex.cours;
            const modTitre = cours?.module?.titre || "Module";
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

export async function obtenirEnfantsRattaches(membreId: string) {
    try {
        const enfants = await prisma.utilisateur.findMany({
            where: {
                tuteurId: membreId,
                role: 'ENFANT'
            },
            include: {
                badges: true,
                ScoreQuiz: {
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
                    }
                }
            }
        });

        const listEnfants = await Promise.all(enfants.map(async (enfant) => {
            const modules = await prisma.module.findMany({
                where: { public: 'ENFANT' },
                include: {
                    cours: {
                        include: {
                            exercices: true
                        }
                    }
                }
            });

            const exercicesIds = new Set<number>();
            for (const mod of modules) {
                for (const crs of mod.cours) {
                    for (const ex of crs.exercices) {
                        exercicesIds.add(ex.id);
                    }
                }
            }

            const totalEx = exercicesIds.size;
            const completedExSet = new Set(enfant.ScoreQuiz.map(s => s.exerciceId));
            const completedEx = completedExSet.size;

            const progression = totalEx > 0 ? Math.round((completedEx / totalEx) * 100) : 0;

            const tentatives = await prisma.tentativeExercice.findMany({
                where: { etudiantId: enfant.id },
                include: {
                    exercice: true
                }
            });

            const competenceFailed: string[] = [];
            const competenceScores: Record<string, { correct: number, total: number }> = {};

            for (const t of tentatives) {
                const comp = t.exercice?.competence || "Général";
                if (!competenceScores[comp]) {
                    competenceScores[comp] = { correct: 0, total: 0 };
                }
                competenceScores[comp].correct += t.score;
                competenceScores[comp].total += t.totalQuestions;
            }

            for (const [comp, stat] of Object.entries(competenceScores)) {
                const ratio = stat.total > 0 ? (stat.correct / stat.total) * 100 : 100;
                if (ratio < 80) {
                    competenceFailed.push(comp);
                }
            }

            let modPref = "Aucun";
            const moduleCounts: Record<string, number> = {};
            for (const s of enfant.ScoreQuiz) {
                const modTitre = s.exercice?.cours?.module?.titre;
                if (modTitre) {
                    moduleCounts[modTitre] = (moduleCounts[modTitre] || 0) + 1;
                }
            }
            const sortedMods = Object.entries(moduleCounts).sort((a, b) => b[1] - a[1]);
            if (sortedMods.length > 0) {
                modPref = sortedMods[0][0];
            }

            return {
                nom: enfant.nom,
                prenom: enfant.prenom,
                username: enfant.username,
                age: 9,
                initiales: `${enfant.prenom?.[0] || ''}${enfant.nom?.[0] || ''}`.toUpperCase(),
                couleur: "from-blue-400 to-indigo-500",
                progression,
                modulePref: modPref,
                temps: completedEx > 0 ? `${completedEx * 15} min` : "0 min",
                derniere: enfant.ScoreQuiz.length > 0 
                    ? new Date(enfant.ScoreQuiz[0].createdAt).toLocaleDateString('fr-FR')
                    : "Aucune",
                serie: enfant.ScoreQuiz.length > 0 ? 1 : 0,
                quizReussis: completedEx,
                quizTotal: totalEx,
                difficulte: competenceFailed.length > 0 ? competenceFailed : null
            };
        }));

        return listEnfants;
    } catch (e) {
        console.error("Erreur obtenirEnfantsRattaches:", e);
        return [];
    }
}

export async function obtenirReservationsMembre(membreId: string) {
    try {
        const reservations = await prisma.reservation.findMany({
            where: { utilisateurId: membreId },
            include: {
                atelier: {
                    include: {
                        lieu: true
                    }
                }
            },
            orderBy: {
                dateReservation: 'desc'
            }
        });

        return reservations.map(r => ({
            id: r.id.toString(),
            atelierTitre: r.atelier.titre,
            lieu: r.atelier.lieu.nom,
            date: r.atelier.dateDebut.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
            horaire: `${r.atelier.dateDebut.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${r.atelier.dateFin.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        }));
    } catch (e) {
        console.error("Erreur obtenirReservationsMembre:", e);
        return [];
    }
}
