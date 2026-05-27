// src/app/(app-avec-header)/login/actions.ts
'use server';

import { prisma } from '@/lib/prisma'; // Assure-toi d'avoir configuré ton client prisma ici
// import { supabase } from '@/lib/supabase'; // Si vous utilisez l'auth Supabase

export async function loginAction(formData: any) {
    const { email, password } = formData;

    try {
        // Chercher si l'utilisateur existe dans ta table
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return { success: false, error: "Identifiants incorrects" };
        }

        // Validation avec Supabase
        if (user.password !== password) { //! Ne pas oublier de hasher les mots de passe en production
            return { success: false, error: "Identifiants incorrects" };
        }

        return { success: true, role: user.role };
    } catch (error) {
        console.error("Erreur login:", error);
        return { success: false, error: "Une erreur serveur est survenue" };
    }
}