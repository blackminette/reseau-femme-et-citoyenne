// * src/app/(dashboard-adultes)/admin/membres/actions.ts
'use server'

import { prisma } from '@/lib/prisma';
import { getSupabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function listerLesUtilisateurs(trie: string, filtre?: string) {
    try {
        const whereCondition: any = {};

        if (filtre) {
            whereCondition.OR = [
                { role: filtre },
                { nom: { contains: filtre, mode: 'insensitive' } },
                { prenom: { contains: filtre, mode: 'insensitive' } },
                { email: { contains: filtre, mode: 'insensitive' } },
            ];
        }

        const utilisateurs = await prisma.utilisateur.findMany({
            where: whereCondition,
            orderBy: {
                createdAt: trie === 'CROISSANT' ? 'asc' : 'desc',
            },
            select: {
                id: true,
                nom: true,
                prenom: true,
                username: true,
                telephone: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        enfants: true,
                        reservations: true,
                        coursAnimes: true,
                        dons: true,
                    }
                },
                tuteur: {
                    select: {
                        nom: true,
                        prenom: true,
                    }
                }
            }
        });

        return { success: true, data: utilisateurs };
    } catch (error) {
        console.error("Erreur Prisma :", error);
        return { success: false, error: "Impossible de charger les membres." };
    }
}

export async function modifierUtilisateur(id: string, nouvelleDonnees: any) {
    try {
        const membreModifie = await prisma.utilisateur.update({
            where: { id: id },
            data: {
                nom: nouvelleDonnees.nom,
                prenom: nouvelleDonnees.prenom,
                username: nouvelleDonnees.username,
                telephone: nouvelleDonnees.telephone,
                role: nouvelleDonnees.role
            }
        });

        revalidatePath('/admin/membres');

        return { success: true, data: membreModifie };
    } catch (error) {
        console.error("Erreur lors de la modification :", error);
        return { success: false, error: "Impossible de modifier le membre" };
    }
}

export async function supprimerUtilisateur(id: string) {
    try {
        const supabase = await getSupabaseAdmin();

        const { error: authError } = await supabase.auth.admin.deleteUser(id);

        if (authError) {
            console.error("[supprimerUtilisateur] Erreur Supabase Auth:", authError.message);
            return { success: false, error: "Impossible de supprimer les identifiants de sécurité." };
        }

        await prisma.utilisateur.delete({
            where: { id: id }
        });

        revalidatePath('/admin/membres');
        return { success: true };
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        return { success: false, error: "Impossible de supprimer le membre de la base de données." };
    }
}

export async function creerUtilisateur(formData: {
    nom: string;
    prenom: string;
    username: string;
    telephone?: string;
    role: string;
}) {
    const { nom, prenom, username, telephone, role } = formData;

    if (!nom || !prenom || !username || !role) {
        return { success: false, error: "Les champs obligatoires sont manquants." };
    }

    try {
        const supabase = await getSupabaseAdmin();

        const emailSimule = `${username.trim().toLowerCase()}@rfc06.fr`;
        const motDePasseTemporaire = "Password123!";

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: emailSimule,
            password: motDePasseTemporaire,
            email_confirm: true,
            user_metadata: {
                nom: nom.trim(),
                prenom: prenom.trim(),
                telephone: telephone?.trim() || null,
                doitChangerMotDePasse: true
            }
        });

        if (authError) {
            console.error("[creerUtilisateur] Erreur Supabase Admin Auth:", authError.message);
            return { success: false, error: authError.message };
        }

        if (!authData.user) {
            return { success: false, error: "Erreur lors de la création du compte de sécurité." };
        }

        const nouvelUtilisateur = await prisma.utilisateur.create({
            data: {
                id: authData.user.id,
                username: username.trim(),
                email: emailSimule,
                nom: nom.trim(),
                prenom: prenom.trim(),
                telephone: telephone?.trim() || null,
                role: role
            }
        });

        return { success: true, data: nouvelUtilisateur };

    } catch (error: any) {
        console.error("[creerUtilisateur] Erreur critique :", error);
        if (error.code === 'P2002') {
            return { success: false, error: "Ce nom d'utilisateur est déjà pris." };
        }
        return { success: false, error: "Une erreur interne est survenue sur le serveur." };
    }
}