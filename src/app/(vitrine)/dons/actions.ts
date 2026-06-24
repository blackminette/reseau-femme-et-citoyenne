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
            user = await prisma.utilisateur.create({
                data: {
                    email: email.toLowerCase(),
                    nom: nom,
                    prenom: prenom,
                    role: 'DONATEUR',
                }
            });
        }

        // Créer l'enregistrement de don
        const don = await prisma.don.create({
            data: {
                montant: amount,
                utilisateurId: user.id,
                statut: 'COMPLETED'
            }
        });

        return { success: true, donId: don.id };
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du don:", error);
        return { success: false, error: "Impossible d'enregistrer le don. Veuillez réessayer." };
    }
}
