// * src/app/(auth)/forgot-password/actions.ts
'use server';

import { getSupabaseServer } from '@/lib/supabase';

export async function forgotPasswordAction(email: string) {
    if (!email) {
        return { success: false, error: "L'adresse email est obligatoire." };
    }

    try {
        const supabase = await getSupabaseServer();
        
        // On demande à Supabase d'envoyer un email de réinitialisation
        // Le redirectTo doit être configuré dans Supabase (ex: http://localhost:3000/reset-password)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/reset-password`,
        });

        if (error) {
            console.error("[forgot-password] Erreur Supabase:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true };

    } catch (error) {
        console.error("[forgot-password] Erreur critique :", error);
        return {
            success: false,
            error: "Une erreur serveur est survenue. Veuillez réessayer plus tard."
        };
    }
}
