// * src/app/(auth)/signup/actions.ts
'use server';

import { getSupabaseServer } from '@/lib/supabase';

export async function signupAction(formData: any) {
    const { email, password, confirmPassword, nom, prenom, telephone } = formData;

    if (!email || !password || !nom || !prenom) {
        return { success: false, error: "Tous les champs sont obligatoires." };
    }

    if (password !== confirmPassword) {
        return { success: false, error: "Les mots de passe ne correspondent pas." };
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return { 
            success: false, 
            error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial." 
        };
    }

    try {
        const supabase = await getSupabaseServer();

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nom,
                    prenom,
                    telephone
                }
            }
        });

        if (authError) {
            return { success: false, error: authError.message };
        }

        if (!authData.user) {
            return { success: false, error: "Une erreur inconnue est survenue." };
        }

        return { success: true, needsConfirmation: true };

    } catch (error) {
        console.error("[signup] Erreur critique :", error);
        return {
            success: false,
            error: "Une erreur serveur est survenue."
        };
    }
}
