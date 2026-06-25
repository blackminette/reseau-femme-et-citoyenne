// * src/app/(dashboard-adultes)/formation/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getSupabaseServer } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

/*
 * Suivi de progression des modules de formation adulte.
 * Le contenu des modules est géré côté front ; ici on ne persiste que la
 * progression de l'utilisateur (étape atteinte, score au quiz, statut terminé).
 */

// Récupère l'ID de l'utilisateur connecté (repli sur le premier MEMBRE, comme l'espace membre).
async function obtenirUtilisateurId(): Promise<string | null> {
    try {
        const supabase = await getSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) return user.id;
    } catch (e) {
        console.warn('[Formation] Session Supabase indisponible, repli :', e);
    }
    try {
        const membre = await prisma.utilisateur.findFirst({ where: { role: 'MEMBRE' } });
        return membre?.id ?? null;
    } catch {
        return null;
    }
}

export type ProgressionFormationDTO = {
    etapeActuelle: number;
    totalEtapes: number;
    scoreQuiz: number | null;
    totalQuiz: number | null;
    terminee: boolean;
    progression: number; // pourcentage 0-100
};

const PROGRESSION_VIDE: ProgressionFormationDTO = {
    etapeActuelle: 0, totalEtapes: 1, scoreQuiz: null, totalQuiz: null, terminee: false, progression: 0,
};

function pourcentage(etape: number, total: number, terminee: boolean): number {
    if (terminee) return 100;
    if (total <= 0) return 0;
    return Math.min(100, Math.round((etape / total) * 100));
}

// ─── Lecture de la progression d'un module pour l'utilisateur courant ───
export async function obtenirProgressionFormation(moduleCle: string): Promise<ProgressionFormationDTO> {
    try {
        const utilisateurId = await obtenirUtilisateurId();
        if (!utilisateurId) return PROGRESSION_VIDE;

        const p = await prisma.progressionFormation.findUnique({
            where: { utilisateurId_moduleCle: { utilisateurId, moduleCle } },
        });
        if (!p) return PROGRESSION_VIDE;

        return {
            etapeActuelle: p.etapeActuelle,
            totalEtapes: p.totalEtapes,
            scoreQuiz: p.scoreQuiz,
            totalQuiz: p.totalQuiz,
            terminee: p.terminee,
            progression: pourcentage(p.etapeActuelle, p.totalEtapes, p.terminee),
        };
    } catch (e) {
        console.error('[Formation] obtenirProgressionFormation:', e);
        return PROGRESSION_VIDE;
    }
}

// ─── Sauvegarde l'étape atteinte (on conserve toujours l'étape la plus avancée) ───
export async function sauvegarderEtapeFormation(moduleCle: string, etape: number, totalEtapes: number) {
    try {
        const utilisateurId = await obtenirUtilisateurId();
        if (!utilisateurId) return { success: false as const };

        const existante = await prisma.progressionFormation.findUnique({
            where: { utilisateurId_moduleCle: { utilisateurId, moduleCle } },
        });
        const etapeMax = Math.max(existante?.etapeActuelle ?? 0, etape);

        await prisma.progressionFormation.upsert({
            where: { utilisateurId_moduleCle: { utilisateurId, moduleCle } },
            create: { utilisateurId, moduleCle, etapeActuelle: etapeMax, totalEtapes },
            update: { etapeActuelle: etapeMax, totalEtapes },
        });

        revalidatePath('/formation');
        return { success: true as const };
    } catch (e) {
        console.error('[Formation] sauvegarderEtapeFormation:', e);
        return { success: false as const };
    }
}

// ─── Enregistre le score du quiz ───
export async function enregistrerScoreQuizFormation(moduleCle: string, score: number, total: number) {
    try {
        const utilisateurId = await obtenirUtilisateurId();
        if (!utilisateurId) return { success: false as const };

        await prisma.progressionFormation.upsert({
            where: { utilisateurId_moduleCle: { utilisateurId, moduleCle } },
            create: { utilisateurId, moduleCle, scoreQuiz: score, totalQuiz: total },
            update: { scoreQuiz: score, totalQuiz: total },
        });

        revalidatePath('/formation');
        return { success: true as const, score, total };
    } catch (e) {
        console.error('[Formation] enregistrerScoreQuizFormation:', e);
        return { success: false as const };
    }
}

// ─── Marque le module comme terminé ───
export async function terminerModuleFormation(moduleCle: string, totalEtapes: number) {
    try {
        const utilisateurId = await obtenirUtilisateurId();
        if (!utilisateurId) return { success: false as const };

        await prisma.progressionFormation.upsert({
            where: { utilisateurId_moduleCle: { utilisateurId, moduleCle } },
            create: { utilisateurId, moduleCle, etapeActuelle: totalEtapes, totalEtapes, terminee: true },
            update: { etapeActuelle: totalEtapes, totalEtapes, terminee: true },
        });

        revalidatePath('/formation');
        return { success: true as const };
    } catch (e) {
        console.error('[Formation] terminerModuleFormation:', e);
        return { success: false as const };
    }
}
