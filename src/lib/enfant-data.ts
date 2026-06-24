// * src/lib/enfant-data.ts
// Données simulées de l'espace enfant (visuel uniquement — à brancher sur la BDD plus tard).
// Source unique, comme membre-data.ts.

import type { LucideIcon } from "lucide-react";
import {
    BookOpen, Laptop, Cpu, Languages, Landmark, Leaf,
    Target, Star, Trophy, Crown, Search, Globe, HelpCircle, Check,
} from "lucide-react";

// Enfant connecté à son espace.
export const ENFANT = {
    prenom: "Léa", nom: "Martin", age: 9, initiales: "LM",
    progression: 73,
};

// Modules d'apprentissage. Couleurs reprises de la maquette (dégradés), icônes lucide.
export type Module = { id: string; label: string; Icon: LucideIcon; progression: number; from: string; to: string };
export const MODULES: Module[] = [
    { id: "lecture", label: "Lecture & compréhension", Icon: BookOpen, progression: 73, from: "#66bb6a", to: "#2e7d32" },
    { id: "numerique", label: "Numérique", Icon: Laptop, progression: 85, from: "#42a5f5", to: "#0d47a1" },
    { id: "robotique", label: "Robotique", Icon: Cpu, progression: 0, from: "#9b8cff", to: "#6d5ba8" },
    { id: "anglais", label: "Anglais", Icon: Languages, progression: 0, from: "#ec407a", to: "#880e4f" },
    { id: "civique", label: "Éducation civique", Icon: Landmark, progression: 0, from: "#ffa726", to: "#e65100" },
    { id: "eco", label: "Éco-citoyenneté", Icon: Leaf, progression: 0, from: "#26a69a", to: "#00695c" },
];

// Badges. obtenu = débloqué ; sinon "progress" indique l'avancement vers le déblocage.
export type Badge = {
    label: string; emoji: string; desc: string; obtenu: boolean;
    progress?: { cur: number; max: number; txt: string };
};
export const BADGES: Badge[] = [
    { label: "1ers pas", emoji: "🎯", desc: "Terminer sa première activité.", obtenu: true },
    { label: "Score parfait", emoji: "⭐", desc: "Obtenir une note maximale.", obtenu: true },
    { label: "Assidu", emoji: "🏆", desc: "Compléter 10 activités au total.", obtenu: false, progress: { cur: 9, max: 10, txt: "9 / 10 activités" } },
    { label: "Expert", emoji: "👑", desc: "Obtenir 5 scores parfaits.", obtenu: false, progress: { cur: 3, max: 5, txt: "3 / 5 scores parfaits" } },
    { label: "Curieux", emoji: "🔍", desc: "Essayer 3 modules différents.", obtenu: true },
    { label: "Explorateur", emoji: "🌍", desc: "Avoir touché à tous les modules !", obtenu: false, progress: { cur: 5, max: 6, txt: "5 / 6 modules explorés" } },
];

// Dernier badge débloqué (bandeau "nouveau badge").
export const DERNIER_BADGE = { label: "1ers pas", emoji: "🎯", desc: "Terminer sa première activité." };

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
