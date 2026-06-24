// * src/app/(auth)/reset-password/actions.ts
'use server';

import { getSupabaseServer } from '@/lib/supabase';

export async function resetPasswordAction(password: string) {
    if (!password) {
        return { success: false, error: "Le nouveau mot de passe est obligatoire." };
    }

    try {
        const supabase = await getSupabaseServer();
        
        // On met à jour le mot de passe de l'utilisateur actuellement sessionné (via le callback)
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            console.error("[reset-password] Erreur Supabase:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true };

    } catch (error) {
        console.error("[reset-password] Erreur critique :", error);
        return {
            success: false,
            error: "Une erreur serveur est survenue. Veuillez réessayer plus tard."
        };
    }
}
