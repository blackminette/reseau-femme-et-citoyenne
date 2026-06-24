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
            // Note : L'ID de l'utilisateur est parfois difficile à récupérer via Webhook seul
            // Sauf si vous avez passé l'ID utilisateur dans le champ 'payer' ou 'metadata'
            const don = await prisma.don.create({
                data: {
                    type: 'FINANCIER',
                    status: 'RECEIVED',
                    montant: montantEuros,
                    description: `Don via HelloAsso - ${payer.firstName} ${payer.lastName}`,
                    // Si vous avez réussi à mapper l'utilisateur :
                    // utilisateurId: body.data.metadata.utilisateurId || "anon",
                }
            });

            console.log("[Webhook HelloAsso] Don enregistré avec succès :", don.id);
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("[Webhook HelloAsso] Erreur lors du traitement :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
