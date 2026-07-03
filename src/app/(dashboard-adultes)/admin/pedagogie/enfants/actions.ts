// * src/app/(dashboard-adultes)/admin/pedagogie/enfants/actions.ts
'use server'

import { prisma } from '@/lib/prisma';

// Interface representing a child's overall tracking card/profile
export interface StudentPedagogicalProfile {
    id: string;
    nom: string;
    prenom: string;
    username: string;
    createdAt: Date;
    dernierConnexion: Date | null;
    scorePedagogique: number; // RFC06 score: 30% ex, 40% quiz, 20% regularity, 10% autonomy
    progressionGlobale: number; // overall percentage completion of available exercises
    leconsTerminees: number;
    exercicesRealises: number;
    quizRealises: number;
    tentativesTotal: number;
    competences: Array<{
        competence: string;
        pourcentage: number;
        statut: 'ACQUISE' | 'FRAGILE' | 'DIFFICULTE_IMPORTANTE' | 'NON_ACQUISE';
    }>;
    recommandations: Array<{
        type: 'LECON' | 'EXERCICE' | 'QUIZ';
        titre: string;
        moduleTitre: string;
        raison: string;
    }>;
    recentActivities: Array<{
        id: number;
        titre: string;
        type: string;
        score: number;
        maxScore: number;
        createdAt: Date;
    }>;
}

// Function to map a score percentage to a competence status string
function evaluateCompetencePct(pct: number): 'ACQUISE' | 'FRAGILE' | 'DIFFICULTE_IMPORTANTE' | 'NON_ACQUISE' {
    if (pct >= 80) return 'ACQUISE';
    if (pct >= 60) return 'FRAGILE';
    if (pct >= 40) return 'DIFFICULTE_IMPORTANTE';
    return 'NON_ACQUISE';
}

// Map exercises to pedagogical competencies based on title or keywords
function getCompetenceName(exTitre: string, exInstructions: string): string {
    const text = (exTitre + " " + exInstructions).toLowerCase();
    if (text.includes("dossier")) return "Gestion des dossiers";
    if (text.includes("télécharge") || text.includes("download")) return "Téléchargements";
    if (text.includes("recherche") || text.includes("trouver") || text.includes("retrouver")) return "Recherche de fichiers";
    if (text.includes("clavier") || text.includes("saisir") || text.includes("écrire")) return "Utilisation du clavier";
    if (text.includes("souris") || text.includes("clic") || text.includes("glisser")) return "Utilisation de la souris";
    if (text.includes("anglais") || text.includes("vocabulaire") || text.includes("english")) return "Vocabulaire anglais";
    if (text.includes("tri") || text.includes("déchets") || text.includes("écologie") || text.includes("citoyen")) return "Eco-citoyenneté";
    if (text.includes("civique") || text.includes("loi") || text.includes("droit")) return "Éducation civique";
    return "Culture numérique générale";
}

export async function obtenirSuiviPedagogiqueEnfants(): Promise<{ success: boolean; data: StudentPedagogicalProfile[]; error?: string }> {
    try {
        // 1. Fetch all children / students
        // Students are Utilisateur records whose role is MEMBRE or any role that has a tuteurId,
        // or specifically children (tuteurId is set). Let's fetch all users who are kids or have a tutor.
        // In the seed script, kid account has email 'enfant@rfc06.fr' and role 'MEMBRE', tuteurId set.
        // Let's retrieve all Utilisateurs who have a tuteurId OR are associated as children, or have username/email of test kids.
        const students = await prisma.utilisateur.findMany({
            where: {
                OR: [
                    { tuteurId: { not: null } },
                    { email: { contains: 'enfant' } },
                    { role: 'MEMBRE', email: { contains: '@rfc06.fr' } } // Fallback for standard test kids
                ]
            },
            include: {
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
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        // 2. Fetch all kids exercises to calculate absolute progress
        const allKidExercises = await prisma.exercice.findMany({
            where: {
                cours: {
                    module: {
                        public: 'ENFANT',
                        isPublished: true
                    }
                }
            },
            include: {
                cours: {
                    include: {
                        module: true
                    }
                }
            }
        });

        const totalKidExercisesCount = allKidExercises.length;

        const profiles: StudentPedagogicalProfile[] = [];

        for (const student of students) {
            // Group scores by exercise to find latest score and attempts
            const scoresByEx: Record<number, { scores: typeof student.ScoreQuiz, latest: typeof student.ScoreQuiz[0] }> = {};
            for (const sq of student.ScoreQuiz) {
                if (!scoresByEx[sq.exerciceId]) {
                    scoresByEx[sq.exerciceId] = { scores: [], latest: sq };
                }
                scoresByEx[sq.exerciceId].scores.push(sq);
            }

            const uniqueExercicesIds = Object.keys(scoresByEx).map(Number);
            const distinctExercicesCompletes = uniqueExercicesIds.length;

            // Differentiate between Exercices (type != 'QUIZ') and Quiz (type == 'QUIZ')
            let distinctQuizCompletes = 0;
            let distinctSimpleExCompletes = 0;
            let totalAttempts = student.ScoreQuiz.length;

            // Calculations for competencies
            // Group exercise performance by Competence name
            const competenceScores: Record<string, { totalScore: number; maxScore: number; counts: number }> = {};

            for (const exId of uniqueExercicesIds) {
                const group = scoresByEx[exId];
                const ex = group.latest.exercice;
                if (!ex) continue;

                if (ex.type === 'QUIZ') {
                    distinctQuizCompletes++;
                } else {
                    distinctSimpleExCompletes++;
                }

                // Determine competency category
                const compName = getCompetenceName(ex.titre, ex.instructions);
                
                // Max questions detection
                let maxQuestions = 1;
                try {
                    const contenuParsed = typeof ex.contenu === 'string' ? JSON.parse(ex.contenu) : ex.contenu;
                    if (Array.isArray(contenuParsed) && contenuParsed.length > 0) {
                        maxQuestions = contenuParsed.length;
                    } else {
                        const instructionsParsed = JSON.parse(ex.instructions);
                        if (Array.isArray(instructionsParsed)) {
                            maxQuestions = instructionsParsed.length;
                        }
                    }
                } catch {
                    maxQuestions = 1;
                }

                if (!competenceScores[compName]) {
                    competenceScores[compName] = { totalScore: 0, maxScore: 0, counts: 0 };
                }

                // Use the best or latest score for competency mastery
                const bestScore = Math.max(...group.scores.map(s => s.score));
                competenceScores[compName].totalScore += bestScore;
                competenceScores[compName].maxScore += maxQuestions;
                competenceScores[compName].counts++;
            }

            // Build competence list
            const competences = Object.entries(competenceScores).map(([name, data]) => {
                const pct = data.maxScore > 0 ? Math.round((data.totalScore / data.maxScore) * 100) : 0;
                return {
                    competence: name,
                    pourcentage: pct,
                    statut: evaluateCompetencePct(pct)
                };
            });

            // Calculate overall progress %
            const progressionGlobale = totalKidExercisesCount > 0 
                ? Math.round((distinctExercicesCompletes / totalKidExercisesCount) * 100) 
                : 0;

            // Calculate Custom RFC06 Score
            // 30% exercises completed ratio
            // 40% average quiz scores
            // 20% regularity (based on number of distinct days/activities completed, up to 10 activities)
            // 10% autonomy (completed on first attempt)
            let exercisesRatio = totalKidExercisesCount > 0 ? distinctExercicesCompletes / totalKidExercisesCount : 0;
            
            // Average quiz/exercise scores
            let totalScoreRatioSum = 0;
            let firstAttemptSuccesses = 0;
            for (const exId of uniqueExercicesIds) {
                const group = scoresByEx[exId];
                const ex = group.latest.exercice;
                
                let maxQuestions = 1;
                try {
                    const contenuParsed = typeof ex.contenu === 'string' ? JSON.parse(ex.contenu) : ex.contenu;
                    if (Array.isArray(contenuParsed) && contenuParsed.length > 0) {
                        maxQuestions = contenuParsed.length;
                    }
                } catch {}

                const bestScore = Math.max(...group.scores.map(s => s.score));
                totalScoreRatioSum += (bestScore / maxQuestions);

                // Success without assistance on first attempt (if first attempt score >= 80% of max)
                const firstAttempt = group.scores[group.scores.length - 1]; // sorted desc by creation, so last item in array is first chronologically
                if (firstAttempt && (firstAttempt.score / maxQuestions) >= 0.8) {
                    firstAttemptSuccesses++;
                }
            }

            const avgScoreRatio = distinctExercicesCompletes > 0 ? (totalScoreRatioSum / distinctExercicesCompletes) : 0;
            const autonomyRatio = distinctExercicesCompletes > 0 ? (firstAttemptSuccesses / distinctExercicesCompletes) : 0;
            
            // Implication & regularity score: up to 10 distinct activities completed gives full 20 points
            const regularityRatio = Math.min(distinctExercicesCompletes / 10, 1.0);

            const scoreRFC06 = Math.round(
                (exercisesRatio * 30) + 
                (avgScoreRatio * 40) + 
                (regularityRatio * 20) + 
                (autonomyRatio * 10)
            );

            // Compute auto-recommendations based on weak competencies
            const recommendations: StudentPedagogicalProfile['recommandations'] = [];
            for (const comp of competences) {
                if (comp.statut === 'NON_ACQUISE' || comp.statut === 'DIFFICULTE_IMPORTANTE') {
                    // Recommend refastening an exercise under this category
                    const weakEx = allKidExercises.find(ex => getCompetenceName(ex.titre, ex.instructions) === comp.competence);
                    if (weakEx) {
                        recommendations.push({
                            type: weakEx.type === 'QUIZ' ? 'QUIZ' : 'EXERCICE',
                            titre: weakEx.titre,
                            moduleTitre: weakEx.cours.module.titre,
                            raison: `La compétence "${comp.competence}" doit être renforcée (Score actuel : ${comp.pourcentage}%).`
                        });
                    }
                }
            }

            // Fallback default recommendation if everything is fine
            if (recommendations.length === 0 && allKidExercises.length > 0) {
                const nextEx = allKidExercises.find(ex => !uniqueExercicesIds.includes(ex.id));
                if (nextEx) {
                    recommendations.push({
                        type: nextEx.type === 'QUIZ' ? 'QUIZ' : 'EXERCICE',
                        titre: nextEx.titre,
                        moduleTitre: nextEx.cours.module.titre,
                        raison: "Prochaine activité disponible dans le parcours d'apprentissage."
                    });
                }
            }

            // Map recent activity objects
            const recentActivities = student.ScoreQuiz.slice(0, 5).map(sq => {
                let maxQuestions = 1;
                try {
                    const contenuParsed = typeof sq.exercice.contenu === 'string' ? JSON.parse(sq.exercice.contenu) : sq.exercice.contenu;
                    if (Array.isArray(contenuParsed) && contenuParsed.length > 0) {
                        maxQuestions = contenuParsed.length;
                    }
                } catch {}

                return {
                    id: sq.id,
                    titre: sq.exercice?.titre || 'Activité sans titre',
                    type: sq.exercice?.type || 'EXERCICE',
                    score: sq.score,
                    maxScore: maxQuestions,
                    createdAt: sq.createdAt
                };
            });

            const lastConnexion = student.ScoreQuiz.length > 0 ? student.ScoreQuiz[0].createdAt : null;

            profiles.push({
                id: student.id,
                nom: student.nom,
                prenom: student.prenom,
                username: student.username || student.email.split('@')[0],
                createdAt: student.createdAt,
                dernierConnexion: lastConnexion,
                scorePedagogique: scoreRFC06 || 0,
                progressionGlobale: progressionGlobale || 0,
                leconsTerminees: distinctExercicesCompletes,
                exercicesRealises: distinctSimpleExCompletes,
                quizRealises: distinctQuizCompletes,
                tentativesTotal: totalAttempts,
                competences: competences.sort((a, b) => b.pourcentage - a.pourcentage),
                recommandations: recommendations.slice(0, 3),
                recentActivities: recentActivities
            });
        }

        return { success: true, data: profiles };
    } catch (error) {
        console.error("Erreur lors du suivi pédagogique des enfants:", error);
        return { success: false, error: "Erreur lors de la récupération des données pédagogiques.", data: [] };
    }
}
