// * src/app/(app-avec-header)/login/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getSupabaseServer } from '@/lib/supabase';

export async function loginAction(formData: any) {
    const { email, password } = formData;

    try {
        const supabase = await getSupabaseServer();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError || !authData.user) {
            return { success: false, error: "Identifiants ou mot de passe incorrects." };
        }

        // on vérifie que l'utilisateur existe bien dans la table Prisma (ex: s'il a déjà un profil créé)
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { email: email }
        });

        // Si l'utilisateur n'existe pas, on renvoie une erreur (même si l'auth Supabase a réussi)
        if (!utilisateur) {
            return {
                success: false,
                error: "Compte authentifié, mais aucun profil utilisateur trouvé dans l'association."
            };
        }


        // Si tout est bon, on renvoie le rôle de l'utilisateur pour adapter l'interface ensuite
        return {
            success: true,
            role: utilisateur.role
        };

    } catch (error) {
        console.error("Erreur critique lors de la connexion :", error);
        return {
            success: false,
            error: "Une erreur serveur est survenue. Veuillez réessayer plus tard."
        };
    }
}