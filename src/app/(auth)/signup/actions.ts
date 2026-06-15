// * src/app/(auth)/signup/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getSupabaseServer } from '@/lib/supabase';

export async function signupAction(formData: any) {
    const { email, password, confirmPassword, nom, prenom, telephone } = formData;

    // Validations de base
    if (!email || !password || !nom || !prenom) {
        return { success: false, error: "Tous les champs sont obligatoires." };
    }

    if (password !== confirmPassword) {
        return { success: false, error: "Les mots de passe ne correspondent pas." };
    }

    if (password.length < 6) {
        return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères." };
    }

    try {
        const supabase = await getSupabaseServer();

        // 1. Inscription dans Supabase Auth
        // Note : Selon la configuration Supabase, cela peut envoyer un mail de confirmation.
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: `${prenom} ${nom}`,
                }
            }
        });

        if (authError) {
            return { success: false, error: authError.message };
        }

        if (!authData.user) {
            return { success: false, error: "Une erreur inconnue est survenue lors de l'inscription." };
        }

        // 2. Création de l'utilisateur dans la base de données via Prisma
        // On s'assure que le profil est créé pour que le middleware et le reste de l'app fonctionnent.
        try {
            await prisma.utilisateur.create({
                data: {
                    email: email,
                    nom: nom,
                    prenom: prenom,
                    telephone: telephone, // Ajout du téléphone
                    role: "MEMBRE", // Rôle par défaut pour les nouvelles inscriptions
                }
            });
        } catch (prismaError: any) {
            console.error("[signup] Erreur Prisma:", prismaError);
            // Si l'utilisateur existe déjà dans Prisma mais pas dans Supabase Auth (cas limite)
            if (prismaError.code === 'P2002') {
                return { success: false, error: "Cet email est déjà utilisé." };
            }
            throw prismaError;
        }

        return { success: true };

    } catch (error) {
        console.error("[signup] Erreur critique lors de l'inscription :", error);
        return {
            success: false,
            error: "Une erreur serveur est survenue. Veuillez réessayer plus tard."
        };
    }
}
