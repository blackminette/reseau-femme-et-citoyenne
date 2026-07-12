'use strict';
// ============================================================
//  milo-kb.js — Bibliothèque de réponses préfabriquées de Milo
//  Réponses instantanées aux questions récurrentes, sans appel
//  à l'API Gemini (économie de tokens/quota).
// ============================================================

// ── Bibliothèque de réponses préfabriquées de Milo ───────────
// Réponses toutes faites pour les questions récurrentes → servies
// instantanément sans appel à l'API Gemini (économie de tokens/quota).
// Chaque entrée expose des concepts SANS jamais donner la réponse exacte
// du quiz : on explique une notion, l'enfant choisit ensuite lui-même.
//
// Les entrées ciblées par `module` s'appliquent AUSSI BIEN aux quiz qu'aux
// exercices de ce module (les deux passent ?m=<module> dans l'URL).
//
// Idempotent : n'insère que les entrées dont le `label` est absent, pour
// qu'un simple redémarrage applique les nouveautés sans créer de doublon.
const MILO_KB = [
  // ═══════════ LECTURE ═══════════
  {
    module: 'lecture', label: 'Définition : synonyme',
    keywords: "c'est quoi un synonyme|ca veut dire quoi synonyme|synonyme ca veut dire|definition synonyme|un synonyme c'est quoi|comprends pas synonyme|synonyme ca veut dire quoi",
    answer: "Un **synonyme**, c'est un mot qui veut dire **presque la même chose** qu'un autre 😊\n\nPar exemple : *content* et *joyeux* sont des synonymes, ils veulent dire pareil !\n\nDu coup, cherche le mot dans la liste qui veut dire la même chose que celui de la question. Tu y arrives ? 💪",
  },
  {
    module: 'lecture', label: 'Définition : antonyme / contraire',
    keywords: "c'est quoi un antonyme|antonyme ca veut dire|definition antonyme|c'est quoi un contraire|le contraire ca veut dire|contraire ca veut dire quoi",
    answer: "Un **antonyme**, c'est le **contraire** d'un mot 🔄\n\nPar exemple : le contraire de *grand*, c'est *petit*. Le contraire de *chaud*, c'est *froid*.\n\nAlors cherche dans la liste le mot qui veut dire le **contraire** de celui de la question 😉",
  },
  {
    module: 'lecture', label: 'Méthode : comprendre un texte',
    keywords: "j'ai pas compris l'histoire|je comprends pas l'histoire|j'ai rien compris au texte|comprends pas le texte|comment comprendre un texte|j'ai pas compris le texte",
    answer: "Pas de panique ! 📖 Pour bien comprendre un texte :\n\n1. Relis **doucement**, phrase par phrase\n2. Demande-toi : **qui** ? **où** ? **quoi** ?\n3. Repère les mots importants\n\nEt souviens-toi : la réponse est **toujours cachée dans le texte**. Relis le passage qui parle de la question 🔍",
  },
  {
    module: 'lecture', label: 'Définition : personnage',
    keywords: "c'est quoi un personnage|personnage ca veut dire|un personnage c'est quoi",
    answer: "Un **personnage**, c'est quelqu'un (ou un animal) qui **agit dans l'histoire** 🧍\n\nDans un texte, ce sont ceux qui parlent, bougent, ou à qui il arrive des choses. Relis pour repérer qui fait quoi !",
  },

  // ═══════════ NUMÉRIQUE ═══════════
  {
    module: 'numerique', label: 'Définition : URL',
    keywords: "c'est quoi une url|url ca veut dire|que veut dire url|definition url|c'est quoi l'url",
    answer: "Une **URL**, c'est l'**adresse d'un site internet** 🌐\n\nComme *www.google.com* : c'est ce qu'on écrit en haut du navigateur pour aller sur un site. Un peu comme l'adresse d'une maison, mais sur internet ! 🏠",
  },
  {
    module: 'numerique', label: 'Définition : RAM / mémoire vive',
    keywords: "c'est quoi la ram|memoire vive|c'est quoi la memoire vive|ram ca veut dire|c'est quoi la memoire de l'ordi",
    answer: "La **RAM** (mémoire vive), c'est la mémoire que l'ordinateur utilise **pendant qu'il travaille** ⚡\n\nElle est très rapide, mais attention : quand on **éteint** l'ordinateur, tout ce qu'elle contient **s'efface** ! C'est comme un brouillon qu'on jette à la fin.",
  },
  {
    module: 'numerique', label: 'Définition : navigateur',
    keywords: "c'est quoi un navigateur|navigateur ca veut dire|a quoi sert un navigateur|c'est quoi un navigateur web",
    answer: "Un **navigateur**, c'est le logiciel qui te sert à **visiter des sites internet** 🧭\n\nChrome, Firefox, Edge… ce sont des navigateurs. C'est ta petite voiture pour te promener sur le web ! 🚗",
  },
  {
    module: 'numerique', label: 'Définition : mot de passe',
    keywords: "c'est quoi un mot de passe|mot de passe ca veut dire|un bon mot de passe|comment faire un mot de passe",
    answer: "Un **mot de passe**, c'est un **code secret** qui protège ton compte 🔐\n\nUn bon mot de passe mélange des **lettres, des chiffres et des symboles** (ex: *Cha7@ton!*). Et surtout : on ne le donne **jamais** à personne !",
  },
  {
    module: 'numerique', label: 'Définition : Wi-Fi',
    keywords: "c'est quoi le wifi|wifi ca veut dire|c'est quoi le wi-fi|wi-fi ca veut dire",
    answer: "Le **Wi-Fi**, c'est l'**internet sans fil** 📶\n\nÇa permet à ton ordi, ta tablette ou ton téléphone de se connecter à internet **sans câble**, grâce à des ondes invisibles dans l'air !",
  },
  {
    module: 'numerique', label: 'Définition : processeur / CPU',
    keywords: "c'est quoi le processeur|c'est quoi le cpu|processeur ca sert a quoi|le cpu ca sert a quoi|role du processeur",
    answer: "Le **processeur** (CPU), c'est le **cerveau** de l'ordinateur 🧠\n\nC'est lui qui fait tous les **calculs** et prend les décisions, très très vite. Sans lui, l'ordinateur ne pourrait rien faire !",
  },
  {
    module: 'numerique', label: 'Définition : disque dur',
    keywords: "c'est quoi le disque dur|disque dur ca sert a quoi|a quoi sert le disque dur|role du disque dur",
    answer: "Le **disque dur**, c'est là où l'ordinateur **range tes fichiers** 💾\n\nTes photos, tes vidéos, tes documents… ils y restent même quand tu éteins l'ordi. C'est comme une grande armoire de rangement !",
  },

  // ═══════════ ROBOTIQUE ═══════════
  {
    module: 'robotique', label: 'Définition : boucle',
    keywords: "c'est quoi une boucle|une boucle ca veut dire|definition boucle|a quoi sert une boucle|boucle ca veut dire",
    answer: "Une **boucle**, c'est quand on demande à un robot de **répéter** une action plusieurs fois 🔁\n\nAu lieu d'écrire 10 fois « avance », on dit juste : « répète 10 fois : avance ». C'est plus malin et plus rapide !",
  },
  {
    module: 'robotique', label: 'Définition : robot',
    keywords: "c'est quoi un robot|un robot c'est quoi|robot ca veut dire|definition robot",
    answer: "Un **robot**, c'est une **machine programmée** pour faire des actions 🤖\n\nOn lui donne des instructions, et il les exécute — parfois même tout seul ! Un aspirateur robot, un bras dans une usine… ce sont des robots.",
  },
  {
    module: 'robotique', label: 'Définition : capteur',
    keywords: "c'est quoi un capteur|capteur ca sert a quoi|a quoi sert un capteur|capteur ca veut dire|role du capteur",
    answer: "Un **capteur**, c'est ce qui permet au robot de **ressentir** le monde 👁️\n\nComme tes yeux, tes oreilles ou ta peau ! Il y a des capteurs de lumière, de distance, de son… Ils envoient des infos au « cerveau » du robot.",
  },
  {
    module: 'robotique', label: 'Définition : actionneur',
    keywords: "c'est quoi un actionneur|actionneur ca veut dire|a quoi sert un actionneur",
    answer: "Un **actionneur**, c'est ce qui permet au robot d'**agir et de bouger** 💪\n\nUn moteur qui fait tourner une roue, une lumière qui s'allume, un haut-parleur… Si le capteur c'est les sens, l'actionneur c'est les muscles !",
  },
  {
    module: 'robotique', label: 'Définition : programmer',
    keywords: "c'est quoi programmer|programmer ca veut dire|programmer un robot|c'est quoi la programmation",
    answer: "**Programmer**, c'est **donner des instructions** à une machine pour qu'elle fasse ce qu'on veut ⚙️\n\nC'est comme écrire une **recette de cuisine** : des étapes claires, dans le bon ordre. Le robot suit la recette à la lettre !",
  },
  {
    module: 'robotique', label: 'Définition : intelligence artificielle (IA)',
    keywords: "c'est quoi l'ia|intelligence artificielle|ia ca veut dire|c'est quoi l'intelligence artificielle",
    answer: "L'**IA** (Intelligence Artificielle), c'est quand une machine arrive à **apprendre et décider** un peu toute seule 🧠\n\nComme moi, Milo ! Mais attention : une IA **imite** l'intelligence, elle ne ressent pas de vraies émotions comme toi 😊",
  },

  // ═══════════ ANGLAIS ═══════════
  {
    module: 'anglais', label: 'Méthode : traduire un mot anglais',
    keywords: "je comprends pas l'anglais|j'ai pas compris l'anglais|je sais pas traduire|comment traduire|je comprends pas le mot anglais",
    answer: "Pas grave ! 🇬🇧 Une astuce : beaucoup de mots anglais **ressemblent** au français.\n\nEt parfois tu connais le mot sans le savoir (dans des jeux, des chansons…). Lis bien chaque réponse à voix basse, celle qui « sonne » juste est souvent la bonne. Essaie ! 💫",
  },

  // ═══════════ ÉDUCATION CIVIQUE ═══════════
  {
    module: 'civique', label: 'Définition : République',
    keywords: "c'est quoi une republique|republique ca veut dire|c'est quoi la republique|definition republique",
    answer: "Une **République**, c'est un pays où **le peuple a le pouvoir** grâce au vote 🗳️\n\nPersonne n'est roi, personne n'est au-dessus des lois, et tout le monde a les **mêmes droits**. La France est une République !",
  },
  {
    module: 'civique', label: 'Définition : laïcité',
    keywords: "c'est quoi la laicite|laicite ca veut dire|definition laicite|c'est quoi la laïcité",
    answer: "La **laïcité**, c'est la **liberté de croire ou de ne pas croire** 🕊️\n\nÀ l'école, tout le monde est traité pareil, peu importe sa religion. C'est comme une cour de récré : chacun est le bienvenu, du moment qu'on se respecte ❤️",
  },
  {
    module: 'civique', label: 'Différence : droit et devoir',
    keywords: "c'est quoi un droit|c'est quoi un devoir|difference droit devoir|droits et devoirs|droit et devoir ca veut dire",
    answer: "Un **droit**, c'est ce que tu **peux** avoir ou faire (aller à l'école, être protégé…) ✅\n\nUn **devoir**, c'est ce que tu **dois** faire pour bien vivre avec les autres (respecter, écouter…) 🤝\n\nAstuce : *droit = pour toi*, *devoir = envers les autres* !",
  },
  {
    module: 'civique', label: 'Définition : devise',
    keywords: "c'est quoi une devise|devise ca veut dire|c'est quoi la devise",
    answer: "Une **devise**, c'est une **petite phrase qui représente les valeurs** d'un pays 📜\n\nC'est comme un slogan important. Réfléchis aux 3 grands mots que tu vois partout en France (sur les mairies, les écoles…) 🇫🇷",
  },

  // ═══════════ ÉCO-CITOYENNETÉ ═══════════
  {
    module: 'eco', label: 'Définition : recyclage / tri',
    keywords: "c'est quoi le recyclage|recycler ca veut dire|comment trier|c'est quoi le tri|trier ca veut dire|recyclage ca veut dire",
    answer: "**Recycler**, c'est **transformer un déchet en nouvel objet** au lieu de le jeter ♻️\n\nOn trie : papier et plastique dans le **bac jaune**, verre dans le **bac à verre**, épluchures au **compost**. Pense à la matière de l'objet pour trouver sa poubelle !",
  },
  {
    module: 'eco', label: 'Définition : biodégradable',
    keywords: "c'est quoi biodegradable|biodegradable ca veut dire|que veut dire biodegradable|c'est quoi biodégradable",
    answer: "**Biodégradable**, ça veut dire qu'un objet **disparaît tout seul dans la nature** avec le temps 🍂\n\nComme une peau de banane qui pourrit et se mélange à la terre. À l'inverse, le plastique, lui, met des centaines d'années !",
  },
  {
    module: 'eco', label: 'Définition : énergie renouvelable',
    keywords: "c'est quoi une energie renouvelable|energie renouvelable ca veut dire|renouvelable ca veut dire|c'est quoi le renouvelable",
    answer: "Une **énergie renouvelable**, c'est une énergie qui **ne s'épuise jamais** 🌞\n\nLe soleil, le vent, l'eau… on peut les utiliser encore et encore. Au contraire, le pétrole ou le charbon, eux, finissent par disparaître.",
  },
  {
    module: 'eco', label: 'Définition : effet de serre',
    keywords: "c'est quoi l'effet de serre|effet de serre ca veut dire|c'est quoi l'effet de serre",
    answer: "L'**effet de serre**, c'est quand des gaz (surtout le **CO₂**) forment une sorte de **couverture** autour de la Terre 🌡️\n\nUn peu de couverture, c'est bien. Mais trop, et la Terre a **trop chaud** : c'est le réchauffement climatique !",
  },
  {
    module: 'eco', label: 'Définition : compost',
    keywords: "c'est quoi le compost|composter ca veut dire|c'est quoi composter|compost ca veut dire",
    answer: "Le **compost**, c'est un tas où on met les **déchets de cuisine** (épluchures, restes de fruits…) 🍎\n\nAvec le temps, ils se transforment en **terre riche** pour faire pousser les plantes. La nature recycle toute seule !",
  },
  {
    module: 'eco', label: 'Définition : éco-geste',
    keywords: "c'est quoi un eco geste|eco citoyen ca veut dire|c'est quoi un eco-geste|c'est quoi un ecogeste",
    answer: "Un **éco-geste**, c'est une **petite action du quotidien** qui aide la planète 🌍\n\nÉteindre la lumière, fermer le robinet, trier ses déchets… Chaque petit geste compte ! Toi aussi tu peux en faire plein 💚",
  },

  // ═══════════ GÉNÉRAL (tous modules) ═══════════
  {
    module: null, label: 'Qui es-tu Milo ?',
    keywords: "qui es tu|c'est quoi ton nom|comment tu t'appelles|tu es qui|t'es qui|tu t'appelles comment",
    answer: "Moi c'est **Milo** 🤖 ton copain pour t'aider à comprendre les questions !\n\nJe ne te donne jamais la réponse toute faite, mais je te donne des indices pour que tu la trouves **tout seul** — c'est comme ça qu'on apprend le mieux 💪",
  },
  {
    module: null, label: 'Refus : donner la réponse',
    keywords: "donne moi la reponse|dis moi la reponse|c'est quoi la reponse|donne la reponse|la reponse c'est quoi|dis moi la bonne reponse|donne moi la solution",
    answer: "Ah non, petit malin 😄 Si je te donne la réponse, tu n'apprends rien !\n\nMais je vais t'aider à la trouver **tout seul**. Dis-moi plutôt ce qui te bloque dans la question, et on avance ensemble 💪",
  },

  // ═══════════ ENRICHISSEMENT — LECTURE ═══════════
  {
    module: 'lecture', label: 'Définition : idée principale',
    keywords: "c'est quoi l'idee principale|idee principale ca veut dire|c'est quoi le sujet du texte|de quoi parle le texte",
    answer: "L'**idée principale**, c'est **de quoi parle surtout le texte** — le message le plus important 🎯\n\nPour la trouver, demande-toi : « si je devais raconter cette histoire en une phrase, je dirais quoi ? »",
  },
  {
    module: 'lecture', label: 'Définition : paragraphe',
    keywords: "c'est quoi un paragraphe|paragraphe ca veut dire|un paragraphe c'est quoi",
    answer: "Un **paragraphe**, c'est un **bloc de plusieurs phrases** qui parlent de la même idée 📄\n\nOn passe à un nouveau paragraphe quand on change de sujet. C'est ce qui aère le texte et le rend plus facile à lire !",
  },
  {
    module: 'lecture', label: 'Définition : titre',
    keywords: "a quoi sert le titre|c'est quoi le titre|pourquoi un titre|role du titre",
    answer: "Le **titre**, c'est le **nom du texte**, tout en haut 🔝\n\nIl te donne déjà un indice sur le sujet ! Lis-le toujours en premier : il t'aide à deviner de quoi va parler l'histoire.",
  },

  // ═══════════ ENRICHISSEMENT — NUMÉRIQUE ═══════════
  {
    module: 'numerique', label: 'Définition : logiciel',
    keywords: "c'est quoi un logiciel|logiciel ca veut dire|un logiciel c'est quoi|c'est quoi un programme informatique",
    answer: "Un **logiciel** (ou programme), c'est un **outil qui fait fonctionner l'ordinateur** pour une tâche 🧰\n\nWord pour écrire, un jeu pour jouer, un navigateur pour internet… Chaque logiciel a son rôle, comme les applis sur un téléphone !",
  },
  {
    module: 'numerique', label: 'Définition : fichier',
    keywords: "c'est quoi un fichier|fichier ca veut dire|un fichier c'est quoi",
    answer: "Un **fichier**, c'est un **document rangé dans l'ordinateur** 📁\n\nUne photo, une chanson, un texte… chacun est un fichier avec un nom. On les garde dans le disque dur, comme des feuilles dans un classeur !",
  },
  {
    module: 'numerique', label: 'Définition : Internet',
    keywords: "c'est quoi internet|internet ca veut dire|internet c'est quoi|comment marche internet",
    answer: "**Internet**, c'est un **immense réseau qui relie les ordinateurs du monde entier** 🌍\n\nGrâce à lui, tu peux envoyer un message ou voir un site à l'autre bout de la planète en une seconde. Comme des routes invisibles entre toutes les machines !",
  },
  {
    module: 'numerique', label: "Définition : arobase (@)",
    keywords: "c'est quoi l'arobase|c'est quoi le @|arobase ca veut dire|le signe @|a quoi sert le @",
    answer: "Le signe **@** s'appelle une **arobase** ✉️\n\nOn l'utilise dans les adresses email, entre ton nom et le nom du service : *lea@exemple.com*. Il veut dire « chez » en anglais (*at*) !",
  },
  {
    module: 'numerique', label: 'Définition : se déconnecter',
    keywords: "c'est quoi se deconnecter|se deconnecter ca veut dire|deconnexion ca veut dire|pourquoi se deconnecter",
    answer: "**Se déconnecter**, c'est **quitter son compte** proprement 🔒\n\nC'est important surtout sur un ordinateur partagé, pour que personne d'autre n'utilise ton compte après toi. C'est comme fermer la porte de sa chambre à clé !",
  },

  // ═══════════ ENRICHISSEMENT — ROBOTIQUE ═══════════
  {
    module: 'robotique', label: 'Définition : Scratch',
    keywords: "c'est quoi scratch|scratch ca veut dire|c'est quoi le langage scratch|comment marche scratch",
    answer: "**Scratch**, c'est un **langage pour programmer en s'amusant** 🧩\n\nAu lieu d'écrire du code compliqué, on assemble des **blocs de couleurs** comme un puzzle. Parfait pour débuter ! (scratch.mit.edu)",
  },
  {
    module: 'robotique', label: 'Définition : condition (si… alors)',
    keywords: "c'est quoi une condition|si alors ca veut dire|c'est quoi si alors|condition en programmation",
    answer: "Une **condition**, c'est une règle du type **« SI… ALORS… »** 🔀\n\nExemple : *SI le robot voit un mur, ALORS il tourne*. Ça permet au robot de **décider** quoi faire selon la situation, comme toi quand tu réfléchis !",
  },
  {
    module: 'robotique', label: 'Définition : variable',
    keywords: "c'est quoi une variable|variable ca veut dire|une variable en programmation",
    answer: "Une **variable**, c'est une **petite boîte pour stocker une information** 📦\n\nPar exemple, une variable *score* peut garder le nombre de points. On peut regarder dedans ou changer sa valeur quand on veut !",
  },
  {
    module: 'robotique', label: 'Définition : algorithme',
    keywords: "c'est quoi un algorithme|algorithme ca veut dire|un algo c'est quoi",
    answer: "Un **algorithme**, c'est une **suite d'étapes pour arriver à un résultat** 🪜\n\nComme une recette de cuisine ou le chemin pour aller à l'école : étape 1, étape 2, étape 3… Les ordinateurs adorent suivre des algorithmes !",
  },
  {
    module: 'robotique', label: 'Définition : microcontrôleur',
    keywords: "c'est quoi un microcontroleur|microcontroleur ca veut dire|c'est quoi le cerveau du robot|carte mere du robot",
    answer: "Le **microcontrôleur**, c'est le **cerveau du robot** 🧠\n\nC'est la petite puce qui reçoit les infos des capteurs, réfléchit, et commande les moteurs. Sans lui, le robot ne saurait pas quoi faire !",
  },

  // ═══════════ ENRICHISSEMENT — ANGLAIS ═══════════
  {
    module: 'anglais', label: 'Astuce : les nombres en anglais (-teen)',
    keywords: "comment compter en anglais|je comprends pas les nombres anglais|c'est quoi teen|regle des nombres anglais|les nombres en anglais",
    answer: "Astuce pour les nombres ! 🔢 À partir de 13, on rajoute **-teen** à la fin :\n\n*four → fourteen (14)*, *six → sixteen (16)*…\n\nEt les dizaines finissent par **-ty** : *twenty (20)*, *thirty (30)*. Repère la terminaison pour deviner le nombre !",
  },
  {
    module: 'anglais', label: 'Astuce : prononcer un mot anglais',
    keywords: "comment prononcer|je sais pas prononcer|comment ca se dit|comment on prononce",
    answer: "En anglais, ça ne se prononce pas toujours comme ça s'écrit ! 🗣️\n\nMais pas de stress : dis le mot tout bas, plusieurs fois. Souvent tu l'as déjà entendu (dans une chanson, un jeu…). Le plus important, c'est de **comprendre le sens** 💫",
  },

  // ═══════════ ENRICHISSEMENT — CIVIQUE ═══════════
  {
    module: 'civique', label: 'Définition : voter / élection',
    keywords: "c'est quoi voter|voter ca veut dire|c'est quoi une election|une election c'est quoi|c'est quoi le vote",
    answer: "**Voter**, c'est **choisir** en donnant sa voix 🗳️\n\nLors d'une **élection**, chaque citoyen vote pour la personne qu'il préfère (comme un président ou un maire). Celui qui a le plus de voix gagne. C'est ça, la démocratie !",
  },
  {
    module: 'civique', label: 'Définition : démocratie',
    keywords: "c'est quoi la democratie|democratie ca veut dire|une democratie c'est quoi",
    answer: "La **démocratie**, c'est quand **le peuple choisit** qui le dirige, grâce au vote 🤝\n\nDu grec *démos* (le peuple) et *kratos* (le pouvoir) : le pouvoir au peuple ! Tout le monde a son mot à dire.",
  },
  {
    module: 'civique', label: 'Définition : citoyen',
    keywords: "c'est quoi un citoyen|citoyen ca veut dire|un citoyen c'est quoi|c'est quoi la citoyennete",
    answer: "Un **citoyen**, c'est un **membre d'un pays** qui a des **droits** et des **devoirs** 🧑‍🤝‍🧑\n\nEn grandissant, il peut voter, mais il doit aussi respecter les lois et les autres. Toi aussi tu es un petit citoyen à l'école !",
  },
  {
    module: 'civique', label: 'Définition : respect',
    keywords: "c'est quoi le respect|respecter ca veut dire|c'est quoi respecter les autres",
    answer: "Le **respect**, c'est **traiter les autres avec gentillesse et politesse** 🤗\n\nDire bonjour et merci, écouter sans couper la parole, ne pas se moquer… On respecte les autres comme on aimerait être respecté !",
  },
  {
    module: 'civique', label: 'Définition : tolérance',
    keywords: "c'est quoi la tolerance|tolerance ca veut dire|etre tolerant ca veut dire",
    answer: "La **tolérance**, c'est **accepter que les autres soient différents** de toi 🌈\n\nDifférente couleur, religion, façon de penser… Chacun est unique, et c'est ça qui rend le monde intéressant !",
  },
  {
    module: 'civique', label: 'Définition : harcèlement',
    keywords: "c'est quoi le harcelement|harcelement ca veut dire|c'est quoi harceler|etre harcele",
    answer: "Le **harcèlement**, c'est quand quelqu'un **embête méchamment une autre personne, encore et encore** 🚫\n\nCe n'est jamais un jeu, ça fait très mal. Si tu le vois ou le vis, il faut **en parler à un adulte de confiance** tout de suite. Tu n'es jamais seul 💙",
  },

  // ═══════════ ENRICHISSEMENT — ÉCO ═══════════
  {
    module: 'eco', label: 'Définition : pollution',
    keywords: "c'est quoi la pollution|polluer ca veut dire|c'est quoi polluer|la pollution c'est quoi",
    answer: "La **pollution**, c'est quand on **salit la nature** (l'air, l'eau, la terre) avec des déchets ou des gaz 🏭\n\nÇa fait du mal aux plantes, aux animaux et à nous. Chaque déchet bien jeté, c'est un peu moins de pollution !",
  },
  {
    module: 'eco', label: 'Définition : réchauffement climatique',
    keywords: "c'est quoi le rechauffement climatique|rechauffement ca veut dire|c'est quoi le changement climatique|le climat qui change",
    answer: "Le **réchauffement climatique**, c'est la **Terre qui devient de plus en plus chaude** 🌡️\n\nÀ cause des gaz qu'on rejette (voitures, usines…), le climat se dérègle : plus de canicules, de tempêtes… C'est pour ça qu'on protège la planète !",
  },
  {
    module: 'eco', label: 'Définition : CO₂ / gaz à effet de serre',
    keywords: "c'est quoi le co2|co2 ca veut dire|c'est quoi le dioxyde de carbone|c'est quoi les gaz a effet de serre",
    answer: "Le **CO₂** (dioxyde de carbone), c'est un **gaz invisible** rejeté par les voitures, les usines, les avions… 💨\n\nEn trop grande quantité, il réchauffe la Terre. Moins on en produit (vélo, marche…), mieux la planète se porte !",
  },
  {
    module: 'eco', label: 'Définition : biodiversité',
    keywords: "c'est quoi la biodiversite|biodiversite ca veut dire|c'est quoi la nature vivante",
    answer: "La **biodiversité**, c'est **toute la variété du vivant** : animaux, plantes, insectes… 🐝🌳\n\nChaque espèce a un rôle. Les abeilles pollinisent les fleurs, les arbres font l'oxygène… Tout est relié, comme une grande équipe !",
  },
  {
    module: 'eco', label: 'Définition : eau potable',
    keywords: "c'est quoi l'eau potable|eau potable ca veut dire|c'est quoi de l'eau buvable",
    answer: "L'**eau potable**, c'est l'**eau qu'on peut boire sans danger** 💧\n\nElle est très rare : sur toute l'eau de la Terre, à peine une goutte sur 200 est buvable ! C'est pour ça qu'il ne faut pas la gaspiller.",
  },
  {
    module: 'eco', label: 'Définition : gaspillage',
    keywords: "c'est quoi le gaspillage|gaspiller ca veut dire|c'est quoi gaspiller",
    answer: "**Gaspiller**, c'est **utiliser ou jeter plus que nécessaire** 🗑️\n\nLaisser l'eau couler, jeter de la nourriture pas finie… Éviter le gaspillage, c'est faire attention et ne prendre que ce dont on a besoin. Malin et écolo !",
  },
  {
    module: 'eco', label: 'Définition : manger local et de saison',
    keywords: "c'est quoi manger local|manger de saison ca veut dire|c'est quoi de saison|pourquoi manger local",
    answer: "**Manger local**, c'est manger des aliments **produits près de chez toi** 🥕\n\nIls voyagent moins → moins de pollution ! Et **de saison**, c'est manger les fruits/légumes au bon moment de l'année (des fraises en été, pas en hiver !).",
  },

  // ═══════════ ENRICHISSEMENT — GÉNÉRAL ═══════════
  {
    module: null, label: 'Politesse : remerciement',
    keywords: "merci milo|merci beaucoup|merci pour ton aide|merci pour l'aide|mci milo",
    answer: "Avec plaisir ! 😊 Je suis super content de t'avoir aidé.\n\nContinue comme ça, tu te débrouilles très bien 💪 N'hésite pas si tu bloques sur une autre question !",
  },
  {
    module: null, label: 'Politesse : salutation',
    keywords: "coucou milo|bonjour milo|salut milo|coucou toi|re milo|hello milo",
    answer: "Coucou ! 👋 Trop content de te voir !\n\nJe suis là pour t'aider à comprendre les questions. Dis-moi ce qui te bloque et on trouve la réponse ensemble 😊",
  },
  {
    module: null, label: 'Soutien : découragement',
    keywords: "je suis nul|j'y arrive pas|je suis trop bete|je vais jamais y arriver|c'est trop dur pour moi|je comprends jamais rien",
    answer: "Eh non, ne dis pas ça ! 💙 Personne ne naît en sachant tout — même les grands scientifiques ont commencé par se tromper.\n\nSe tromper, c'est **exactement comme ça qu'on apprend**. On y va doucement, étape par étape, et tu vas y arriver. Je suis avec toi 💪",
  },

  // ═══════════ VAGUE 3 — LECTURE ═══════════
  {
    module: 'lecture', label: 'Définition : dialogue',
    keywords: "c'est quoi un dialogue|dialogue ca veut dire|c'est quoi les guillemets|pourquoi des guillemets",
    answer: "Un **dialogue**, c'est quand des **personnages se parlent** dans l'histoire 💬\n\nOn le reconnaît aux **guillemets** « … » ou aux tirets. Repère qui dit quoi, ça aide beaucoup à comprendre !",
  },
  {
    module: 'lecture', label: "Définition : morale de l'histoire",
    keywords: "c'est quoi la morale|morale de l'histoire ca veut dire|c'est quoi une morale|la lecon de l'histoire",
    answer: "La **morale**, c'est la **leçon que l'histoire veut nous apprendre** 🌟\n\nSouvent à la fin, on comprend un message : être courageux, partager, ne pas mentir… Demande-toi : « qu'est-ce que cette histoire veut m'apprendre ? »",
  },
  {
    module: 'lecture', label: 'Astuce : deviner un mot grâce au contexte',
    keywords: "c'est quoi le contexte|deviner un mot|je connais pas ce mot|un mot que je comprends pas|comment deviner un mot",
    answer: "Astuce de lecteur ! 🔍 Quand tu ne connais pas un mot, regarde les **mots autour** de lui (c'est le *contexte*).\n\nSouvent, la phrase entière te donne un indice sur ce que le mot veut dire. Relis la phrase en entier, tu vas deviner !",
  },
  {
    module: 'lecture', label: 'Définition : syllabe',
    keywords: "c'est quoi une syllabe|syllabe ca veut dire|c'est quoi les syllabes",
    answer: "Une **syllabe**, c'est un **morceau de mot** qu'on prononce d'un coup 🎵\n\nExemple : *cho-co-lat* = 3 syllabes. Tape dans tes mains en disant le mot, chaque « tape » est une syllabe !",
  },

  // ═══════════ VAGUE 3 — NUMÉRIQUE ═══════════
  {
    module: 'numerique', label: 'Définition : email',
    keywords: "c'est quoi un email|c'est quoi un mail|c'est quoi une adresse email|un e-mail c'est quoi|c'est quoi un courriel",
    answer: "Un **email** (ou courriel), c'est une **lettre envoyée par internet** ✉️\n\nÇa arrive en quelques secondes à l'autre bout du monde ! Une adresse email ressemble à : *lea@exemple.com* (avec l'arobase @).",
  },
  {
    module: 'numerique', label: 'Définition : télécharger',
    keywords: "c'est quoi telecharger|telecharger ca veut dire|c'est quoi un telechargement",
    answer: "**Télécharger**, c'est **récupérer un fichier depuis internet** vers ton ordinateur ⬇️\n\nUne photo, un jeu, une chanson… tu le télécharges pour le garder. Attention : ne télécharge que sur des sites sûrs, et demande à un adulte !",
  },
  {
    module: 'numerique', label: 'Définition : application / appli',
    keywords: "c'est quoi une application|c'est quoi une appli|une appli c'est quoi|application ca veut dire",
    answer: "Une **application** (appli), c'est un **petit logiciel** sur un téléphone ou une tablette 📱\n\nChaque appli fait une chose : jouer, dessiner, écouter de la musique… C'est comme une boîte à outils, une appli = un outil !",
  },
  {
    module: 'numerique', label: 'Définition : virus informatique',
    keywords: "c'est quoi un virus informatique|c'est quoi un virus sur l'ordi|virus ordinateur ca veut dire",
    answer: "Un **virus informatique**, c'est un **programme méchant** qui abîme l'ordinateur 🦠\n\nIl peut casser des fichiers ou espionner. Pour s'en protéger : ne clique pas n'importe où et n'ouvre pas les fichiers d'inconnus !",
  },
  {
    module: 'numerique', label: 'Définition : réseau',
    keywords: "c'est quoi un reseau|un reseau c'est quoi|reseau informatique ca veut dire",
    answer: "Un **réseau**, c'est **plusieurs ordinateurs reliés entre eux** pour partager des infos 🔗\n\nComme une bande de copains qui se passent des messages. Internet, c'est le plus grand réseau du monde !",
  },
  {
    module: 'numerique', label: 'Définition : pixel',
    keywords: "c'est quoi un pixel|pixel ca veut dire|c'est quoi les pixels",
    answer: "Un **pixel**, c'est un **tout petit carré de couleur** 🟦\n\nUne image sur un écran est faite de milliers de pixels, comme une mosaïque ! De loin on voit l'image, de très près on voit les petits carrés.",
  },

  // ═══════════ VAGUE 3 — ROBOTIQUE ═══════════
  {
    module: 'robotique', label: 'Définition : moteur',
    keywords: "c'est quoi un moteur|a quoi sert un moteur|le role du moteur|moteur d'un robot",
    answer: "Un **moteur**, c'est ce qui fait **tourner les roues ou bouger** le robot ⚙️\n\nQuand le cerveau du robot dit « avance », c'est le moteur qui fait le travail. C'est un peu ses muscles !",
  },
  {
    module: 'robotique', label: "Définition : alimentation / batterie",
    keywords: "c'est quoi l'alimentation d'un robot|comment un robot a de l'energie|c'est quoi la batterie|d'ou vient l'energie du robot",
    answer: "Un robot a besoin d'**énergie** pour fonctionner 🔋\n\nÇa vient d'une **batterie** (comme dans un téléphone) ou d'une **prise électrique**. Sans énergie, le robot reste immobile — comme toi sans manger !",
  },
  {
    module: 'robotique', label: 'Définition : robot autonome',
    keywords: "c'est quoi un robot autonome|autonome ca veut dire|c'est quoi etre autonome pour un robot",
    answer: "**Autonome**, ça veut dire que le robot se **débrouille tout seul**, sans qu'on le commande à chaque instant 🤖\n\nComme un aspirateur robot qui nettoie la maison sans qu'on le pousse. Il décide lui-même grâce à ses capteurs !",
  },
  {
    module: 'robotique', label: 'Définition : bug',
    keywords: "c'est quoi un bug|bug ca veut dire|c'est quoi un bogue|pourquoi ca bug",
    answer: "Un **bug**, c'est une **erreur dans un programme** 🐛\n\nÇa fait faire n'importe quoi à la machine ! Le mot vient d'un vrai insecte coincé dans un ordinateur il y a longtemps. Corriger un bug, c'est « déboguer ».",
  },
  {
    module: 'robotique', label: 'Définition : drone',
    keywords: "c'est quoi un drone|drone ca veut dire|un drone c'est quoi",
    answer: "Un **drone**, c'est un **petit engin volant sans pilote à bord** 🚁\n\nOn le commande à distance, et il a souvent une caméra. C'est une sorte de robot qui vole !",
  },

  // ═══════════ VAGUE 3 — ANGLAIS ═══════════
  {
    module: 'anglais', label: 'Astuce : se présenter en anglais',
    keywords: "comment se presenter en anglais|comment dire mon nom en anglais|comment dire je m'appelle en anglais",
    answer: "Pour se présenter en anglais : **My name is…** = « Je m'appelle… » 👋\n\nExemple : *My name is Léa*. Et pour demander : *What's your name?* = « Comment tu t'appelles ? » Essaie avec ton prénom !",
  },
  {
    module: 'anglais', label: 'Astuce : dire son âge en anglais',
    keywords: "comment dire mon age en anglais|comment dire quel age en anglais|dire son age en anglais",
    answer: "Pour dire ton âge : **I am … years old** 🎂\n\nExemple : *I am 9 years old* = « J'ai 9 ans ». Le mot *old* veut dire « vieux/âgé ». Remplace juste par ton âge !",
  },

  // ═══════════ VAGUE 3 — CIVIQUE ═══════════
  {
    module: 'civique', label: 'Définition : liberté',
    keywords: "c'est quoi la liberte|liberte ca veut dire|etre libre ca veut dire",
    answer: "La **liberté**, c'est pouvoir **penser, parler et agir** comme on veut… 🕊️\n\n…tant qu'on ne fait pas de mal aux autres ! Ta liberté s'arrête là où commence celle des autres. C'est une des grandes valeurs de la France.",
  },
  {
    module: 'civique', label: 'Définition : égalité',
    keywords: "c'est quoi l'egalite|egalite ca veut dire|etre egaux ca veut dire",
    answer: "L'**égalité**, c'est que **tout le monde a les mêmes droits** ⚖️\n\nFille ou garçon, peu importe la couleur ou la religion : chacun compte pareil et mérite le même respect. C'est juste, non ?",
  },
  {
    module: 'civique', label: 'Définition : fraternité',
    keywords: "c'est quoi la fraternite|fraternite ca veut dire|c'est quoi etre fraternel",
    answer: "La **fraternité**, c'est **s'entraider comme des frères et sœurs** 🤝\n\nÊtre solidaire, aider celui qui est en difficulté, être gentil… C'est ce qui fait qu'on vit bien tous ensemble !",
  },
  {
    module: 'civique', label: 'Définition : loi',
    keywords: "c'est quoi une loi|une loi c'est quoi|a quoi servent les lois|c'est quoi les lois",
    answer: "Une **loi**, c'est une **règle qu'il faut respecter dans tout le pays** 📜\n\nElles servent à protéger tout le monde et à vivre ensemble sans danger. Comme les règles d'un jeu : sans elles, ce serait le chaos !",
  },
  {
    module: 'civique', label: "Définition : droits de l'enfant",
    keywords: "c'est quoi les droits de l'enfant|convention des droits de l'enfant|c'est quoi un droit de l'enfant",
    answer: "Les **droits de l'enfant**, ce sont des **protections pour tous les enfants du monde** 🧒\n\nLe droit d'aller à l'école, d'être soigné, d'être protégé, de jouer… Ils ont été écrits en **1989**. Chaque enfant y a droit !",
  },
  {
    module: 'civique', label: 'Définition : solidarité / entraide',
    keywords: "c'est quoi la solidarite|c'est quoi l'entraide|etre solidaire ca veut dire|s'entraider ca veut dire",
    answer: "La **solidarité**, c'est **s'aider les uns les autres** 🤲\n\nQuand quelqu'un est en difficulté, on lui tend la main. Ensemble, on est toujours plus forts que tout seul !",
  },

  // ═══════════ VAGUE 3 — ÉCO ═══════════
  {
    module: 'eco', label: 'Définition : énergie solaire',
    keywords: "c'est quoi l'energie solaire|energie solaire ca veut dire|c'est quoi les panneaux solaires",
    answer: "L'**énergie solaire**, c'est l'énergie qu'on récupère grâce au **soleil** ☀️\n\nDes **panneaux solaires** captent sa lumière et la transforment en électricité. Et le soleil, lui, ne s'épuise jamais : c'est une énergie renouvelable !",
  },
  {
    module: 'eco', label: 'Définition : énergie éolienne / éolienne',
    keywords: "c'est quoi l'energie eolienne|c'est quoi une eolienne|energie du vent|eolienne ca veut dire",
    answer: "Une **éolienne**, c'est une grande **hélice** qui fabrique de l'électricité grâce au **vent** 💨\n\nPlus le vent souffle, plus elle tourne et produit de l'énergie propre. Et le vent est gratuit et illimité !",
  },
  {
    module: 'eco', label: 'Définition : covoiturage',
    keywords: "c'est quoi le covoiturage|covoiturage ca veut dire|c'est quoi covoiturer",
    answer: "Le **covoiturage**, c'est **partager une voiture à plusieurs** pour un même trajet 🚗👥\n\nAu lieu de 4 voitures, une seule ! Ça pollue moins et c'est plus convivial. Malin pour la planète !",
  },
  {
    module: 'eco', label: 'Définition : transports en commun',
    keywords: "c'est quoi les transports en commun|transport en commun ca veut dire|c'est quoi le transport en commun",
    answer: "Les **transports en commun**, ce sont les **bus, trains, tramways…** que tout le monde peut prendre 🚌\n\nUn seul bus transporte plein de gens à la place de plein de voitures → beaucoup moins de pollution !",
  },
  {
    module: 'eco', label: 'Définition : développement durable',
    keywords: "c'est quoi le developpement durable|developpement durable ca veut dire",
    answer: "Le **développement durable**, c'est **vivre bien aujourd'hui sans abîmer la planète pour demain** 🌍\n\nOn utilise les ressources avec soin, pour qu'il en reste pour les enfants du futur. C'est penser à long terme !",
  },
  {
    module: 'eco', label: 'Définition : espèce en danger / disparition',
    keywords: "c'est quoi une espece en danger|especes qui disparaissent|c'est quoi la disparition des especes|animaux en voie de disparition",
    answer: "Une **espèce en danger**, c'est un animal ou une plante **qui risque de disparaître pour toujours** 🐼\n\nÀ cause de la pollution ou de la destruction de leur maison (la nature). Les protéger, c'est garder la Terre belle et vivante !",
  },
  {
    module: 'eco', label: 'Définition : déforestation',
    keywords: "c'est quoi la deforestation|deforestation ca veut dire|couper les arbres|c'est quoi la disparition des forets",
    answer: "La **déforestation**, c'est quand on **coupe trop d'arbres** et que les forêts disparaissent 🌳🪓\n\nOr les arbres fabriquent l'oxygène qu'on respire et abritent plein d'animaux. Planter des arbres, c'est aider la planète !",
  },

  // ═══════════ VAGUE 3 — GÉNÉRAL ═══════════
  {
    module: null, label: 'Politesse : au revoir',
    keywords: "au revoir milo|a plus milo|bye milo|a bientot milo|je m'en vais|a plus tard milo",
    answer: "À bientôt ! 👋 Tu as bien travaillé aujourd'hui.\n\nReviens me voir dès que tu as besoin d'un coup de main. Continue comme ça, tu progresses super bien 🌟",
  },
  {
    module: null, label: 'Milo est-il un vrai humain ?',
    keywords: "tu es un robot|t'es un robot|tu es reel|tu es un humain|tu es vivant|es tu une vraie personne|tu es une vraie personne",
    answer: "Bonne question ! 🤖 Je suis un **assistant intelligent**, pas un vrai humain.\n\nJe ne mange pas, je ne dors pas… mais je suis toujours là pour t'aider ! Par contre, mon amitié pour toi, elle, est bien réelle 😊",
  },
  {
    module: null, label: 'Comment vas-tu Milo ?',
    keywords: "ca va milo|comment tu vas|comment ca va milo|tu vas bien|comment vas tu",
    answer: "Moi je vais super bien, merci ! 😄 Surtout quand j'aide un(e) élève aussi motivé(e) que toi.\n\nEt toi, prêt(e) à résoudre cette question ensemble ? Dis-moi ce qui te bloque !",
  },
  {
    module: null, label: 'Gentillesse envers Milo',
    keywords: "tu es gentil|je t'aime bien milo|t'es cool|tu es super|tu es le meilleur|tu es trop bien|j'adore milo",
    answer: "Oh, merci, ça me touche ! 🥰 Toi aussi tu es génial(e).\n\nAllez, on forme une super équipe tous les deux 💪 Sur quelle question je peux t'aider ?",
  },
  {
    module: null, label: 'Raconter une blague',
    keywords: "raconte une blague|tu connais une blague|fais moi rire|dis une blague|raconte moi une blague",
    answer: "Allez, une petite blague ! 😄\n\n*Pourquoi les robots n'ont jamais peur ?*\n… Parce qu'ils ont des **nerfs d'acier** ! 🤖\n\nBon, maintenant au travail — mais en souriant 😁 Dis-moi ta question !",
  },
  {
    module: null, label: 'Quel âge a Milo ?',
    keywords: "tu as quel age|quel age tu as|c'est quoi ton age|tu as quel age milo",
    answer: "Moi, un âge ? 🤖 Je suis un assistant, je n'ai pas d'âge comme toi !\n\nMais je suis tout neuf et j'apprends plein de choses chaque jour, un peu comme toi à l'école 😊 Allez, on s'y met ?",
  },
];

function seedMiloKb(db) {
  const existing = new Set(
    db.prepare('SELECT label FROM milo_kb').all().map(r => r.label)
  );
  const insert = db.prepare(
    'INSERT INTO milo_kb (module, label, keywords, answer) VALUES (?, ?, ?, ?)'
  );
  for (const e of MILO_KB) {
    if (!existing.has(e.label)) insert.run(e.module, e.label, e.keywords, e.answer);
  }
}

module.exports = { MILO_KB, seedMiloKb };
