'use server';

import { prisma } from '@/lib/prisma';

export async function enregistrerDon(data: {
    amount: number;
    name: string;
    email: string;
    message?: string;
}) {
    try {
        const { amount, name, email } = data;

        // Extraire le prénom et le nom
        const nameParts = name.trim().split(/\s+/);
        const prenom = nameParts[0] || 'Donateur';
        const nom = nameParts.slice(1).join(' ') || 'Anonyme';

        // Trouver ou créer l'utilisateur donateur
        let user = await prisma.utilisateur.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            const baseUsername = email.toLowerCase().split('@')[0].replace(/[^a-z0-9]/g, '');
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            const generatedUsername = `${baseUsername}${randomSuffix}`;

            user = await prisma.utilisateur.create({
                data: {
                    email: email.toLowerCase(),
                    username: generatedUsername,
                    nom: nom,
                    prenom: prenom,
                    role: 'DONATEUR',
                }
            });
        }

        // Créer l'enregistrement de don initialisé à 'PENDING'
        const don = await prisma.don.create({
            data: {
                montant: amount,
                utilisateurId: user.id,
                statut: 'PENDING'
            }
        });

        // URL officielle HelloAsso avec paramètres pré-remplis
        const redirectUrl = `https://www.helloasso.com/associations/reseau-femme-et-citoyenne-06/formulaires/1?amount=${amount}`;

        return { success: true, donId: don.id, redirectUrl };
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du don:", error);
        return { success: false, error: "Impossible d'enregistrer le don. Veuillez réessayer." };
    }
}
