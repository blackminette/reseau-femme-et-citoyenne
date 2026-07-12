// * src/app/(dashboard-adultes)/membre/badges/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Target, Star, Trophy, Crown } from "lucide-react";
import { obtenirProfilMembre, obtenirActiviteRecenteAdulte } from "../actions";

export const metadata = {
    title: "Mes badges",
    description: "Consultez vos badges obtenus et ceux à débloquer.",
};

export default async function BadgesAdultePage() {
    const profile = await obtenirProfilMembre();
    const recentScores = await obtenirActiviteRecenteAdulte();

    const progression = profile?.progression ?? 0;

    const badges = [
        {
            label: "1ers pas",
            Icon: Target,
            desc: "Terminer sa première activité.",
            obtenu: recentScores && recentScores.length > 0
        },
        {
            label: "Score parfait",
            Icon: Star,
            desc: "Obtenir une note maximale à un quiz.",
            obtenu: recentScores && recentScores.some(s => s.parfait)
        },
        {
            label: "Assidu(e)",
            Icon: Trophy,
            desc: "Compléter 10 activités au total.",
            obtenu: progression >= 80
        },
        {
            label: "Expert(e)",
            Icon: Crown,
            desc: "Obtenir 5 scores parfaits.",
            obtenu: progression === 100
        },
    ];

    const badgesObtenus = badges.filter(b => b.obtenu).length;

    return (
        <div className="text-violet-900">

            <Link
                href="/membre"
                className="group mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 transition-colors hover:text-violet-800"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Retour au tableau de bord
            </Link>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-violet-950">
                Mes badges
            </h1>
            <p className="mt-1 text-sm text-violet-600 mb-6">
                {badgesObtenus > 0
                    ? `Vous avez obtenu ${badgesObtenus} badge${badgesObtenus > 1 ? 's' : ''} sur ${badges.length}. Continuez comme ça !`
                    : "Complétez des activités pour débloquer vos premiers badges !"}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {badges.map(({ label, Icon, desc, obtenu }) => (
                    <div
                        key={label}
                        className={`flex items-start gap-4 rounded-2xl border p-6 shadow-xs transition-all ${
                            obtenu
                                ? 'border-violet-200 bg-white'
                                : 'border-slate-200 bg-slate-50 opacity-60'
                        }`}
                    >
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                            obtenu ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-300'
                        }`}>
                            <Icon className="h-7 w-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className={`text-sm font-bold ${obtenu ? 'text-violet-950' : 'text-slate-400'}`}>
                                {label}
                            </div>
                            <p className={`mt-1 text-[12px] leading-relaxed ${obtenu ? 'text-violet-600' : 'text-slate-400'}`}>
                                {desc}
                            </p>
                            {obtenu ? (
                                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                                    ✓ Obtenu
                                </span>
                            ) : (
                                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">
                                    🔒 À débloquer
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
