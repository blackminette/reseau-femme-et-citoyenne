// * src/app/(auth)/login/actions.ts
'use server';

import { getSupabaseServer } from '@/lib/supabase';
import { redirect } from 'next/navigation';

const roleParEmail: Record<string, string> = {
    'admin@rfc06.fr': 'ADMIN',
    'membre@rfc06.fr': 'MEMBRE',
    'partenaire@rfc06.fr': 'PARTENAIRE',
    'intervenante@rfc06.fr': 'INTERVENANT',
    'enfant@rfc06.fr': 'ENFANT',
    'benevole@rfc06.fr': 'BENEVOLE',
};

function normaliserRole(role: string | null): string | null {
    if (role === 'INTERVENANTE') {
        return 'INTERVENANT';
    }

    return role;
}

function redirectWithError(message: string): never {
    redirect(`/login?error=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData): Promise<never> {
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
        redirectWithError("[login] Les champs e-mail et mot de passe sont obligatoires.");
    }

    let destination = '/accueil';

    try {
        const supabase = await getSupabaseServer();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError || !authData.user) {
            redirectWithError("[login] Identifiants ou mot de passe incorrects.");
        }

        const { data: profil, error: profilError } = await supabase
            .from('Utilisateur')
            .select('role')
            .eq('email', email)
            .single();

        const role = normaliserRole(
            typeof profil?.role === 'string'
                ? profil.role
                : roleParEmail[email] ?? null
        );

        if (!role) {
            redirectWithError(
                profilError
                    ? "[login] Compte authentifié, mais le profil utilisateur n'a pas pu être lu."
                : "[login] Compte authentifié, mais aucun profil utilisateur trouvé dans l'association."
            );
        }

        destination = {
            ADMIN: '/admin',
            MEMBRE: '/membre',
            ENFANT: '/enfant',
            PARTENAIRE: '/partenaire',
            BENEVOLE: '/benevole',
            INTERVENANT: '/intervenant',
        }[role] ?? '/accueil';
    } catch (error) {
        console.error("[login] Erreur critique lors de la connexion :", error);
        redirectWithError("[login] Une erreur serveur est survenue. Veuillez réessayer plus tard.");
    }

    redirect(destination);
}
