import { PrismaClient, Parcours } from '@prisma/client'; // Importation de l'Enum Parcours
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- DONNÉES HISTORIQUES DE NAPOLÉON REPRISES À L'IDENTIQUE ---
const NAPOLEON_COURS = [
  {
    titre: 'Découvrir Napoléon',
    ordreDansModule: 1,
    contenu: [
      {
        titre: 'Qui était Napoléon ?',
        texte: "Napoléon Bonaparte est une grande figure de l'histoire de France. Il a d'abord été général, puis il est devenu Premier Consul et ensuite Empereur des Français. Pour l'étudier sérieusement, il faut regarder à la fois ses réussites et ses limites."
      }
    ],
  },
  {
    titre: 'Napoléon et son époque',
    ordreDansModule: 2,
    contenu: [
      {
        titre: 'Une période de changements',
        texte: "Napoléon a vécu pendant une période de grands changements en France. Après la Révolution, il a pris le pouvoir et a dirigé le pays. Son époque a vu des réformes importantes, comme l'organisation de l'administration et du droit."
      }
    ],
  },
  {
    titre: 'Comprendre avec méthode',
    ordreDansModule: 3,
    contenu: [
      {
        titre: 'Analyser un personnage historique',
        texte: "Pour comprendre Napoléon, on doit poser des questions précises : dans quel contexte agit-il, quelles décisions prend-il, qui en profite, qui en souffre et quelles sont les limites de son pouvoir ? L'histoire s'explique avec des faits, pas avec des impressions."
      }
    ],
  },
  {
    titre: 'Les limites à connaître',
    ordreDansModule: 4,
    contenu: [
      {
        titre: 'Regarder aussi les limites',
        texte: "Le Code civil a structuré une partie du droit, mais il donnait moins de droits aux femmes qu'aux hommes. Napoléon a aussi concentré beaucoup de pouvoir et le rétablissement de l'esclavage en 1802 est contraire aux valeurs actuelles de liberté et d'égalité."
      }
    ],
  },
] as const;

const NAPOLEON_EXERCICES = [
  {
    titre: "Remettre les grandes étapes dans l'ordre",
    ordre: 1,
    type: 'IMAGES_ORDRE',
    instructions: "Range les événements de la vie politique de Napoléon du plus ancien au plus récent.",
    contenu: {
      correctOrder: ['Général pendant la Révolution française', 'Premier Consul', 'Empereur des Français', 'Exil après sa chute'],
      initialOrder: ['Empereur des Français', 'Général pendant la Révolution française', 'Exil après sa chute', 'Premier Consul']
    }
  },
  {
    titre: 'Quiz Napoléon',
    ordre: 2,
    type: 'QUIZ',
    instructions: 'Réponds aux questions pour vérifier ce que tu as retenu.',
    contenu: [
      { q: "Comment s'appelle la fonction de Napoléon avant de devenir Empereur ?", options: ['Président', 'Premier Consul', 'Roi de France', 'Ministre'], answer: 1, explication: "Après le coup d'État de 1799, Napoléon devient Premier Consul." },
      { q: "Napoléon a surtout dirigé la France après...", options: ['La Révolution française', 'La Première Guerre mondiale', 'La Seconde Guerre mondiale', 'La guerre froide'], answer: 0, explication: "Napoléon prend le pouvoir dans la période qui suit la Révolution française." },
      { q: "Pourquoi faut-il étudier Napoléon avec rigueur ?", options: ['Pour le transformer en héros parfait', 'Pour oublier son époque', 'Pour comprendre ses réussites et ses limites', 'Parce qu’il n’a rien changé'], answer: 2, explication: "Un personnage historique se comprend en regardant les faits, le contexte et les conséquences." },
      { q: "Quel est un exemple de conséquence liée à son époque ?", options: ['Des guerres très nombreuses en Europe', 'La disparition totale de l’État', 'La fin de toute administration', 'L’arrêt de l’histoire'], answer: 0, explication: "Son règne a été marqué par des guerres à grande échelle en Europe." },
      { q: "Que doit faire un élève quand il étudie l’histoire ?", options: ['Répéter des slogans', 'Chercher des faits et des sources', 'Éviter les dates', 'Inventer des conclusions'], answer: 1, explication: "L'histoire demande des faits, du contexte et des sources fiables." }
    ]
  }
] as const;

// Utilisation explicite du type Parcours pour éviter l'erreur d'assignation de type string
const AUTRES_PARCOURS: Array<{
  parcours: Parcours;
  moduleTitre: string;
  moduleDescription: string;
  coursTitre: string;
  coursContenu: Array<{ titre: string; texte: string }>;
}> = [
    {
      parcours: Parcours.COMPREHENSION_LECTURE,
      moduleTitre: 'Soutien en Lecture et Compréhension',
      moduleDescription: 'Renforcer les bases fondamentales de la lecture et assimiler le sens des textes complexes.',
      coursTitre: 'Les structures narratives de base',
      coursContenu: [
        {
          titre: 'Identifier le schéma narratif',
          texte: "Un récit se construit souvent selon des étapes bien précises : la situation initiale, l'élément déclencheur, les péripéties, le dénouement et la situation finale."
        }
      ]
    },
    {
      parcours: Parcours.NUMERIQUE,
      moduleTitre: 'Initiation à l’Informatique',
      moduleDescription: 'Découvrir le fonctionnement du numérique, du code et d’internet en toute sécurité.',
      coursTitre: 'Découvrir le fonctionnement d’Internet',
      coursContenu: [
        {
          titre: 'Le réseau mondial',
          texte: "Internet est un gigantesque réseau d'ordinateurs connectés entre eux à travers le monde pour s'échanger des données."
        }
      ]
    }
  ];

async function nettoyerToutLeCatalogue() {
  console.log('🧹 Nettoyage complet des tables de cours (Modules, Cours, Exercices)...');
  await prisma.scoreQuiz.deleteMany({});
  await prisma.programme.deleteMany({});
  await prisma.exercice.deleteMany({});
  await prisma.cours.deleteMany({});
  await prisma.module.deleteMany({});
}

async function resetSerialSequence(tableName: string) {
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"${tableName}"', 'id'), COALESCE((SELECT MAX(id) FROM "${tableName}"), 0) + 1, false);`
  );
}

async function resetSequences() {
  await resetSerialSequence('Module');
  await resetSerialSequence('Cours');
  await resetSerialSequence('Exercice');
  await resetSerialSequence('Programme');
  await resetSerialSequence('ScoreQuiz');
}

async function seedCatalogueComplet(intervenantUserId: string) {
  await nettoyerToutLeCatalogue();
  await resetSequences();

  // 1. GENERATION DU PARCOURS EDUCATION CIVIQUE AVEC LES DONNÉES NAPOLÉON ORIGINALES
  const napoleonModule = await prisma.module.create({
    data: {
      titre: 'Napoléon',
      description: "Comprendre un personnage clé de l'histoire française",
      parcours: [Parcours.EDUCATION_CIVIQUE], // Utilisation de l'Enum Strict
      difficulte: 'MOYEN',
      public: 'ENFANT',
      isPublished: true
    }
  });

  const coursCrees: Array<{ id: number; titre: string }> = [];

  for (const cours of NAPOLEON_COURS) {
    const createdCours = await prisma.cours.create({
      data: {
        titre: cours.titre,
        intervenanteId: intervenantUserId,
        contenu: cours.contenu as unknown as object,
        moduleId: napoleonModule.id,
        ordreDansModule: cours.ordreDansModule,
      }
    });
    coursCrees.push({ id: createdCours.id, titre: createdCours.titre });
  }

  for (const exercice of NAPOLEON_EXERCICES) {
    const targetCours = exercice.ordre === 1 ? coursCrees[2] : coursCrees[3];
    await prisma.exercice.create({
      data: {
        titre: exercice.titre,
        instructions: exercice.instructions,
        type: exercice.type,
        contenu: exercice.contenu as unknown as object,
        ordre: exercice.ordre,
        coursId: targetCours.id
      }
    });
  }
  console.log(`🧩 Parcours [EDUCATION_CIVIQUE] : Module "${napoleonModule.titre}" seedé avec ${NAPOLEON_COURS.length} cours et ${NAPOLEON_EXERCICES.length} exercices.`);

  // 2. GENERATION DES AUTRES PARCOURS DYNAMIQUES
  for (const item of AUTRES_PARCOURS) {
    const moduleCree = await prisma.module.create({
      data: {
        titre: item.moduleTitre,
        description: item.moduleDescription,
        parcours: [item.parcours],
        difficulte: 'MOYEN',
        public: 'ENFANT',
        isPublished: true
      }
    });

    await prisma.cours.create({
      data: {
        titre: item.coursTitre,
        intervenanteId: intervenantUserId,
        moduleId: moduleCree.id,
        ordreDansModule: 1,
        contenu: item.coursContenu as unknown as object,
      }
    });

    console.log(`🧩 Parcours [${item.parcours}] : Module "${item.moduleTitre}" créé.`);
  }
}

async function purgerUtilisateursExistants() {
  console.log('🧹 Purge des utilisateurs existants (Supabase Auth & Prisma)...');
  const utilisateursBase = await prisma.utilisateur.findMany({ select: { id: true, email: true } });

  for (const user of utilisateursBase) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (!error) console.log(`🗑️ Compte Supabase Auth supprimé : ${user.email}`);
  }

  await prisma.utilisateur.deleteMany({});
  console.log('✅ Base de données locale nettoyée de tous les utilisateurs.');
}

async function main() {
  console.log('🌱 (Seeding) Début de la synchronisation Supabase + Prisma...');

  await purgerUtilisateursExistants();

  const utilisateursDeTest = [
    { email: 'admin@rfc06.fr', motDePasse: 'PassAsso123!', username: 'admin', nom: 'IPSSI', prenom: 'Johanna', role: 'ADMIN', telephone: '0601020304' },
    { email: 'membre@rfc06.fr', motDePasse: 'PassAsso123!', username: 'membre', nom: 'Martin', prenom: 'Lucas', role: 'MEMBRE', telephone: '0602030405' },
    { email: 'partenaire@rfc06.fr', motDePasse: 'PassAsso123!', username: 'partenaire', nom: 'Dubois', prenom: 'Thomas', role: 'PARTENAIRE', telephone: '0603040506' },
    { email: 'intervenant@rfc06.fr', motDePasse: 'PassAsso123!', username: 'intervenant', nom: 'Robert', prenom: 'Sarah', role: 'INTERVENANT', telephone: '0604050607' },
    { email: 'enfant@rfc06.fr', motDePasse: 'PassAsso123!', username: 'enfant', nom: 'Petit', prenom: 'Chloé', role: 'ENFANT', telephone: null },
    { email: 'benevole@rfc06.fr', motDePasse: 'PassAsso123!', username: 'benevole', nom: 'Lemoine', prenom: 'Antoine', role: 'BENEVOLE', telephone: '0605060708' },
    { email: 'etudiant@rfc06.fr', motDePasse: 'PassAsso123!', username: 'etudiant', nom: 'Durand', prenom: 'Marie', role: 'ETUDIANT', telephone: '0606070809' }
  ];

  console.log('📅 Ajout des ateliers spécifiques (29 juin - 4 juillet)...');
  await prisma.atelier.deleteMany({});
  await prisma.lieu.deleteMany({});

  const lieu = await prisma.lieu.create({
    data: { nom: "Centre Communautaire", adresseTexte: "12 rue de la Paix, 06000 Nice" }
  });

  const ateliersSpecifiques = [
    { titre: "Atelier Bricolage", dateDebut: new Date('2026-06-29T10:00:00'), dateFin: new Date('2026-06-29T12:00:00'), placesMax: 10 },
    { titre: "Cours de Dessin", dateDebut: new Date('2026-07-01T14:00:00'), dateFin: new Date('2026-07-01T16:00:00'), placesMax: 8 },
    { titre: "Éveil Musical", dateDebut: new Date('2026-07-03T10:00:00'), dateFin: new Date('2026-07-03T12:00:00'), placesMax: 12 },
    { titre: "Atelier Poterie", dateDebut: new Date('2026-07-04T14:00:00'), dateFin: new Date('2026-07-04T16:00:00'), placesMax: 15 }
  ];

  for (const atelier of ateliersSpecifiques) {
    await prisma.atelier.create({ data: { ...atelier, description: "Atelier spécial été !", lieuId: lieu.id } });
  }

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
        if (!userExistant) continue;
        supabaseAuthId = userExistant.id;
      } else {
        continue;
      }
    } else {
      supabaseAuthId = authData.user.id;
    }

    await prisma.utilisateur.upsert({
      where: { id: supabaseAuthId },
      update: {},
      create: {
        id: supabaseAuthId,
        email: user.email,
        username: user.username,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        telephone: user.telephone,
      },
    });
    console.log(`👤 Compte [${user.role}] pour ${user.prenom} ${user.nom} synchronisé !`);
  }

  const responsableCours = await prisma.utilisateur.findFirst({
    where: { role: 'INTERVENANT' },
    orderBy: { createdAt: 'asc' }
  });

  if (!responsableCours) {
    throw new Error("Impossible de seed les modules : aucun compte avec le rôle INTERVENANT trouvé.");
  }

  await seedCatalogueComplet(responsableCours.id);

  console.log('✅ Seeding global terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });