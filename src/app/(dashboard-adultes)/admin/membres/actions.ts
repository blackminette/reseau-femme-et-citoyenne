'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getAuthErrorMessage, requireAdmin } from '@/services/rbac/server';
import type { UserRole } from '@/types/auth';
import type { Prisma } from '@prisma/client';

type ActionError = { success: false; error: string };

type ActionResult<T = unknown> =
    | { success: true; data?: T }
    | ActionError;

type ModifierUtilisateurPayload = Record<string, unknown>;

const UTILISATEUR_ADMIN_ARGS = {
    select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        role: true,
        createdAt: true,
        _count: {
            select: {
                reservations: true,
                coursAnimes: true,
                dons: true,
            },
        },
        tuteur: {
            select: {
                nom: true,
                prenom: true,
            },
        },
    },
} satisfies Prisma.UtilisateurDefaultArgs;

type UtilisateurAdmin = Prisma.UtilisateurGetPayload<typeof UTILISATEUR_ADMIN_ARGS>;

const ROLES_MODIFIABLES = [
    'ADMIN',
    'INTERVENANT',
    'MEMBRE',
    'ENFANT',
    'PARTENAIRE',
    'BENEVOLE',
    'ETUDIANT',
] as const satisfies readonly UserRole[];

function estRoleAutorise(value: unknown): value is UserRole {
    return typeof value === 'string' && ROLES_MODIFIABLES.includes(value as UserRole);
}

function lireTexteObligatoire(payload: ModifierUtilisateurPayload, champ: string): string {
    const value = payload[champ];

    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`Champ invalide : ${champ}`);
    }

    return value.trim();
}

function lireTexteOptionnel(payload: ModifierUtilisateurPayload, champ: string): string | null {
    const value = payload[champ];

    if (value === null || value === undefined || value === '') {
        return null;
    }

    if (typeof value !== 'string') {
        throw new Error(`Champ invalide : ${champ}`);
    }

    return value.trim() || null;
}

function normaliserDonneesUtilisateur(payload: ModifierUtilisateurPayload) {
    const role = payload.role;

    if (!estRoleAutorise(role)) {
        throw new Error('Role utilisateur invalide.');
    }

    return {
        nom: lireTexteObligatoire(payload, 'nom'),
        prenom: lireTexteObligatoire(payload, 'prenom'),
        email: lireTexteObligatoire(payload, 'email').toLowerCase(),
        telephone: lireTexteOptionnel(payload, 'telephone'),
        role,
    };
}

async function verifierAdmin(): Promise<ActionError | null> {
    try {
        await requireAdmin();
        return null;
    } catch (error) {
        console.error('[admin/membres] Acces refuse :', error);
        return { success: false, error: getAuthErrorMessage(error) };
    }
}

export async function listerTousLesUtilisateurs(): Promise<ActionResult<UtilisateurAdmin[]>> {
    const erreurAutorisation = await verifierAdmin();

    if (erreurAutorisation) {
        return erreurAutorisation;
    }

    try {
        const utilisateurs = await prisma.utilisateur.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            select: UTILISATEUR_ADMIN_ARGS.select,
        });

        return { success: true, data: utilisateurs };
    } catch (error) {
        console.error('[admin/membres] Erreur Prisma lors du chargement :', error);
        return { success: false, error: 'Impossible de charger les membres.' };
    }
}

export async function modifierUtilisateur(
    id: string,
    nouvelleDonnees: ModifierUtilisateurPayload
) {
    const erreurAutorisation = await verifierAdmin();

    if (erreurAutorisation) {
        return erreurAutorisation;
    }

    if (!id || id.trim().length === 0) {
        return { success: false, error: 'Identifiant utilisateur manquant.' };
    }

    try {
        const donneesNormalisees = normaliserDonneesUtilisateur(nouvelleDonnees);

        const membreModifie = await prisma.utilisateur.update({
            where: { id },
            data: donneesNormalisees,
        });

        revalidatePath('/admin/membres');

        return { success: true, data: membreModifie };
    } catch (error) {
        console.error('[admin/membres] Erreur lors de la modification :', error);
        return { success: false, error: 'Impossible de modifier le membre.' };
    }
}

export async function supprimerUtilisateur(id: string) {
    const erreurAutorisation = await verifierAdmin();

    if (erreurAutorisation) {
        return erreurAutorisation;
    }

    if (!id || id.trim().length === 0) {
        return { success: false, error: 'Identifiant utilisateur manquant.' };
    }

    try {
        await prisma.utilisateur.delete({
            where: { id },
        });

        revalidatePath('/admin/membres');

        return { success: true };
    } catch (error) {
        console.error('[admin/membres] Erreur lors de la suppression :', error);
        return { success: false, error: 'Impossible de supprimer le membre.' };
    }
}
