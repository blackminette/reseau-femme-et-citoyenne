'use server';

import { prisma } from '@/lib/prisma';
import { getSupabaseServer } from '@/lib/supabase';

export async function signupAction(formData: any) {
    const { username, password, nom, prenom, telephone } = formData;

    try {
        const fauxEmail = `${username.trim().toLowerCase()}@rfc06.fr`;

        const existingUser = await prisma.utilisateur.findUnique({
            where: { username: username.trim() }
        });

        if (existingUser) {
            return { success: false, error: "Ce nom d'utilisateur est déjà pris." };
        }

        const supabase = await getSupabaseServer();
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: fauxEmail,
            password,
        });

        if (authError) {
            console.error("[signup] Erreur Supabase Auth:", authError.message);
            return { success: false, error: authError.message };
        }

        if (!authData.user) {
            return { success: false, error: "Une erreur est survenue lors de la création de l'authentification." };
        }

        await prisma.utilisateur.create({
            data: {
                id: authData.user.id,
                email: fauxEmail,
                username: username.trim(),
                nom: nom.trim(),
                prenom: prenom.trim(),
                telephone: telephone ? telephone.trim() : null,
                role: 'MEMBRE'
            }
        });

        return {
            success: true,
            needsConfirmation: false
        };

    } catch (error) {
        console.error("[signup] Erreur critique lors de l'inscription :", error);
        return {
            success: false,
            error: "Une erreur serveur est survenue. Veuillez réessayer plus tard."
        };
    }
}