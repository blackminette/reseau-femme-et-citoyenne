// * src/app/(dashboard-adultes)/formation/modules-data.tsx
import {
    type LucideIcon,
    Folder, Mail, FileText, Globe, ShieldCheck, CreditCard,
    Compass, BookOpen, Target, Search, HelpCircle, BadgeCheck, Lightbulb,
    KeyRound, UserPlus, Send, AtSign, ListChecks, Briefcase, Sparkles,
    PenLine, CheckCircle2, Eye, Lock,
    AlertTriangle, UserCheck, ScanLine, Banknote, Smartphone, ShoppingCart,
} from 'lucide-react';

/*
 * Catalogue des modules de formation adulte + contenu des parcours.
 * Le contenu est statique (géré côté front) ; un moteur générique (Parcours.tsx)
 * sait afficher n'importe quel module défini ici. Pour ajouter un module :
 * ajouter une entrée dans MODULES avec ses `etapes` et son `quiz`.
 */

export type Tone = 'violet' | 'green' | 'amber' | 'blue';

export type Encadre = { tone: Tone; icon: LucideIcon; titre: string; texte?: string; items?: string[] };

export type Bloc =
    | { type: 'texte'; icon?: LucideIcon; titre?: string; texte: string }
    | { type: 'liste'; icon?: LucideIcon; titre?: string; ordonnee?: boolean; items: string[] }
    | { type: 'encadre'; tone: Tone; icon: LucideIcon; titre: string; texte?: string; items?: string[] }
    | { type: 'cartes'; items: { icon: LucideIcon; titre: string; texte: string }[] }
    | { type: 'associer'; titre?: string; paires: { gauche: string; droite: string }[] };

export type EtapeContenu = {
    label: string;          // libellé court dans la timeline
    titre: string;          // grand titre de l'étape
    icon: LucideIcon;
    description: string;    // paragraphe d'intro (colonne gauche)
    encadres?: Encadre[];   // encadrés colorés (colonne gauche)
    blocs: Bloc[];          // contenu (colonne droite)
};

export type QuizItem = { q: string; multi?: boolean; icon: LucideIcon; options: { txt: string; bon: boolean }[] };

export type ModuleFormation = {
    slug: string;
    titre: string;
    categorie: string;
    description: string;
    icon: LucideIcon;
    from: string;           // dégradé carte (couleur début)
    to: string;             // dégradé carte (couleur fin)
    niveau: 'Débutant' | 'Intermédiaire';
    dureeMin: number;
    disponible: boolean;
    href?: string;          // page dédiée (ex: module à widgets riches)
    etapes?: EtapeContenu[]; // contenu pour le moteur générique
    quiz?: QuizItem[];
};

// Nombre total d'étapes affichées (étapes de contenu + Quiz + Validation).
export function nbEtapes(m: ModuleFormation): number {
    if (m.etapes) return m.etapes.length + 2;
    return 7; // module à page dédiée (fichiers-windows)
}

// ───────────────────────── MODULE : Créer une adresse email ─────────────────────────
const EMAIL: EtapeContenu[] = [
    {
        label: 'Découvrir', titre: 'Découvrir', icon: Compass,
        description: "Une adresse email est votre « boîte aux lettres » sur Internet. Elle permet de recevoir et d'envoyer des messages, mais aussi de créer des comptes (services publics, santé, achats…).",
        encadres: [
            { tone: 'violet', icon: Target, titre: 'À quoi ça sert', items: ['Communiquer (famille, administration, employeur)', 'Créer des comptes en ligne', 'Recevoir des documents importants'] },
            { tone: 'amber', icon: Lightbulb, titre: 'Bon à savoir', texte: "Une adresse email est gratuite et vous la gardez aussi longtemps que vous voulez." },
        ],
        blocs: [
            { type: 'texte', icon: AtSign, titre: 'À quoi ressemble une adresse email ?', texte: "Une adresse a toujours la forme prenom.nom@fournisseur.com. Le symbole @ (« arobase ») sépare votre identifiant du nom du fournisseur." },
            {
                type: 'cartes', items: [
                    { icon: AtSign, titre: 'L’identifiant', texte: 'Ce qui est avant le @ (ex : marie.dupont).' },
                    { icon: Mail, titre: 'Le @', texte: 'Sépare l’identifiant du fournisseur.' },
                    { icon: Globe, titre: 'Le fournisseur', texte: 'Ce qui est après le @ (ex : gmail.com).' },
                ],
            },
        ],
    },
    {
        label: 'Choisir', titre: 'Choisir', icon: BookOpen,
        description: "Avant de créer votre adresse, choisissez un fournisseur (le service qui héberge votre boîte) puis un identifiant et un mot de passe solide.",
        encadres: [
            { tone: 'blue', icon: Globe, titre: 'Des fournisseurs gratuits', items: ['Gmail (Google)', 'Outlook (Microsoft)', 'Laposte.net'] },
            { tone: 'amber', icon: Lightbulb, titre: 'Conseil identifiant', texte: "Choisissez un identifiant simple et sérieux : prenom.nom plutôt qu’un surnom." },
        ],
        blocs: [
            { type: 'texte', icon: KeyRound, titre: 'Un mot de passe solide', texte: "Le mot de passe protège votre boîte. Il doit être difficile à deviner et connu de vous seul(e)." },
            { type: 'liste', icon: ShieldCheck, titre: 'Les règles d’un bon mot de passe', items: ['Au moins 12 caractères', 'Des majuscules, minuscules et chiffres', 'Au moins un caractère spécial (!, ?, @…)', 'Évitez votre date de naissance ou « 123456 »'] },
            { type: 'encadre', tone: 'green', icon: Lightbulb, titre: 'Astuce', texte: "Utilisez une phrase facile à retenir : « MonChat!Mange3Croquettes »." },
        ],
    },
    {
        label: 'Créer', titre: 'Créer le compte', icon: UserPlus,
        description: "Vous allez maintenant créer votre compte, étape par étape. Prenez votre temps et lisez chaque écran.",
        encadres: [
            { tone: 'violet', icon: Target, titre: 'Objectif', texte: "Créer une adresse email fonctionnelle et bien noter vos identifiants." },
        ],
        blocs: [
            { type: 'liste', icon: ListChecks, titre: 'Les étapes', ordonnee: true, items: ["Ouvrez votre navigateur et allez sur le site du fournisseur (ex : gmail.com).", "Cliquez sur « Créer un compte ».", "Remplissez le formulaire : nom, prénom, identifiant souhaité.", "Choisissez votre mot de passe (deux fois pour confirmer).", "Validez et suivez les vérifications (numéro de téléphone si demandé)."] },
            { type: 'encadre', tone: 'amber', icon: PenLine, titre: 'Important', texte: "Notez votre adresse et votre mot de passe sur un papier gardé en lieu sûr, le temps de les mémoriser." },
        ],
    },
    {
        label: 'Utiliser', titre: 'Utiliser & sécuriser', icon: Send,
        description: "Bravo, votre boîte est créée ! Voyons comment envoyer un premier message et garder votre compte en sécurité.",
        encadres: [
            { tone: 'green', icon: CheckCircle2, titre: 'Vous savez maintenant', items: ['Reconnaître une adresse email', 'Choisir un mot de passe solide', 'Créer un compte'] },
            { tone: 'amber', icon: ShieldCheck, titre: 'Sécurité', texte: "Déconnectez-vous sur un ordinateur partagé et ne donnez jamais votre mot de passe." },
        ],
        blocs: [
            { type: 'liste', icon: Send, titre: 'Envoyer un premier email', ordonnee: true, items: ["Cliquez sur « Nouveau message » (ou « Écrire »).", "Dans « À », tapez l’adresse du destinataire.", "Écrivez un objet court et votre message.", "Cliquez sur « Envoyer »."] },
            { type: 'encadre', tone: 'blue', icon: Lock, titre: 'Reconnaître les arnaques', texte: "Méfiez-vous des emails qui réclament vos mots de passe ou de l’argent en urgence : ce sont souvent des arnaques." },
        ],
    },
];
const EMAIL_QUIZ: QuizItem[] = [
    { q: "Que sépare le symbole @ dans une adresse email ?", icon: AtSign, options: [{ txt: "Le prénom et le nom", bon: false }, { txt: "L’identifiant et le fournisseur", bon: true }, { txt: "Deux messages", bon: false }, { txt: "Rien du tout", bon: false }] },
    { q: "Quel mot de passe est le plus solide ?", icon: KeyRound, options: [{ txt: "123456", bon: false }, { txt: "Votre date de naissance", bon: false }, { txt: "MonChat!Mange3Croquettes", bon: true }, { txt: "motdepasse", bon: false }] },
    { q: "Que faut-il faire avec votre mot de passe ?", multi: true, icon: ShieldCheck, options: [{ txt: "Le garder secret", bon: true }, { txt: "Le partager avec tout le monde", bon: false }, { txt: "Le noter en lieu sûr au début", bon: true }, { txt: "L’écrire sur un post-it collé à l’écran", bon: false }] },
    { q: "Sur un ordinateur partagé, à la fin, il faut…", icon: Lock, options: [{ txt: "Laisser sa session ouverte", bon: false }, { txt: "Se déconnecter", bon: true }, { txt: "Éteindre l’écran seulement", bon: false }, { txt: "Changer de mot de passe", bon: false }] },
];

// ───────────────────────── MODULE : Rédiger un CV ─────────────────────────
const CV: EtapeContenu[] = [
    {
        label: 'Découvrir', titre: 'Découvrir', icon: Compass,
        description: "Le CV (« curriculum vitae ») est un document qui résume votre parcours. Il sert à vous présenter à un employeur pour décrocher un entretien.",
        encadres: [
            { tone: 'violet', icon: Target, titre: 'À quoi sert un CV', items: ['Se présenter en une page', 'Mettre en avant ses expériences', 'Donner envie de vous rencontrer'] },
            { tone: 'amber', icon: Lightbulb, titre: 'Règle d’or', texte: "Un CV tient sur 1 page, clair et facile à lire en quelques secondes." },
        ],
        blocs: [
            { type: 'texte', icon: FileText, titre: 'Un bon CV en 3 mots', texte: "Clair, honnête, adapté. Il doit être agréable à lire et correspondre à l’emploi visé." },
            {
                type: 'cartes', items: [
                    { icon: Eye, titre: 'Lisible', texte: 'Aéré, sans fautes, une seule page.' },
                    { icon: CheckCircle2, titre: 'Honnête', texte: 'Pas de mensonge : tout doit être vrai.' },
                    { icon: Target, titre: 'Adapté', texte: 'Mettez en avant ce qui compte pour le poste.' },
                ],
            },
        ],
    },
    {
        label: 'Comprendre', titre: 'Les rubriques', icon: BookOpen,
        description: "Un CV est organisé en rubriques. Voyons lesquelles sont indispensables et ce qu’on y met.",
        encadres: [
            { tone: 'blue', icon: ListChecks, titre: 'Les rubriques clés', items: ['État civil & contact', 'Expériences professionnelles', 'Formation & diplômes', 'Compétences & langues'] },
        ],
        blocs: [
            { type: 'liste', icon: FileText, titre: 'Ce que contient chaque rubrique', items: ["En-tête : prénom, nom, téléphone, email, ville.", "Expériences : poste, entreprise, dates, missions (les plus récentes d’abord).", "Formation : diplômes et années.", "Compétences : informatique, langues, permis…"] },
            { type: 'encadre', tone: 'amber', icon: Lightbulb, titre: 'Astuce', texte: "Commencez toujours par le plus récent (expériences et formation)." },
        ],
    },
    {
        label: 'Rédiger', titre: 'Rédiger', icon: PenLine,
        description: "À vous d’écrire ! Voici les bonnes pratiques pour un contenu efficace et sans faute.",
        encadres: [
            { tone: 'violet', icon: Target, titre: 'Objectif', texte: "Rédiger un contenu clair, avec des verbes d’action et sans fautes." },
            { tone: 'green', icon: Lightbulb, titre: 'Verbes d’action', items: ['Organiser, accueillir, gérer', 'Vendre, réparer, accompagner'] },
        ],
        blocs: [
            { type: 'liste', icon: ListChecks, titre: 'Les bons réflexes', ordonnee: true, items: ["Soyez concret : « accueil de 30 clients/jour » plutôt que « bon relationnel ».", "Utilisez des phrases courtes et des verbes d’action.", "Relisez pour corriger les fautes (ou faites relire).", "Restez sobre : pas trop de couleurs ni de polices."] },
            { type: 'encadre', tone: 'amber', icon: PenLine, titre: 'À éviter', texte: "Les photos floues, les adresses email farfelues et les informations trop personnelles (situation familiale…)." },
        ],
    },
    {
        label: 'Finaliser', titre: 'Finaliser & envoyer', icon: Send,
        description: "Dernière ligne droite : la mise en page, la relecture et l’envoi de votre CV.",
        encadres: [
            { tone: 'green', icon: CheckCircle2, titre: 'Vous savez maintenant', items: ['Structurer un CV', 'Rédiger un contenu efficace', 'Le mettre en forme'] },
            { tone: 'amber', icon: ShieldCheck, titre: 'Le bon format', texte: "Enregistrez et envoyez votre CV en PDF : la mise en page reste intacte partout." },
        ],
        blocs: [
            { type: 'liste', icon: ListChecks, titre: 'Avant d’envoyer', ordonnee: true, items: ["Vérifiez qu’il tient sur 1 page.", "Relisez une dernière fois (fautes, numéro de téléphone).", "Enregistrez en PDF nommé « CV_Prénom_Nom.pdf ».", "Joignez-le à votre email avec un petit message de motivation."] },
            { type: 'encadre', tone: 'blue', icon: Lightbulb, titre: 'Astuce', texte: "Adaptez légèrement votre CV à chaque offre : reprenez les mots-clés de l’annonce." },
        ],
    },
];
const CV_QUIZ: QuizItem[] = [
    { q: "Idéalement, un CV tient sur…", icon: FileText, options: [{ txt: "5 pages", bon: false }, { txt: "1 page", bon: true }, { txt: "10 pages", bon: false }, { txt: "Autant que possible", bon: false }] },
    { q: "Dans quel ordre présenter ses expériences ?", icon: ListChecks, options: [{ txt: "De la plus ancienne à la plus récente", bon: false }, { txt: "De la plus récente à la plus ancienne", bon: true }, { txt: "Par ordre alphabétique", bon: false }, { txt: "Au hasard", bon: false }] },
    { q: "Quelles rubriques sont indispensables ?", multi: true, icon: BookOpen, options: [{ txt: "Contact (téléphone, email)", bon: true }, { txt: "Expériences professionnelles", bon: true }, { txt: "Votre signe astrologique", bon: false }, { txt: "Formation & diplômes", bon: true }] },
    { q: "Dans quel format envoyer son CV ?", icon: Send, options: [{ txt: "En photo floue", bon: false }, { txt: "En PDF", bon: true }, { txt: "Sur papier uniquement", bon: false }, { txt: "Dans le corps de l’email", bon: false }] },
];

// ───────────────────────── MODULE : Naviguer sur Internet en sécurité ─────────────────────────
const INTERNET: EtapeContenu[] = [
    {
        label: 'Découvrir', titre: 'Découvrir', icon: Compass,
        description: "Internet est très utile, mais il faut rester prudent. Apprenons à voir ce qui est sûr et ce qui est dangereux.",
        encadres: [
            { tone: 'violet', icon: Target, titre: 'Le but', texte: "Naviguer sans se faire piéger." },
            { tone: 'green', icon: Lock, titre: 'Le petit cadenas', texte: "Un site sûr montre un cadenas et commence par « https »." },
        ],
        blocs: [
            { type: 'texte', icon: ShieldCheck, titre: "Un site sûr, c'est quoi ?", texte: "Un site sûr protège vos informations. On le reconnaît au cadenas et à l'adresse qui commence par « https »." },
            { type: 'cartes', items: [
                { icon: Lock, titre: 'Cadenas', texte: 'Présent = connexion protégée.' },
                { icon: Globe, titre: 'https', texte: "L'adresse commence par https." },
                { icon: AlertTriangle, titre: 'Méfiance', texte: 'Pas de cadenas ? Ne donnez rien.' },
            ] },
        ],
    },
    {
        label: 'Reconnaître', titre: 'Reconnaître les pièges', icon: AlertTriangle,
        description: "Les arnaques imitent de vrais messages (banque, colis, impôts) pour voler vos informations.",
        encadres: [
            { tone: 'amber', icon: Lightbulb, titre: "Signes d'une arnaque", items: ['On vous presse (« urgent ! »)', "On demande un mot de passe ou de l'argent", 'Des fautes, une adresse bizarre'] },
        ],
        blocs: [
            { type: 'liste', icon: AlertTriangle, titre: 'Les bons réflexes', items: ["Ne cliquez pas sur un lien d'un message inattendu.", 'Ne donnez jamais votre mot de passe par email ou téléphone.', 'Dans le doute, allez vous-même sur le site officiel.'] },
            { type: 'associer', titre: 'Reliez le danger au bon réflexe', paires: [
                { gauche: 'Email « urgent » de la banque', droite: 'Aller soi-même sur le site officiel' },
                { gauche: 'On demande votre mot de passe', droite: 'Ne jamais le donner' },
                { gauche: 'Lien dans un SMS inconnu', droite: 'Ne pas cliquer' },
            ] },
        ],
    },
    {
        label: 'Se protéger', titre: 'Se protéger', icon: ShieldCheck,
        description: "Quelques habitudes simples protègent vos comptes et vos données.",
        encadres: [
            { tone: 'green', icon: CheckCircle2, titre: 'Vous savez', items: ['Reconnaître un site sûr', 'Repérer une arnaque'] },
        ],
        blocs: [
            { type: 'liste', icon: KeyRound, titre: 'Protéger ses comptes', items: ['Un mot de passe différent par site important.', 'Fermez votre session sur un ordinateur partagé.', 'Mettez à jour votre téléphone et votre ordinateur.'] },
            { type: 'encadre', tone: 'blue', icon: Lock, titre: 'Astuce', texte: "En cas de doute sur un message, demandez à un proche ou à un conseiller avant d'agir." },
        ],
    },
];
const INTERNET_QUIZ: QuizItem[] = [
    { q: "Comment reconnaît-on un site sûr ?", icon: Lock, options: [{ txt: 'Il a beaucoup de couleurs', bon: false }, { txt: 'Il a un cadenas et commence par https', bon: true }, { txt: 'Il a de la musique', bon: false }, { txt: 'Il est en anglais', bon: false }] },
    { q: "Un email « urgent » demande votre mot de passe. Que faites-vous ?", icon: AlertTriangle, options: [{ txt: 'Je le donne vite', bon: false }, { txt: 'Je vérifie moi-même sur le site officiel', bon: true }, { txt: 'Je clique sur le lien', bon: false }, { txt: 'Je transfère à un ami', bon: false }] },
    { q: "Quels sont les signes d'une arnaque ?", multi: true, icon: Eye, options: [{ txt: 'On vous met la pression', bon: true }, { txt: "On demande de l'argent ou un mot de passe", bon: true }, { txt: 'Adresse bizarre avec des fautes', bon: true }, { txt: 'Le site a un cadenas officiel', bon: false }] },
    { q: "Sur un ordinateur partagé, à la fin il faut…", icon: KeyRound, options: [{ txt: 'Laisser sa session ouverte', bon: false }, { txt: 'Se déconnecter', bon: true }, { txt: 'Donner son mot de passe au suivant', bon: false }, { txt: 'Ne rien faire', bon: false }] },
];

// ───────────────────────── MODULE : Faire ses démarches en ligne ─────────────────────────
const DEMARCHES: EtapeContenu[] = [
    {
        label: 'Découvrir', titre: 'Découvrir', icon: Compass,
        description: "Beaucoup de démarches se font sur Internet : impôts, allocations (CAF), santé (Ameli)… Cela évite de se déplacer.",
        encadres: [
            { tone: 'violet', icon: Target, titre: 'Le but', texte: "Faire ses démarches en ligne en confiance." },
            { tone: 'blue', icon: UserCheck, titre: 'FranceConnect', texte: "Un bouton pour se connecter à plusieurs sites publics avec un seul compte." },
        ],
        blocs: [
            { type: 'texte', icon: Globe, titre: 'Les sites officiels', texte: "Les sites publics finissent souvent par « .gouv.fr ». Méfiez-vous d'un site qui fait payer une démarche gratuite." },
            { type: 'cartes', items: [
                { icon: Banknote, titre: 'Impôts', texte: 'impots.gouv.fr' },
                { icon: ShieldCheck, titre: 'Santé', texte: 'ameli.fr' },
                { icon: UserCheck, titre: 'Allocations', texte: 'caf.fr' },
            ] },
        ],
    },
    {
        label: 'Préparer', titre: 'Préparer', icon: ListChecks,
        description: "Avant de commencer, préparez ce dont vous aurez besoin. Tout sera plus facile.",
        encadres: [
            { tone: 'amber', icon: Lightbulb, titre: 'À préparer', items: ['Vos identifiants (ou créer un compte)', 'Vos documents en photo ou en PDF', 'Votre numéro (fiscal, sécurité sociale…)'] },
        ],
        blocs: [
            { type: 'liste', icon: ScanLine, titre: 'Prendre un document en photo', ordonnee: true, items: ['Posez le document bien à plat.', "Vérifiez qu'on lit bien le texte.", "Enregistrez la photo sur l'appareil.", 'Vous pourrez « ajouter » ce fichier pendant la démarche.'] },
            { type: 'associer', titre: 'Reliez le site à sa démarche', paires: [
                { gauche: 'impots.gouv.fr', droite: 'Déclarer ses impôts' },
                { gauche: 'ameli.fr', droite: 'Carte Vitale et remboursements' },
                { gauche: 'caf.fr', droite: 'Allocations familiales' },
            ] },
        ],
    },
    {
        label: 'Faire', titre: 'Faire la démarche', icon: CheckCircle2,
        description: "Vous êtes prêt(e). Suivez les étapes calmement, écran par écran.",
        encadres: [
            { tone: 'green', icon: CheckCircle2, titre: 'Vous savez', items: ['Trouver le bon site', 'Préparer vos documents'] },
            { tone: 'amber', icon: ShieldCheck, titre: 'Prudence', texte: "Une démarche officielle est gratuite. Si on vous demande de payer, méfiez-vous." },
        ],
        blocs: [
            { type: 'liste', icon: ListChecks, titre: 'Étape par étape', ordonnee: true, items: ['Connectez-vous (ou avec FranceConnect).', 'Choisissez la démarche.', 'Remplissez les informations.', 'Ajoutez vos documents.', 'Validez et gardez la confirmation.'] },
            { type: 'encadre', tone: 'blue', icon: Lightbulb, titre: 'Astuce', texte: "Notez la date et gardez l'email de confirmation comme preuve." },
        ],
    },
];
const DEMARCHES_QUIZ: QuizItem[] = [
    { q: "À quoi reconnaît-on un site public officiel ?", icon: Globe, options: [{ txt: 'Il finit souvent par .gouv.fr', bon: true }, { txt: 'Il fait payer tout', bon: false }, { txt: 'Il est plein de publicités', bon: false }, { txt: "Il n'a pas d'adresse", bon: false }] },
    { q: "Qu'est-ce que FranceConnect ?", icon: UserCheck, options: [{ txt: 'Un jeu en ligne', bon: false }, { txt: 'Se connecter à plusieurs sites publics avec un seul compte', bon: true }, { txt: 'Une banque', bon: false }, { txt: 'Un réseau social', bon: false }] },
    { q: "Que faut-il préparer avant une démarche ?", multi: true, icon: ListChecks, options: [{ txt: 'Ses identifiants', bon: true }, { txt: 'Ses documents en photo/PDF', bon: true }, { txt: 'Son numéro fiscal ou de sécu', bon: true }, { txt: 'La météo', bon: false }] },
    { q: "Une démarche officielle (impôts, CAF)…", icon: Banknote, options: [{ txt: 'Est payante', bon: false }, { txt: 'Est gratuite', bon: true }, { txt: 'Coûte 50 €', bon: false }, { txt: 'Demande le code de la carte bancaire', bon: false }] },
];

// ───────────────────────── MODULE : Payer en ligne en sécurité ─────────────────────────
const PAIEMENT: EtapeContenu[] = [
    {
        label: 'Découvrir', titre: 'Découvrir', icon: Compass,
        description: "Payer sur Internet permet d'acheter sans se déplacer. C'est pratique et sûr si on suit quelques règles.",
        encadres: [
            { tone: 'violet', icon: Target, titre: 'Le but', texte: "Payer en ligne sans danger." },
            { tone: 'green', icon: Lock, titre: 'Le cadenas', texte: "Ne payez que sur un site avec le cadenas et « https »." },
        ],
        blocs: [
            { type: 'texte', icon: CreditCard, titre: 'Comment ça marche', texte: "On met le produit dans le panier, puis on entre les informations de sa carte bancaire pour payer." },
            { type: 'cartes', items: [
                { icon: ShoppingCart, titre: 'Panier', texte: "Ce qu'on veut acheter." },
                { icon: CreditCard, titre: 'Carte', texte: 'Numéro, date, code à 3 chiffres au dos.' },
                { icon: Smartphone, titre: 'Confirmation', texte: 'Un code arrive par SMS.' },
            ] },
        ],
    },
    {
        label: 'Sécuriser', titre: 'Payer en sécurité', icon: ShieldCheck,
        description: "Votre banque ajoute une sécurité : un code de confirmation. Et il y a des règles à ne jamais oublier.",
        encadres: [
            { tone: 'amber', icon: Lightbulb, titre: 'À ne JAMAIS faire', items: ['Donner son code de carte par email ou téléphone', 'Payer sur un site sans cadenas', 'Enregistrer sa carte sur un ordinateur public'] },
        ],
        blocs: [
            { type: 'liste', icon: Smartphone, titre: 'La double sécurité', items: ['Après avoir validé, la banque envoie un code.', "Vous le confirmez par SMS ou dans l'appli de la banque.", "Sans cette confirmation, le paiement ne se fait pas."] },
            { type: 'associer', titre: 'Bon réflexe ou piège ? Reliez', paires: [
                { gauche: 'Site avec cadenas', droite: 'On peut payer' },
                { gauche: 'Email qui demande le code de carte', droite: "C'est une arnaque" },
                { gauche: 'Code reçu par SMS de la banque', droite: 'À confirmer soi-même' },
            ] },
        ],
    },
    {
        label: 'Acheter', titre: 'Faire un achat', icon: ShoppingCart,
        description: "Vous avez les clés. Voici un achat, étape par étape.",
        encadres: [
            { tone: 'green', icon: CheckCircle2, titre: 'Vous savez', items: ['Reconnaître un site sûr', 'Protéger votre carte'] },
        ],
        blocs: [
            { type: 'liste', icon: ListChecks, titre: 'Étape par étape', ordonnee: true, items: ['Vérifiez le cadenas du site.', 'Ajoutez le produit au panier.', 'Entrez les informations de carte.', 'Confirmez avec le code de la banque.', "Gardez l'email de confirmation."] },
            { type: 'encadre', tone: 'blue', icon: Lightbulb, titre: 'Astuce', texte: "Gardez une preuve de l'achat (email ou capture) jusqu'à la réception." },
        ],
    },
];
const PAIEMENT_QUIZ: QuizItem[] = [
    { q: "Avant de payer, que doit-on vérifier ?", icon: Lock, options: [{ txt: 'Que le site a un cadenas et https', bon: true }, { txt: 'Que le site a des couleurs', bon: false }, { txt: 'Rien', bon: false }, { txt: "Qu'il y a de la pub", bon: false }] },
    { q: "La banque envoie un code par SMS. À quoi sert-il ?", icon: Smartphone, options: [{ txt: 'À gagner un cadeau', bon: false }, { txt: "À confirmer que c'est bien vous qui payez", bon: true }, { txt: 'À rien', bon: false }, { txt: 'À changer de carte', bon: false }] },
    { q: "Que ne faut-il JAMAIS faire ?", multi: true, icon: AlertTriangle, options: [{ txt: 'Donner son code de carte par email', bon: true }, { txt: 'Payer sur un site sans cadenas', bon: true }, { txt: 'Confirmer avec le code de sa banque', bon: false }, { txt: 'Enregistrer sa carte sur un ordi public', bon: true }] },
    { q: "Après un achat, c'est bien de…", icon: CheckCircle2, options: [{ txt: "Supprimer tout de suite l'email", bon: false }, { txt: "Garder l'email de confirmation comme preuve", bon: true }, { txt: 'Donner son numéro de carte par téléphone', bon: false }, { txt: 'Ne rien garder', bon: false }] },
];

// ───────────────────────── CATALOGUE ─────────────────────────
export const MODULES: ModuleFormation[] = [
    {
        slug: 'fichiers-windows', titre: 'Gérer ses fichiers sur Windows', categorie: 'Numérique',
        description: "Organiser, classer et retrouver facilement ses fichiers et dossiers sur un ordinateur.",
        icon: Folder, from: '#7c3aed', to: '#9333ea', niveau: 'Débutant', dureeMin: 15,
        disponible: true, href: '/formation/fichiers-windows',
    },
    {
        slug: 'creer-email', titre: 'Créer une adresse email', categorie: 'Numérique',
        description: "Comprendre, créer et sécuriser sa première boîte mail pour communiquer en ligne.",
        icon: Mail, from: '#2563eb', to: '#4f46e5', niveau: 'Débutant', dureeMin: 12,
        disponible: true, etapes: EMAIL, quiz: EMAIL_QUIZ,
    },
    {
        slug: 'rediger-cv', titre: 'Rédiger un CV', categorie: 'Emploi',
        description: "Construire un CV clair et efficace pour décrocher des entretiens.",
        icon: FileText, from: '#0d9488', to: '#0891b2', niveau: 'Débutant', dureeMin: 15,
        disponible: true, etapes: CV, quiz: CV_QUIZ,
    },
    {
        slug: 'internet-securite', titre: 'Naviguer sur Internet en sécurité', categorie: 'Numérique',
        description: "Reconnaître les sites fiables, les arnaques et protéger ses données.",
        icon: ShieldCheck, from: '#db2777', to: '#e11d48', niveau: 'Débutant', dureeMin: 12,
        disponible: true, etapes: INTERNET, quiz: INTERNET_QUIZ,
    },
    {
        slug: 'demarches-en-ligne', titre: 'Faire ses démarches en ligne', categorie: 'Vie quotidienne',
        description: "Utiliser les services publics en ligne (impôts, CAF, santé…) en toute confiance.",
        icon: Globe, from: '#f59e0b', to: '#f97316', niveau: 'Intermédiaire', dureeMin: 18,
        disponible: true, etapes: DEMARCHES, quiz: DEMARCHES_QUIZ,
    },
    {
        slug: 'paiement-en-ligne', titre: 'Payer en ligne en sécurité', categorie: 'Vie quotidienne',
        description: "Faire un achat ou un paiement sur Internet sans se faire piéger.",
        icon: CreditCard, from: '#16a34a', to: '#15803d', niveau: 'Intermédiaire', dureeMin: 12,
        disponible: true, etapes: PAIEMENT, quiz: PAIEMENT_QUIZ,
    },
];

export function getModule(slug: string): ModuleFormation | undefined {
    return MODULES.find((m) => m.slug === slug);
}
