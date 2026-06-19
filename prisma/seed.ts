import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charge l'environnement local, avec fallback sur .env si .env.local n'existe pas
dotenv.config({ path: '.env.local' });
if (!process.env.DATABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  dotenv.config({ path: '.env' });
}

// Configure le pool de connexion PostgreSQL natif
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Initialise Prisma avec l'adaptateur exigé par la v7
const prisma = new PrismaClient({ adapter });

const hasSupabaseConfig =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

// Initialisation du client Supabase avec la clé d'administration (Service Role Key)
const supabaseAdmin = hasSupabaseConfig
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  : null;

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

  // 2. Boucle pour créer sur Supabase Auth ET synchroniser dans Prisma via l'UUID généré
  if (!supabaseAdmin) {
    console.warn('⚠️ Variables Supabase absentes: la synchronisation Auth est ignorée, seule la base Prisma est alimentée.');
  }

  for (const user of utilisateursDeTest) {
    if (!supabaseAdmin) {
      continue;
    }

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

  const actualitesDeTest = [
    {
      titre: 'Label "Association Engagée" renouvelé pour 2025',
      tag: 'Vie associative',
      datePublication: new Date('2025-04-03T12:00:00.000Z'),
      extrait:
        'Pour la troisième année consécutive, la Ville de Nice renouvelle notre label qui récompense notre engagement auprès des familles.',
      ctaLabel: 'Lire la suite',
      ctaHref: '/ateliers',
      ordre: 1,
      estPublic: true,
    },
    {
      titre: 'Nouveau : ateliers jardinage et permaculture',
      tag: 'Atelier à thème',
      datePublication: new Date('2025-03-20T12:00:00.000Z'),
      extrait:
        'À partir d’avril, nous proposons des ateliers de jardinage urbain pour initier les enfants à la permaculture et au respect de la nature.',
      ctaLabel: 'Réserver',
      ctaHref: '/ateliers',
      ordre: 2,
      estPublic: true,
    },
    {
      titre: 'Le spectacle de Noël : un franc succès !',
      tag: 'Événement',
      datePublication: new Date('2025-01-10T12:00:00.000Z'),
      extrait:
        'Plus de 200 personnes ont assisté au spectacle de théâtre de décembre. Les enfants ont présenté une pièce écrite par eux-mêmes.',
      ctaLabel: 'Voir les vidéos',
      ctaHref: '/actualites',
      ordre: 3,
      estPublic: true,
    },
    {
      titre: 'Des actions construites avec les partenaires locaux',
      tag: 'Partenaire',
      datePublication: new Date('2026-05-28T12:00:00.000Z'),
      extrait:
        'L’association continue de structurer ses contenus et ses actions pour proposer des repères clairs, utiles et accessibles à tous.',
      ctaLabel: 'Découvrir',
      ctaHref: '/contact',
      ordre: 4,
      estPublic: true,
    },
    {
      titre: 'Forum de l’engagement : présence de l’association',
      tag: 'Événement',
      datePublication: new Date('2026-06-10T12:00:00.000Z'),
      extrait:
        'L’association participe à un temps fort local pour présenter ses actions, ses ateliers et ses besoins en bénévoles.',
      ctaLabel: 'Lire l’article',
      ctaHref: '/actualites/forum-engagement-2026',
      ordre: 5,
      estPublic: true,
    },
    {
      titre: 'Nouvelle session : accompagnement aux démarches',
      tag: 'Plateforme éducative',
      datePublication: new Date('2026-06-18T12:00:00.000Z'),
      extrait:
        'Un nouveau cycle de séances est prévu pour aider les publics à mieux comprendre les démarches du quotidien et avancer pas à pas.',
      ctaLabel: 'Découvrir',
      ctaHref: '/ateliers',
      ordre: 6,
      estPublic: true,
    },
    {
      titre: 'Maison des Associations Saint Roch : atelier inclusion numérique',
      tag: 'Atelier',
      datePublication: new Date('2026-06-19T12:00:00.000Z'),
      extrait:
        'Atelier inclusion numérique le lundi de 14h à 16h pour accompagner les publics sur les bases du numérique.',
      ctaLabel: 'Voir l’atelier',
      ctaHref: '/ateliers',
      ordre: 7,
      estPublic: true,
    },
  ];

  for (const actualite of actualitesDeTest) {
    await prisma.actualite.upsert({
      where: { id: actualite.ordre },
      update: {
        titre: actualite.titre,
        tag: actualite.tag,
        datePublication: actualite.datePublication,
        extrait: actualite.extrait,
        ctaLabel: actualite.ctaLabel,
        ctaHref: actualite.ctaHref,
        ordre: actualite.ordre,
        estPublic: actualite.estPublic,
      },
      create: {
        id: actualite.ordre,
        titre: actualite.titre,
        tag: actualite.tag,
        datePublication: actualite.datePublication,
        extrait: actualite.extrait,
        ctaLabel: actualite.ctaLabel,
        ctaHref: actualite.ctaHref,
        ordre: actualite.ordre,
        estPublic: actualite.estPublic,
      },
    });
  }

  if (supabaseAdmin) {
    console.log('✅ Seeding terminé avec succès et prêt pour le login local !');
  } else {
    console.log('✅ Seeding terminé avec succès pour la base Prisma. La synchronisation Auth Supabase est désactivée.');
  }
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
