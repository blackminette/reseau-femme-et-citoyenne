// * src/lib/membre-data.ts
// Données simulées de l'espace membre (visuel uniquement — à brancher sur la BDD plus tard).
// Source UNIQUE : centralisé ici pour éviter toute duplication entre les pages de l'espace membre.

import type { LucideIcon } from "lucide-react";
import { BookOpen, Calculator, Laptop, Scale, Palette } from "lucide-react";

// Métriques d'apprentissage communes au membre et à ses enfants.
export type Metriques = {
    progression: number;
    ModuleIcon: LucideIcon;
    modulePref: string;
    temps: string;
    derniere: string;
    serie: number;
    quizReussis: number;
    quizTotal: number;
};

// Le membre est aussi un apprenant : il a sa propre progression.
export type Membre = Metriques & {
    prenom: string;
    nom: string;
    initiales: string;
    badges: number;
    modules: { Icon: LucideIcon; label: string }[];
};

export const MEMBRE: Membre = {
    prenom: "Sophie", nom: "Martin", initiales: "SM",
    progression: 64, ModuleIcon: Laptop, modulePref: "Numérique",
    temps: "3h45", derniere: "20/05/2026", serie: 3, quizReussis: 6, quizTotal: 8,
    badges: 3,
    modules: [
        { Icon: Laptop, label: "Numérique" },
        { Icon: BookOpen, label: "Lecture & compréhension" },
        { Icon: Scale, label: "Éducation civique" },
    ],
};

// Nom affiché du membre, réutilisé dans les sélecteurs et les réservations.
export const NOM_COMPLET_MEMBRE = `${MEMBRE.prenom} ${MEMBRE.nom}`;

export type Enfant = Metriques & {
    id: number;
    prenom: string; nom: string; age: number; naissance: string;
    username: string; initiales: string; couleur: string;
    difficulte: string[] | null; reservations: number; badges: number;
};

// Enfants réellement rattachés au compte.
export const ENFANTS_RATTACHES: Enfant[] = [
    {
        id: 1, prenom: "Lina", nom: "Martin", age: 10, naissance: "12 mars 2016",
        username: "lina_martin", initiales: "L", couleur: "from-indigo-400 to-purple-500",
        progression: 73, ModuleIcon: BookOpen, modulePref: "Lecture & compréhension",
        temps: "1h12", derniere: "22/05/2026", serie: 0, quizReussis: 5, quizTotal: 7,
        difficulte: null, reservations: 2, badges: 4,
    },
    {
        id: 2, prenom: "Adam", nom: "Martin", age: 7, naissance: "5 juillet 2018",
        username: "adam_martin", initiales: "A", couleur: "from-rose-400 to-pink-500",
        progression: 48, ModuleIcon: Calculator, modulePref: "Logique & calcul",
        temps: "42 min", derniere: "19/05/2026", serie: 0, quizReussis: 2, quizTotal: 4,
        difficulte: ["Lecture & compréhension"], reservations: 1, badges: 2,
    },
];

// 🔁 DÉMO : true = membre SANS enfant · false = membre AVEC enfants.
// Remplacer par les enfants réellement rattachés au compte (BDD) le moment venu.
export const SIMULER_SANS_ENFANT = true;
export const ENFANTS: Enfant[] = SIMULER_SANS_ENFANT ? [] : ENFANTS_RATTACHES;

// Ateliers proposés à la réservation (mélange adultes / enfants).
export type Atelier = { id: number; titre: string; date: string; creneau: string; places: number; public: "Adultes" | "Enfants" };
export const ATELIERS: Atelier[] = [
    { id: 1, titre: "Atelier numérique", date: "Mercredi 18 juin 2026", creneau: "14h00 – 15h30", places: 5, public: "Adultes" },
    { id: 2, titre: "Français langue étrangère", date: "Jeudi 19 juin 2026", creneau: "09h30 – 11h00", places: 3, public: "Adultes" },
    { id: 3, titre: "Initiation au dessin", date: "Mercredi 25 juin 2026", creneau: "16h00 – 17h00", places: 4, public: "Enfants" },
    { id: 4, titre: "Éveil musical", date: "Samedi 28 juin 2026", creneau: "10h30 – 11h30", places: 0, public: "Enfants" },
];

// Réservations du membre (et de ses enfants). "participant" = membre ou enfant.
export type Reservation = { id: number; atelier: string; participant: string; date: string; creneau: string; statut: "Confirmée" | "En attente" | "Annulée" };
export const RESERVATIONS: Reservation[] = [
    { id: 1, atelier: "Atelier numérique", participant: NOM_COMPLET_MEMBRE, date: "Mercredi 18 juin 2026", creneau: "14h00 – 15h30", statut: "Confirmée" },
    { id: 2, atelier: "Français langue étrangère", participant: NOM_COMPLET_MEMBRE, date: "Jeudi 19 juin 2026", creneau: "09h30 – 11h00", statut: "En attente" },
];

// Activité récente (pertinente seulement s'il y a des enfants).
export type Activite = { enfant: string; Icon: LucideIcon; action: string; module: string; date: string; score: string; parfait: boolean };
export const ACTIVITES: Activite[] = [
    { enfant: "Lina", Icon: BookOpen, action: "a terminé le quiz", module: "Lecture & compréhension", date: "Hier", score: "8/8", parfait: true },
    { enfant: "Adam", Icon: Calculator, action: "a fait l'exercice", module: "Logique & calcul", date: "Il y a 2 jours", score: "5/7", parfait: false },
    { enfant: "Lina", Icon: Palette, action: "a fait l'exercice", module: "Arts créatifs", date: "Il y a 3 jours", score: "6/6", parfait: true },
];
