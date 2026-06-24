// * src/lib/partenaire-data.ts
// Données de démonstration de l'espace partenaire (à remplacer par la BDD).
import {
    CalendarDays,
    Palette,
    BookOpen,
    Music,
    type LucideIcon,
} from "lucide-react";

/** Profil de l'organisation partenaire connectée. */
export const PARTENAIRE = {
    organisation: "Médiathèque Centrale",
    type: "Établissement culturel",
    contact: "Julie Bernard",
    initiales: "JB",
};

export type StatutDemande = "Validée" | "En attente" | "Refusée";

export type Demande = {
    id: number;
    atelier: string;
    Icon: LucideIcon;
    date: string;
    creneau: string;
    beneficiaires: number;
    statut: StatutDemande;
    demandeLe: string;
};

/** Demandes de réservation d'atelier déposées par le partenaire. */
export const DEMANDES: Demande[] = [
    {
        id: 1,
        atelier: "Éveil musical",
        Icon: Music,
        date: "12 sept. 2026",
        creneau: "10h00 – 11h30",
        beneficiaires: 12,
        statut: "Validée",
        demandeLe: "28 août 2026",
    },
    {
        id: 2,
        atelier: "Atelier lecture & contes",
        Icon: BookOpen,
        date: "18 sept. 2026",
        creneau: "14h00 – 15h30",
        beneficiaires: 20,
        statut: "En attente",
        demandeLe: "2 sept. 2026",
    },
    {
        id: 3,
        atelier: "Arts plastiques",
        Icon: Palette,
        date: "25 sept. 2026",
        creneau: "09h30 – 11h00",
        beneficiaires: 15,
        statut: "En attente",
        demandeLe: "4 sept. 2026",
    },
    {
        id: 4,
        atelier: "Atelier d'écriture",
        Icon: CalendarDays,
        date: "30 août 2026",
        creneau: "16h00 – 17h30",
        beneficiaires: 10,
        statut: "Refusée",
        demandeLe: "20 août 2026",
    },
];

/** Nombre de messages non lus avec l'équipe. */
export const MESSAGES_NON_LUS = 2;

// ─────────────────────────── Messagerie ───────────────────────────

export type Message = {
    id: number;
    /** "moi" = le partenaire connecté, "equipe" = l'association. */
    auteur: "moi" | "equipe";
    nom: string;
    texte: string;
    heure: string;
};

/** Fil de discussion entre le partenaire et l'équipe (à remplacer par la BDD). */
export const CONVERSATION: Message[] = [
    { id: 1, auteur: "equipe", nom: "Équipe RFC06", texte: "Bonjour Julie ! Merci pour votre demande d'atelier « Éveil musical », nous l'avons bien reçue.", heure: "Lun. 09:12" },
    { id: 2, auteur: "moi", nom: "Médiathèque Centrale", texte: "Bonjour, parfait ! Est-il possible de prévoir une salle adaptée pour une douzaine d'enfants ?", heure: "Lun. 09:30" },
    { id: 3, auteur: "equipe", nom: "Équipe RFC06", texte: "Oui, tout à fait. L'atelier est validé pour le 12 septembre à 10h00. À très vite !", heure: "Lun. 10:05" },
    { id: 4, auteur: "equipe", nom: "Équipe RFC06", texte: "Pensez à nous transmettre la liste des bénéficiaires quelques jours avant la séance.", heure: "Mar. 14:20" },
];

// ─────────────────────────── Planning ───────────────────────────

export type Creneau = {
    id: number;
    atelier: string;
    Icon: LucideIcon;
    jour: string;
    creneau: string;
    placesDispo: number;
    placesTotal: number;
};

/** Créneaux d'ateliers ouverts à la réservation (à remplacer par la BDD). */
export const PLANNING: Creneau[] = [
    { id: 1, atelier: "Éveil musical", Icon: Music, jour: "Lundi 14 sept. 2026", creneau: "10h00 – 11h30", placesDispo: 4, placesTotal: 12 },
    { id: 2, atelier: "Arts plastiques", Icon: Palette, jour: "Lundi 14 sept. 2026", creneau: "14h00 – 15h30", placesDispo: 0, placesTotal: 15 },
    { id: 3, atelier: "Atelier lecture & contes", Icon: BookOpen, jour: "Mercredi 16 sept. 2026", creneau: "09h30 – 11h00", placesDispo: 8, placesTotal: 20 },
    { id: 4, atelier: "Atelier d'écriture", Icon: CalendarDays, jour: "Mercredi 16 sept. 2026", creneau: "16h00 – 17h30", placesDispo: 6, placesTotal: 10 },
    { id: 5, atelier: "Éveil musical", Icon: Music, jour: "Vendredi 18 sept. 2026", creneau: "10h00 – 11h30", placesDispo: 12, placesTotal: 12 },
];

/** Statistiques dérivées des demandes (cohérentes avec la liste). */
export const STATS = {
    total: DEMANDES.length,
    validees: DEMANDES.filter((d) => d.statut === "Validée").length,
    enAttente: DEMANDES.filter((d) => d.statut === "En attente").length,
    messages: MESSAGES_NON_LUS,
};
