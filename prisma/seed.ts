import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charge le fichier .env
dotenv.config({ path: '.env.local' });

// Configure le pool de connexion PostgreSQL natif
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Initialise Prisma avec l'adaptateur exigé par la v7
const prisma = new PrismaClient({ adapter });

// Initialisation du client Supabase avec la clé d'administration (Service Role Key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('🌱 (Seeding) Début de la synchronisation Supabase + Prisma...');

  // 1. Liste de tous les comptes de test (un par rôle) avec mot de passe générique
  const utilisateursDeTest = [
    {
      email: 'admin@rfc06.fr',
      motDePasse: 'PassAsso123!',
      nom: 'IPSSI',
      prenom: 'Johanna',
      role: 'ADMIN',
      telephone: '0601020304',
    },
    {
      email: 'membre@rfc06.fr',
      motDePasse: 'PassAsso123!',
      nom: 'Martin',
      prenom: 'Lucas',
      role: 'MEMBRE',
      telephone: '0602030405',
    },
    {
      email: 'partenaire@rfc06.fr',
      motDePasse: 'PassAsso123!',
      nom: 'Dubois',
      prenom: 'Thomas',
      role: 'PARTENAIRE',
      telephone: '0603040506',
    },
    {
      email: 'intervenante@rfc06.fr',
      motDePasse: 'PassAsso123!',
      nom: 'Robert',
      prenom: 'Sarah',
      role: 'INTERVENANTE',
      telephone: '0604050607',
    },
    {
      email: 'enfant@rfc06.fr',
      motDePasse: 'PassAsso123!',
      nom: 'Petit',
      prenom: 'Chloé',
      role: 'ENFANT',
      telephone: null,
    },
    {
      email: 'benevole@rfc06.fr',
      motDePasse: 'PassAsso123!',
      nom: 'Lemoine',
      prenom: 'Antoine',
      role: 'BENEVOLE',
      telephone: '0605060708',
    }
  ];

  let intervenanteId = '';

  // 2. Boucle pour créer sur Supabase Auth ET synchroniser dans Prisma
  for (const user of utilisateursDeTest) {
    let supabaseAuthId: string;

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.motDePasse,
      email_confirm: true 
    });

    if (authError) {
      if (authError.message.includes('already exists') || authError.message.includes('email_exists')) {
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const userExistant = listData?.users.find(u => u.email === user.email);
        
        if (!userExistant) {
          console.error(`❌ Impossible de récupérer l'UUID existant pour ${user.email}`);
          continue;
        }
        supabaseAuthId = userExistant.id;
      } else {
        console.error(`❌ Erreur Supabase Auth pour ${user.email}:`, authError.message);
        continue;
      }
    } else {
      supabaseAuthId = authData.user.id;
    }

    if (user.role === 'INTERVENANTE') {
      intervenanteId = supabaseAuthId;
    }

    await prisma.utilisateur.upsert({
      where: { id: supabaseAuthId },
      update: {}, 
      create: {
        id: supabaseAuthId,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        telephone: user.telephone,
      },
    });

    console.log(`👤 Compte [${user.role}] pour ${user.prenom} ${user.nom} synchronisé !`);
  }

  // --- LOGIQUE DE CALCUL DYNAMIQUE DE LA SEMAINE COURANTE ---
  const aujourdhui = new Date();
  const diff = aujourdhui.getDay() === 0 ? 6 : aujourdhui.getDay() - 1;
  
  // Calcul du lundi de cette semaine à minuit pile
  const lundiCourant = new Date(aujourdhui);
  lundiCourant.setDate(aujourdhui.getDate() - diff);
  lundiCourant.setHours(0, 0, 0, 0);

  // Helper pour générer des dates de manière lisible
  const getDatePourJourEtHeure = (joursDepuisLundi: number, heures: number, minutes: number = 0) => {
    const d = new Date(lundiCourant);
    d.setDate(lundiCourant.getDate() + joursDepuisLundi);
    d.setHours(heures, minutes, 0, 0);
    return d;
  };

  console.log('🌱 (Seeding) Injection des lieux et ateliers dynamiques pour cette semaine...');

  const lieuMedia = await prisma.lieu.upsert({
    where: { adresseIdBan: 'ban-id-12345' },
    update: {},
    create: {
      nom: 'Espace Créatif (Média 1)',
      adresseTexte: '12 Rue des Fleurs, 06000 Nice',
      adresseIdBan: 'ban-id-12345',
      estExterieur: false,
    },
  });

  const lieuLab = await prisma.lieu.upsert({
    where: { adresseIdBan: 'ban-id-67890' },
    update: {},
    create: {
      nom: 'Salle Lab Tech 2',
      adresseTexte: '45 Avenue de la République, 06000 Nice',
      adresseIdBan: 'ban-id-67890',
      estExterieur: false,
    },
  });

  // Nettoyage complet
  await prisma.atelier.deleteMany({});

  // B. Ajout des Ateliers de test calculés dynamiquement sur la semaine actuelle
  await prisma.atelier.createMany({
    data: [
      {
        titre: 'Conte & bricolage',
        description: '3 - 5 ans. Doudou bienvenu.',
        dateDebut: getDatePourJourEtHeure(1, 10), // 1 = Mardi, 10h
        dateFin: getDatePourJourEtHeure(1, 12),   // Mardi, 12h
        placesMax: 10,
        lieuId: lieuMedia.id,
      },
      {
        titre: 'Création de Jeux Scratch',
        description: 'Niveau Poussins (3 - 5 ans).',
        dateDebut: getDatePourJourEtHeure(2, 14), // 2 = Mercredi, 14h
        dateFin: getDatePourJourEtHeure(2, 16),   // Mercredi, 16h
        placesMax: 15,
        lieuId: lieuMedia.id,
      },
      {
        titre: 'Robotique & Kits Arduino',
        description: 'Découverte ludique.',
        dateDebut: getDatePourJourEtHeure(2, 16, 30), // Mercredi, 16h30
        dateFin: getDatePourJourEtHeure(2, 18),      // Mercredi, 18h
        placesMax: 15,
        lieuId: lieuLab.id,
      },
      {
        titre: 'Initiation Peinture',
        description: 'Expression créative libre.',
        dateDebut: getDatePourJourEtHeure(5, 14), // 5 = Samedi, 14h
        dateFin: getDatePourJourEtHeure(5, 16),   // Samedi, 16h
        placesMax: 12,
        lieuId: lieuLab.id,
      }
    ],
  });

  console.log('✅ Données de planning injectées dynamiquement pour la semaine en cours !');
  console.log('✅ Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });