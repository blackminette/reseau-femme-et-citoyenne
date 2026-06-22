// * src/app/(dashboard-adultes)/membre/reservations/page.tsx
import React from 'react';
import Link from "next/link";
import { CalendarPlus, CalendarDays, Clock, User } from "lucide-react";
import { RESERVATIONS } from "@/lib/membre-data";

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

export default function MembreReservationsPage() {
    return (
        <div className="text-violet-900">

            {/* En-tête : titre à gauche, bouton "Réserver" à droite */}
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-violet-200 pb-5">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-violet-950">Mes réservations</h1>
                    <p className="text-sm text-violet-600">Les ateliers que vous avez réservés, pour vous et vos enfants.</p>
                </div>
                <Link
                    href="/membre/reserver"
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
                >
                    <CalendarPlus className="h-4 w-4" aria-hidden /> Réserver un atelier
                </Link>
            </div>

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
