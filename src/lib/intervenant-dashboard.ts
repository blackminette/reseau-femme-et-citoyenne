import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

type IntervenantConnecte = {
    nomAffiche: string;
    role: string | null;
};

function verifierVariablesSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            'Variables Supabase publiques manquantes pour lire la session intervenant.'
        );
    }

    return {
        supabaseUrl,
        supabaseAnonKey,
    };
}

export async function obtenirIntervenantConnecte(): Promise<IntervenantConnecte> {
    const { supabaseUrl, supabaseAnonKey } = verifierVariablesSupabase();

    const cookieStore = await cookies();

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                } catch {
                    // Dans un Server Component, l'ecriture de cookies peut etre refusee.
                    // La lecture de session reste suffisante pour afficher le nom.
                }
            },
        },
    });

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return {
            nomAffiche: 'Intervenant',
            role: null,
        };
    }

    const utilisateur = await prisma.utilisateur.findUnique({
        where: {
            id: user.id,
        },
        select: {
            email: true,
            nom: true,
            prenom: true,
            role: true,
        },
    });

    if (!utilisateur) {
        return {
            nomAffiche: user.email ?? 'Intervenant',
            role: null,
        };
    }

    const prenomAffiche = utilisateur.prenom?.trim();

    return {
        nomAffiche: prenomAffiche || utilisateur.email || 'Intervenant',
        role: utilisateur.role,
    };
}
