// * src/app/premire-connexion/actions.ts
'use server';

import { getSupabaseServer } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function changerMotDePasseInitial(nouveauMdp: string) {
    if (!nouveauMdp || nouveauMdp.length < 6) {
        return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères." };
    }

    try {
        const supabase = await getSupabaseServer();

        const { error } = await supabase.auth.updateUser({
            password: nouveauMdp,
            data: {
                doitChangerMotDePasse: false
            }
        });

        if (error) {
            console.error("[PremiereConnexion] Erreur Supabase :", error.message);
            return { success: false, error: error.message };
        }

        revalidatePath('/');
        return { success: true };

    } catch (error) {
        console.error("[PremiereConnexion] Erreur critique :", error);
        return { success: false, error: "Une erreur interne est survenue." };
    }
}