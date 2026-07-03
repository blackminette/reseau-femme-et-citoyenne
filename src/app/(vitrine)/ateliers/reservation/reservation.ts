'use server';

import { prisma } from "@/lib/prisma";

export async function reserverAtelier(prevState: any, formData: FormData) {
  const atelierId = parseInt(formData.get('atelierId') as string);
  const rawUtilisateurId = formData.get('utilisateurId') as string;
  const nom = formData.get('nom') as string;
  const email = formData.get('email') as string;
  const telephone = formData.get('telephone') as string;
  const modePaiement = formData.get('modePaiement') as string;

  const utilisateurId = (rawUtilisateurId && rawUtilisateurId !== "") ? rawUtilisateurId : undefined;

  try {
    return await prisma.$transaction(async (tx) => {
      // Vérification de la disponibilité
      const atelier = await tx.atelier.findUnique({
        where: { id: atelierId },
        include: { reservations: true }
      });

      if (!atelier) {
        throw new Error("Atelier introuvable.");
      }

      if (atelier.reservations.length >= atelier.placesMax) {
        throw new Error("Désolé, cet atelier est complet.");
      }

      // Création de la réservation
      await tx.reservation.create({
        data: { 
          atelierId, 
          utilisateurId, 
          nom: nom || null,
          email: email || null,
          telephone: telephone || null,
          modePaiement: modePaiement || "SUR_PLACE",
          statutPaiement: modePaiement === 'HELLOASSO' ? 'EN_ATTENTE' : 'A_PAYER_SUR_PLACE',
          statut: "PENDING"
        }
      });

      return { 
        success: true, 
        message: modePaiement === 'HELLOASSO' 
          ? "Réservation enregistrée. Veuillez procéder au paiement." 
          : "Réservation confirmée ! Règlement à prévoir sur place." 
      };
    });
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}