'use client'; // nécessaire car on gère le choix de l'enfant et le clic "Réserver"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, Users, Check } from "lucide-react";

// Enfants du compte (à remplacer par la base de données plus tard)
const ENFANTS = ["Lina", "Adam"];

// Ateliers disponibles à la réservation (simulés)
const ATELIERS = [
    { id: 1, titre: "Initiation au dessin",   date: "Mercredi 18 juin 2026", creneau: "14h00 – 15h30", places: 4 },
    { id: 2, titre: "Atelier pâtisserie",     date: "Samedi 21 juin 2026",   creneau: "10h00 – 12h00", places: 2 },
    { id: 3, titre: "Théâtre & expression",   date: "Mercredi 25 juin 2026", creneau: "16h00 – 17h00", places: 6 },
    { id: 4, titre: "Éveil musical",          date: "Samedi 28 juin 2026",   creneau: "10h30 – 11h30", places: 0 },
];

export default function MembreReserverPage() {
    const router = useRouter();
    const [enfant, setEnfant] = useState(ENFANTS[0]);

    const handleReserver = () => {
        // TODO : enregistrer la réservation en base de données
        router.push("/membre/reservations");
    };

    return (
        <div className="space-y-8">

            <div className="space-y-3">
                {/* Lien retour vers la liste des réservations */}
                <Link href="/membre/reservations" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft className="w-4 h-4" aria-hidden /> Retour aux réservations
                </Link>
                {/* Bandeau d'accueil dégradé */}
                <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-lg">
                    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" aria-hidden />
                    <div className="relative space-y-1">
                        <h1 className="text-3xl font-extrabold">Réserver un atelier</h1>
                        <p className="text-white/80">Choisissez un enfant puis un atelier disponible.</p>
                    </div>
                </header>
            </div>

            {/* Choix de l'enfant pour qui réserver */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-2 max-w-sm">
                <label htmlFor="enfant" className="block text-sm font-semibold text-slate-700">Pour quel enfant ?</label>
                <select
                    id="enfant" value={enfant} onChange={e => setEnfant(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {ENFANTS.map(nom => <option key={nom} value={nom}>{nom}</option>)}
                </select>
            </div>

            {/* Liste des ateliers disponibles */}
            <div className="grid gap-4">
                {ATELIERS.map(({ id, titre, date, creneau, places }) => {
                    const complet = places === 0;
                    return (
                        <article key={id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-2">
                                <h2 className="font-bold text-slate-900">{titre}</h2>
                                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4" aria-hidden /> {date}</span>
                                    <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" aria-hidden /> {creneau}</span>
                                    <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4" aria-hidden /> {complet ? "Complet" : `${places} place${places > 1 ? "s" : ""}`}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleReserver} disabled={complet}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                <Check className="w-4 h-4" aria-hidden /> Réserver
                            </button>
                        </article>
                    );
                })}
            </div>

        </div>
    );
}
