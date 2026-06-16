import Link from "next/link";
import { CalendarPlus, CalendarDays, Clock, User } from "lucide-react";

export const metadata = {
    title: "Mes réservations",
    description: "Les ateliers réservés pour vos enfants.",
};

// Réservations simulées (à remplacer par la base de données plus tard)
const RESERVATIONS = [
    { id: 1, atelier: "Initiation au dessin", enfant: "Lina", date: "Mercredi 18 juin 2026", creneau: "14h00 – 15h30", statut: "Confirmée" },
    { id: 2, atelier: "Atelier pâtisserie", enfant: "Adam", date: "Samedi 21 juin 2026", creneau: "10h00 – 12h00", statut: "En attente" },
    { id: 3, atelier: "Théâtre & expression", enfant: "Lina", date: "Mercredi 25 juin 2026", creneau: "16h00 – 17h00", statut: "Confirmée" },
];

// Couleur du badge selon le statut de la réservation
const STATUT_STYLE: Record<string, string> = {
    "Confirmée": "bg-emerald-50 text-emerald-600",
    "En attente": "bg-amber-50 text-amber-600",
    "Annulée": "bg-red-50 text-red-600",
};

export default function MembreReservationsPage() {
    return (
        <div className="space-y-8">

            {/* Bandeau d'accueil dégradé : titre à gauche, bouton "Réserver" à droite */}
            <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-lg">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" aria-hidden />
                <div className="relative flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold">Mes réservations</h1>
                        <p className="text-white/80">Les ateliers réservés pour vos enfants.</p>
                    </div>
                    <Link href="/membre/reserver" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-indigo-600 bg-white hover:bg-white/90 transition-colors">
                        <CalendarPlus className="w-4 h-4" aria-hidden /> Réserver un atelier
                    </Link>
                </div>
            </header>

            {/* Liste des réservations (ou message si vide) */}
            {RESERVATIONS.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center text-slate-500">
                    Vous n'avez aucune réservation pour le moment.
                </div>
            ) : (
                <div className="grid gap-4">
                    {RESERVATIONS.map(({ id, atelier, enfant, date, creneau, statut }) => (
                        <article key={id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-2">
                                <h2 className="font-bold text-slate-900">{atelier}</h2>
                                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                                    <span className="inline-flex items-center gap-1.5"><User className="w-4 h-4" aria-hidden /> {enfant}</span>
                                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4" aria-hidden /> {date}</span>
                                    <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" aria-hidden /> {creneau}</span>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUT_STYLE[statut]}`}>{statut}</span>
                        </article>
                    ))}
                </div>
            )}

        </div>
    );
}
