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

/** Statistiques dérivées des demandes (cohérentes avec la liste). */
export const STATS = {
    total: DEMANDES.length,
    validees: DEMANDES.filter((d) => d.statut === "Validée").length,
    enAttente: DEMANDES.filter((d) => d.statut === "En attente").length,
    messages: MESSAGES_NON_LUS,
};
