import Link from "next/link";
import { UserPlus, CalendarDays } from "lucide-react";

export const metadata = {
    title: "Mes enfants",
    description: "Les enfants rattachés à votre compte.",
};

// Enfants simulés (à remplacer par la base de données plus tard)
const ENFANTS = [
    { id: 1, prenom: "Lina",  naissance: "12 mars 2016",    initiales: "L", couleur: "from-indigo-400 to-purple-500" },
    { id: 2, prenom: "Adam",  naissance: "5 juillet 2018",  initiales: "A", couleur: "from-rose-400 to-pink-500"   },
];

export default function MembreEnfantsPage() {
    return (
        <div className="space-y-8">

            {/* En-tête : titre à gauche, bouton "Ajouter" à droite */}
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold text-slate-900">Mes enfants</h1>
                    <p className="text-slate-500">Les enfants rattachés à votre compte.</p>
                </div>
                <Link href="/membre/enfants/ajouter" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                    <UserPlus className="w-4 h-4" aria-hidden /> Ajouter un enfant
                </Link>
            </header>

            {/* Liste des enfants (ou message si vide) */}
            {ENFANTS.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center text-slate-500">
                    Aucun enfant rattaché pour le moment.
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {ENFANTS.map(({ id, prenom, naissance, initiales, couleur }) => (
                        <article key={id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-5">
                            {/* Avatar avec dégradé de couleur */}
                            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${couleur} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
                                {initiales}
                            </div>
                            <div className="space-y-1">
                                <h2 className="font-bold text-slate-900 text-lg">{prenom}</h2>
                                <p className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                                    <CalendarDays className="w-4 h-4" aria-hidden /> Né(e) le {naissance}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}

        </div>
    );
}
