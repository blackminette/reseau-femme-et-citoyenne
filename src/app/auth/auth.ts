// * src/app/auth/auth.ts
'use server';

import { getSupabaseServer } from "@/lib/supabase";
import { redirect } from 'next/navigation';

export async function deconnexionUtilisateur() {
    const supabase = await getSupabaseServer();

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Erreur lors de la déconnexion Supabase:", error.message);
    }

    redirect('/');
}