'use client'; // nécessaire car on gère le choix du participant et le clic "Réserver"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, Users, Check } from "lucide-react";
import { ENFANTS, ATELIERS, NOM_COMPLET_MEMBRE } from "@/lib/membre-data";

// Participants possibles : le membre lui-même, puis ses enfants rattachés (s'il en a).
const PARTICIPANTS = [`Moi (${NOM_COMPLET_MEMBRE})`, ...ENFANTS.map(e => `${e.prenom} ${e.nom}`)];

export default function MembreReserverPage() {
    const router = useRouter();
    const [participant, setParticipant] = useState(PARTICIPANTS[0]);

    const handleReserver = () => {
        // TODO : enregistrer la réservation en base de données pour `participant`
        router.push("/membre/reservations");
    };

    return (
        <div className="text-violet-900">

            {/* Lien retour */}
            <Link href="/membre/reservations" className="inline-flex items-center gap-1.5 text-sm text-violet-500 transition-colors hover:text-violet-700">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Retour aux réservations
            </Link>

            {/* En-tête */}
            <div className="mt-3 flex flex-col gap-1 border-b border-violet-200 pb-5">
                <h1 className="text-3xl font-bold tracking-tight text-violet-950">Réserver un atelier</h1>
                <p className="text-sm text-violet-600">Choisissez le participant puis un atelier disponible.</p>
            </div>

            {/* Choix du participant */}
            <div className="mt-6 max-w-sm rounded-2xl border border-violet-200 bg-white p-6 shadow-xs">
                <label htmlFor="participant" className="block text-sm font-semibold text-violet-800">Pour qui ?</label>
                <select
                    id="participant" value={participant} onChange={e => setParticipant(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-violet-200 px-4 py-2.5 text-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                    {PARTICIPANTS.map(nom => <option key={nom} value={nom}>{nom}</option>)}
                </select>
                {ENFANTS.length === 0 && (
                    <p className="mt-2 text-[11px] text-violet-500">
                        Ajoutez un enfant depuis « Mes enfants » pour pouvoir réserver aussi pour lui.
                    </p>
                )}
            </div>

            {/* Liste des ateliers disponibles */}
            <div className="mt-6 grid gap-4">
                {ATELIERS.map(({ id, titre, date, creneau, places, public: pub }) => {
                    const complet = places === 0;
                    return (
                        <article key={id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-200 bg-white p-6 shadow-xs">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-bold text-violet-950">{titre}</h2>
                                    <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold text-violet-600">{pub}</span>
                                </div>
                                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-violet-500">
                                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden /> {date}</span>
                                    <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden /> {creneau}</span>
                                    <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" aria-hidden /> {complet ? "Complet" : `${places} place${places > 1 ? "s" : ""}`}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleReserver} disabled={complet}
                                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-200"
                            >
                                <Check className="h-4 w-4" aria-hidden /> Réserver
                            </button>
                        </article>
                    );
                })}
            </div>

        </div>
    );
}
