// * src/app/api/webhooks/helloasso/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        console.log("[Webhook HelloAsso] Réception d'un événement :", JSON.stringify(body, null, 2));

        // HelloAsso envoie des événements de type 'Payment'
        if (body.eventType === 'Payment' && body.data.status === 'Success') {
            const { amount, payer, date } = body.data;
            
            // Conversion du montant (HelloAsso envoie en centimes)
            const montantEuros = amount / 100;

            // Enregistrement du don dans votre base de données
            // Note : L'ID de l'utilisateur est requis dans le schéma Don.
            // Nous essayons de trouver l'utilisateur par son email.
            let utilisateurId: string | undefined = undefined;
            if (payer && payer.email) {
                const user = await prisma.utilisateur.findUnique({
                    where: { email: payer.email }
                });
                if (user) {
                    utilisateurId = user.id;
                }
            }

            if (utilisateurId) {
                const don = await prisma.don.create({
                    data: {
                        montant: montantEuros,
                        statut: 'COMPLETED',
                        utilisateurId: utilisateurId,
                    }
                });
                console.log("[Webhook HelloAsso] Don enregistré avec succès :", don.id);
            } else {
                console.warn(`[Webhook HelloAsso] Aucun utilisateur trouvé avec l'email du payeur (${payer?.email || 'non fourni'}). Le don de ${montantEuros} € n'a pas pu être enregistré en base car utilisateurId est obligatoire.`);
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("[Webhook HelloAsso] Erreur lors du traitement :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
