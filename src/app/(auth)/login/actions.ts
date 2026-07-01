// * src/app/(auth)/login/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getSupabaseServer } from '@/lib/supabase';

export async function loginAction(formData: any) {
    const { username, password } = formData;

    try {
        const fauxEmail = `${username.trim().toLowerCase()}@rfc06.fr`;
        const supabase = await getSupabaseServer();

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: fauxEmail,
            password,
        });

        if (authError) {
            return { success: false, error: "Identifiants ou mot de passe incorrects." };
        }

        if (!authData.user) {
            return { success: false, error: "Utilisateur non trouvé." };
        }

        let utilisateur = await prisma.utilisateur.findUnique({
            where: { username: username.trim() }
        });

        if (!utilisateur) {
            utilisateur = await prisma.utilisateur.create({
                data: {
                    id: authData.user.id,
                    email: fauxEmail,
                    username: username.trim(),
                    nom: authData.user.user_metadata?.nom || 'Nom par défaut',
                    prenom: authData.user.user_metadata?.prenom || 'Prénom par défaut',
                    role: 'MEMBRE'
                }
            });
        }

        return {
            success: true,
            role: utilisateur.role,
            session: authData.session
        };

    } catch (error) {
        console.error("[loginAction] Erreur serveur critique :", error);
        return {
            success: false,
            error: "Une erreur serveur est survenue. Veuillez réessayer plus tard."
        };
    }
}