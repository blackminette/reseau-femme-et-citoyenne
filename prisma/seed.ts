import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charge d'abord .env puis .env.local s'il existe afin de couvrir les deux
// conventions de configuration utilisées dans le dépôt.
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

// Configure le pool de connexion PostgreSQL natif
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Initialise Prisma avec l'adaptateur
const prisma = new PrismaClient({ adapter });

// Initialisation du client Supabase avec la clé d'administration (Service Role Key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const NAPOLEON_TITLES = ['Napoléon', 'Napoleon', 'Éducation Civique', 'Education Civique'];
const NAPOLEON_MODULE_DESCRIPTION = "Comprendre un personnage clé de l'histoire française";

const NAPOLEON_COURS = [
  {
    titre: 'Découvrir Napoléon',
    ordreDansModule: 1,
    contenu: [
      {
        numeroPage: 1,
        titre: 'Qui était Napoléon ?',
        texteExplicatif: "Napoléon Bonaparte est une grande figure de l'histoire de France. Il a d'abord été général, puis il est devenu Premier Consul et ensuite Empereur des Français. Pour l'étudier sérieusement, il faut regarder à la fois ses réussites et ses limites.",
        imageUrl: '/images/enfants/napoleon/napoleon_lecon_1_qui_etait_napoleon.png',
        texte: "Napoléon Bonaparte est une grande figure de l'histoire de France. Il a d'abord été général, puis il est devenu Premier Consul et ensuite Empereur des Français. Pour l'étudier sérieusement, il faut regarder à la fois ses réussites et ses limites."
      }
    ],
  },
  {
    titre: 'Napoléon et son époque',
    ordreDansModule: 2,
    contenu: [
      {
        numeroPage: 2,
        titre: 'Une période de changements',
        texteExplicatif: "Napoléon a vécu pendant une période de grands changements en France. Après la Révolution, il a pris le pouvoir et a dirigé le pays. Son époque a vu des réformes importantes, comme l'organisation de l'administration et du droit.",
        imageUrl: '/images/enfants/napoleon/napoleon_lecon_2_napoleon_et_son_epoque.png',
        texte: "Napoléon a vécu pendant une période de grands changements en France. Après la Révolution, il a pris le pouvoir et a dirigé le pays. Son époque a vu des réformes importantes, comme l'organisation de l'administration et du droit."
      }
    ],
  },
  {
    titre: 'Comprendre avec méthode',
    ordreDansModule: 3,
    contenu: [
      {
        numeroPage: 3,
        titre: 'Analyser un personnage historique',
        texteExplicatif: "Pour comprendre Napoléon, on doit poser des questions précises : dans quel contexte agit-il, quelles décisions prend-il, qui en profite, qui en souffre et quelles sont les limites de son pouvoir ? L'histoire s'explique avec des faits, pas avec des impressions.",
        imageUrl: '/images/enfants/napoleon/napoleon_lecon_3_comprendre_avec_methode.png',
        texte: "Pour comprendre Napoléon, on doit poser des questions précises : dans quel contexte agit-il, quelles décisions prend-il, qui en profite, qui en souffre et quelles sont les limites de son pouvoir ? L'histoire s'explique avec des faits, pas avec des impressions."
      }
    ],
  },
  {
    titre: 'Les limites à connaître',
    ordreDansModule: 4,
    contenu: [
      {
        numeroPage: 4,
        titre: 'Regarder aussi les limites',
        texteExplicatif: "Le Code civil a structuré une partie du droit, mais il donnait moins de droits aux femmes qu'aux hommes. Napoléon a aussi concentré beaucoup de pouvoir et le rétablissement de l'esclavage en 1802 est contraire aux valeurs actuelles de liberté et d'égalité.",
        imageUrl: '/images/enfants/napoleon/napoleon_lecon_4_les_limites_a_connaitre.png',
        texte: "Le Code civil a structuré une partie du droit, mais il donnait moins de droits aux femmes qu'aux hommes. Napoléon a aussi concentré beaucoup de pouvoir et le rétablissement de l'esclavage en 1802 est contraire aux valeurs actuelles de liberté et d'égalité."
      }
    ],
  },
] as const;

const NAPOLEON_EXERCICES = [
  {
    id: 'exercice-ordre-napoleon',
    numeroPage: 1,
    titre: "Remettre les grandes étapes dans l'ordre",
    ordre: 1,
    type: 'IMAGES_ORDRE',
    instructions: "Range les événements de la vie politique de Napoléon du plus ancien au plus récent.",
    contenu: {
      correctOrder: [
        'Général pendant la Révolution française',
        'Premier Consul',
        'Empereur des Français',
        'Exil après sa chute'
      ],
      initialOrder: [
        'Empereur des Français',
        'Général pendant la Révolution française',
        'Exil après sa chute',
        'Premier Consul'
      ]
    }
  },
  {
    id: 'quiz-napoleon',
    numeroPage: 2,
    titre: 'Quiz Napoléon',
    ordre: 2,
    type: 'QUIZ',
    instructions: 'Réponds aux questions pour vérifier ce que tu as retenu.',
    contenu: [
      {
        id: 'q1',
        numeroPage: 1,
        question: "Comment s'appelle la fonction de Napoléon avant de devenir Empereur ?",
        q: "Comment s'appelle la fonction de Napoléon avant de devenir Empereur ?",
        options: ['Président', 'Premier Consul', 'Roi de France', 'Ministre'],
        reponseCorrecte: 'Premier Consul',
        answer: 1,
        explication: "Après le coup d'État de 1799, Napoléon devient Premier Consul."
      },
      {
        id: 'q2',
        numeroPage: 2,
        question: "Napoléon a surtout dirigé la France après...",
        q: "Napoléon a surtout dirigé la France après...",
        options: ['La Révolution française', 'La Première Guerre mondiale', 'La Seconde Guerre mondiale', 'La guerre froide'],
        reponseCorrecte: 'La Révolution française',
        answer: 0,
        explication: "Napoléon prend le pouvoir dans la période qui suit la Révolution française."
      },
      {
        id: 'q3',
        numeroPage: 3,
        question: "Pourquoi faut-il étudier Napoléon avec rigueur ?",
        q: "Pourquoi faut-il étudier Napoléon avec rigueur ?",
        options: ['Pour le transformer en héros parfait', 'Pour oublier son époque', 'Pour comprendre ses réussites et ses limites', 'Parce qu’il n’a rien changé'],
        reponseCorrecte: 'Pour comprendre ses réussites et ses limites',
        answer: 2,
        explication: "Un personnage historique se comprend en regardant les faits, le contexte et les conséquences."
      },
      {
        id: 'q4',
        numeroPage: 4,
        question: "Quel est un exemple de conséquence liée à son époque ?",
        q: "Quel est un exemple de conséquence liée à son époque ?",
        options: ['Des guerres très nombreuses en Europe', 'La disparition totale de l’État', 'La fin de toute administration', 'L’arrêt de l’histoire'],
        reponseCorrecte: 'Des guerres très nombreuses en Europe',
        answer: 0,
        explication: "Son règne a été marqué par des guerres à grande échelle en Europe."
      },
      {
        id: 'q5',
        numeroPage: 5,
        question: "Que doit faire un élève quand il étudie l’histoire ?",
        q: "Que doit faire un élève quand il étudie l’histoire ?",
        options: ['Répéter des slogans', 'Chercher des faits et des sources', 'Éviter les dates', 'Inventer des conclusions'],
        reponseCorrecte: 'Chercher des faits et des sources',
        answer: 1,
        explication: "L'histoire demande des faits, du contexte et des sources fiables."
      }
    ]
  }
] as const;

async function nettoyerNapoleonSeed() {
  const allChildModules = await prisma.module.findMany({
    where: {
      public: 'ENFANT'
    },
    include: {
      cours: {
        include: {
          exercices: true
        }
      }
    }
  });

  const existingModules = allChildModules.filter((module) =>
    NAPOLEON_TITLES.includes(module.titre) || module.parcours.includes('EDUCATION_CIVIQUE')
  );

  if (existingModules.length === 0) {
    return null;
  }

  const targetModule = existingModules[0];
  const exerciceIds = existingModules.flatMap((mod) =>
    mod.cours.flatMap((cours) => cours.exercices.map((exercice) => exercice.id))
  );
  const coursIds = existingModules.flatMap((mod) => mod.cours.map((cours) => cours.id));

  if (exerciceIds.length > 0) {
    await prisma.scoreQuiz.deleteMany({
      where: {
        exerciceId: { in: exerciceIds }
      }
    });
  }

  if (coursIds.length > 0) {
    await prisma.programme.deleteMany({
      where: {
        coursId: { in: coursIds }
      }
    });
    await prisma.cours.deleteMany({
      where: {
        id: { in: coursIds }
      }
    });
  }

  const extraModuleIds = existingModules.slice(1).map((mod) => mod.id);
  if (extraModuleIds.length > 0) {
    await prisma.module.deleteMany({
      where: {
        id: { in: extraModuleIds }
      }
    });
  }

  return targetModule.id;
}

async function resetSerialSequence(tableName: string) {
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"${tableName}"', 'id'), COALESCE((SELECT MAX(id) FROM "${tableName}"), 0) + 1, false);`
  );
}

async function resetNapoleonSequences() {
  await resetSerialSequence('Module');
  await resetSerialSequence('Cours');
  await resetSerialSequence('Exercice');
  await resetSerialSequence('Programme');
  await resetSerialSequence('ScoreQuiz');
}

async function seedNapoleonModule(intervenanteId: string) {
  const targetModuleId = await nettoyerNapoleonSeed();
  await resetNapoleonSequences();
  const napoleonModule = targetModuleId
    ? await prisma.module.update({
      where: { id: targetModuleId },
      data: {
        titre: 'Napoléon',
        description: NAPOLEON_MODULE_DESCRIPTION,
        parcours: ['EDUCATION_CIVIQUE'],
        difficulte: 'MOYEN',
        public: 'ENFANT',
        isPublished: true
      }
    })
    : await prisma.module.create({
      data: {
        titre: 'Napoléon',
        description: NAPOLEON_MODULE_DESCRIPTION,
        parcours: ['EDUCATION_CIVIQUE'],
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
        intervenanteId,
        contenu: cours.contenu as unknown as object,
        moduleId: napoleonModule.id,
        ordreDansModule: cours.ordreDansModule,
      }
    });

    coursCrees.push({
      id: createdCours.id,
      titre: createdCours.titre
    });
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

  console.log(`🧩 Module [Napoléon] seedé avec ${NAPOLEON_COURS.length} cours et ${NAPOLEON_EXERCICES.length} exercices.`);
}

async function main() {
  console.log('🌱 (Seeding) Début de la synchronisation Supabase + Prisma...');

  // 1. Liste de tous les comptes de test (un par rôle) avec mot de passe générique
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
      nom: 'Martin',
      prenom: 'Lucas',
      role: 'MEMBRE',
      telephone: '0602030405',
    },
    {
      email: 'partenaire@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'partenaire',
      nom: 'Dubois',
      prenom: 'Thomas',
      role: 'PARTENAIRE',
      telephone: '0603040506',
    },
    {
      email: 'intervenante@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'intervenante',
      nom: 'Robert',
      prenom: 'Sarah',
      role: 'INTERVENANTE',
      telephone: '0604050607',
    },
    {
      email: 'enfant@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'enfant',
      nom: 'Petit',
      prenom: 'Chloé',
      role: 'ENFANT',
      telephone: null,
    },
    {
      email: 'benevole@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'benevole',
      nom: 'Lemoine',
      prenom: 'Antoine',
      role: 'BENEVOLE',
      telephone: '0605060708',
    }
  ];

// --- AJOUT D'ATELIERS DU 29 JUIN AU 4 JUILLET 2026 ---
  console.log('📅 Ajout des ateliers spécifiques (29 juin - 4 juillet)...');

  // Nettoyage préalable pour éviter les doublons ou erreurs de clé
  await prisma.atelier.deleteMany({});
  await prisma.lieu.deleteMany({});

  const lieu = await prisma.lieu.create({
    data: {
      nom: "Centre Communautaire",
      adresseTexte: "12 rue de la Paix, 06000 Nice"
    }
  });

  const ateliersSpecifiques = [
    { 
      titre: "Atelier Bricolage", 
      dateDebut: new Date('2026-06-29T10:00:00'), 
      dateFin: new Date('2026-06-29T12:00:00'),
      placesMax: 10
    },
    { 
      titre: "Cours de Dessin", 
      dateDebut: new Date('2026-07-01T14:00:00'), 
      dateFin: new Date('2026-07-01T16:00:00'),
      placesMax: 8
    },
    { 
      titre: "Éveil Musical", 
      dateDebut: new Date('2026-07-03T10:00:00'), 
      dateFin: new Date('2026-07-03T12:00:00'),
      placesMax: 12
    },
    { 
      titre: "Atelier Poterie", 
      dateDebut: new Date('2026-07-04T14:00:00'), 
      dateFin: new Date('2026-07-04T16:00:00'),
      placesMax: 1
    }
  ];

  for (const atelier of ateliersSpecifiques) {
    await prisma.atelier.create({
      data: {
        ...atelier,
        description: "Atelier spécial été !",
        lieuId: lieu.id
      }
    });
  }

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
        const usersExistants = (listData?.users ?? []) as Array<{ id: string; email: string | null }>;
        const userExistant = usersExistants.find((u) => u.email === user.email);
        
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

    console.log(`👤 Compte [${user.role}] pour ${user.prenom} ${user.nom} synchronisé ! (Mdp: ${user.motDePasse})`);
  }

  const intervenante = await prisma.utilisateur.findFirst({
    where: {
      role: { in: ['INTERVENANTE', 'INTERVENANT'] }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  if (!intervenante) {
    throw new Error("Impossible de seed Napoléon : aucun compte intervenante n'a été trouvé.");
  }

  await seedNapoleonModule(intervenante.id);

  console.log('✅ Seeding terminé avec succès et prêt pour le login local !');
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
