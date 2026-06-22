// * src/app/(dashboard-adultes)/membre/enfants/page.tsx
import React from "react";
import Link from "next/link";
import { UserPlus, CalendarDays, Plus } from "lucide-react";
import { ENFANTS } from "@/lib/membre-data";

export const metadata = {
    title: "Mes enfants",
    description: "Les enfants rattachés à votre compte.",
};

export default function MembreEnfantsPage() {
    return (
        <div className="text-violet-900">

            {/* En-tête : titre à gauche, bouton "Ajouter" à droite */}
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-violet-200 pb-5">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-violet-950">Mes enfants</h1>
                    <p className="text-sm text-violet-600">Les enfants rattachés à votre compte.</p>
                </div>
                <Link
                    href="/membre/enfants/ajouter"
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
                >
                    <UserPlus className="h-4 w-4" aria-hidden /> Ajouter un enfant
                </Link>
            </div>

            {/* Liste des enfants (ou état vide) */}
            {ENFANTS.length === 0 ? (
                <div className="mt-6 max-w-5xl rounded-2xl border-2 border-dashed border-violet-200 bg-white p-10 text-center shadow-xs">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                        <UserPlus className="h-8 w-8" aria-hidden />
                    </div>
                    <h2 className="mt-5 text-xl font-bold text-violet-950">Aucun enfant rattaché</h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-violet-600">
                        Ajoutez un enfant pour suivre sa progression et l&apos;inscrire à des ateliers.
                    </p>
                    <Link
                        href="/membre/enfants/ajouter"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
                    >
                        <Plus className="h-4 w-4" aria-hidden /> Ajouter un enfant
                    </Link>
                </div>
            ) : (
                <div className="mt-6 grid max-w-5xl gap-4 sm:grid-cols-2">
                    {ENFANTS.map(({ id, prenom, naissance, initiales, couleur }) => (
                        <article key={id} className="flex items-center gap-5 rounded-2xl border border-violet-200 bg-white p-6 shadow-xs">
                            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${couleur} text-xl font-bold text-white`}>
                                {initiales}
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-violet-950">{prenom}</h2>
                                <p className="inline-flex items-center gap-1.5 text-sm text-violet-500">
                                    <CalendarDays className="h-4 w-4" aria-hidden /> Né(e) le {naissance}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}

        </div>
    );
}
