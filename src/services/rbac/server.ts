import { prisma } from '@/lib/prisma';
import { getSupabaseServer } from '@/lib/supabase';
import type { UserRole, UserSession } from '@/types/auth';

const AUTH_REQUIRED = 'AUTH_REQUIRED';
const FORBIDDEN = 'FORBIDDEN';

const ROLES_UTILISATEUR = [
    'ADMIN',
    'INTERVENANT',
    'MEMBRE',
    'ENFANT',
    'PARTENAIRE',
    'BENEVOLE',
    'ETUDIANT',
] as const satisfies readonly UserRole[];

function isUserRole(value: string): value is UserRole {
    return ROLES_UTILISATEUR.includes(value as UserRole);
}

export function getAuthErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        if (error.message === AUTH_REQUIRED) {
            return 'Connexion requise.';
        }

        if (error.message === FORBIDDEN) {
            return 'Acces reserve aux administrateurs.';
        }
    }

    return 'Acces refuse.';
}

export async function getCurrentUserSession(): Promise<UserSession | null> {
    const supabase = await getSupabaseServer();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
        return null;
    }

    const utilisateur = await prisma.utilisateur.findUnique({
        where: { email: user.email },
        select: {
            id: true,
            email: true,
            nom: true,
            prenom: true,
            role: true,
        },
    });

    if (!utilisateur || !isUserRole(utilisateur.role)) {
        return null;
    }

    return {
        id: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        role: utilisateur.role,
    };
}

export async function requireRole(allowedRoles: UserRole[]): Promise<UserSession> {
    const session = await getCurrentUserSession();

    if (!session) {
        throw new Error(AUTH_REQUIRED);
    }

    if (!allowedRoles.includes(session.role)) {
        throw new Error(FORBIDDEN);
    }

    return session;
}

export async function requireAdmin(): Promise<UserSession> {
    return requireRole(['ADMIN']);
}
