'use client';

import { UserPlus, CalendarDays, Plus } from "lucide-react";
import { ENFANTS } from "@/lib/membre-data";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export const metadata = {
    title: "Mes enfants",
    description: "Les enfants rattachés à votre compte.",
};

export default function MembreEnfantsPage() {
    return (
        <div className="text-violet-900">

            <PageHeader
                titre="Mes enfants"
                sousTitre="Les enfants rattachés à votre compte."
                action={{ href: "/membre/enfants/ajouter", label: "Ajouter un enfant", Icon: UserPlus }}
            />

            {/* Liste des enfants (ou état vide) */}
            {ENFANTS.length === 0 ? (
                <EmptyState
                    className="mt-6"
                    Icon={UserPlus}
                    titre="Aucun enfant rattaché"
                    texte="Ajoutez un enfant pour suivre sa progression et l'inscrire à des ateliers."
                    action={{ href: "/membre/enfants/ajouter", label: "Ajouter un enfant", Icon: Plus }}
                />
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
