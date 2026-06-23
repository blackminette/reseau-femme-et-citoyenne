import { NiveauPedagogique, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

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

  let idIntervenante = '';

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

    await prisma.utilisateur.upsert({
      // Recherche par l'email unique plutôt que par l'id Supabase
      where: { email: user.email },
      update: {
        id: supabaseAuthId, // Met à jour l'id au cas où il aurait changé
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        telephone: user.telephone,
      },
      create: {
        id: supabaseAuthId,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        telephone: user.telephone,
      },
    });

    if (user.role === 'INTERVENANTE') {
      idIntervenante = supabaseAuthId;
    }

    console.log(`👤 Compte [${user.role}] pour ${user.prenom} ${user.nom} synchronisé !`);
  }

  if (!idIntervenante) {
    const userIntervenante = await prisma.utilisateur.findFirst({
      where: { role: 'INTERVENANTE' }
    });
    if (userIntervenante) idIntervenante = userIntervenante.id;
  }

  if (!idIntervenante) {
    console.error("❌ Impossible de continuer le seeding des cours : aucune intervenante trouvée.");
    return;
  }

  console.log('📚 (Seeding) Ajout des modules et des cours...');

  const modulesAChanger = [
    {
      titre: 'Bases du Code (Adultes)',
      description: 'Découvrir les concepts fondamentaux de la programmation algorithmique.',
      public: 'ADULTE' as const,
      cours: [
        {
          titre: 'Introduction aux variables',
          ordreDansModule: 1,
          niveauRequis: NiveauPedagogique.ADULTE,
          contenu: [
            {
              numeroPage: 1,
              titre: "Qu'est-ce qu'une variable ?",
              texteExplicatif: "En programmation, une variable est un espace de stockage nommé qui permet de conserver une donnée en mémoire.\n\nImaginez une boîte avec une étiquette collée dessus : le nom de l'étiquette est le nom de la variable, et ce qu'il y a dans la boîte est sa valeur.",
              imageUrl: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=600"
            },
            {
              numeroPage: 2,
              titre: "Les types de données",
              texteExplicatif: "Une boîte (variable) peut contenir différents types d'objets :\n- Du texte (String) : ex: \"Johanna\"\n- Un nombre entier ou décimal (Number) : ex: 26\n- Un booléen (Boolean) : vrai ou faux (True/False)",
              imageUrl: null
            },
            {
              numeroPage: 3,
              titre: "Exemple de code",
              texteExplicatif: "Voici comment on déclare une variable en JavaScript :\n\nlet prenom = \"Johanna\";\nlet age = 26;\n\nÀ partir de ce moment, l'ordinateur se souvient de ces valeurs tant que le programme tourne.",
              imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600"
            }
          ],
          // Injection des exercices spécifiques à ce cours
          exercices: [
            {
              titre: "Quiz : Les types de variables",
              instructions: "Sélectionnez la bonne réponse pour chaque question sur les types de données.",
              type: "QCM",
              ordre: 1,
              contenu: [
                {
                  id: "q1",
                  question: "Quel type de donnée représente la valeur suivante : 26 ?",
                  options: ["String (Texte)", "Number (Nombre)", "Boolean (Booléen)", "Null"],
                  reponseCorrecte: "Number (Nombre)"
                },
                {
                  id: "q2",
                  question: "Comment écrit-on correctement une valeur de type String (Texte) ?",
                  options: ["let prenom = Johanna;", "let prenom = \"Johanna\";", "let prenom = 26;", "let prenom = true;"],
                  reponseCorrecte: "let prenom = \"Johanna\";"
                }
              ]
            },
            {
              titre: "Logique : Algorithme de préparation",
              instructions: "Remettez les étapes de la manipulation d'une variable dans le bon ordre chronologique.",
              type: "IMAGES_ORDRE",
              ordre: 2,
              contenu: [
                { id: "step_1", label: "Déclarer la variable (créer la boîte vide)", ordreCorrect: 1, imageUrl: "https://images.unsplash.com/photo-1512418490979-92798cec1380?w=300" },
                { id: "step_2", label: "Affecter une valeur initiale (mettre un objet dedans)", ordreCorrect: 2, imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300" },
                { id: "step_3", label: "Lire la valeur pour l'afficher à l'écran (regarder le contenu)", ordreCorrect: 3, imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=300" }
              ]
            },
            {
              titre: "Exercice d'application : Votre première variable",
              instructions: "Répondez par vrai ou faux.",
              type: "VRAI_FAUX",
              ordre: 3,
              contenu: [
                {
                  id: "v1",
                  numeroPage: 1,
                  affirmation: "Une variable est forcément un nombre.",
                  options: ["Vrai", "Faux"],
                  reponseCorrecte: "Faux"
                }
              ]
            }
          ]
        },
        { titre: 'Les conditions et les structures logiques', ordreDansModule: 2, niveauRequis: NiveauPedagogique.ADULTE, contenu: [] },
        { titre: 'Les boucles (While et For)', ordreDansModule: 3, niveauRequis: NiveauPedagogique.ADULTE, contenu: [] }
      ]
    },
    {
      titre: 'Développement Web (Adultes)',
      description: 'Créer ses premières pages web dynamiques et responsives.',
      public: 'ADULTE' as const,
      cours: [
        { titre: 'Structure et sémantique HTML5', ordreDansModule: 1, niveauRequis: NiveauPedagogique.ADULTE, contenu: [] },
        { titre: 'Mise en page moderne avec CSS Grid et Flexbox', ordreDansModule: 2, niveauRequis: NiveauPedagogique.ADULTE, contenu: [] }
      ]
    },
    {
      titre: 'Initiation à Scratch (Enfants)',
      description: 'Apprendre à programmer de manière ludique avec des blocs colorés.',
      public: 'ENFANT' as const,
      cours: [
        { titre: 'Découverte de l\'interface et du lutin', ordreDansModule: 1, niveauRequis: NiveauPedagogique.NIVEAU_1, contenu: [] },
        { titre: 'Faire bouger et animer son premier personnage', ordreDansModule: 2, niveauRequis: NiveauPedagogique.NIVEAU_2, contenu: [] },
        { titre: 'Création d\'un mini-jeu de labyrinthe', ordreDansModule: 3, niveauRequis: NiveauPedagogique.NIVEAU_3, contenu: [] }
      ]
    },
    {
      titre: 'Robotique Ludique (Enfants)',
      description: 'Découvrir la logique des capteurs et des moteurs pas à pas.',
      public: 'ENFANT' as const,
      cours: [
        { titre: 'Qu\'est-ce qu\'un robot ?', ordreDansModule: 1, niveauRequis: NiveauPedagogique.NIVEAU_1, contenu: [] },
        { titre: 'Programmer des déplacements simples', ordreDansModule: 2, niveauRequis: NiveauPedagogique.NIVEAU_2, contenu: [] }
      ]
    }
  ];

  for (const item of modulesAChanger) {
    const moduleCree = await prisma.module.create({
      data: {
        titre: item.titre,
        description: item.description,
        public: item.public
      }
    });

    for (const coursItem of item.cours) {
      // Préparation de la structure de création du cours
      const extraData: any = {};

      // Si le cours contient des exercices décrits ci-dessus, on les ajoute à la transaction de création
      if ('exercices' in coursItem && coursItem.exercices) {
        extraData.exercices = {
          create: coursItem.exercices
        };
      }

      await prisma.cours.create({
        data: {
          titre: coursItem.titre,
          estPublic: true,
          intervenanteId: idIntervenante,
          contenu: coursItem.contenu ? coursItem.contenu : [],
          moduleId: moduleCree.id,
          ordreDansModule: coursItem.ordreDansModule,
          ...extraData // Injecte les exercices de manière transparente
        }
      });
    }
    console.log(`📦 Module [${item.public}] "${item.titre}" créé avec ${item.cours.length} cours associés.`);
  }

  console.log('✅ Seeding terminé avec succès et prêt pour le login local !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });