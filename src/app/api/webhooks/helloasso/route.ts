import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        console.log("[Webhook HelloAsso] Événement reçu :", JSON.stringify(body, null, 2));

        // HelloAsso envoie des événements de type 'Payment'
        if (body.eventType === 'Payment' && body.data.status === 'Success') {
            const { amount, payer } = body.data;
            
            // Le montant de HelloAsso est en centimes d'euros
            const montantEuros = amount / 100;
            const email = payer?.email?.toLowerCase();

            if (!email) {
                console.warn("[Webhook HelloAsso] Email du payeur manquant, impossible d'associer le don.");
                return NextResponse.json({ error: "Email manquant" }, { status: 400 });
            }

            // Trouver ou créer l'utilisateur donateur
            let user = await prisma.utilisateur.findUnique({
                where: { email }
            });

            if (!user) {
                const nom = payer.lastName || 'Anonyme';
                const prenom = payer.firstName || 'Donateur';
                
                // Generer un username unique
                const usernameBase = email.split('@')[0];
                const uniqueSuffix = Date.now().toString().slice(-4);

                user = await prisma.utilisateur.create({
                    data: {
                        email,
                        nom,
                        prenom,
                        username: `${usernameBase}_${uniqueSuffix}`,
                        role: 'MEMBRE', // Par défaut 'MEMBRE', ou donateur si supporté
                    }
                });
            }

            // Enregistrer le don comme complété
            const don = await prisma.don.create({
                data: {
                    montant: montantEuros,
                    statut: 'COMPLETED',
                    utilisateurId: user.id
                }
            });

            console.log("[Webhook HelloAsso] Don enregistré avec succès en base de données :", don.id);
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("[Webhook HelloAsso] Erreur de traitement du webhook :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
