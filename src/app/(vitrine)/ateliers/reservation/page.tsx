import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import ReservationClient from './reservationClient';

// Configuration de la connexion à la BDD
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const revalidate = 0; // Force la page à ne pas être mise en cache pour avoir les ateliers en temps réel

export default async function ReservationPage() {
  // Récupération de tous les ateliers depuis la base de données
  const ateliersBdd = await prisma.atelier.findMany({
    orderBy: {
      dateDebut: 'asc',
    },
  });

  // Formatage des données pour les envoyer proprement au composant Client
  const ateliersFormates = ateliersBdd.map((atelier) => {
    const dateAtelier = new Date(atelier.dateDebut);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short' };
    const dateTexte = dateAtelier.toLocaleDateString('fr-FR', options);
    const heureTexte = `${dateAtelier.getHours()}h`;

    return {
      id: atelier.id,
      titre: atelier.titre,
      description: atelier.description,
      // On génère dynamiquement le texte de la date à la place du texte fixe "4 - 12 ans"
      ageText: `${dateTexte.toUpperCase()} à ${heureTexte}`,
    };
  });

  return <ReservationClient initialAteliers={ateliersFormates} />;
}