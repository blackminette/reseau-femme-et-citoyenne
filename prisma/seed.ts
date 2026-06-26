import { PrismaClient, Parcours, Difficulte } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
if (!process.env.DATABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  dotenv.config({ path: '.env' });
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('🌱 (Seeding) Début de la synchronisation Supabase + Prisma...');

  const utilisateursDeTest = [
    {
      email: 'admin@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'admin',
      nom: 'IPSSI',
      prenom: 'Johanna',
      role: 'ADMIN',
      telephone: '0601020304',
    },
    {
      email: 'membre@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'membre',
      nom: 'Dupont',
      prenom: 'Jean',
      role: 'MEMBRE',
      telephone: '0611223344',
    },
    {
      email: 'intervenant@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'intervenant',
      nom: 'Martin',
      prenom: 'Sophie',
      role: 'INTERVENANT',
      telephone: '0622334455',
    },
    {
      email: 'partenaire@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'partenaire',
      nom: 'Asso',
      prenom: 'Partenaire',
      role: 'PARTENAIRE',
      telephone: '0633445566',
    },
    {
      email: 'benevole@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'benevole',
      nom: 'Bernard',
      prenom: 'Lucas',
      role: 'BENEVOLE',
      telephone: '0644556677',
    },
    {
      email: 'enfant@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'enfant',
      nom: 'Petit',
      prenom: 'Thomas',
      role: 'ENFANT',
      telephone: '0655667788',
    },
    {
      email: 'etudiant@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'etudiant',
      nom: 'Grand',
      prenom: 'Emma',
      role: 'ETUDIANT',
      telephone: '0666778899',
    },
  ];

  for (const u of utilisateursDeTest) {
    let supabaseAuthId = '';

    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.error('Erreur lors de la vérification de l’existence de l’utilisateur Supabase:', listError.message);
      continue;
    }

    const existingUser = listData.users.find((user) => user.email === u.email);

    if (existingUser) {
      supabaseAuthId = existingUser.id;
    } else {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: u.motDePasse,
        email_confirm: true,
      });

      if (authError) {
        console.error(`Erreur d'inscription Supabase pour ${u.email}:`, authError.message);
        continue;
      }

      supabaseAuthId = authData.user.id;
    }

    await prisma.utilisateur.upsert({
      where: { id: supabaseAuthId },
      update: {
        email: u.email,
        nom: u.nom,
        prenom: u.prenom,
        role: u.role,
        telephone: u.telephone,
      },
      create: {
        id: supabaseAuthId,
        email: u.email,
        nom: u.nom,
        prenom: u.prenom,
        role: u.role,
        telephone: u.telephone,
      },
    });
  }

  const modulesDeTest = [
    {
      id: 1,
      titre: 'Numérique (Adulte)',
      description: 'Découvrez les bases fondamentales de l’informatique, la navigation sur Internet et la gestion sécurisée de vos e-mails pour gagner en autonomie au quotidien.',
      parcours: [Parcours.NUMERIQUE_ADULTE],
      difficulte: Difficulte.FACILE,
      isPublished: true,
    },
    {
      id: 2,
      titre: 'Expression & Compréhension Orale',
      description: 'Améliorez votre aisance à l’oral, enrichissez votre vocabulaire du quotidien et développez votre confiance à travers des mises en situation pratiques et interactives.',
      parcours: [Parcours.ORAL],
      difficulte: Difficulte.MOYEN,
      isPublished: true,
    },
    {
      id: 3,
      titre: 'Numérique (Enfant)',
      description: 'Une initiation ludique aux outils numériques à travers des ateliers créatifs pour comprendre les écrans sans danger.',
      parcours: [Parcours.NUMERIQUE],
      difficulte: Difficulte.FACILE,
      isPublished: true,
    },
    {
      id: 4,
      titre: 'Robotique Ludique',
      description: 'Découvrez la programmation et l’assemblage de petits robots pour développer la logique et l’esprit d’équipe.',
      parcours: [Parcours.ROBOTIQUE],
      difficulte: Difficulte.DIFFICILE,
      isPublished: true,
    },
    {
      id: 5,
      titre: 'Anglais (Junior)',
      description: 'Apprentissage immersif de la langue anglaise par le chant, le jeu et le dialogue adapté aux jeunes.',
      parcours: [Parcours.ANGLAIS],
      difficulte: Difficulte.FACILE,
      isPublished: true,
    },
    {
      id: 6,
      titre: 'Éco-Citoyenneté',
      description: 'Sensibilisation aux enjeux environnementaux et découverte des écogestes au quotidien de façon interactive.',
      parcours: [Parcours.ECO_CITOYENNETE],
      difficulte: Difficulte.FACILE,
      isPublished: true,
    },
    {
      id: 7,
      titre: 'Éducation Civique',
      description: 'Comprendre les institutions, les valeurs républicaines et les bases de la vie en société.',
      parcours: [Parcours.EDUCATION_CIVIQUE],
      difficulte: Difficulte.MOYEN,
      isPublished: true,
    },
    {
      id: 8,
      titre: 'Compréhension Lecture',
      description: 'Ateliers de soutien à la lecture, analyse d’histoires simples et renforcement de l’expression écrite.',
      parcours: [Parcours.COMPREHENSION_LECTURE],
      difficulte: Difficulte.MOYEN,
      isPublished: true,
    },
  ];

  for (const m of modulesDeTest) {
    await prisma.module.upsert({
      where: { id: m.id },
      update: {
        titre: m.titre,
        description: m.description,
        parcours: m.parcours,
        difficulte: m.difficulte,
        isPublished: m.isPublished,
      },
      create: {
        id: m.id,
        titre: m.titre,
        description: m.description,
        parcours: m.parcours,
        difficulte: m.difficulte,
        isPublished: m.isPublished,
      },
    });
  }

  const actualitesDeTest = [
    {
      titre: 'Reprise des ateliers numériques',
      tag: 'Événement',
      datePublication: new Date(),
      extrait: 'Les inscriptions pour les sessions d’accompagnement numérique adultes et enfants sont désormais ouvertes. Places limitées.',
      ctaLabel: 'S’inscrire',
      ctaHref: '/ateliers',
      ordre: 1,
      estPublic: true,
    },
    {
      titre: 'Lancement du module Robotique',
      tag: 'Nouveauté',
      datePublication: new Date(),
      extrait: 'Dès mercredi prochain, découvrez notre tout nouveau parcours pédagogique robotique destiné aux juniors.',
      ctaLabel: 'Voir le parcours',
      ctaHref: '/ateliers',
      ordre: 2,
      estPublic: true,
    },
    {
      titre: 'Assemblée Générale Annuelle',
      tag: 'Vie associative',
      datePublication: new Date(),
      extrait: 'Tous les membres, bénévoles et partenaires sont invités à participer à notre bilan annuel le 15 du mois prochain à 18h.',
      ctaLabel: 'En savoir plus',
      ctaHref: '/contact',
      ordre: 3,
      estPublic: true,
    },
    {
      titre: 'Nouveau partenariat éducatif',
      tag: 'Partenariat',
      datePublication: new Date(),
      extrait: 'L’association continue de structurer ses contenus et ses actions pour proposer des repères clairs, utiles et accessibles à tous.',
      ctaLabel: 'Découvrir',
      ctaHref: '/contact',
      ordre: 4,
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
    console.log('... Fin');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });