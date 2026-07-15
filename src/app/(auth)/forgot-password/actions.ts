'use server';

import { prisma } from '@/lib/prisma';

type PasswordRequest = {
    username: string;
    message: string;
};

export async function submitForgotRequestAction(formData: PasswordRequest) {
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
                sujet: "Demande de mot de passe oublié",
                message: message.trim()
            }
        });

        return { success: true };

    } catch (error) {
        console.error("[forgot-password-contact] Erreur critique :", error);
        return {
            success: false,
            error: "Une erreur serveur est survenue. Veuillez réessayer plus tard."
        };
    }
}
