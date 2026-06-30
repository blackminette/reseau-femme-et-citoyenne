// * src/app/(dashboard-adultes)/admin/membres/actions.ts
'use server'

import { prisma } from '@/lib/prisma';
import { getSupabaseAdmin, getSupabaseServer } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function listerLesUtilisateurs() {
    try {
        const utilisateurs = await prisma.utilisateur.findMany({
            select: {
                id: true,
                nom: true,
                prenom: true,
                username: true,
                telephone: true,
                role: true,
                isActive: true,
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

export async function reinitialiserMdp(username: string) {
    if (!username) {
        return { success: false, error: "Nom d'utilisateur manquant." };
    }

    try {
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { username: username.trim() }
        });

        if (!utilisateur) {
            return { success: false, error: "Utilisateur introuvable dans la base de données." };
        }

        const supabase = await getSupabaseAdmin();

        const { error } = await supabase.auth.admin.updateUserById(
            utilisateur.id,
            {
                password: "Password123!",
                user_metadata: {
                    doitChangerMotDePasse: true
                }
            }
        );

        if (error) {
            console.error("[reinitialiserMdp] Erreur Supabase Admin :", error.message);
            return { success: false, error: error.message };
        }

        await supabase.auth.admin.signOut(utilisateur.id);

        revalidatePath('/admin/membres');
        return { success: true };

    } catch (error: any) {
        console.error("[reinitialiserMdp] Erreur critique :", error);
        return { success: false, error: "Une erreur interne est survenue sur le serveur." };
    }
}

export async function toggleStatutUtilisateur(id: string, statutActuel: boolean) {
    try {
        await prisma.utilisateur.update({
            where: { id: id },
            data: { isActive: !statutActuel }
        });

        revalidatePath('/admin/membres');

        return { success: true };
    } catch (error) {
        console.error("[toggleStatutUtilisateur] Erreur :", error);
        return { success: false, error: "Impossible de modifier le statut du membre." };
    }
}

export async function creerUtilisateursEnLot(data: {
    prefixe: string;
    role: string;
    nombre: number;
}) {
    const { prefixe, role, nombre } = data;

    if (!prefixe || !role || !nombre || nombre < 1) {
        return { success: false, error: "Paramètres invalides." };
    }

    if (nombre > 50) {
        return { success: false, error: "Par sécurité, vous ne pouvez pas créer plus de 50 comptes à la fois." };
    }

    try {
        const supabase = await getSupabaseAdmin();
        const baseUsername = prefixe.trim().toLowerCase().replace(/\s+/g, '');
        const comptesCrees = [];

        for (let i = 1; i <= nombre; i++) {
            const currentUsername = `${baseUsername}${i}`;
            const emailSimule = `${currentUsername}@rfc06.fr`;
            const motDePasseTemporaire = "Password123!";

            const existingUser = await prisma.utilisateur.findUnique({
                where: { username: currentUsername }
            });

            if (existingUser) {
                continue;
            }

            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: emailSimule,
                password: motDePasseTemporaire,
                email_confirm: true,
                user_metadata: {
                    nom: prefixe.toUpperCase(),
                    prenom: `N°${i}`,
                    doitChangerMotDePasse: true
                }
            });

            if (authError) {
                console.error(`[creerUtilisateursEnLot] Erreur Supabase pour ${currentUsername}:`, authError.message);
                continue;
            }

            if (authData?.user) {
                const nouvelUser = await prisma.utilisateur.create({
                    data: {
                        id: authData.user.id,
                        username: currentUsername,
                        email: emailSimule,
                        nom: prefixe.trim(),
                        prenom: `N°${i}`,
                        role: role
                    }
                });
                comptesCrees.push(nouvelUser);
            }
        }

        revalidatePath('/admin/membres');

        return {
            success: true,
            message: `${comptesCrees.length} compte(s) créé(s) avec succès.`
        };

    } catch (error) {
        console.error("[creerUtilisateursEnLot] Erreur critique :", error);
        return { success: false, error: "Une erreur interne est survenue lors de la création en lot." };
    }
}

export async function supprimerUtilisateursEnMasse(ids: string[]) {
    if (!ids || ids.length === 0) {
        return { success: false, error: "Aucun utilisateur sélectionné." };
    }

    try {
        const supabase = await getSupabaseAdmin();

        const idsSupprimesAvecSucces: string[] = [];

        for (const id of ids) {
            const { error: authError } = await supabase.auth.admin.deleteUser(id);

            if (authError) {
                console.error(`[supprimerMasse] Impossible de supprimer Auth pour ${id}:`, authError.message);
                continue;
            }

            idsSupprimesAvecSucces.push(id);
        }

        if (idsSupprimesAvecSucces.length === 0) {
            return {
                success: false,
                error: "La suppression a échoué dans le système d'authentification. Aucune donnée n'a été retirée de la base de données."
            };
        }

        const result = await prisma.utilisateur.deleteMany({
            where: {
                id: {
                    in: idsSupprimesAvecSucces
                }
            }
        });

        revalidatePath('/admin/membres');

        // On prépare un message précis pour l'administrateur si certains comptes ont échoué
        const totalEchecs = ids.length - idsSupprimesAvecSucces.length;
        const messageSucces = totalEchecs > 0
            ? `${result.count} membre(s) supprimé(s) avec succès. (${totalEchecs} échec(s) ignoré(s) par sécurité)`
            : `${result.count} membre(s) supprimé(s) avec succès.`;

        return {
            success: true,
            message: messageSucces
        };

    } catch (error) {
        console.error("[supprimerUtilisateursEnMasse] Erreur critique :", error);
        return { success: false, error: "Une erreur est survenue lors de la suppression groupée." };
    }
}