import { NiveauPedagogique, PrismaClient, Parcours } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
if (!process.env.DATABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  dotenv.config({ path: '.env' });
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Initialisation du client Supabase avec la clé d'administration (Service Role Key) de manière conditionnelle
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

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

    if (supabaseAdmin) {
      // A. Création/Vérification du compte dans Supabase Auth (Sans envoi d'email)
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.motDePasse,
        email_confirm: true // Valide le compte d'office pour éviter le blocage au login
      });

      if (authError) {
        // Si l'utilisateur existe déjà sur Supabase Auth, on récupère simplement son UUID existant
        if (authError.message.includes('already exists') || authError.message.includes('email_exists')) {
          const { data: listData } = await supabaseAdmin.auth.admin.listUsers() as any;
          const userExistant = (listData?.users || []).find((u: any) => u.email === user.email);
          
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
    } else {
      // UUID mocké indexé sur le rôle
      supabaseAuthId = `mock-uuid-${user.role.toLowerCase()}`;
    }

    // B. Exécution de l'upsert Prisma indexé sur l'email ou sur l'id
    const userExistant = await prisma.utilisateur.findUnique({
      where: { email: user.email }
    });

    if (userExistant) {
      await prisma.utilisateur.update({
        where: { id: userExistant.id },
        data: {
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
          telephone: user.telephone,
        }
      });
      supabaseAuthId = userExistant.id;
    } else {
      await prisma.utilisateur.create({
        data: {
          id: supabaseAuthId,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
          telephone: user.telephone,
        }
      });
    }

    if (user.role === 'INTERVENANTE') {
      idIntervenante = supabaseAuthId;
    }

    console.log(`👤 Compte [${user.role}] pour ${user.prenom} ${user.nom} synchronisé dans Prisma !`);
  }

  // 3. Seeding des Modules Pédagogiques pour l'Espace Enfant
  console.log('🌱 Seeding des modules, cours et exercices pour enfants...');
  
  // Récupérer l'ID de l'intervenante pour l'associer aux cours
  const intervenante = await prisma.utilisateur.findFirst({
    where: { role: 'INTERVENANTE' }
  });
  
  if (!intervenante) {
    throw new Error("❌ Impossible de trouver l'intervenante de test pour le seeding des cours");
  }
  
  const intervenanteId = intervenante.id;

  // Définir les modules à insérer
  const modulesEnfant = [
    {
      slug: 'lecture',
      titre: 'Lecture & compréhension',
      description: 'Apprends à lire, à comprendre des histoires et joue avec les mots !',
      cours: [
        {
          titre: "L'alphabet et ses mystères",
          ordreDansModule: 1,
          contenu: [
            { titre: "Les voyelles joyeuses", texte: "Les lettres A, E, I, O, U, Y sont les voyelles ! Elles donnent de la voix aux mots. Par exemple : A comme 'Abeille' et O comme 'Ours'.", imagePlaceholder: "🐝 🐻", bgColor: "bg-emerald-50" },
            { titre: "Les consonnes compagnes", texte: "Toutes les autres lettres sont des consonnes. Elles s'associent aux voyelles pour former des sons. B et A font 'BA' !", imagePlaceholder: "📚 ✏️", bgColor: "bg-teal-50" },
            { titre: "La chanson de l'alphabet", texte: "Répète après nous : A, B, C, D, E, F, G... Tu connais maintenant le secret des mots !", imagePlaceholder: "🎵 ✨", bgColor: "bg-violet-50" }
          ],
          exercices: [
            {
              titre: "L'alphabet et ses mystères",
              type: "LECON",
              instructions: "Lis attentivement la leçon !"
            }
          ]
        },
        {
          titre: "Quiz — Les sons complexes",
          ordreDansModule: 2,
          contenu: [],
          exercices: [
            {
              titre: "Quiz — Les sons complexes",
              type: "QUIZ",
              instructions: JSON.stringify([
                { q: "Quel mot contient le son 'OU' ?", options: ["Chocolat", "Poule", "Chapeau"], answer: 1, explication: "P-ou-le s'écrit avec 'OU', comme dans le mot rouge !" },
                { q: "Quel mot contient le son 'CH' ?", options: ["Chien", "Maison", "Jardin"], answer: 0, explication: "Ch-ien commence par le son 'CH' !" },
                { q: "Quel mot s'écrit avec la voyelle 'A' ?", options: ["Stylo", "Maman", "Fleur"], answer: 1, explication: "M-a-m-a-n contient deux fois la voyelle 'A' !" }
              ])
            }
          ]
        }
      ]
    },
    {
      slug: 'numerique',
      titre: 'Numérique',
      description: 'Découvre l\'ordinateur, le clavier, la souris et comment naviguer en sécurité.',
      cours: [
        {
          titre: "Leçon : Souris et clavier n'ont plus de secret",
          ordreDansModule: 1,
          contenu: [
            { titre: "Découvrir la souris", texte: "La souris te permet de diriger le pointeur à l'écran. Fais un 'Clic gauche' pour choisir un élément, et un double-clic pour ouvrir un jeu !", imagePlaceholder: "🖱️ 🎯", bgColor: "bg-blue-50" },
            { titre: "Apprivoiser le clavier", texte: "Le clavier sert à écrire des lettres et des chiffres. Utilise la touche 'Espace' pour faire des trous entre les mots, et 'Entrée' pour aller à la ligne.", imagePlaceholder: "⌨️ ✍️", bgColor: "bg-indigo-50" },
            { titre: "Attention à ton écran !", texte: "Il est important de garder tes yeux à bonne distance de l'écran et de faire des pauses régulières pour jouer dehors !", imagePlaceholder: "🌳 🏃‍♂️", bgColor: "bg-sky-50" }
          ],
          exercices: [
            {
              titre: "Leçon : Souris et clavier n'ont plus de secret",
              type: "LECON",
              instructions: "Lis la leçon pour découvrir la souris et le clavier !"
            }
          ]
        },
        {
          titre: "Quiz : Les bons réflexes sur Internet",
          ordreDansModule: 2,
          contenu: [],
          exercices: [
            {
              titre: "Quiz : Les bons réflexes sur Internet",
              type: "QUIZ",
              instructions: JSON.stringify([
                { q: "Que faire si un inconnu te parle sur Internet ?", options: ["Lui répondre gentiment", "Ignorer et le dire tout de suite à mes parents", "Lui donner mon nom complet"], answer: 1, explication: "Il ne faut jamais parler aux inconnus en ligne et toujours prévenir un adulte !" },
                { q: "Ton mot de passe doit être...", options: ["Facile à deviner (ex: 12345)", "Secret pour tout le monde sauf mes parents", "Partagé avec mes meilleurs copains"], answer: 1, explication: "Un bon mot de passe doit rester secret pour protéger tes données !" },
                { q: "Quelle règle est la meilleure pour les écrans ?", options: ["Y passer toute la soirée", "Faire des pauses et jouer dehors", "Ne jamais s'arrêter avant d'avoir fini"], answer: 1, explication: "Passer du temps dehors et faire des pauses est essentiel pour ta santé !" }
              ])
            }
          ]
        }
      ]
    },
    {
      slug: 'robotique',
      titre: 'Robotique',
      description: 'Construis et programme tes premiers petits robots.',
      cours: [
        {
          titre: "Leçon : Qu'est-ce qu'un robot ?",
          ordreDansModule: 1,
          contenu: [
            { titre: "C'est quoi un robot ?", texte: "Un robot est une machine intelligente qui peut faire des tâches toute seule. Il obéit aux instructions (le code) données par les humains !", imagePlaceholder: "🤖 🧠", bgColor: "bg-purple-50" },
            { titre: "Les capteurs : les yeux du robot", texte: "Pour ne pas foncer dans les murs, le robot utilise des capteurs de distance ou de lumière. C'est comme ses yeux !", imagePlaceholder: "👀 📡", bgColor: "bg-pink-50" },
            { titre: "Les moteurs : les jambes du robot", texte: "Pour bouger ses roues ou ses bras mécaniques, le robot utilise des petits moteurs électriques très précis.", imagePlaceholder: "⚙️ ⚡", bgColor: "bg-violet-50" }
          ],
          exercices: [
            {
              titre: "Leçon : Qu'est-ce qu'un robot ?",
              type: "LECON",
              instructions: "Lis la leçon pour comprendre le fonctionnement d'un robot !"
            }
          ]
        },
        {
          titre: "Quiz : Les capteurs du robot",
          ordreDansModule: 2,
          contenu: [],
          exercices: [
            {
              titre: "Quiz : Les capteurs du robot",
              type: "QUIZ",
              instructions: JSON.stringify([
                { q: "Pour faire avancer un robot vers l'avant, quelle flèche utiliser ?", options: ["La flèche Gauche", "La flèche Haut", "La flèche Droite"], answer: 1, explication: "La flèche du haut dirige le robot vers l'avant !" },
                { q: "À quoi sert un capteur de distance sur un robot ?", options: ["À chanter des chansons", "À détecter les obstacles pour les éviter", "À faire clignoter ses lumières"], answer: 1, explication: "Le capteur mesure la distance pour éviter les collisions !" },
                { q: "Qui donne l'intelligence et le programme au robot ?", options: ["Le robot lui-même", "Le programmeur humain", "Une prise électrique"], answer: 1, explication: "C'est l'humain qui écrit le code pour programmer le robot !" }
              ])
            }
          ]
        }
      ]
    },
    {
      slug: 'anglais',
      titre: 'Anglais',
      description: 'Apprends tes premiers mots d\'anglais en t\'amusant.',
      cours: [
        {
          titre: "Quiz : Les couleurs en anglais",
          ordreDansModule: 1,
          contenu: [],
          exercices: [
            {
              titre: "Quiz : Les couleurs en anglais",
              type: "QUIZ",
              instructions: JSON.stringify([
                { q: "Quelle est la couleur du soleil en anglais ?", options: ["Red", "Blue", "Yellow"], answer: 2, explication: "Le soleil est jaune, ce qui se dit 'Yellow' en anglais !" },
                { q: "Comment dit-on 'Vert' en anglais ?", options: ["Green", "Black", "Pink"], answer: 0, explication: "Vert se dit 'Green' !" },
                { q: "Quelle couleur donne le mélange du 'Red' et du 'Blue' ?", options: ["Orange", "Purple", "White"], answer: 1, explication: "Rouge + Bleu donne du violet, qui se dit 'Purple' !" }
              ])
            }
          ]
        },
        {
          titre: "Leçon : Les mots magiques",
          ordreDansModule: 2,
          contenu: [
            { titre: "Hello & Goodbye", texte: "Pour dire bonjour, dis 'Hello' ! Et pour dire au revoir, dis 'Goodbye' !", imagePlaceholder: "👋 🇬🇧", bgColor: "bg-pink-50" },
            { titre: "Please & Thank you", texte: "S'il te plaît se dit 'Please', et merci se dit 'Thank you'. Ce sont les mots magiques de la politesse !", imagePlaceholder: "✨ 🤝", bgColor: "bg-indigo-50" }
          ],
          exercices: [
            {
              titre: "Leçon : Les mots magiques",
              type: "LECON",
              instructions: "Découvre les formules de politesse en anglais !"
            }
          ]
        }
      ]
    },
    {
      slug: 'civique',
      titre: 'Éducation civique',
      description: 'Comprends les valeurs de la République et la vie en communauté.',
      cours: [
        {
          titre: "Leçon : Les symboles de la République",
          ordreDansModule: 1,
          contenu: [
            { titre: "Le drapeau tricolore", texte: "Le drapeau français a trois couleurs verticales : le Bleu, le Blanc et le Rouge. Le blanc représente le roi historique, et le bleu et le rouge représentent la ville de Paris.", imagePlaceholder: "🇫🇷 🗼", bgColor: "bg-amber-50" },
            { titre: "La devise républicaine", texte: "Notre devise est : 'Liberté, Égalité, Fraternité'. Cela veut dire que nous sommes tous libres, tous égaux face à la loi, et que nous devons nous entraider comme des frères et sœurs !", imagePlaceholder: "🤝 ❤️", bgColor: "bg-orange-50" },
            { titre: "La Marianne et le 14 Juillet", texte: "Marianne est la dame qui représente la République. Le 14 Juillet, c'est la fête nationale avec les feux d'artifice !", imagePlaceholder: "🎆 🎇", bgColor: "bg-red-50" }
          ],
          exercices: [
            {
              titre: "Leçon : Les symboles de la République",
              type: "LECON",
              instructions: "Apprends à reconnaître les emblèmes français !"
            }
          ]
        },
        {
          titre: "Quiz : La vie en société",
          ordreDansModule: 2,
          contenu: [],
          exercices: [
            {
              titre: "Quiz : La vie en société",
              type: "QUIZ",
              instructions: JSON.stringify([
                { q: "Quelle est la devise républicaine de la France ?", options: ["Liberté, Égalité, Fraternité", "Travail, Famille, Patrie", "Union, Paix, Progrès"], answer: 0, explication: "Notre devise nationale est Liberté, Égalité, Fraternité !" },
                { q: "À l'école, que doit-on faire en priorité ?", options: ["Crier plus fort que le maître", "Respecter et écouter les autres", "Garder tous les jouets pour soi"], answer: 1, explication: "Le respect mutuel permet d'apprendre dans une bonne ambiance !" }
              ])
            }
          ]
        }
      ]
    },
    {
      slug: 'eco',
      titre: 'Éco-citoyenneté',
      description: 'Apprends les gestes pour protéger la nature et trier les déchets.',
      cours: [
        {
          titre: "Leçon : Le grand jeu du tri sélectif",
          ordreDansModule: 1,
          contenu: [
            { titre: "Pourquoi trier les déchets ?", texte: "Trier permet de recycler nos déchets pour fabriquer de nouvelles choses sans polluer la Terre. C'est un super geste pour la planète !", imagePlaceholder: "♻️ 🌍", bgColor: "bg-emerald-50" },
            { titre: "Le bac jaune", texte: "Dans le bac jaune, on jette les emballages en plastique, les boîtes de conserve en métal, et les cartons !", imagePlaceholder: "🟡 🥫", bgColor: "bg-yellow-50" },
            { titre: "Le bac vert et le compost", texte: "Dans le bac vert, on dépose le verre (bouteilles, pots). Et les épluchures de fruits et légumes vont au compost pour nourrir les plantes !", imagePlaceholder: "🟢 🍎", bgColor: "bg-green-50" }
          ],
          exercices: [
            {
              titre: "Leçon : Le grand jeu du tri sélectif",
              type: "LECON",
              instructions: "Découvre les règles du recyclage !"
            }
          ]
        },
        {
          fancyId: "e2",
          titre: "Quiz : Les bons éco-gestes",
          ordreDansModule: 2,
          contenu: [],
          exercices: [
            {
              titre: "Quiz : Les bons éco-gestes",
              type: "QUIZ",
              instructions: JSON.stringify([
                { q: "Pendant que je me brosse les dents, je dois...", options: ["Laisser couler l'eau", "Fermer le robinet d'eau", "Jouer avec la brosse à dents"], answer: 1, explication: "Fermer le robinet évite de gaspiller de précieux litres d'eau !" },
                { q: "Quel déchet peut-on composter dans le jardin ?", options: ["Une canette de soda", "Une bouteille plastique", "Une épluchure de banane"], answer: 2, explication: "Les restes de fruits et légumes sont biodégradables et parfaits pour le compost !" }
              ])
            }
          ]
        }
      ]
    }
  ];

  // Nettoyer les anciennes données pour repartir propre
  await prisma.scoreQuiz.deleteMany({});
  await prisma.composition.deleteMany({});
  await prisma.exercice.deleteMany({});
  await prisma.cours.deleteMany({});
  await prisma.module.deleteMany({
    where: { public: 'ENFANT' }
  });

  for (const mod of modulesEnfant) {
    const createdModule = await prisma.module.create({
      data: {
        titre: mod.titre,
        description: mod.description,
        public: 'ENFANT'
      }
    });

    for (const crs of mod.cours) {
      const createdCours = await prisma.cours.create({
        data: {
          titre: crs.titre,
          contenu: crs.contenu,
          ordreDansModule: crs.ordreDansModule,
          moduleId: createdModule.id,
          intervenanteId: intervenanteId
        }
      });

      for (const ex of crs.exercices) {
        const createdExercice = await prisma.exercice.create({
          data: {
            titre: ex.titre,
            instructions: ex.instructions,
            type: ex.type
          }
        });

        // Liaison via la table Composition
        await prisma.composition.create({
          data: {
            coursId: createdCours.id,
            exerciceId: createdExercice.id,
            ordre: 1
          }
        });
      }
    }
    console.log(`📦 Module [${mod.titre}] créé avec ses cours et exercices associés !`);
  }
  // Seeding de scores réalistes pour l'enfant de test
  const childUser = await prisma.utilisateur.findUnique({
    where: { email: 'enfant@rfc06.fr' }
  });

  if (childUser) {
    const seededExercises = await prisma.exercice.findMany();
    const alphabetLecon = seededExercises.find(e => e.titre.includes("alphabet") && e.type === "LECON");
    const sonsQuiz = seededExercises.find(e => e.titre.includes("sons") && e.type === "QUIZ");
    const sourisLecon = seededExercises.find(e => e.titre.includes("Souris") && e.type === "LECON");
    const reflexesQuiz = seededExercises.find(e => e.titre.includes("réflexes") && e.type === "QUIZ");

    const now = new Date();
    if (alphabetLecon) {
      await prisma.scoreQuiz.create({
        data: { etudiantId: childUser.id, exerciceId: alphabetLecon.id, score: 1, createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) }
      });
    }
    if (sonsQuiz) {
      await prisma.scoreQuiz.create({
        data: { etudiantId: childUser.id, exerciceId: sonsQuiz.id, score: 3, createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) }
      });
    }
    if (sourisLecon) {
      await prisma.scoreQuiz.create({
        data: { etudiantId: childUser.id, exerciceId: sourisLecon.id, score: 1, createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000) }
      });
    }
    if (reflexesQuiz) {
      await prisma.scoreQuiz.create({
        data: { etudiantId: childUser.id, exerciceId: reflexesQuiz.id, score: 2, createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000) }
      });
    }
    console.log("🏆 Scores réalistes pour l'enfant Chloé Petit seedés avec succès !");
=======
      supabaseAuthId = authData.user.id;
    }

    await prisma.utilisateur.upsert({
      where: { email: user.email },
      update: {
        id: supabaseAuthId,
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
>>>>>>> e3ac4b343d55127423ec652f552e19e35b76367b
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
      parcours: ['NUMERIQUE_ADULTE'] as Parcours[],
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
      parcours: ['NUMERIQUE_ADULTE'] as Parcours[],
      cours: [
        { titre: 'Structure et sémantique HTML5', ordreDansModule: 1, niveauRequis: NiveauPedagogique.ADULTE, contenu: [] },
        { titre: 'Mise en page moderne avec CSS Grid et Flexbox', ordreDansModule: 2, niveauRequis: NiveauPedagogique.ADULTE, contenu: [] }
      ]
    },
    {
      titre: 'Initiation à Scratch (Enfants)',
      description: 'Apprendre à programmer de manière ludique avec des blocs colorés.',
      public: 'ENFANT' as const,
      parcours: ['NUMERIQUE'] as Parcours[],
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
      parcours: ['ROBOTIQUE'] as Parcours[],
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
        public: item.public,
        parcours: item.parcours
      }
    });

    for (const coursItem of item.cours) {
      const extraData: any = {};

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
          ...extraData
        }
      });
    }
    console.log(`📦 Module [${item.public}] "${item.titre}" créé avec ${item.cours.length} cours associés.`);
  }

  const actualitesDeTest = [
    {
      titre: 'Label "Association Engagée" renouvelé pour 2025',
      tag: 'EVENT',
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
      tag: 'ATELIER',
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
      tag: 'SPECTACLE',
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
      tag: 'VIE ASSOCIATIVE',
      datePublication: new Date('2026-05-28T12:00:00.000Z'),
      extrait:
        'L’association continue de structurer ses contenus et ses actions pour proposer des repères clairs, utiles et accessibles à tous.',
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
    console.log('✅ Seeding terminé avec succès pour la base Prisma. La synchronisation Auth Supabase est désactivée.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
