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

const NAPOLEON_TITLES = ['Napoléon', 'Napoleon'];
const NAPOLEON_MODULE_DESCRIPTION = "Comprendre un personnage clé de l'histoire française";

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
    titre: 'Quiz Napoléon',
    ordre: 2,
    type: 'QUIZ',
    instructions: 'Réponds aux questions pour vérifier ce que tu as retenu.',
    contenu: [
      {
        q: "Comment s'appelle la fonction de Napoléon avant de devenir Empereur ?",
        options: ['Président', 'Premier Consul', 'Roi de France', 'Ministre'],
        answer: 1,
        explication: "Après le coup d'État de 1799, Napoléon devient Premier Consul."
      },
      {
        q: "Napoléon a surtout dirigé la France après...",
        options: ['La Révolution française', 'La Première Guerre mondiale', 'La Seconde Guerre mondiale', 'La guerre froide'],
        answer: 0,
        explication: "Napoléon prend le pouvoir dans la période qui suit la Révolution française."
      },
      {
        q: "Pourquoi faut-il étudier Napoléon avec rigueur ?",
        options: ['Pour le transformer en héros parfait', 'Pour oublier son époque', 'Pour comprendre ses réussites et ses limites', 'Parce qu’il n’a rien changé'],
        answer: 2,
        explication: "Un personnage historique se comprend en regardant les faits, le contexte et les conséquences."
      },
      {
        q: "Quel est un exemple de conséquence liée à son époque ?",
        options: ['Des guerres très nombreuses en Europe', 'La disparition totale de l’État', 'La fin de toute administration', 'L’arrêt de l’histoire'],
        answer: 0,
        explication: "Son règne a été marqué par des guerres à grande échelle en Europe."
      },
      {
        q: "Que doit faire un élève quand il étudie l’histoire ?",
        options: ['Répéter des slogans', 'Chercher des faits et des sources', 'Éviter les dates', 'Inventer des conclusions'],
        answer: 1,
        explication: "L'histoire demande des faits, du contexte et des sources fiables."
      }
    ]
  }
] as const;

async function nettoyerNapoleonSeed() {
  const existingModules = await prisma.module.findMany({
    where: {
      titre: { in: NAPOLEON_TITLES },
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

  if (existingModules.length === 0) {
    return;
  }

  const exerciceIds = existingModules.flatMap((mod) =>
    mod.cours.flatMap((cours) => cours.exercices.map((exercice) => exercice.id))
  );

  if (exerciceIds.length > 0) {
    await prisma.scoreQuiz.deleteMany({
      where: {
        exerciceId: { in: exerciceIds }
      }
    });
  }

  await prisma.module.deleteMany({
    where: {
      id: { in: existingModules.map((mod) => mod.id) }
    }
  });
}

async function seedNapoleonModule(intervenanteId: string) {
  await nettoyerNapoleonSeed();

  const napoleonModule = await prisma.module.create({
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

    // B. Exécution de l'upsert Prisma indexé sur cet UUID
    await prisma.utilisateur.upsert({
      where: { id: supabaseAuthId }, // Utilise l'ID authentifié comme clé primaire
      update: {}, 
      create: {
        id: supabaseAuthId, // On force Prisma à s'aligner sur l'UUID de Supabase
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
    // Ferme proprement le pool à la fin
    await pool.end();
  });
