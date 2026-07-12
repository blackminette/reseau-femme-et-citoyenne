// * src/app/(auth)/login/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getSupabaseServer } from '@/lib/supabase';

export async function loginAction(formData: { email: string; password: string }) {
    const { email, password } = formData;

    try {
        const inputEmail = email.trim().toLowerCase();
        const fauxEmail = inputEmail.includes('@') ? inputEmail : `${inputEmail}@rfc06.fr`;
        const supabase = await getSupabaseServer();

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: fauxEmail,
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
        let utilisateur = await prisma.utilisateur.findUnique({
            where: { email: fauxEmail }
        });

        if (!utilisateur) {
            console.log("[login] Profil Prisma manquant, création automatique pour:", fauxEmail);
            utilisateur = await prisma.utilisateur.create({
                data: {
                    id: authData.user.id, // Synchronisation de l'ID
                    email: fauxEmail,
                    username: fauxEmail.split('@')[0],
                    nom: authData.user.user_metadata?.nom || 'Nom par défaut',
                    prenom: authData.user.user_metadata?.prenom || 'Prénom par défaut',
                    role: 'MEMBRE' // Rôle par défaut
                }
            });
        }

        console.log("[login] Profil trouvé/créé, rôle:", utilisateur.role);


        // Si tout est bon, on renvoie le rôle de l'utilisateur pour adapter l'interface ensuite
        return {
            success: true,
            role: utilisateur.role,
            session: authData.session
        };

    } catch (error) {
        console.error("[loginAction] Erreur serveur critique :", error);
        return {
            success: false,
            error: "Une erreur serveur est survenue. Veuillez réessayer plus tard."
        };
    }
}
