'use server';

import { prisma } from '@/lib/prisma';

export async function submitResetRequestAction(formData: any) {
    const { username, message } = formData;

    if (!username || !message) {
        return { success: false, error: "Tous les champs sont obligatoires." };
    }

    try {
        const fauxEmail = `${username.trim().toLowerCase()}@rfc06.fr`;

        await prisma.messageContact.create({
            data: {
                nom: username.trim(),
                email: fauxEmail,
                sujet: "Demande de réinitialisation de mot de passe",
                message: message.trim()
            }
        });

        return { success: true };

    } catch (error) {
        console.error("[reset-password-contact] Erreur critique :", error);
        return {
            success: false,
            error: "Une erreur serveur est survenue. Veuillez réessayer plus tard."
        };
    }
}