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

  // Variable temporaire pour stocker l'ID de l'intervenante pour la liaison des cours/ateliers
  let intervenanteId = '';

  // 2. Boucle pour créer sur Supabase Auth ET synchroniser dans Prisma via l'UUID généré
  for (const user of utilisateursDeTest) {
    let supabaseAuthId: string;

    // A. Création/Vérification du compte dans Supabase Auth (Sans envoi d'email)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.motDePasse,
      email_confirm: true // Valide le compte d'office pour éviter le blocage au login
    });

    if (authError) {
      // Si l'utilisateur existe déjà sur Supabase Auth, on récupère simplement son UUID existant
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
      // Si la création est neuve, on extrait l'UUID généré par Supabase
      supabaseAuthId = authData.user.id;
    }

    // Garde en mémoire l'ID de l'intervenante pour la suite
    if (user.role === 'INTERVENANTE') {
      intervenanteId = supabaseAuthId;
    }

    // B. Exécution de l'upsert Prisma indexé sur cet UUID
    await prisma.utilisateur.upsert({
      where: { id: supabaseAuthId }, // Utilise l'ID authentifié comme clé primaire
      update: {}, 
      create: {
        id: supabaseAuthId, // On force Prisma à s'aligner sur l'UUID de Supabase
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        telephone: user.telephone,
      },
    });

    console.log(`👤 Compte [${user.role}] pour ${user.prenom} ${user.nom} synchronisé ! (Mdp: ${user.motDePasse})`);
  }

  // --- NOUVELLE SECTION FUSIONNÉE : LIEUX ET ATELIERS ---
  console.log('🌱 (Seeding) Injection des lieux et ateliers de test pour le calendrier...');

  // A. Ajout ou récupération des lieux uniques via l'ID BAN officiel
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

  // Nettoyage des anciens ateliers de test pour éviter l'encombrement au rafraîchissement
  await prisma.atelier.deleteMany({});

  // B. Ajout des Ateliers de test calés sur Juin 2026 (Mois et année en cours)
  await prisma.atelier.createMany({
    data: [
      {
        titre: 'Conte & bricolage',
        description: '3 - 5 ans Saint-Roch. Doudou bienvenu.',
        dateDebut: new Date('2026-06-17T14:00:00Z'), // Mercredi à 14h
        dateFin: new Date('2026-06-17T16:00:00Z'),
        placesMax: 10,
        lieuId: lieuMedia.id,
      },
      {
        titre: 'Création de Jeux Scratch',
        description: 'Niveau Poussins.',
        dateDebut: new Date('2026-06-17T16:30:00Z'), // Mercredi à 16h30
        dateFin: new Date('2026-06-17T18:00:00Z'),
        placesMax: 15,
        lieuId: lieuMedia.id,
      },
      {
        titre: 'Robotique & Kits Arduino',
        description: 'Niveau Collège (11-15 ans).',
        dateDebut: new Date('2026-06-20T10:00:00Z'), // Samedi à 10h
        dateFin: new Date('2026-06-20T12:30:00Z'),
        placesMax: 15,
        lieuId: lieuLab.id,
      },
      {
        titre: 'Initiation HTML / CSS',
        description: 'Niveau Primaire.',
        dateDebut: new Date('2026-06-20T14:00:00Z'), // Samedi à 14h
        dateFin: new Date('2026-06-20T16:30:00Z'),
        placesMax: 12,
        lieuId: lieuLab.id,
      }
    ],
  });

  console.log('✅ Données de planning injectées et prêtes pour l\'affichage !');
  console.log('✅ Seeding terminé avec succès et prêt pour le login local !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    // Ferme proprement le pool à la fin
    await pool.end();
  });