// * src/lib/enfant-data.ts
// Données simulées de l'espace enfant (visuel uniquement — à brancher sur la BDD plus tard).
// Source unique, comme membre-data.ts.

import type { LucideIcon } from "lucide-react";
import {
    BookOpen, Laptop, Cpu, Languages, Landmark, Leaf,
    Target, Star, Trophy, Crown, HelpCircle, Check,
    Palette, Drama, Cookie, Scissors, Shapes, Sprout, Music, Camera,
} from "lucide-react";

// Enfant connecté à son espace.
export const ENFANT = {
    prenom: "Léa", nom: "Martin", age: 9, initiales: "LM",
    progression: 73, badgesObtenus: 6,
};

// Modules d'apprentissage. Couleurs reprises de la maquette (dégradés), icônes lucide.
export type Module = { id: string; label: string; Icon: LucideIcon; progression: number; from: string; to: string; slug?: string };
export const MODULES: Module[] = [
    { id: "lecture", label: "Lecture & compréhension", Icon: BookOpen, progression: 73, from: "#66bb6a", to: "#2e7d32" },
    { id: "numerique", label: "Numérique", Icon: Laptop, progression: 85, from: "#42a5f5", to: "#0d47a1" },
    { id: "robotique", label: "Robotique", Icon: Cpu, progression: 0, from: "#9b8cff", to: "#6d5ba8" },
    { id: "anglais", label: "Anglais", Icon: Languages, progression: 0, from: "#ec407a", to: "#880e4f" },
    { id: "civique", label: "Éducation civique", Icon: Landmark, progression: 0, from: "#ffa726", to: "#e65100" },
    { id: "napoleon", label: "Napoléon", Icon: Crown, progression: 0, from: "#f59e0b", to: "#7c2d12" },
    { id: "eco", label: "Éco-citoyenneté", Icon: Leaf, progression: 0, from: "#26a69a", to: "#00695c" },
];

// Badges (4 affichés). obtenu = débloqué.
export type Badge = { label: string; Icon: LucideIcon; desc: string; obtenu: boolean };
export const BADGES: Badge[] = [
    { label: "1ers pas", Icon: Target, desc: "Terminer sa première activité.", obtenu: true },
    { label: "Score parfait", Icon: Star, desc: "Obtenir une note maximale.", obtenu: true },
    { label: "Assidu", Icon: Trophy, desc: "Compléter 10 activités au total.", obtenu: false },
    { label: "Expert", Icon: Crown, desc: "Obtenir 5 scores parfaits.", obtenu: false },
];

// Dernier badge débloqué (bandeau "nouveau badge").
export const DERNIER_BADGE = { label: "1ers pas", Icon: Target, desc: "Terminer sa première activité." };

// Derniers résultats (quiz / exercices).
export type Resultat = { id: number; Icon: LucideIcon; titre: string; date: string; score: string; parfait: boolean };
export const RESULTATS: Resultat[] = [
    { id: 1, Icon: BookOpen, titre: "Quiz — Lecture & compréhension", date: "22/05/2026", score: "1/1", parfait: true },
    { id: 2, Icon: BookOpen, titre: "Quiz — Lecture & compréhension", date: "20/05/2026", score: "2/5", parfait: false },
    { id: 3, Icon: HelpCircle, titre: "Quiz — culturegen", date: "20/05/2026", score: "6/10", parfait: false },
    { id: 4, Icon: HelpCircle, titre: "Quiz — maths", date: "20/05/2026", score: "3/10", parfait: false },
];

// Activité récente.
export type ActiviteEnfant = { id: number; Icon: LucideIcon; titre: string; module: string; date: string; score: string; parfait: boolean };
export const ACTIVITE: ActiviteEnfant[] = [
    { id: 1, Icon: Star, titre: "Tu as terminé le quiz", module: "Lecture & compréhension", date: "22/05/2026", score: "1/1", parfait: true },
    { id: 2, Icon: Check, titre: "Tu as terminé le quiz", module: "Lecture & compréhension", date: "20/05/2026", score: "2/5", parfait: false },
    { id: 3, Icon: Check, titre: "Tu as terminé le quiz", module: "culturegen", date: "20/05/2026", score: "6/10", parfait: false },
];

// ─── Ateliers ───

// Ateliers réservés par la famille pour l'enfant.
export type AtelierReserve = {
    id: number; atelier: string; Icon: LucideIcon;
    jour: number; mois: string; annee: number;
    lieu: string; age: number; paiement: "Carte bancaire" | "Espèces";
    demande: string; message: string | null;
    statut: "Confirmé" | "En attente" | "Refusé";
};
export const ATELIERS_RESERVES: AtelierReserve[] = [
    { id: 1, atelier: "Peinture libre", Icon: Palette, jour: 7, mois: "Juin", annee: 2026, lieu: "Saint-Roch", age: 9, paiement: "Carte bancaire", demande: "18 juin 2026", message: "Atelier pour Léa.", statut: "Confirmé" },
    { id: 2, atelier: "Couture créative", Icon: Scissors, jour: 18, mois: "Juin", annee: 2026, lieu: "Trachel", age: 9, paiement: "Espèces", demande: "18 juin 2026", message: null, statut: "En attente" },
    { id: 3, atelier: "Argile & modelage", Icon: Shapes, jour: 11, mois: "Juin", annee: 2026, lieu: "Saint-Roch", age: 11, paiement: "Carte bancaire", demande: "18 juin 2026", message: "Atelier pour Jules.", statut: "Confirmé" },
];

// Catalogue d'ateliers proposés (couleurs reprises de la maquette, icônes lucide).
export type AtelierCatalogue = {
    id: string; titre: string; Icon: LucideIcon; couleur: string; desc: string;
    ageMin: number; ageMax: number; date: string; heure: string; places: number; lieu: string;
};
export const ATELIERS_CATALOGUE: AtelierCatalogue[] = [
    { id: "peinture", titre: "Peinture libre", Icon: Palette, couleur: "#f0a020", desc: "Exprime-toi librement avec peintures et pinceaux. Chaque œuvre est unique !", ageMin: 4, ageMax: 12, date: "14 juin 2026", heure: "14h00 – 16h00", places: 6, lieu: "Salle Picasso" },
    { id: "theatre", titre: "Théâtre & jeux", Icon: Drama, couleur: "#9b8cff", desc: "Improvisation, scénario et mise en scène dans une ambiance bienveillante.", ageMin: 7, ageMax: 12, date: "17 juin 2026", heure: "10h00 – 12h00", places: 8, lieu: "Grande salle" },
    { id: "patisserie", titre: "Atelier pâtisserie", Icon: Cookie, couleur: "#f97c7c", desc: "Cuisinez des recettes simples et délicieuses en vous amusant.", ageMin: 6, ageMax: 12, date: "21 juin 2026", heure: "14h30 – 16h30", places: 5, lieu: "Cuisine pédagogique" },
    { id: "couture", titre: "Couture créative", Icon: Scissors, couleur: "#4caf50", desc: "Apprenez les bases de la couture et créez vos propres accessoires.", ageMin: 8, ageMax: 12, date: "24 juin 2026", heure: "10h00 – 12h30", places: 6, lieu: "Atelier textile" },
    { id: "argile", titre: "Argile & modelage", Icon: Shapes, couleur: "#29b6f6", desc: "Créez des sculptures en argile et laissez libre cours à votre imagination.", ageMin: 5, ageMax: 12, date: "2 juillet 2026", heure: "14h00 – 16h00", places: 7, lieu: "Salle arts plastiques" },
    { id: "nature", titre: "Explorateurs de la nature", Icon: Sprout, couleur: "#66bb6a", desc: "Observation des plantes, petites expériences et herbier à ramener chez soi.", ageMin: 4, ageMax: 10, date: "5 juillet 2026", heure: "10h00 – 12h00", places: 10, lieu: "Jardin pédagogique" },
    { id: "musique", titre: "Initiation musicale", Icon: Music, couleur: "#ec407a", desc: "Découverte des rythmes, des instruments et du chant choral en groupe.", ageMin: 5, ageMax: 12, date: "8 juillet 2026", heure: "14h00 – 15h30", places: 12, lieu: "Salle musique" },
    { id: "photo", titre: "Photo & créativité", Icon: Camera, couleur: "#ff7043", desc: "Apprends à cadrer, observer et raconter une histoire avec ton appareil photo.", ageMin: 9, ageMax: 12, date: "12 juillet 2026", heure: "10h00 – 12h00", places: 8, lieu: "Salle multimédia" },
];
