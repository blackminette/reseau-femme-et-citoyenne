import { obtenirDetailsActiviteDepuisDB, obtenirDetailsModuleDepuisDB } from '../../../actions';

// Types
export type Question = {
    q: string;
    options: string[];
    answer: number;
    explication: string;
};

export type MatchItem = {
    id: string;
    text: string;
};

export type MatchExerciseData = {
    left: MatchItem[];
    right: MatchItem[];
    pairs: Record<string, string>;
};

export type OrderExerciseData = {
    initialOrder: string[];
    correctOrder: string[];
};

export type InputQuestion = {
    label: string;
    placeholder: string;
    key: string;
    correct: string[];
};

export type InputExerciseData = {
    questions: InputQuestion[];
};

export interface PageCours {
    numeroPage: number;
    titre: string;
    texteExplicatif: string;
    imageUrl: string | null;
}

export interface PageExercice {
    id: string | number;
    numeroPage: number;
    question: string;
    options: string[];
    reponseCorrecte: string;
}

export type SortItem = {
    id: string;
    text: string;
    category: string;
};

export type SortCategory = {
    id: string;
    title: string;
    bg: string;
};

export type SortExerciseData = {
    items: SortItem[];
    categories: SortCategory[];
};

export type ExerciseContent =
    | { type: 'match'; data: MatchExerciseData }
    | { type: 'order'; data: OrderExerciseData }
    | { type: 'input'; data: InputExerciseData }
    | { type: 'sort'; data: SortExerciseData };

export type ModuleContent = {
    titreGlobal: string;
    description: string;
    themeColor: string;
    step1: {
        titre: string;
        soustitre: string;
        texte: string;
        emoji: string;
        aRetenir: string;
        imageUrl?: string | null;
        numeroPage?: number;
        exempleText?: string;
        exempleImage?: string;
    };
    step2: {
        soustitre: string;
        boxTitre: string;
        texte: string;
        emoji: string;
        aRetenir: string[];
        imageUrl?: string | null;
        numeroPage?: number;
        badges?: { label: string; emoji: string }[];
        bulletList?: string[];
    };
    step3: {
        soustitre: string;
        texte: string;
        pointsCles: string[];
        bulles: string[];
        illustration: string;
        imageUrl?: string | null;
        numeroPage?: number;
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
export const MODULES_ADVENTURES: Record<string, ModuleContent> = {
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

export type DetailedActivity = NonNullable<Awaited<ReturnType<typeof obtenirDetailsActiviteDepuisDB>>>;

export function getFirstSentence(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return '';
    const match = trimmed.match(/^[^.?!]+[.?!]?/);
    return (match?.[0] || trimmed).trim();
}

export function getNapoleonInitialStepIndex(actId: string) {
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

export function extractLesson(detail: DetailedActivity | null | undefined) {
    const fallbackTitle = detail?.titre || '';
    const rawContent = detail && Array.isArray(detail.contenu) ? detail.contenu : [];
    const first = rawContent[0] as {
        titre?: string;
        texte?: string;
        texteExplicatif?: string;
        imageUrl?: string | null;
        numeroPage?: number;
    } | undefined;

    return {
        title: first?.titre || fallbackTitle,
        text: first?.texteExplicatif || first?.texte || detail?.instructions || '',
        imageUrl: first?.imageUrl ?? null,
        numeroPage: first?.numeroPage
    };
}

function normalizeQuizContent(rawContent: unknown, fallback: Question[]): Question[] {
    if (!Array.isArray(rawContent) || rawContent.length === 0) {
        return fallback;
    }

    return rawContent.map((item, index) => {
        const fallbackQuestion = fallback[index] ?? fallback[0];
        const page = item as {
            q?: string;
            question?: string;
            options?: string[];
            answer?: number;
            explication?: string;
            reponseCorrecte?: string;
        };
        const options = Array.isArray(page.options) && page.options.length > 0 ? page.options.map(String) : fallbackQuestion.options;
        const question = page.q || page.question || fallbackQuestion.q;
        const explanation = page.explication || fallbackQuestion.explication || '';
        let answer = typeof page.answer === 'number' ? page.answer : -1;

        if (answer < 0 && typeof page.reponseCorrecte === 'string') {
            const normalizedCorrect = page.reponseCorrecte.trim().toLowerCase();
            const matchIndex = options.findIndex((option) => option.trim().toLowerCase() === normalizedCorrect);
            if (matchIndex >= 0) {
                answer = matchIndex;
            }
        }

        if (answer < 0) {
            answer = fallbackQuestion.answer;
        }

        return {
            q: question,
            options,
            answer,
            explication: explanation || (typeof page.reponseCorrecte === 'string' && page.reponseCorrecte.trim()
                ? `Réponse correcte : ${page.reponseCorrecte.trim()}`
                : fallbackQuestion.explication)
        };
    });
}

export function buildNapoleonContentFromDb(
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
            aRetenir: lesson1.text || fallback.step1.aRetenir,
            imageUrl: lesson1.imageUrl ?? null,
            numeroPage: lesson1.numeroPage
        },
        step2: {
            soustitre: fallback.step2.soustitre,
            boxTitre: lesson2.title || fallback.step2.boxTitre,
            texte: lesson2.text || fallback.step2.texte,
            emoji: fallback.step2.emoji,
            aRetenir: step2Retenir.length > 0 ? step2Retenir : fallback.step2.aRetenir,
            imageUrl: lesson2.imageUrl ?? null,
            numeroPage: lesson2.numeroPage
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
            illustration: fallback.step3.illustration,
            imageUrl: lesson3.imageUrl ?? null,
            numeroPage: lesson3.numeroPage
        },
        exercice: {
            titre: orderExercise?.titre || fallback.exercice.titre,
            type: 'order',
            data: orderData as OrderExerciseData
        },
        quiz: normalizeQuizContent(quizData, fallback.quiz)
    };
}
