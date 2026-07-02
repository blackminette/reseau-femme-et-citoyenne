// * src/app/(dashboard-enfant)/enfant/modules/[id]/activite/[actId]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Star, Check, RotateCcw,
    Sparkles, CheckCircle2, XCircle, MoveUp, MoveDown
} from 'lucide-react';
import { MODULES } from '@/lib/enfant-data';
import {
    obtenirDetailsActiviteDepuisDB,
    obtenirDetailsModuleDepuisDB,
    sauvegarderResultatActivite
} from '../../../actions';

// Types
type Question = {
    q: string;
    options: string[];
    answer: number;
    explication: string;
};

type MatchItem = {
    id: string;
    text: string;
};

type MatchExerciseData = {
    left: MatchItem[];
    right: MatchItem[];
    pairs: Record<string, string>;
};

type OrderExerciseData = {
    initialOrder: string[];
    correctOrder: string[];
};

type InputQuestion = {
    label: string;
    placeholder: string;
    key: string;
    correct: string[];
};

type InputExerciseData = {
    questions: InputQuestion[];
};

type SortItem = {
    id: string;
    text: string;
    category: string;
};

type SortCategory = {
    id: string;
    title: string;
    bg: string;
};

type SortExerciseData = {
    items: SortItem[];
    categories: SortCategory[];
};

type ExerciseContent =
    | { type: 'match'; data: MatchExerciseData }
    | { type: 'order'; data: OrderExerciseData }
    | { type: 'input'; data: InputExerciseData }
    | { type: 'sort'; data: SortExerciseData };

type ModuleContent = {
    titreGlobal: string;
    description: string;
    themeColor: string;
    step1: {
        titre: string;
        soustitre: string;
        texte: string;
        emoji: string;
        aRetenir: string;
        exempleText?: string;
        exempleImage?: string;
    };
    step2: {
        soustitre: string;
        boxTitre: string;
        texte: string;
        emoji: string;
        aRetenir: string[];
        badges?: { label: string; emoji: string }[];
        bulletList?: string[];
    };
    step3: {
        soustitre: string;
        texte: string;
        pointsCles: string[];
        bulles: string[];
        illustration: string;
        objectif?: string;
    };
    exercice: {
        titre: string;
        type: 'match' | 'order' | 'input' | 'sort';
        data: ExerciseContent['data'];
    } & ExerciseContent;
    quiz: Question[];
};

// Data pour chaque module
const MODULES_ADVENTURES: Record<string, ModuleContent> = {
    civique: {
        titreGlobal: "Éducation civique",
        description: "Vivre ensemble et comprendre le monde",
        themeColor: "from-amber-400 to-orange-500",
        step1: {
            titre: "Découvrir",
            soustitre: "Qu'est-ce que la citoyenneté ?",
            texte: "Être citoyen, c'est faire partie d'une communauté (une ville, un pays, le monde) et participer à la vie en société. Chaque citoyen a des droits mais aussi des devoirs.",
            emoji: "🏫 🤝 🇫🇷",
            aRetenir: "La citoyenneté permet de vivre ensemble dans le respect de chacun."
        },
        step2: {
            soustitre: "Lis attentivement le texte suivant.",
            boxTitre: "Le rôle des citoyens",
            texte: "Dans une démocratie, les citoyens ont des droits qui leur permettent de vivre libres et protégés. Ils ont aussi des devoirs qui aident à vivre ensemble dans le respect et la solidarité. Par exemple, ils doivent respecter les lois, payer leurs impôts, protéger l'environnement et participer à la vie de la communauté (école, quartier, ville...). Chacun peut donner son avis et voter pour choisir ses représentants.",
            emoji: "🗳️ ✉️",
            aRetenir: ["La citoyenneté, c'est participer à la vie en société et agir pour le bien commun."],
            badges: [
                { label: "Respecter les lois", emoji: "⚖️" },
                { label: "Participer à la vie de la société", emoji: "👥" },
                { label: "Protéger l'environnement", emoji: "🌍" }
            ]
        },
        step3: {
            soustitre: "Récapitulons !",
            texte: "La citoyenneté repose sur des droits et des devoirs qui permettent de vivre ensemble dans le respect et la solidarité. Retenons les idées principales de la leçon.",
            pointsCles: [
                "Les citoyens ont des droits.",
                "Ils ont aussi des devoirs.",
                "Respecter les autres et les lois permet de bien vivre ensemble."
            ],
            bulles: [
                "Quels sont les droits des citoyens ?",
                "Quels sont leurs devoirs ?",
                "Pourquoi est-il important de les respecter ?",
                "Comment participer à la vie de la société ?"
            ],
            illustration: "🤔"
        },
        exercice: {
            titre: "Relie chaque droit à son exemple.",
            type: 'match',
            data: {
                left: [
                    { id: 'l1', text: "Droit à l'éducation" },
                    { id: 'l2', text: "Liberté d'expression" },
                    { id: 'l3', text: "Droit à la santé" },
                    { id: 'l4', text: "Droit à un environnement sain" }
                ],
                right: [
                    { id: 'r2', text: "Dire ce que l'on pense sans être puni." },
                    { id: 'r1', text: "Aller à l'école et apprendre." },
                    { id: 'r4', text: "Vivre dans un endroit propre et non pollué." },
                    { id: 'r3', text: "Être soigné quand on est malade." }
                ],
                pairs: {
                    'l1': 'r1',
                    'l2': 'r2',
                    'l3': 'r3',
                    'l4': 'r4'
                }
            }
        },
        quiz: [
            { q: "Quel devoir aide à préserver la nature ?", options: ["Avoir le droit de s'exprimer.", "Respecter les lois.", "Protéger l'environnement.", "Choisir ses représentants."], answer: 2, explication: "Protéger l'environnement est un devoir citoyen crucial pour l'avenir de la planète." },
            { q: "Quel symbole représente la République Française ?", options: ["La Tour Eiffel", "La Marianne", "Le coq uniquement", "Un château fort"], answer: 1, explication: "Marianne est la figure symbolique qui incarne la République Française et ses valeurs." },
            { q: "Quelle est la devise nationale de la France ?", options: ["Union, Force, Courage", "Liberté, Égalité, Fraternité", "Paix, Progrès, Justice", "Travail, Famille, Patrie"], answer: 1, explication: "La devise officielle est 'Liberté, Égalité, Fraternité'." },
            { q: "Que célèbre-t-on principalement lors de la fête nationale le 14 Juillet ?", options: ["Le début des vacances d'été", "La fête de la musique", "L'histoire républicaine et la fête de la Fédération", "La récolte du blé"], answer: 2, explication: "Le 14 Juillet célèbre l'union de la nation et les idéaux de la Révolution française." },
            { q: "À quoi sert principalement le vote des citoyens ?", options: ["À payer ses impôts", "À choisir ses représentants", "À s'inscrire à l'école", "À gagner de l'argent"], answer: 1, explication: "Voter permet aux citoyens de choisir démocratiquement les personnes qui gèrent le pays." },
            { q: "Qui a le droit de voter en France lors des élections nationales ?", options: ["Tous les enfants", "Seuls les présidents", "Tous les citoyens majeurs inscrits sur les listes électorales", "Tous les habitants du quartier"], answer: 2, explication: "Il faut être citoyen français, avoir 18 ans minimum et jouir de ses droits civiques." },
            { q: "Respecter les autres à l'école est...", options: ["Optionnel", "Un droit", "Un devoir", "Une punition"], answer: 2, explication: "Le respect mutuel est un devoir fondamental pour garantir le vivre-ensemble." },
            { q: "L'accès à l'école gratuite pour tous est garanti par...", options: ["Le droit à la santé", "Le droit à l'éducation", "Le droit de vote", "La liberté d'expression"], answer: 1, explication: "C'est le droit à l'éducation qui garantit à chaque enfant l'accès aux apprentissages." },
            { q: "Dans quel ordre se trouvent les couleurs du drapeau français (de gauche à droite) ?", options: ["Rouge, Blanc, Bleu", "Bleu, Blanc, Rouge", "Vert, Blanc, Rouge", "Bleu, Rouge, Blanc"], answer: 1, explication: "Les trois bandes verticales sont ordonnées : Bleu, Blanc, puis Rouge." },
            { q: "Que veut dire la valeur de la 'Fraternité' ?", options: ["Faire ce que l'on veut", "Être tous identiques", "S'entraider et se respecter comme des frères et sœurs", "Avoir plus de droits que de devoirs"], answer: 2, explication: "La fraternité est la solidarité et l'amitié entre tous les citoyens." }
        ]
    },
    napoleon: {
        titreGlobal: "Napoléon",
        description: "Comprendre un personnage clé de l'histoire française",
        themeColor: "from-amber-500 to-rose-600",
        step1: {
            titre: "Découvrir",
            soustitre: "Qui était Napoléon ?",
            texte: "Napoléon Bonaparte est une grande figure de l'histoire de France. Il a d'abord été général, puis il est devenu Premier Consul et ensuite Empereur des Français. Pour l'étudier sérieusement, il faut regarder à la fois ses réussites et ses limites.",
            emoji: "🎩 🇫🇷 📜",
            aRetenir: "Napoléon a marqué l'histoire française, mais un personnage historique se juge avec des faits, pas avec des slogans."
        },
        step2: {
            soustitre: "Lis attentivement le texte suivant.",
            boxTitre: "Napoléon et son époque",
            texte: "Napoléon Bonaparte a vécu pendant une période de grands changements en France. Après la Révolution, il a pris le pouvoir et a dirigé le pays. Son époque a vu des réformes importantes, comme l'organisation de l'administration et du droit. Mais son règne s'est aussi accompagné de guerres très nombreuses en Europe. Pour comprendre Napoléon, il faut donc distinguer les réformes utiles, le pouvoir personnel et les conflits.",
            emoji: "⚖️ 🗺️ 🏛️",
            aRetenir: [
                "Napoléon est lié à une période de grands changements.",
                "Il faut comparer ses actions et leurs conséquences.",
                "L'histoire demande de la précision, pas du mythe."
            ]
        },
        step3: {
            soustitre: "Récapitulons !",
            texte: "Napoléon est une figure historique importante, mais on doit l'analyser avec méthode : on observe le contexte, on compare les décisions, on mesure les conséquences et on garde en tête les limites du pouvoir.",
            pointsCles: [
                "Le contexte historique change la manière de lire ses actions.",
                "Une réforme peut avoir des effets utiles et des limites en même temps.",
                "L'histoire demande des faits précis, pas une admiration aveugle."
            ],
            bulles: [
                "Quel est le contexte ?",
                "Quelles décisions prend-il ?",
                "Quels effets voit-on ?",
                "Quelles limites faut-il noter ?"
            ],
            illustration: "🏛️"
        },
        exercice: {
            titre: "Remets les grandes étapes de la vie politique de Napoléon dans le bon ordre.",
            type: 'order',
            data: {
                correctOrder: [
                    "Général pendant la Révolution française",
                    "Premier Consul",
                    "Empereur des Français",
                    "Exil après sa chute"
                ],
                initialOrder: [
                    "Empereur des Français",
                    "Général pendant la Révolution française",
                    "Exil après sa chute",
                    "Premier Consul"
                ]
            }
        },
        quiz: [
            { q: "Comment s'appelle la fonction de Napoléon avant de devenir Empereur ?", options: ["Président", "Premier Consul", "Roi de France", "Ministre"], answer: 1, explication: "Après le coup d'État de 1799, Napoléon devient Premier Consul." },
            { q: "Napoléon a surtout dirigé la France après...", options: ["La Révolution française", "La Première Guerre mondiale", "La Seconde Guerre mondiale", "La guerre froide"], answer: 0, explication: "Napoléon prend le pouvoir dans la période qui suit la Révolution française." },
            { q: "Pourquoi faut-il étudier Napoléon avec rigueur ?", options: ["Pour le transformer en héros parfait", "Pour oublier son époque", "Pour comprendre ses réussites et ses limites", "Parce qu'il n'a rien changé"], answer: 2, explication: "Un personnage historique se comprend en regardant les faits, les réformes et les conséquences." },
            { q: "Quel est un exemple de conséquence liée à son époque ?", options: ["Des guerres très nombreuses en Europe", "La disparition totale de l'État", "La fin de toute administration", "L'arrêt de l'histoire"], answer: 0, explication: "Son règne a été marqué par des guerres à grande échelle en Europe." },
            { q: "Que doit faire un élève quand il étudie l'histoire ?", options: ["Répéter des slogans", "Chercher des faits et des sources", "Éviter les dates", "Inventer des conclusions"], answer: 1, explication: "L'histoire demande des faits, du contexte et des sources fiables." }
        ]
    },
    anglais: {
        titreGlobal: "Anglais",
        description: "Apprendre l'anglais en s'amusant 😜",
        themeColor: "from-pink-400 to-rose-600",
        step1: {
            titre: "Découvrir",
            soustitre: "Hello !",
            texte: "L'anglais est parlé dans beaucoup de pays. Apprendre quelques mots nous aide à communiquer, à voyager et à nous faire de nouveaux amis !",
            emoji: "🇬🇧 ✈️ 🤝",
            aRetenir: "Apprendre une langue, c'est ouvrir son cœur et son esprit."
        },
        step2: {
            soustitre: "Lis attentivement le texte suivant.",
            boxTitre: "A day with Tom 🍃",
            texte: "Hi! My name is Tom, I'm 10 years old. I live in London with my parents and my little sister, Lily. I go to school from Monday to Friday. My favorite subject is English! I like reading and sports. After school, I play football with my friends. On Saturdays, I help my mum at home and watch a movie. On Sunday, we go to the park as a family. I love my life!",
            emoji: "✍️ 📖 ⚽",
            aRetenir: [
                "Tom parle de sa vie quotidienne.",
                "Il utilise des mots simples pour décrire ses activités."
            ]
        },
        step3: {
            soustitre: "Récapitulons !",
            texte: "Voici ce que nous avons appris de la présentation de Tom :",
            pointsCles: [
                "Hello / Hi : Dire bonjour",
                "My name is... : Se présenter",
                "I live in... : Dire où l'on habite",
                "I like... : Parler de ses goûts",
                "I play... : Parler de ses activités"
            ],
            bulles: [
                "Let's practice now!"
            ],
            illustration: "👧",
            objectif: "Mots clés:\nHello (bonjour)\nMy name is... (je m'appelle...)\nI live in... (j'habite à...)\nI like... (j'aime...)\nI play... (je joue...)"
        },
        exercice: {
            titre: "Remets les phrases dans le bon ordre logique pour te présenter.",
            type: 'order',
            data: {
                correctOrder: [
                    "Hello !",
                    "My name is Tom.",
                    "I live in London.",
                    "I play football.",
                    "I love my life !"
                ],
                initialOrder: [
                    "I play football.",
                    "Hello !",
                    "I love my life !",
                    "My name is Tom.",
                    "I live in London."
                ]
            }
        },
        quiz: [
            { q: "What is Tom's favorite subject ?", options: ["Maths", "Science", "English", "History"], answer: 2, explication: "Tom dit : 'My favorite subject is English!'." },
            { q: "How do you say 'Bonjour' in English ?", options: ["Goodbye", "Hello", "Thank you", "Please"], answer: 1, explication: "'Hello' ou 'Hi' veut dire 'Bonjour' en anglais." },
            { q: "What color is 'Yellow' in French ?", options: ["Vert", "Rouge", "Bleu", "Jaune"], answer: 3, explication: "'Yellow' correspond à la couleur jaune." },
            { q: "How old is Tom ?", options: ["8 years old", "10 years old", "12 years old", "9 years old"], answer: 1, explication: "Tom déclare : 'I'm 10 years old'." },
            { q: "Where does Tom live ?", options: ["Paris", "New York", "London", "Sydney"], answer: 2, explication: "Tom dit : 'I live in London with my parents'." },
            { q: "How do you say 'Vert' in English ?", options: ["Blue", "Green", "Red", "Black"], answer: 1, explication: "Vert se dit 'Green'." },
            { q: "Which sport does Tom play after school ?", options: ["Basketball", "Tennis", "Football", "Rugby"], answer: 2, explication: "Tom dit : 'I play football with my friends'." },
            { q: "On which day does Tom watch a movie ?", options: ["Monday", "Saturday", "Friday", "Sunday"], answer: 1, explication: "Il dit : 'On Saturdays, I help my mum and watch a movie'." },
            { q: "How do you say 'S'il vous plaît' in English ?", options: ["Thank you", "Sorry", "Please", "Welcome"], answer: 2, explication: "S'il vous plaît se traduit par 'Please'." },
            { q: "How do you say 'Merci' in English ?", options: ["Hello", "Excuse me", "Please", "Thank you"], answer: 3, explication: "Merci se traduit par 'Thank you'." }
        ]
    },
    lecture: {
        titreGlobal: "Lecture & compréhension",
        description: "Un outil pour apprendre et grandir",
        themeColor: "from-emerald-400 to-green-600",
        step1: {
            titre: "Découvrir",
            soustitre: "Qu'est-ce que la lecture ?",
            texte: "Lire, c'est comprendre des mots écrits pour découvrir des idées, des histoires ou des informations. Quand tu lis, ton cerveau imagine, comprend et apprend de nouvelles choses. La lecture t'aide à mieux comprendre le monde qui t'entoure !",
            emoji: "📚 💡 🧠",
            aRetenir: "Lire, c'est voyager et imaginer avec son cerveau."
        },
        step2: {
            soustitre: "Lis attentivement le texte suivant.",
            boxTitre: "Le voyage de Léo",
            texte: "Léo se réveille tôt ce matin. Aujourd'hui, il part en voyage avec sa famille. Ils prennent le train pour aller à la montagne. Léo regarde par la fenêtre. Il voit des champs, des arbres et des rivières qui défilent. À l'arrivée, l'air est frais et pur. Ils posent leurs valises dans un chalet confortable. L'après-midi, Léo part en randonnée. Il voit des fleurs sauvages et des papillons colorés. Le soir, toute la famille se réunit autour d'un bon repas.",
            emoji: "🚂 ⛰️ 🏡",
            aRetenir: [
                "Un texte raconte une histoire ou donne des informations.",
                "Pour bien comprendre, il faut lire attentivement.",
                "Observe les détails importants (qui, quoi, où, quand)."
            ]
        },
        step3: {
            soustitre: "Récapitulons !",
            texte: "Bien comprendre un texte, c'est trouver les informations importantes et décoder le message de l'auteur.",
            pointsCles: [
                "Identifier les personnages (qui ?) et les lieux (où ?).",
                "Repérer les actions principales (quoi ?) et le moment (quand ?).",
                "Comprendre le message ou l'idée principale globale."
            ],
            bulles: [
                "Qui ? Les personnages",
                "Où ? Le lieu de l'histoire",
                "Que se passe-t-il ? L'action",
                "Pourquoi ? Le sens du texte"
            ],
            illustration: "👦"
        },
        exercice: {
            titre: "Relie chaque question à sa bonne réponse d'après le texte.",
            type: 'match',
            data: {
                left: [
                    { id: 'l1', text: "Où vont Léo et sa famille ?" },
                    { id: 'l2', text: "Quel transport prennent-ils ?" },
                    { id: 'l3', text: "Où posent-ils leurs valises ?" },
                    { id: 'l4', text: "Qu'observe Léo en chemin ?" }
                ],
                right: [
                    { id: 'r2', text: "Le train." },
                    { id: 'r1', text: "À la montagne." },
                    { id: 'r4', text: "Des fleurs et des papillons." },
                    { id: 'r3', text: "Dans un chalet confortable." }
                ],
                pairs: {
                    'l1': 'r1',
                    'l2': 'r2',
                    'l3': 'r3',
                    'l4': 'r4'
                }
            }
        },
        quiz: [
            { q: "Quel message principal du texte ?", options: ["Léo part à la plage avec ses copains.", "Léo découvre la montagne et passe de bons moments avec sa famille.", "Léo reste à la maison pour jouer à la console.", "Léo va à l'école à pied."], answer: 1, explication: "L'histoire décrit le trajet et le séjour de Léo en famille à la montagne." },
            { q: "Comment Léo et sa famille voyagent-ils ?", options: ["En voiture", "En train", "En avion", "À vélo"], answer: 1, explication: "Le texte indique : 'Ils prennent le train pour aller à la montagne'." },
            { q: "Où s'installent-ils à leur arrivée ?", options: ["Dans un hôtel de luxe", "Sous une tente de camping", "Dans un chalet confortable", "Chez des amis"], answer: 2, explication: "Le texte précise : 'Ils posent leurs valises dans un chalet confortable'." },
            { q: "Qu'est-ce que Léo observe en randonnée ?", options: ["Des voitures et des bus", "Des fleurs sauvages et des papillons colorés", "Des ours et des loups", "Des skieurs"], answer: 1, explication: "Il voit 'des fleurs sauvages et des papillons colorés'." },
            { q: "À quel moment de la journée la famille se réunit-elle autour du repas ?", options: ["Le matin", "À midi", "À l'heure du goûter", "Le soir"], answer: 3, explication: "Le texte indique : 'Le soir, toute la famille se réunit autour d'un bon repas'." },
            { q: "Que fait Léo pendant l'après-midi ?", options: ["Il dort", "Il fait ses devoirs", "Il part en randonnée", "Il nage dans un lac"], answer: 2, explication: "Le texte dit : 'L'après-midi, Léo part en randonnée'." },
            { q: "Comment est décrit l'air à la montagne ?", options: ["Chaud et humide", "Frais et pur", "Pollué", "Sec et froid"], answer: 1, explication: "Il est écrit : 'À l'arrivée, l'air est frais et pur'." },
            { q: "Quand Léo se réveille-t-il ce matin-là ?", options: ["Tard dans la matinée", "Tôt ce matin", "À midi", "Pendant l'après-midi"], answer: 1, explication: "Le texte commence par : 'Léo se réveille tôt ce matin'." },
            { q: "Avec qui Léo part-il en voyage ?", options: ["Seul", "Avec ses copains de classe", "Avec sa famille", "Avec son chien"], answer: 2, explication: "Le texte indique : 'il part en voyage avec sa famille'." },
            { q: "Pourquoi lit-on attentivement un texte ?", options: ["Pour finir le plus vite possible", "Pour bien comprendre l'histoire et retenir les détails importants", "Pour apprendre à dessiner", "Parce que c'est obligatoire uniquement"], answer: 1, explication: "Une lecture attentive permet de saisir le sens, la structure et les faits marquants du texte." }
        ]
    },
    numerique: {
        titreGlobal: "Numérique",
        description: "Un outil pour apprendre et grandir",
        themeColor: "from-blue-400 to-indigo-600",
        step1: {
            titre: "Découvrir",
            soustitre: "Qu'est-ce que le numérique ?",
            texte: "Le numérique regroupe tous les outils électroniques : ordinateurs, tablettes, smartphones, internet... Ces outils nous aident à apprendre, à communiquer, à créer et à mieux comprendre le monde.",
            emoji: "💻 🖱️ 🌐",
            aRetenir: "Le numérique est un outil puissant qui nous aide à apprendre et à progresser."
        },
        step2: {
            soustitre: "Lis attentivement le texte suivant.",
            boxTitre: "Le numérique, un outil d'apprentissage",
            texte: "À l'école, le numérique nous permet d'accéder à beaucoup d'informations, de découvrir de nouveaux sujets et de réaliser des activités intéressantes. Il nous aide à comprendre grâce à des vidéos éducatives, des exercices interactifs et des documents en ligne. Il nous permet aussi de communiquer avec nos enseignants et nos camarades pour travailler ensemble. Utilisé avec raison et dans le bon contexte, le numérique devient un allié précieux pour réussir à l'école et dans la vie.",
            emoji: "👩‍💻 📚",
            aRetenir: ["Le numérique est un outil d'apprentissage pour comprendre, s'exercer, créer et collaborer."],
            bulletList: [
                "Rechercher des informations fiables",
                "Comprendre des concepts avec des vidéos",
                "S'exercer grâce à des quiz",
                "Créer des exposés ou des dessins",
                "Partager des projets scolaires"
            ]
        },
        step3: {
            soustitre: "Récapitulons !",
            texte: "Le numérique est utile si nous l'utilisons correctement et de manière responsable.",
            pointsCles: [
                "Je m'en sers pour apprendre et faire des recherches utiles.",
                "Je reste concentré et je limite mon temps d'écran.",
                "Je vérifie toujours si la source des informations est sûre.",
                "Je l'utilise avec respect pour communiquer avec les autres."
            ],
            bulles: [
                "Apprendre intelligemment",
                "Se protéger en ligne",
                "Vérifier ses sources",
                "Communiquer avec respect"
            ],
            illustration: "👍",
            objectif: "Objectif : Utiliser le numérique intelligemment pour apprendre, progresser et devenir autonome."
        },
        exercice: {
            titre: "Associe chaque situation à son bon usage.",
            type: 'match',
            data: {
                left: [
                    { id: 'l1', text: "Trouver des infos pour un exposé" },
                    { id: 'l2', text: "Regarder une vidéo d'histoire" },
                    { id: 'l3', text: "Envoyer ses devoirs par e-mail" },
                    { id: 'l4', text: "Jouer en ligne pendant 4 heures" }
                ],
                right: [
                    { id: 'r2', text: "S'informer et comprendre" },
                    { id: 'r4', text: "Mauvaise utilisation / Risque d'abus" },
                    { id: 'r1', text: "Rechercher et s'instruire" },
                    { id: 'r3', text: "Communiquer et collaborer" }
                ],
                pairs: {
                    'l1': 'r1',
                    'l2': 'r2',
                    'l3': 'r3',
                    'l4': 'r4'
                }
            }
        },
        quiz: [
            { q: "Quel est le meilleur usage du numérique ?", options: ["Regarder des vidéos sans but pendant des heures.", "Utiliser une application pour faire ses devoirs et apprendre.", "Jouer en ligne au lieu d'aller à l'école.", "Copier des informations sans vérifier la source."], answer: 1, explication: "Utiliser le numérique comme outil de soutien scolaire et d'apprentissage est le meilleur choix." },
            { q: "Quel outil n'est pas un appareil numérique ?", options: ["Un smartphone", "Une tablette", "Un livre papier classique", "Un ordinateur portable"], answer: 2, explication: "Un livre papier est un support physique traditionnel, pas un appareil électronique numérique." },
            { q: "À quoi sert principalement la souris d'un ordinateur ?", options: ["À écouter de la musique", "À diriger le pointeur à l'écran et cliquer", "À écrire des lettres", "À éteindre l'électricité"], answer: 1, explication: "La souris permet de naviguer visuellement et d'interagir par des clics sur l'écran." },
            { q: "Quelle touche permet d'insérer un espace entre deux mots ?", options: ["La touche Entrée", "La touche Espace (la plus longue)", "La touche Majuscule", "La touche Suppr"], answer: 1, explication: "La grande barre d'espace sert à séparer les mots pour rendre le texte lisible." },
            { q: "Que faire si un inconnu te parle sur Internet ?", options: ["Lui répondre gentiment", "Ignorer et le dire tout de suite à un adulte de confiance", "Lui donner ton adresse et ton école", "Lui envoyer une photo"], answer: 1, explication: "Il ne faut jamais communiquer avec des inconnus en ligne et toujours avertir ses parents." },
            { q: "Ton mot de passe doit être...", options: ["Facile à deviner (ex: 1234)", "Secret pour tout le monde sauf mes parents", "Partagé avec tous mes copains", "Écrit sur mon cahier d'école visible de tous"], answer: 1, explication: "Un mot de passe doit rester secret pour protéger ton compte et tes données personnelles." },
            { q: "Pourquoi faut-il faire des pauses régulières avec les écrans ?", options: ["Pour user la batterie", "Pour protéger ses yeux, son sommeil et rester actif", "Parce que l'ordinateur a besoin de dormir", "Pour faire de la place dans la chambre"], answer: 1, explication: "Les pauses évitent la fatigue visuelle et favorisent une bonne santé physique." },
            { q: "Où peut-on trouver des vidéos éducatives fiables ?", options: ["Sur n'importe quel site de jeux vidéo", "Sur des plateformes ou sites scolaires recommandés par les enseignants", "Sur les réseaux sociaux sans filtre", "Dans les spams d'e-mails"], answer: 1, explication: "Il faut privilégier les sources scolaires et vérifiées pour apprendre en sécurité." },
            { q: "Pour copier du texte à l'ordinateur, on utilise principalement...", options: ["Le haut-parleur", "La souris uniquement", "Le clavier", "L'imprimante"], answer: 2, explication: "Le clavier permet de saisir des caractères, des chiffres et de rédiger des textes." },
            { q: "Le numérique est un allié précieux si...", options: ["On y passe toutes nos nuits", "On l'utilise avec modération, bon sens et pour s'instruire", "On ne lit plus aucun livre papier", "On refuse de parler aux gens en vrai"], answer: 1, explication: "L'équilibre et l'usage intelligent font du numérique un formidable outil d'apprentissage." }
        ]
    },
    eco: {
        titreGlobal: "Éco-citoyenneté",
        description: "Agir aujourd'hui pour un monde meilleur",
        themeColor: "from-teal-400 to-emerald-600",
        step1: {
            titre: "Découvrir",
            soustitre: "Pourquoi protéger notre planète ?",
            texte: "La Terre est notre maison. L'air que nous respirons, l'eau que nous buvons et la nature qui nous entoure sont précieux. Mais nos actions peuvent l'abîmer... ou la protéger ! Chaque geste compte pour un avenir plus propre et plus sain.",
            emoji: "🌍 🌱 ☀️",
            aRetenir: "Prendre soin de la planète, c'est prendre soin de nous tous !"
        },
        step2: {
            soustitre: "Lis attentivement le texte suivant.",
            boxTitre: "Une journée sans déchets 🍃",
            texte: "Ce samedi, Emma et son frère Léo décident de relever un défi : produire le moins de déchets possible ! Ils prennent des sacs réutilisables pour faire les courses, choisissent des produits avec peu d'emballages, réparent leur jouet au lieu d'en acheter un nouveau et trient leurs déchets à la maison. Le soir, ils sont fiers : leur poubelle est presque vide ! Leurs petits gestes ont un grand impact sur la planète.",
            emoji: "♻️ 🗑️ 🟢 🟡",
            aRetenir: [
                "Réduire, réutiliser, réparer et recycler sont des gestes utiles.",
                "Agir chaque jour permet de protéger notre environnement."
            ]
        },
        step3: {
            soustitre: "Récapitulons !",
            texte: "Pour être éco-citoyen, il suffit d'adopter des gestes simples et responsables au quotidien.",
            pointsCles: [
                "Réduire pour éviter de gaspiller l'eau, l'énergie et la nourriture.",
                "Réutiliser pour donner une seconde vie aux objets au lieu de jeter.",
                "Recycler en triant correctement nos emballages, papiers et verres.",
                "Respecter la nature et tous les êtres vivants de la biodiversité."
            ],
            bulles: [
                "Moins de déchets",
                "Économiser l'eau",
                "Protéger la nature",
                "Se déplacer autrement",
                "Économiser l'énergie"
            ],
            illustration: "🌳"
        },
        exercice: {
            titre: "Trie les gestes en fonction de leur impact sur la planète.",
            type: 'sort',
            data: {
                categories: [
                    { id: 'eco', title: "Éco-citoyen 💚", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" },
                    { id: 'non-eco', title: "Non éco-citoyen ❌", bg: "bg-rose-50 text-rose-800 border-rose-200" }
                ],
                items: [
                    { id: 'i1', text: "Trier ses déchets à la maison", category: 'eco' },
                    { id: 'i2', text: "Jeter un emballage par terre", category: 'non-eco' },
                    { id: 'i3', text: "Éteindre la lumière en sortant", category: 'eco' },
                    { id: 'i4', text: "Utiliser une gourde réutilisable", category: 'eco' },
                    { id: 'i5', text: "Laisser l'eau couler en se brossant les dents", category: 'non-eco' },
                    { id: 'i6', text: "Prendre un sac plastique jetable à chaque course", category: 'non-eco' }
                ]
            }
        },
        quiz: [
            { q: "Quel geste permet de réduire la pollution de l'air ?", options: ["Prendre une douche très longue.", "Aller à l'école à pied ou à vélo quand c'est possible.", "Laisser les appareils en veille toute la journée.", "Jeter des déchets dans les rivières."], answer: 1, explication: "Les transports doux comme le vélo ou la marche ne rejettent aucun gaz polluant dans l'atmosphère." },
            { q: "Dans quelle poubelle doit-on jeter les emballages en plastique et en carton ?", options: ["La poubelle verte de verre", "Le bac jaune de tri", "Le composteur de jardin", "N'importe où"], answer: 1, explication: "Le bac jaune est réservé au recyclage du carton, du plastique et des métaux." },
            { q: "Que doit-on faire pendant qu'on se brosse les dents ?", options: ["Laisser couler le robinet", "Fermer le robinet d'eau", "Laisser l'eau couler à moitié", "Prendre un bain en même temps"], answer: 1, explication: "Fermer le robinet évite de gaspiller plusieurs litres d'eau potable inutilement." },
            { q: "Qu'est-ce qui est biodégradable et peut aller dans le composteur ?", options: ["Une bouteille en plastique", "Une épluchure de pomme ou de banane", "Une canette de soda", "Un jouet cassé"], answer: 1, explication: "Les déchets organiques de cuisine se dégradent naturellement et enrichissent la terre." },
            { q: "Que font Emma et Léo pour faire leurs courses sans déchets ?", options: ["Ils achètent plein de sacs plastiques", "Ils utilisent des sacs réutilisables en tissu", "Ils ne font pas de courses", "Ils jettent les emballages dans le magasin"], answer: 1, explication: "Les sacs en tissu réutilisables évitent de fabriquer et jeter du plastique à usage unique." },
            { q: "Quel bac de tri est spécialement réservé pour le verre (bouteilles, pots) ?", options: ["Le bac jaune", "Le conteneur à verre (souvent vert ou blanc)", "Le bac bleu des journaux", "Le bac de déchets ménagers"], answer: 1, explication: "Le verre doit être trié séparément dans les conteneurs prévus pour être fondu et recyclé à l'infini." },
            { q: "Pourquoi recycle-t-on les emballages recyclables ?", options: ["Pour faire de la place", "Pour fabriquer de nouveaux objets sans puiser dans les ressources de la Terre", "Parce que c'est amusant", "Pour les brûler tous"], answer: 1, explication: "Le recyclage préserve les ressources naturelles en réutilisant la matière déjà produite." },
            { q: "Que vaut-il mieux faire avec un jouet ou un objet légèrement cassé ?", options: ["Le jeter tout de suite à la poubelle", "Le réparer si c'est possible ou le donner pour pièces", "En racheter un identique immédiatement", "Le cacher sous son lit"], answer: 1, explication: "Réparer évite le gaspillage et limite la quantité de déchets générés." },
            { q: "Éteindre la lumière en quittant une pièce permet d'économiser...", options: ["De l'eau", "De l'énergie électrique", "Du papier", "Du temps"], answer: 1, explication: "Éteindre les lumières inutiles évite de surconsommer de l'électricité." },
            { q: "Qui a le rôle d'agir pour protéger la planète ?", options: ["Seulement les présidents", "Seulement les scientifiques", "Tout le monde ensemble par des gestes quotidiens", "Personne, elle se répare toute seule"], answer: 2, explication: "Chaque citoyen, petit ou grand, a le pouvoir d'agir positivement sur son environnement." }
        ]
    },
    robotique: {
        titreGlobal: "Robotique",
        description: "Construire et programmer des machines",
        themeColor: "from-purple-400 to-indigo-600",
        step1: {
            titre: "Découvrir",
            soustitre: "Qu'est-ce qu'un robot ?",
            texte: "Un robot est une machine qui peut effectuer des actions toute seule ou avec des consignes.",
            emoji: "🤖 🧠 ⚡",
            aRetenir: "Un robot associe des capteurs, un programme et des moteurs.",
            exempleText: "Un aspirateur robot nettoie ta chambre automatiquement.",
            exempleImage: "/images/enfants/vacuum_robot.png"
        },
        step2: {
            soustitre: "Comment fonctionne un robot ?",
            boxTitre: "Le fonctionnement",
            texte: "Un robot reçoit une information, la traite, puis agit.",
            emoji: "⚙️ 🔌 🤖",
            aRetenir: ["Un robot suit toujours une séquence : recevoir -> traiter -> agir."]
        },
        step3: {
            soustitre: "Récapitulons !",
            texte: "Un robot est composé de différentes parties qui travaillent ensemble.",
            pointsCles: [
                "Le robot reçoit une information.",
                "Il traite cette information.",
                "Il agit en conséquence."
            ],
            bulles: [
                "Le robot obéit au code",
                "Les humains programment",
                "Attention aux bugs !",
                "Tester et recommencer"
            ],
            illustration: "🤖"
        },
        exercice: {
            titre: "Remets les étapes dans l'ordre",
            type: 'order',
            data: {
                correctOrder: [
                    "👁️ Il reçoit une information.",
                    "💻 Il traite l'information.",
                    "⚙️ Il agit."
                ],
                initialOrder: [
                    "⚙️ Il agit.",
                    "👁️ Il reçoit une information.",
                    "💻 Il traite l'information."
                ]
            }
        },
        quiz: [
            { q: "Quelle est la première étape quand un robot fonctionne ?", options: ["Il agit.", "Il traite l'information.", "Il reçoit une information."], answer: 2, explication: "Le robot commence par acquérir des informations par ses capteurs (recevoir), puis les traite dans son unité de contrôle avant de commander les moteurs pour agir." },
            { q: "Quel composant permet au robot d'éviter un mur devant lui ?", options: ["La batterie", "Le capteur de distance", "La diode LED", "Le châssis métallique"], answer: 1, explication: "Le capteur de distance (ultrason ou infrarouge) mesure la proximité des obstacles." },
            { q: "Quel élément joue le rôle du 'cerveau' d'un robot ?", options: ["Le moteur", "La carte de contrôle (microcontrôleur)", "La roue", "Le capteur"], answer: 1, explication: "C'est la carte de contrôle qui exécute le programme et coordonne le robot." },
            { q: "Que font les actionneurs d'un robot ?", options: ["Ils réfléchissent", "Ils captent la lumière", "Ils produisent des actions physiques (mouvement, son, lumière)", "Ils alimentent en courant"], answer: 2, explication: "Les moteurs, haut-parleurs et LED sont des actionneurs qui font agir le robot." },
            { q: "Qui donne l'intelligence et le comportement au robot ?", options: ["Le robot lui-même", "Le programmeur humain à travers son code", "L'usine de fabrication", "La prise électrique de recharge"], answer: 1, explication: "Le robot n'exécute que le programme écrit par un être humain." },
            { q: "Comment qualifie-t-on une erreur dans un programme informatique ?", options: ["Un virus", "Un bug", "Une panne mécanique", "Un faux contact"], answer: 1, explication: "Un bug est une erreur de conception ou de syntaxe dans le code." },
            { q: "Quelle flèche de programmation sert pour faire avancer le robot ?", options: ["La flèche vers le bas", "La flèche vers le haut", "La flèche gauche", "Le bouton stop"], answer: 1, explication: "La flèche pointant vers le haut symbolise le déplacement vers l'avant." },
            { q: "Le robot a-t-il une conscience et des sentiments ?", options: ["Oui, comme nous", "Non, c'est uniquement une machine programmée", "Seulement quand il est connecté à internet", "Seulement s'il a des yeux dessinés"], answer: 1, explication: "Un robot est un automate sans émotion qui suit des calculs logiques." },
            { q: "Pour mesurer la luminosité d'une pièce, le robot utilise...", options: ["Un capteur de lumière (photo-résistance)", "Un capteur de température", "Un moteur de précision", "Son antenne radio"], answer: 0, explication: "Les capteurs de lumière permettent de réagir à la clarté ou à l'obscurité." },
            { q: "Quelle source d'énergie fait fonctionner la plupart des robots autonomes ?", options: ["De l'essence", "De l'eau", "Une batterie ou des piles électriques", "Le vent"], answer: 2, explication: "L'énergie électrique stockée dans des batteries alimente le cerveau et les moteurs." }
        ]
    }
};

type DetailedActivity = NonNullable<Awaited<ReturnType<typeof obtenirDetailsActiviteDepuisDB>>>;

function getFirstSentence(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return '';
    const match = trimmed.match(/^[^.?!]+[.?!]?/);
    return (match?.[0] || trimmed).trim();
}

function getNapoleonInitialStepIndex(actId: string) {
    const match = actId.match(/^cours_(\d+)$/);
    if (!match) return 0;

    const courseNumber = Number.parseInt(match[1], 10);
    if (Number.isNaN(courseNumber) || courseNumber <= 1) {
        return 0;
    }

    if (courseNumber === 2) {
        return 1;
    }

    return 2;
}

function extractLesson(detail: DetailedActivity | null | undefined) {
    const fallbackTitle = detail?.titre || '';
    const rawContent = detail && Array.isArray(detail.contenu) ? detail.contenu : [];
    const first = rawContent[0] as { titre?: string; texte?: string } | undefined;

    return {
        title: first?.titre || fallbackTitle,
        text: first?.texte || detail?.instructions || ''
    };
}

function buildNapoleonContentFromDb(
    moduleDetails: NonNullable<Awaited<ReturnType<typeof obtenirDetailsModuleDepuisDB>>>,
    activitiesDetails: Array<DetailedActivity | null>
): ModuleContent {
    const lessons = activitiesDetails.filter((activity): activity is DetailedActivity => activity !== null && activity.type === 'LECON');
    const exercises = activitiesDetails.filter((activity): activity is DetailedActivity => activity !== null && activity.type !== 'LECON');

    const lesson1 = extractLesson(lessons[0]);
    const lesson2 = extractLesson(lessons[1]);
    const lesson3 = extractLesson(lessons[2]);
    const lesson4 = extractLesson(lessons[3]);
    const fallback = MODULES_ADVENTURES.napoleon;

    const orderExercise = exercises.find((exercise) => exercise.type === 'ORDER');
    const quizExercise = exercises.find((exercise) => exercise.type === 'QUIZ');

    const orderData = orderExercise && typeof orderExercise.contenu === 'object' ? orderExercise.contenu : fallback.exercice.data;
    const quizData = Array.isArray(quizExercise?.contenu) ? quizExercise.contenu : fallback.quiz;

    const step2Retenir = [
        getFirstSentence(lesson2.text),
        getFirstSentence(lesson3.text),
        getFirstSentence(lesson4.text)
    ].filter((item): item is string => Boolean(item));

    return {
        titreGlobal: moduleDetails.label,
        description: moduleDetails.description || fallback.description,
        themeColor: fallback.themeColor,
        step1: {
            titre: fallback.step1.titre,
            soustitre: lesson1.title || fallback.step1.soustitre,
            texte: lesson1.text || fallback.step1.texte,
            emoji: fallback.step1.emoji,
            aRetenir: lesson1.text || fallback.step1.aRetenir
        },
        step2: {
            soustitre: fallback.step2.soustitre,
            boxTitre: lesson2.title || fallback.step2.boxTitre,
            texte: lesson2.text || fallback.step2.texte,
            emoji: fallback.step2.emoji,
            aRetenir: step2Retenir.length > 0 ? step2Retenir : fallback.step2.aRetenir
        },
        step3: {
            soustitre: fallback.step3.soustitre,
            texte: [lesson3.text, lesson4.text].filter(Boolean).join(' ') || fallback.step3.texte,
            pointsCles: [
                lesson3.text ? getFirstSentence(lesson3.text) : '',
                lesson4.text ? getFirstSentence(lesson4.text) : '',
                "L'histoire demande de la précision, pas du mythe."
            ].filter((item): item is string => Boolean(item)),
            bulles: [
                lesson3.title || 'Contexte',
                lesson4.title || 'Limites',
                'Analyser avec méthode',
                'Comparer les faits'
            ],
            illustration: fallback.step3.illustration
        },
        exercice: {
            titre: orderExercise?.titre || fallback.exercice.titre,
            type: 'order',
            data: orderData as OrderExerciseData
        },
        quiz: quizData as Question[]
    };
}

type PageParams = Promise<{ id: string; actId: string }>;

export default function EnfantActivityPage({ params }: { params: PageParams }) {
    const { id, actId } = use(params);
    const router = useRouter();
    const [resolvedModuleId, setResolvedModuleId] = useState<string | null>(
        MODULES_ADVENTURES[id] ? id : null
    );

    // Détermination du module ID de l'aventure (sert à cibler le bon contenu statique)
    const isNapoleonModule = resolvedModuleId === 'napoleon';
    const activeModuleId = resolvedModuleId ?? 'lecture';
    const [napoleonContent, setNapoleonContent] = useState<ModuleContent>(MODULES_ADVENTURES.napoleon);
    const content = isNapoleonModule ? napoleonContent : (MODULES_ADVENTURES[activeModuleId] ?? MODULES_ADVENTURES.lecture);
    const isModuleResolutionPending = !MODULES_ADVENTURES[id] && resolvedModuleId === null;
    const [stepIndex, setStepIndex] = useState(() => (
        isNapoleonModule ? getNapoleonInitialStepIndex(actId) : 0
    )); // 0: Découvrir, 1: Observer, 2: Comprendre, 3: Exercice, 4: Quiz, 5: Résultat
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function resolveModuleFromDb() {
            if (MODULES_ADVENTURES[id]) {
                if (!cancelled) {
                    setResolvedModuleId(id);
                }
                return;
            }

            try {
                const moduleDetails = await obtenirDetailsModuleDepuisDB(id);
                if (cancelled) return;

                if (moduleDetails?.slug === 'napoleon' || moduleDetails?.label?.toLowerCase().includes('napoléon')) {
                    setResolvedModuleId('napoleon');
                } else if (moduleDetails?.slug && MODULES_ADVENTURES[moduleDetails.slug]) {
                    setResolvedModuleId(moduleDetails.slug);
                } else if (moduleDetails?.slug) {
                    setResolvedModuleId(moduleDetails.slug);
                } else {
                    setResolvedModuleId('lecture');
                }
            } catch {
                if (!cancelled) {
                    setResolvedModuleId('lecture');
                }
            }
        }

        resolveModuleFromDb();

        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(() => {
        let cancelled = false;

        async function loadNapoleonContent() {
            if (!isNapoleonModule) {
                return;
            }

            try {
                const moduleDetails = await obtenirDetailsModuleDepuisDB('napoleon');
                if (!moduleDetails || cancelled) {
                    return;
                }

                const activitiesDetails = await Promise.all(
                    moduleDetails.activites.map((activity) => obtenirDetailsActiviteDepuisDB(activity.id))
                );

                if (cancelled) {
                    return;
                }

                setNapoleonContent(buildNapoleonContentFromDb(moduleDetails, activitiesDetails));
                setStepIndex(getNapoleonInitialStepIndex(actId));
            } catch (error) {
                console.warn('[Napoleon] Utilisation du contenu de secours pendant le chargement DB.', error);
            }
        }

        loadNapoleonContent();

        return () => {
            cancelled = true;
        };
    }, [isNapoleonModule, id, actId]);

    const napoleonImages = {
        step1: '/images/enfants/napoleon/napoleon_lecon_1_qui_etait_napoleon.png',
        step2: '/images/enfants/napoleon/napoleon_lecon_2_napoleon_et_son_epoque.png',
        step3: '/images/enfants/napoleon/napoleon_lecon_3_comprendre_avec_methode.png',
        step4: '/images/enfants/napoleon/napoleon_lecon_4_les_limites_a_connaitre.png',
        exercice: '/images/enfants/napoleon/napoleon_exercice_remettre_dans_l_ordre.png',
        quiz: '/images/enfants/napoleon/napoleon_quiz_reviser_napoleon.png',
    } as const;

    const step1ImagePath = isNapoleonModule
        ? napoleonImages.step1
        : activeModuleId === 'robotique'
            ? '/images/enfants/quiz_robot.png'
            : `/images/enfants/${activeModuleId}_decouvrir.png`;
    const step2ImagePath = isNapoleonModule
        ? napoleonImages.step2
        : activeModuleId === 'robotique'
            ? '/images/enfants/robotic_arm.png'
            : `/images/enfants/${activeModuleId}_observer.png`;
    const step3NapoleonImages = isNapoleonModule ? [napoleonImages.step3, napoleonImages.step4] : [];
    const step4ImagePath = isNapoleonModule ? napoleonImages.exercice : '/images/enfants/exercice_generic.png';
    const quizImagePath = isNapoleonModule ? napoleonImages.quiz : '/images/enfants/quiz_robot.png';

    // États pour l'Exercice Interactif
    const [exerciceChecked, setExerciceChecked] = useState(false);
    const [exerciceSuccess, setExerciceSuccess] = useState(false);

    // --- États Exercice 'match' (Civique / Numérique) ---
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, string>>({});

    // --- États Exercice 'order' (Anglais / Robotique) ---
    const [orderedItemsState, setOrderedItemsState] = useState<string[] | null>(null);
    const orderedItems = content.exercice.type === 'order'
        ? (orderedItemsState ?? [...content.exercice.data.initialOrder])
        : [];

    // --- États Exercice 'input' (Lecture) ---
    const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

    // --- États Exercice 'sort' (Éco-citoyenneté) ---
    const [sortedItems, setSortedItems] = useState<Record<string, string>>({}); // itemId -> categoryId
    const [activeSortItemIndex, setActiveSortItemIndex] = useState(0);

    // États pour le Quiz
    const [quizIndex, setQuizIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);

    // Lancer des confettis lors du résultat final
    useEffect(() => {
        if (stepIndex === 5) {
            const showTimer = window.setTimeout(() => setShowConfetti(true), 0);
            const hideTimer = window.setTimeout(() => setShowConfetti(false), 5000);
            return () => {
                window.clearTimeout(showTimer);
                window.clearTimeout(hideTimer);
            };
        }
    }, [stepIndex]);

    if (isModuleResolutionPending) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-violet-900">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
                <p className="mt-4 text-violet-500">Chargement de ton aventure...</p>
            </div>
        );
    }

    // ─── LOGIQUE EXERCICE : MATCH ───
    const handleSelectLeft = (leftId: string) => {
        if (exerciceChecked) return;
        setSelectedLeft(leftId);
    };

    const handleSelectRight = (rightId: string) => {
        if (exerciceChecked || !selectedLeft) return;
        setMatches(prev => ({
            ...prev,
            [selectedLeft]: rightId
        }));
        setSelectedLeft(null);
    };

    const handleResetMatch = () => {
        setMatches({});
        setExerciceChecked(false);
        setExerciceSuccess(false);
        setSelectedLeft(null);
    };

    const verifyMatch = () => {
        const expected = (content.exercice.data as MatchExerciseData).pairs;
        const totalExpected = Object.keys(expected).length;
        let correctCount = 0;

        for (const [l, r] of Object.entries(expected)) {
            if (matches[l] === r) correctCount++;
        }

        setExerciceSuccess(correctCount === totalExpected);
        setExerciceChecked(true);
    };

    // ─── LOGIQUE EXERCICE : ORDER ───
    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (exerciceChecked) return;
        const newOrder = [...orderedItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newOrder.length) return;

        // Échange
        const temp = newOrder[index];
        newOrder[index] = newOrder[targetIndex];
        newOrder[targetIndex] = temp;
        setOrderedItemsState(newOrder);
    };

    const verifyOrder = () => {
        const expected = (content.exercice.data as OrderExerciseData).correctOrder;
        let isCorrect = true;
        for (let i = 0; i < expected.length; i++) {
            if (orderedItems[i] !== expected[i]) {
                isCorrect = false;
                break;
            }
        }
        setExerciceSuccess(isCorrect);
        setExerciceChecked(true);
    };

    const handleResetOrder = () => {
        setOrderedItemsState([...(content.exercice.data as OrderExerciseData).initialOrder]);
        setExerciceChecked(false);
        setExerciceSuccess(false);
    };

    // ─── LOGIQUE EXERCICE : INPUT ───
    const handleInputChange = (key: string, val: string) => {
        if (exerciceChecked) return;
        setInputAnswers(prev => ({
            ...prev,
            [key]: val
        }));
    };

    const verifyInput = () => {
        const questionsList = (content.exercice.data as InputExerciseData).questions;
        let allCorrect = true;

        for (const q of questionsList) {
            const userVal = (inputAnswers[q.key] || "").trim().toLowerCase();
            // Vérifier si la réponse de l'utilisateur contient un des mots acceptés
            const isMatch = q.correct.some((word: string) => userVal.includes(word.toLowerCase()));
            if (!isMatch) {
                allCorrect = false;
            }
        }

        setExerciceSuccess(allCorrect);
        setExerciceChecked(true);
    };

    const handleResetInput = () => {
        setInputAnswers({});
        setExerciceChecked(false);
        setExerciceSuccess(false);
    };

    // ─── LOGIQUE EXERCICE : SORT ───
    const handleSortItem = (categoryId: string) => {
        if (exerciceChecked) return;
        const items = (content.exercice.data as SortExerciseData).items;
        const currentItem = items[activeSortItemIndex];

        setSortedItems(prev => ({
            ...prev,
            [currentItem.id]: categoryId
        }));

        if (activeSortItemIndex < items.length - 1) {
            setActiveSortItemIndex(activeSortItemIndex + 1);
        } else {
            // Tous triés, on vérifie
            let allCorrect = true;
            const updatedSorted: Record<string, string> = {
                ...sortedItems,
                [currentItem.id as string]: categoryId
            };
            for (const item of items) {
                if (updatedSorted[item.id as string] !== item.category) {
                    allCorrect = false;
                }
            }
            setExerciceSuccess(allCorrect);
            setExerciceChecked(true);
        }
    };

    const handleResetSort = () => {
        setSortedItems({});
        setActiveSortItemIndex(0);
        setExerciceChecked(false);
        setExerciceSuccess(false);
    };

    // ─── LOGIQUE QUIZ ───
    const handleAnswerQuiz = (index: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);
        setShowExplanation(true);
        if (index === content.quiz[quizIndex].answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuiz = () => {
        setSelectedOption(null);
        setShowExplanation(false);
        if (quizIndex < content.quiz.length - 1) {
            setQuizIndex(quizIndex + 1);
        } else {
            // Fin de l'aventure
            setStepIndex(5);
        }
    };

    // Enregistrer en BDD ou LocalStorage
    const handleSaveAdventure = async () => {
        const finalScoreString = `${score}/${content.quiz.length}`;
        const isPerfect = score === content.quiz.length;

        const savedData = {
            completed: true,
            score: finalScoreString,
            parfait: isPerfect
        };

        // Sauvegarder pour l'enfant dans le localStorage
        localStorage.setItem(`rfc_enfant_act_${actId}`, JSON.stringify(savedData));

        const isMock = isNaN(Number(actId));
        if (!isMock) {
            try {
                await sauvegarderResultatActivite(actId, score);
            } catch (err) {
                console.error("Erreur de sauvegarde de l'activité sur la BDD:", err);
            }
        }

        router.push(`/enfant/modules/${id}`);
    };

    const steps = [
        { label: "Leçon 1/3", desc: "Découvrir" },
        { label: "Leçon 2/3", desc: "Observer" },
        { label: "Leçon 3/3", desc: "Comprendre" },
        { label: "Exercice", desc: "S'entraîner" },
        { label: "Quiz", desc: "Se tester" }
    ];

    // Trouver les métadonnées statiques du module actuel
    const staticModInfo = MODULES.find(m => m.id === id) || { from: "#6d5ba8", to: "#5b4a98" };

    return (
        <div className="text-violet-900 max-w-6xl mx-auto pb-12 px-4 relative">
            {/* Confettis Emojis */}
            {showConfetti && (
                <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
                    <div className="absolute text-5xl md:text-7xl animate-bounce tracking-widest bg-white/20 backdrop-blur-xs rounded-2xl p-4 shadow-xl">
                        🎉 🥳 🌟 💫 🎈 🏆
                    </div>
                </div>
            )}

            {/* ─── CARTE PRINCIPALE GÉANTE (CONTIENT TOUT LE MODULE) ─── */}
            <div className="bg-white border border-slate-100 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 flex flex-col justify-between min-h-[580px]">

                {/* 1. Header de la carte : Titre à gauche, Timeline à droite */}
                <div className="border-b border-slate-100 pb-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    {/* Module Info */}
                    <div className="flex items-center gap-3">
                        <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                            style={{ backgroundImage: `linear-gradient(135deg, ${staticModInfo.from}, ${staticModInfo.to})` }}
                        >
                            📚
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-800 leading-none">{content.titreGlobal}</h2>
                            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wide">{content.description}</p>
                        </div>
                    </div>

                    {/* Timeline horizontale intégrée dans le header de la carte */}
                    {stepIndex < 5 && (
                        <nav className="flex items-center gap-1 md:gap-3 text-[10px]">
                            {steps.map((st, i) => {
                                const isActive = stepIndex === i;
                                const isDone = stepIndex > i;
                                return (
                                    <React.Fragment key={i}>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black transition-all ${isActive
                                                    ? 'bg-violet-600 text-white ring-4 ring-violet-100 scale-105'
                                                    : isDone
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                {isDone ? <Check className="h-3 w-3" /> : i + 1}
                                            </span>
                                            <span className={`font-black hidden sm:inline ${isActive ? 'text-violet-900' : 'text-slate-400'}`}>
                                                {st.label}
                                            </span>
                                        </div>
                                        {i < steps.length - 1 && (
                                            <span className="text-slate-200 font-bold ml-1">─</span>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </nav>
                    )}
                </div>

                {/* 2. Corps de la carte : Changement en fonction du stepIndex */}
                <div className="flex-grow flex flex-col justify-center py-6">

                    {/* ── STEP 0 : LEÇON 1/3 (DÉCOUVRIR) ── */}
                    {stepIndex === 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Left Side Content */}
                            <div className="space-y-6 flex flex-col justify-between h-full">
                                <div className="space-y-4">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3.5 py-1 text-[10px] font-black text-violet-700 uppercase tracking-widest">
                                        Leçon 1/3
                                    </span>
                                    <h1 className="text-2xl md:text-3xl font-black text-violet-950 leading-tight">
                                        {content.step1.soustitre}
                                    </h1>
                                    <p className="text-sm md:text-base text-violet-850 leading-relaxed font-medium">
                                        {content.step1.texte}
                                    </p>
                                </div>

                                {/* Exemple Box (si spécifié, ex: aspirateur robot pour la robotique) */}
                                {content.step1.exempleText ? (
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between gap-4 mt-4">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-violet-700 uppercase tracking-widest block">Exemple</span>
                                            <p className="text-xs text-slate-700 font-bold leading-normal">{content.step1.exempleText}</p>
                                        </div>
                                        {content.step1.exempleImage && (
                                            <Image src={content.step1.exempleImage} alt="Exemple" width={56} height={56} className="h-14 w-14 object-contain rounded-lg shrink-0" />
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-amber-50 border border-amber-100/50 p-4 rounded-2xl flex items-start gap-3 mt-4">
                                        <Star className="h-5 w-5 text-amber-500 shrink-0 fill-amber-500" />
                                        <div>
                                            <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-wider">À retenir</h4>
                                            <p className="text-xs text-amber-800 font-bold mt-0.5">{content.step1.aRetenir}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side Illustration */}
                            <div className="bg-gradient-to-br from-violet-50/50 to-purple-50/50 border border-violet-100/50 rounded-3xl p-6 flex items-center justify-center shadow-inner min-h-[300px] max-h-[360px] overflow-hidden">
                                <Image
                                    src={step1ImagePath}
                                    alt={content.step1.soustitre}
                                    width={520}
                                    height={260}
                                    className="max-h-[260px] object-contain rounded-2xl hover:scale-102 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* ── STEP 1 : LEÇON 2/3 (OBSERVER) ── */}
                    {stepIndex === 1 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Left Side: Cahier ligné */}
                            <div className="bg-yellow-50/40 border border-yellow-100 rounded-3xl p-6 shadow-xs relative overflow-hidden min-h-[280px] flex flex-col justify-between">
                                <div className="absolute top-0 bottom-0 left-8 w-px bg-rose-200" />
                                <div className="pl-6 space-y-3 font-serif">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-0.5 text-[9px] font-black text-violet-700 uppercase tracking-widest font-sans">
                                        Leçon 2/3
                                    </span>
                                    <h3 className="text-lg font-bold text-violet-900 border-b border-yellow-200 pb-1">{content.step2.boxTitre}</h3>
                                    <p className="text-xs leading-6 text-slate-800 whitespace-pre-line font-medium">
                                        {content.step2.texte}
                                    </p>
                                </div>

                                {/* Ligne de diagramme horizontal spécifique pour le fonctionnement du robot */}
                                {activeModuleId === 'robotique' && (
                                    <div className="pl-6 mt-4 grid grid-cols-3 gap-2 border-t border-yellow-200/50 pt-4 text-center font-sans">
                                        <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col items-center">
                                            <span className="text-xl mb-1">👁️</span>
                                            <span className="text-[9px] font-black text-slate-800 leading-tight">1. Il reçoit une info</span>
                                        </div>
                                        <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col items-center">
                                            <span className="text-xl mb-1">💻</span>
                                            <span className="text-[9px] font-black text-slate-800 leading-tight">2. Il traite l&apos;info</span>
                                        </div>
                                        <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col items-center">
                                            <span className="text-xl mb-1">⚙️</span>
                                            <span className="text-[9px] font-black text-slate-800 leading-tight">3. Il agit</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Image + À retenir */}
                            <div className="flex flex-col gap-5 justify-between h-full">
                                <div className="bg-violet-50/40 border border-violet-100 rounded-3xl p-5 flex items-center justify-center shadow-inner min-h-[160px] max-h-[200px] overflow-hidden">
                                    <Image
                                        src={step2ImagePath}
                                        alt={content.step2.boxTitre}
                                        width={320}
                                        height={150}
                                        className="max-h-[150px] object-contain rounded-xl animate-pulse"
                                        style={{ animationDuration: '3s' }}
                                    />
                                </div>

                                <div className="bg-violet-50 border border-violet-100 p-5 rounded-2xl">
                                    <h4 className="text-[10px] font-black text-violet-800 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                        <Star className="h-4 w-4 fill-violet-400 text-violet-400" /> À retenir
                                    </h4>
                                    <ul className="space-y-1.5 text-xs text-violet-950 font-bold">
                                        {content.step2.aRetenir.map((a, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-violet-500 font-bold">•</span>
                                                <span>{a}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Badges ou Bullet list facultatifs */}
                                {content.step2.badges && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {content.step2.badges.map((b, idx) => (
                                            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-2.5 flex flex-col items-center justify-center text-center shadow-xs">
                                                <span className="text-2xl mb-1">{b.emoji}</span>
                                                <span className="text-[9px] font-black text-violet-900 leading-tight">{b.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2 : LEÇON 3/3 (COMPRENDRE) ── */}
                    {stepIndex === 2 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Left Side: Points Clés */}
                            <div className="space-y-6 flex flex-col justify-between h-full">
                                <div className="space-y-3">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3.5 py-1 text-[10px] font-black text-violet-700 uppercase tracking-widest">
                                        Leçon 3/3
                                    </span>
                                    <h2 className="text-xl md:text-2xl font-black text-violet-950 leading-tight">
                                        Comprendre
                                    </h2>
                                    <p className="text-xs text-violet-800 leading-relaxed font-bold">{content.step3.texte}</p>
                                </div>

                                <div className="bg-white border border-violet-100 rounded-2xl p-5 shadow-xs space-y-3">
                                    <h4 className="text-[10px] font-black text-violet-800 uppercase tracking-widest">Points clés :</h4>
                                    {content.step3.pointsCles.map((pt, idx) => (
                                        <div key={idx} className="flex gap-2.5 items-start">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                                <Check className="h-3 w-3" />
                                            </span>
                                            <p className="text-xs text-violet-950 font-bold leading-normal">{pt}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side: thought bubbles + image OR Robot labels diagram */}
                            <div className="space-y-4">
                                {activeModuleId === 'robotique' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-violet-50/20 border border-violet-100 rounded-3xl p-5 shadow-inner">
                                        <div className="flex justify-center">
                                            <Image
                                                src="/images/enfants/quiz_robot.png"
                                                alt="Robot parts"
                                                width={320}
                                                height={180}
                                                className="max-h-[180px] object-contain"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="bg-emerald-50 border-l-4 border-emerald-400 p-2 rounded-r-lg">
                                                <h5 className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Capteurs</h5>
                                                <p className="text-[8px] text-emerald-700 font-bold leading-tight">Ils perçoivent le monde.</p>
                                            </div>
                                            <div className="bg-orange-50 border-l-4 border-orange-400 p-2 rounded-r-lg">
                                                <h5 className="text-[9px] font-black text-orange-800 uppercase tracking-widest">Unité de contrôle</h5>
                                                <p className="text-[8px] text-orange-700 font-bold leading-tight">Elle réfléchit et prend des décisions.</p>
                                            </div>
                                            <div className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded-r-lg">
                                                <h5 className="text-[9px] font-black text-blue-800 uppercase tracking-widest">Actionneurs</h5>
                                                <p className="text-[8px] text-blue-700 font-bold leading-tight">Ils réalisent des actions.</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : activeModuleId === 'napoleon' ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {step3NapoleonImages.map((src, index) => (
                                                <div
                                                    key={src}
                                                    className="relative min-h-[150px] overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm"
                                                >
                                                    <Image
                                                        src={src}
                                                        alt={index === 0
                                                            ? 'Méthode pour analyser un personnage historique'
                                                            : 'Illustration des limites du pouvoir et des libertés'}
                                                        fill
                                                        className="object-contain p-3"
                                                        sizes="(min-width: 640px) 18vw, 100vw"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            {content.step3.bulles.map((b, idx) => (
                                                <div key={idx} className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-3 shadow-xs relative">
                                                    <span className="absolute -top-2 -left-2 text-xs">💬</span>
                                                    <p className="text-[10px] font-black text-violet-950 leading-relaxed">{b}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {content.step3.objectif && (
                                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 flex gap-2 items-center mt-3">
                                                <span className="text-xl">🎯</span>
                                                <p className="text-[10px] font-extrabold text-emerald-800 whitespace-pre-line leading-normal">{content.step3.objectif}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-2">
                                            {content.step3.bulles.map((b, idx) => (
                                                <div key={idx} className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-3 shadow-xs relative">
                                                    <span className="absolute -top-2 -left-2 text-xs">💬</span>
                                                    <p className="text-[10px] font-black text-violet-950 leading-relaxed">{b}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {content.step3.objectif && (
                                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 flex gap-2 items-center mt-3">
                                                <span className="text-xl">🎯</span>
                                                <p className="text-[10px] font-extrabold text-emerald-800 whitespace-pre-line leading-normal">{content.step3.objectif}</p>
                                            </div>
                                        )}

                                        <div className="text-center pt-2">
                                            <span className="text-5xl animate-pulse inline-block">{content.step3.illustration}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3 : EXERCICE GUIDÉ ── */}
                    {stepIndex === 3 && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Left Side Interaction */}
                            <div className="lg:col-span-8 space-y-4">
                                {/* Match Exercise */}
                                {content.exercice.type === 'match' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            {((content.exercice.data as MatchExerciseData).left).map((item: MatchItem) => {
                                                const isSelected = selectedLeft === item.id;
                                                const matchedRightId = matches[item.id];
                                                const matchedRight = (content.exercice.data as MatchExerciseData).right.find((r: MatchItem) => r.id === matchedRightId);

                                                return (
                                                    <button
                                                        key={item.id}
                                                        disabled={exerciceChecked}
                                                        onClick={() => handleSelectLeft(item.id)}
                                                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center justify-between font-bold text-xs ${isSelected
                                                                ? 'border-violet-600 bg-violet-50 text-violet-900 shadow-sm'
                                                                : matchedRightId
                                                                    ? 'border-emerald-200 bg-emerald-50/20 text-slate-800'
                                                                    : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        <span>{item.text}</span>
                                                        {matchedRight && (
                                                            <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded-md font-black shrink-0 ml-2">
                                                                Lié !
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="space-y-2">
                                            {((content.exercice.data as MatchExerciseData).right).map((item: MatchItem) => {
                                                const isMatchTarget = Object.values(matches).includes(item.id);
                                                return (
                                                    <button
                                                        key={item.id}
                                                        disabled={exerciceChecked || !selectedLeft}
                                                        onClick={() => handleSelectRight(item.id)}
                                                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all font-semibold text-xs ${isMatchTarget
                                                                ? 'border-emerald-300 bg-emerald-50/20 text-emerald-800 font-bold'
                                                                : selectedLeft
                                                                    ? 'border-violet-200 hover:border-violet-400 bg-violet-50/10 text-slate-700'
                                                                    : 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        {item.text}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Order Exercise */}
                                {content.exercice.type === 'order' && (
                                    <div className="space-y-2 max-w-xl">
                                        {orderedItems.map((item: string, idx: number) => (
                                            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between gap-3 text-xs font-bold">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-black text-[10px]">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-slate-800">{item}</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        disabled={exerciceChecked || idx === 0}
                                                        onClick={() => moveItem(idx, 'up')}
                                                        className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30"
                                                    >
                                                        <MoveUp className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        disabled={exerciceChecked || idx === orderedItems.length - 1}
                                                        onClick={() => moveItem(idx, 'down')}
                                                        className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30"
                                                    >
                                                        <MoveDown className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Input Exercise */}
                                {content.exercice.type === 'input' && (
                                    <div className="space-y-4 max-w-xl">
                                        {(content.exercice.data as InputExerciseData).questions.map((q: InputQuestion, idx: number) => (
                                            <div key={idx} className="space-y-1">
                                                <label className="block text-xs font-black text-violet-900">{q.label}</label>
                                                <input
                                                    type="text"
                                                    disabled={exerciceChecked}
                                                    placeholder={q.placeholder}
                                                    value={inputAnswers[q.key] || ""}
                                                    onChange={(e) => handleInputChange(q.key, e.target.value)}
                                                    className="w-full border border-violet-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-violet-500 outline-hidden font-bold"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Sort Exercise */}
                                {content.exercice.type === 'sort' && (
                                    <div className="max-w-xl">
                                        {activeSortItemIndex < content.exercice.data.items.length && !exerciceChecked ? (
                                            <div className="text-center space-y-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl mb-4">
                                                    <p className="text-base font-black text-violet-950">
                                                    &quot;{(content.exercice.data as SortExerciseData).items[activeSortItemIndex].text}&quot;
                                                </p>
                                                <div className="flex justify-center gap-3">
                                                    {((content.exercice.data as SortExerciseData).categories).map((cat: SortCategory) => (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => handleSortItem(cat.id)}
                                                            className={`px-4 py-2.5 rounded-xl border-2 font-black text-xs hover:scale-102 transition-all ${cat.bg}`}
                                                        >
                                                            {cat.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-4 text-xs font-bold text-violet-900">
                                                Tous les gestes ont été classés. Clique sur Vérifier !
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-3 text-left">
                                            {((content.exercice.data as SortExerciseData).categories).map((cat: SortCategory) => (
                                                <div key={cat.id} className={`rounded-xl border p-3 ${cat.bg}`}>
                                                    <h5 className="font-black text-[10px] mb-2">{cat.title}</h5>
                                                    <ul className="space-y-1 text-[10px] font-bold">
                                                        {((content.exercice.data as SortExerciseData).items).map((item: SortItem) => {
                                                            if (sortedItems[item.id] !== cat.id) return null;
                                                            return (
                                                                <li key={item.id} className="bg-white/80 px-2 py-1 rounded-lg border border-slate-100">
                                                                    • {item.text}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* RÉSULTAT EXERCICE */}
                                {exerciceChecked && (
                                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${exerciceSuccess
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                            : 'bg-rose-50 border-rose-200 text-rose-800'
                                        }`}>
                                        {exerciceSuccess ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                                        )}
                                        <div>
                                            <h4 className="text-xs font-black uppercase">
                                                {exerciceSuccess ? "C'est parfait !" : "Quelques erreurs !"}
                                            </h4>
                                            <p className="text-[10px] font-semibold mt-0.5">
                                                {exerciceSuccess
                                                    ? "Tu as réussi l'exercice guidé. Tu es prêt pour l'étape du quiz !"
                                                    : "Recommence pour trouver la bonne solution."}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side Decoration */}
                            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-violet-50/20 border border-violet-100 rounded-3xl p-6 shadow-inner max-h-[300px] overflow-hidden">
                                {activeModuleId === 'robotique' ? (
                                    <div className="flex flex-col items-center text-center">
                                        <Image
                                            src="/images/enfants/exercice_generic.png"
                                            alt="Activité robotique"
                                            width={320}
                                            height={160}
                                            className="max-h-[160px] object-contain rounded-2xl"
                                        />
                                        <div className="mt-4 bg-white border border-violet-100 px-3 py-1.5 rounded-2xl text-[10px] font-black text-violet-700 shadow-xs">
                                            Quel est le bon ordre ? 🤔
                                        </div>
                                    </div>
                                ) : activeModuleId === 'napoleon' ? (
                                    <Image
                                        src={step4ImagePath}
                                        alt="Exercice de chronologie sur Napoléon"
                                        width={360}
                                        height={180}
                                        className="max-h-[180px] object-contain rounded-2xl hover:scale-102 transition-transform duration-300"
                                    />
                                ) : (
                                    <Image
                                        src="/images/enfants/exercice_generic.png"
                                        alt="Activité"
                                        width={360}
                                        height={180}
                                        className="max-h-[180px] object-contain rounded-2xl hover:scale-102 transition-transform duration-300"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 4 : QUIZ (10 QUESTIONS) ── */}
                    {stepIndex === 4 && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
                            {/* Left Side: Questions */}
                            <div className="lg:col-span-8 space-y-4">
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                                    <div
                                        className="bg-violet-600 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${((quizIndex + 1) / content.quiz.length) * 100}%` }}
                                    />
                                </div>

                                <div className="p-5 bg-violet-50/50 rounded-2xl border border-violet-100/50">
                                    <h2 className="text-xs font-black text-violet-500 uppercase tracking-widest mb-1.5">Question {quizIndex + 1} sur {content.quiz.length}</h2>
                                    <h3 className="text-sm md:text-base font-black text-violet-950 leading-snug">
                                        {content.quiz[quizIndex].q}
                                    </h3>
                                </div>

                                <div className="grid gap-2">
                                    {content.quiz[quizIndex].options.map((option, idx) => {
                                        const isCorrectAnswer = idx === content.quiz[quizIndex].answer;
                                        const isSelected = selectedOption === idx;

                                        let optionStyle = 'border-slate-200 hover:border-violet-400 hover:bg-violet-50/20';
                                        if (selectedOption !== null) {
                                            if (isCorrectAnswer) {
                                                optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                                            } else if (isSelected) {
                                                optionStyle = 'border-rose-500 bg-rose-50 text-rose-800';
                                            } else {
                                                optionStyle = 'border-slate-100 bg-slate-50 opacity-40';
                                            }
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                disabled={selectedOption !== null}
                                                onClick={() => handleAnswerQuiz(idx)}
                                                className={`w-full text-left rounded-xl border p-3.5 text-xs font-bold transition-all flex items-center justify-between ${optionStyle}`}
                                            >
                                                <span>{option}</span>
                                                {selectedOption !== null && isCorrectAnswer && (
                                                    <Check className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {showExplanation && (
                                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2.5">
                                        <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-[10px] font-black text-amber-900">
                                                {selectedOption === content.quiz[quizIndex].answer ? "Bien joué ! 🌟" : "Presque ! 😉"}
                                            </div>
                                            <p className="text-xs text-amber-800 font-semibold mt-0.5 leading-relaxed">
                                                {content.quiz[quizIndex].explication}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Robot helper */}
                            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-violet-50/30 border border-violet-100 rounded-3xl p-6 shadow-inner max-h-[300px]">
                                <Image
                                    src={quizImagePath}
                                    alt={activeModuleId === 'napoleon' ? 'Quiz de révision sur Napoléon' : 'Robot assistant'}
                                    width={320}
                                    height={160}
                                    className="max-h-[160px] object-contain animate-bounce"
                                    style={{ animationDuration: '3s' }}
                                />
                                <span className="text-[9px] font-black text-violet-500 mt-3 uppercase tracking-widest bg-white border border-violet-100 px-3 py-1 rounded-full shadow-xs">
                                    Aide Robot 🤖
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 5 : RESULTAT FINAL / BADGE ── */}
                    {stepIndex === 5 && (
                        <div className="text-center max-w-xl mx-auto space-y-6">
                            <div className="flex justify-center">
                                <Image
                                    src="/images/enfants/result_robot.png"
                                    alt="Félicitations !"
                                    width={360}
                                    height={180}
                                    className="max-h-[180px] object-contain animate-bounce"
                                    style={{ animationDuration: '4s' }}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <h2 className="text-2xl md:text-3xl font-black text-violet-950">
                                    {score >= 8 ? "Well done ! Félicitations !" : "Quiz Terminé !"}
                                </h2>
                                <p className="text-xs font-black text-violet-600 uppercase tracking-widest">
                                    Tu as réussi ton aventure {content.titreGlobal} !
                                </p>
                            </div>

                            <div className="bg-slate-50/60 rounded-2xl border border-slate-100 p-5 max-w-sm mx-auto shadow-xs">
                                <span className="block text-[9px] font-black uppercase text-slate-400 tracking-widest">Ton score final</span>
                                <span className="text-3xl md:text-4xl font-black text-emerald-600">
                                    {score} <span className="text-lg text-slate-400">/ {content.quiz.length}</span>
                                </span>
                                <p className="text-[11px] font-bold text-violet-950 mt-2">
                                    {score === 10 && "Excellent ! Un score parfait de champion ! 🌟"}
                                    {score >= 8 && score < 10 && "Super travail ! Tu as très bien compris ! 👏"}
                                    {score >= 5 && score < 8 && "Pas mal ! Revois la leçon pour faire encore mieux ! 👍"}
                                    {score < 5 && "Recommence l&apos;aventure pour améliorer ton score. Courage ! 💪"}
                                </p>
                            </div>

                            {/* Étoiles d'évaluation */}
                            <div className="flex justify-center gap-1">
                                {[1, 2, 3, 4, 5].map((starIdx) => {
                                    const starThreshold = starIdx * 2;
                                    const isGold = score >= starThreshold;
                                    return (
                                        <Star
                                            key={starIdx}
                                            className={`h-6 w-6 ${isGold ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'
                                                }`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Pied de la carte (Footer) : Navigation interne sous les colonnes */}
                <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                    {/* Bouton Retour (interne au wizard) */}
                    {stepIndex > 0 && stepIndex < 5 ? (
                        <button
                            onClick={() => {
                                if (stepIndex === 4 && quizIndex > 0) {
                                    setQuizIndex(quizIndex - 1);
                                    setSelectedOption(null);
                                    setShowExplanation(false);
                                } else {
                                    setStepIndex(stepIndex - 1);
                                }
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 shadow-xs transition-all"
                        >
                            ← Retour
                        </button>
                    ) : (
                        <Link
                            href={`/enfant/modules/${id}`}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 shadow-xs transition-all"
                        >
                            ← Quitter
                        </Link>
                    )}

                    {/* Pagination Dots (uniquement pour les leçons 1/3, 2/3, 3/3) */}
                    {stepIndex < 3 && (
                        <div className="flex gap-2">
                            {[0, 1, 2].map((dotIdx) => (
                                <button
                                    key={dotIdx}
                                    onClick={() => setStepIndex(dotIdx)}
                                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${stepIndex === dotIdx ? 'bg-violet-600 w-6' : 'bg-slate-200'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Bouton Suivant ou Sauvegarder */}
                    {stepIndex < 3 ? (
                        <button
                            onClick={() => setStepIndex(stepIndex + 1)}
                            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-black text-white hover:bg-violet-700 shadow-md transition-all"
                        >
                            {stepIndex === 2 ? "Passer à l'exercice" : "Suivant"} →
                        </button>
                    ) : stepIndex === 3 ? (
                        <div className="flex gap-2">
                            {exerciceChecked && !exerciceSuccess && (
                                <button
                                    onClick={() => {
                                        if (content.exercice.type === 'match') handleResetMatch();
                                        else if (content.exercice.type === 'order') handleResetOrder();
                                        else if (content.exercice.type === 'input') handleResetInput();
                                        else if (content.exercice.type === 'sort') handleResetSort();
                                    }}
                                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" /> Recommencer
                                </button>
                            )}

                            {!exerciceChecked ? (
                                <button
                                    onClick={() => {
                                        if (content.exercice.type === 'match') verifyMatch();
                                        else if (content.exercice.type === 'order') verifyOrder();
                                        else if (content.exercice.type === 'input') verifyInput();
                                        else if (content.exercice.type === 'sort') verifyInput(); // triggers check
                                    }}
                                    className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-black text-white hover:bg-emerald-700 shadow-md"
                                >
                                    Vérifier
                                </button>
                            ) : (
                                <button
                                    disabled={!exerciceSuccess}
                                    onClick={() => setStepIndex(4)}
                                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-black text-white hover:bg-violet-700 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Passer au Quiz →
                                </button>
                            )}
                        </div>
                    ) : stepIndex === 4 ? (
                        <button
                            disabled={selectedOption === null}
                            onClick={handleNextQuiz}
                            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-black text-white hover:bg-violet-700 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            {quizIndex < content.quiz.length - 1 ? "Suivant" : "Terminer"} →
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setStepIndex(0);
                                    setScore(0);
                                    setQuizIndex(0);
                                    setSelectedOption(null);
                                    setShowExplanation(false);
                                    setExerciceChecked(false);
                                    setExerciceSuccess(false);
                                }}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <RotateCcw className="h-4 w-4 inline-block mr-1" /> Recommencer
                            </button>
                                <button
                                    onClick={handleSaveAdventure}
                                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-xs font-black text-white hover:from-emerald-600 hover:to-green-700 shadow-md transition-all"
                                >
                                Continuer l&apos;aventure →
                                </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── TIMELINE DE NAVIGATION HORIZONTALE COMPLÈTE EN BAS (HORS DE LA CARTE) ─── */}
            <div className="mt-8 border border-slate-100 bg-white rounded-2xl p-4 flex flex-wrap items-center justify-center gap-2 md:gap-4 shadow-sm max-w-4xl mx-auto text-xs font-bold text-slate-400">
                {/* Module title with robot/theme icon */}
                <div className="flex items-center gap-2 text-slate-800 font-black">
                    <span className="text-base">🤖</span>
                    <span>{content.titreGlobal}</span>
                    <span className="text-slate-300 ml-1 font-normal">&gt;</span>
                </div>

                {/* Steps List */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[11px]">
                    {[
                        { idx: 0, label: "Leçon 1/3", icon: "📖" },
                        { idx: 1, label: "Leçon 2/3", icon: "🔍" },
                        { idx: 2, label: "Leçon 3/3", icon: "💡" },
                        { idx: 3, label: "Exercice", icon: "🎮" },
                        { idx: 4, label: "Quiz", icon: "🎯" },
                        { idx: 5, label: "Résultat", icon: "🏆" }
                    ].map((step, sIdx) => {
                        const isActive = stepIndex === step.idx;
                        const isCompleted = stepIndex > step.idx;

                        return (
                            <React.Fragment key={step.idx}>
                                {sIdx > 0 && <span className="text-slate-300">→</span>}
                                <div
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${isActive
                                            ? 'text-indigo-600 bg-indigo-50 font-black scale-105'
                                            : isCompleted
                                                ? 'text-slate-700 font-bold'
                                                : 'text-slate-350 opacity-60'
                                        }`}
                                >
                                    <span>{step.icon}</span>
                                    <span>{step.label}</span>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
