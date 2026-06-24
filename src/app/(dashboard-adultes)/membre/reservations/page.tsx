// * src/app/(app-avec-header)/(dashboard)/membre/reservations/page.tsx
'use client';

import React from 'react';
import { CalendarPlus, CalendarDays, Clock, User } from "lucide-react";
import { RESERVATIONS } from "@/lib/membre-data";
import PageHeader from "@/components/PageHeader";

export const metadata = {
    title: "Mes réservations",
    description: "Les ateliers que vous avez réservés, pour vous et vos enfants.",
};

// Couleur du badge selon le statut de la réservation.
const STATUT_STYLE: Record<string, string> = {
    "Confirmée": "bg-emerald-50 text-emerald-600",
    "En attente": "bg-amber-50 text-amber-600",
    "Annulée": "bg-rose-50 text-rose-600",
};

/**
 * Page listant les réservations d'ateliers associatifs publics pour les enfants rattachés au compte parent.
 * Accessible uniquement pour le rôle 'MEMBRE'.
 */

export default function MembreReservationsPage() {
    return (
        <div className="text-violet-900">

            <PageHeader
                titre="Mes réservations"
                sousTitre="Les ateliers que vous avez réservés, pour vous et vos enfants."
                action={{ href: "/membre/reserver", label: "Réserver un atelier", Icon: CalendarPlus }}
            />

            {/* Liste des réservations (ou message si vide) */}
            {RESERVATIONS.length === 0 ? (
                <div className="mt-6 max-w-5xl rounded-2xl border border-violet-200 bg-white p-10 text-center text-sm text-violet-500 shadow-xs">
                    Vous n&apos;avez aucune réservation pour le moment.
                </div>
            ) : (
                <div className="mt-6 grid max-w-5xl gap-4">
                    {RESERVATIONS.map(({ id, atelier, participant, date, creneau, statut }) => (
                        <article key={id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-200 bg-white p-6 shadow-xs">
                            <div className="space-y-2">
                                <h2 className="font-bold text-violet-950">{atelier}</h2>
                                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-violet-500">
                                    <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" aria-hidden /> {participant}</span>
                                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden /> {date}</span>
                                    <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden /> {creneau}</span>
                                </div>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUT_STYLE[statut]}`}>{statut}</span>
                        </article>
                    ))}
                </div>
            )}

        </div>
    );
}
