import React from 'react';
import { prisma } from '@/lib/prisma'; // Assure-toi d'utiliser l'import nommé avec accolades suite à ton correctif
import PlanningClient from './planningClient';

export default async function PlanningPage() {
  // Récupération de tous les ateliers programmés avec leurs relations indispensables
  const ateliers = await prisma.atelier.findMany({
    include: {
      lieu: true,
      reservations: true,
    },
    orderBy: {
      dateDebut: 'asc',
    },
  });

  // Sérialisation propre des données pour les envoyer au Client Component sans erreur de type Date
  const serializedAteliers = ateliers.map((atelier) => ({
    id: atelier.id,
    titre: atelier.titre,
    description: atelier.description,
    dateDebut: atelier.dateDebut.toISOString(),
    dateFin: atelier.dateFin.toISOString(),
    placesMax: atelier.placesMax,
    countReservations: atelier.reservations.length,
    lieu: {
      nom: atelier.lieu.nom,
      adresseTexte: atelier.lieu.adresseTexte,
    },
  }));

  return <PlanningClient initialAteliers={serializedAteliers} />;
}