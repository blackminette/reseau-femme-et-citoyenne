// * src/app/(auth)/login/actions.ts
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

        if (authError) {
            console.error("[login] Erreur Supabase Auth:", authError.message);
            // On renvoie le message de Supabase qui est souvent explicite (ex: Email not confirmed)
            return { success: false, error: authError.message };
        }

        if (!authData.user) {
            return { success: false, error: "Utilisateur non trouvé dans Supabase Auth." };
        }

        console.log("[login] Authentification Supabase réussie pour:", email);

        // on vérifie que l'utilisateur existe bien dans la table Prisma
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { email: email }
        });

        if (!utilisateur) {
            console.error("[login] Profil Prisma manquant pour:", email);
            return {
                success: false,
                error: "Votre compte est validé, mais votre profil n'a pas été trouvé dans notre base de données. Contactez un administrateur."
            };
        }

        console.log("[login] Profil trouvé, rôle:", utilisateur.role);


        // Si tout est bon, on renvoie le rôle de l'utilisateur pour adapter l'interface ensuite
        return {
            success: true,
            role: utilisateur.role
        };

    } catch (error) {
        console.error("[login] Erreur critique lors de la connexion :", error);
        return {
            success: false,
            error: "[login] Une erreur serveur est survenue. Veuillez réessayer plus tard."
        };
    }
}