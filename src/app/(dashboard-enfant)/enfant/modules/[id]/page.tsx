// * src/app/(dashboard-enfant)/enfant/modules/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
    ChevronLeft, Play, CheckCircle, Lock, Trophy,
    Star, Sparkles, BookOpen
} from 'lucide-react';
import { ENFANT, MODULES } from '@/lib/enfant-data';
import {
    obtenirProfilEnfant,
    obtenirDetailsModuleDepuisDB,
    obtenirModulesDuParcours
} from '../actions';

// Types d'activités
type Activite = {
    id: string;
    titre: string;
    description: string;
    type: 'quiz' | 'lecon' | 'exercice';
    statut: 'termine' | 'a_faire' | 'verrouille';
    score?: string;
    parfait?: boolean;
    difficulte?: 'FACILE' | 'MOYEN' | 'DIFFICILE';
};

type Params = Promise<{ id: string }>;

export default function EnfantModuleDetailPage() {
    const params = useParams();
    const rawId = (params?.id as string) || '';
    const id = rawId.toLowerCase();

    const [activites, setActivites] = useState<Activite[]>([]);
    const [progression, setProgression] = useState(0);
    const [dbModule, setDbModule] = useState<any | null>(null);
    const [modulesList, setModulesList] = useState<Array<{ id: string; dbId: number | null; label: string; description: string; progression: number; slug: string }>>([]);
    const [enfant, setEnfant] = useState<typeof ENFANT>(ENFANT);
    const [loading, setLoading] = useState(true);

    const isParcours = ['lecture', 'numerique', 'robotique', 'anglais', 'civique', 'eco'].includes(id);

    useEffect(() => {
        if (!id) return;

        async function loadData() {
            setLoading(true);
            try {
                // Charger le profil enfant
                const prof = await obtenirProfilEnfant();
                if (prof) setEnfant(prof);

                if (isParcours) {
                    // Charger les modules du parcours
                    const mods = await obtenirModulesDuParcours(id);
                    setModulesList(mods);
                } else {
                    const dbMod = await obtenirDetailsModuleDepuisDB(id);
                    if (dbMod) {
                        setDbModule(dbMod);
                        setActivites(dbMod.activites as Activite[]);
                        setProgression(dbMod.progression);
                    }
                }
            } catch (err) {
                console.error("Erreur de chargement du module/profil depuis le serveur :", err);
            }
            setLoading(false);
        }

        loadData();
    }, [id, isParcours]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-violet-900">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
                <p className="mt-4 text-violet-500">Chargement de ton aventure...</p>
            </div>
        );
    }

    // Récupération des informations statiques du module/parcours
    const currentModule = (MODULES.find((m) => m.id === id) ||
        (dbModule ? MODULES.find((m) => m.id === dbModule.slug) : null)) as any;

    const fallbackModule = {
        id: id,
        label: dbModule ? dbModule.label : "Module",
        Icon: BookOpen,
        progression: progression,
        from: "#66bb6a",
        to: "#2e7d32"
    };

    const displayModule: any = currentModule ? {
        ...currentModule,
        label: dbModule ? dbModule.label : currentModule.label,
        progression: progression
    } : (dbModule ? fallbackModule : null);

    // ─── RENDU CAS A : C'est une page Parcours (qui liste ses modules) ───
    if (isParcours) {
        const meta = MODULES.find((m) => m.id === id) || {
            label: id.toUpperCase(),
            Icon: BookOpen,
            from: "#6d5ba8",
            to: "#5b4a98"
        };

        return (
            <div className="text-violet-900">
                {/* Bouton Retour */}
                <div className="mb-4">
                    <Link
                        href="/enfant/modules"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3.5 py-2 text-xs font-bold text-violet-700 shadow-xs hover:bg-violet-50 hover:text-violet-900 transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" /> Retour aux parcours
                    </Link>
                </div>

                {/* Barre du haut */}
                <div className="relative mt-2 flex flex-wrap items-center justify-between gap-5">
                    <div className="relative z-10">
                        <h1 className="flex items-center gap-2.5 text-[26px] font-extrabold tracking-tight text-violet-950">
                            <span
                                className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                                style={{ backgroundImage: `linear-gradient(135deg, ${meta.from}, ${meta.to})` }}
                            >
                                <meta.Icon className="h-5 w-5" aria-hidden />
                            </span>
                            <span className="whitespace-nowrap">Parcours : {meta.label}</span>
                        </h1>
                        <p className="text-[13px] text-violet-600">Choisis un module pour commencer à apprendre et t&apos;exercer !</p>
                    </div>
                </div>

                {/* Liste des modules sous ce parcours */}
                <section className="mt-8 mb-6">
                    {modulesList.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {modulesList.map((mod) => (
                                <Link
                                    key={mod.id}
                                    href={`/enfant/modules/${mod.slug || mod.id}`}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-300"
                                >
                                    <div
                                        className="h-32 flex items-center justify-center relative overflow-hidden transition-all group-hover:opacity-95"
                                        style={{ backgroundImage: `linear-gradient(135deg, ${(mod as any).from || meta.from}dd, ${(mod as any).to || meta.to}dd)` }}
                                    >
                                        <div className="absolute top-3 left-3 h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white flex backdrop-blur-xs">
                                            <meta.Icon className="h-4 w-4" />
                                        </div>
                                        <span className="px-3 text-center text-2xl font-extrabold leading-tight text-white/95 drop-shadow-sm">
                                            {mod.label}
                                        </span>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-base font-extrabold leading-tight text-violet-950 tracking-wide">{mod.label}</h3>
                                            <p className="mt-1.5 text-xs text-violet-500 line-clamp-2">{mod.description}</p>
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex items-center justify-between text-xs font-bold text-violet-500">
                                                <span>Progression</span>
                                                <span>{mod.progression}%</span>
                                            </div>
                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${mod.progression}%`,
                                                        backgroundImage: `linear-gradient(90deg, ${(mod as any).from || meta.from}, ${(mod as any).to || meta.to})`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-violet-100 rounded-2xl p-8">
                            <meta.Icon className="h-12 w-12 text-violet-300 animate-pulse mb-3" />
                            <h4 className="text-sm font-bold text-violet-900">Aucun module disponible</h4>
                            <p className="text-xs text-violet-500 max-w-sm mt-1">Reviens plus tard ! Les modules de ce parcours seront bientôt publiés par l&apos;équipe pédagogique.</p>
                        </div>
                    )}
                </section>
            </div>
        );
    }

    // ─── RENDU CAS B : C'est une page Module (qui liste ses exercices/quiz) ───
    if (!displayModule) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-violet-900">
                <h2 className="text-2xl font-bold">Oups ! Ce module n&apos;existe pas.</h2>
                <p className="mt-2 text-violet-500">Retourne à la liste pour choisir une autre activité.</p>
                <Link
                    href="/enfant/modules"
                    className="mt-6 flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2.5 font-semibold text-white shadow-md hover:bg-violet-700"
                >
                    <ChevronLeft className="h-5 w-5" /> Retourner aux modules
                </Link>
            </div>
        );
    }

    return (
        <div className="text-violet-900">
            {/* ─── Bouton Retour ─── */}
            <div className="mb-4">
                <Link
                    href={dbModule?.slug ? `/enfant/modules/${dbModule.slug}` : "/enfant/modules"}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3.5 py-2 text-xs font-bold text-violet-700 shadow-xs hover:bg-violet-50 hover:text-violet-900 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" /> Retour au parcours
                </Link>
            </div>

            {/* ─── Barre du haut : titre du module + chip enfant ─── */}
            <div className="relative mt-2 flex flex-wrap items-center justify-between gap-5">


                <div className="flex flex-1 items-start gap-4 min-w-0">
                    <div className="min-w-0">
                        <h1 className="flex items-center gap-2.5 text-[26px] font-extrabold tracking-tight text-violet-950">
                            <span
                                className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                                style={{ backgroundImage: `linear-gradient(135deg, ${displayModule.from}, ${displayModule.to})` }}
                            >
                                <displayModule.Icon className="h-5 w-5" aria-hidden />
                            </span>
                            <span className="truncate">{(displayModule as any)?.label}</span>
                        </h1>
                        <p className="text-[13px] text-violet-600">Progresse étape par étape en complétant les activités ci-dessous.</p>
                    </div>
                </div>

            </div>

            {/* ─── Hero visuel du module ─── */}
            <section className="mt-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-500 to-purple-600 p-8 text-white shadow-md">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold">
                        <Star className="h-3.5 w-3.5" aria-hidden />
                        <span>Aventure active</span>
                    </div>
                    <h2 className="mt-4 text-[26px] font-black leading-tight">
                        {(displayModule as any)?.label}
                    </h2>
                    <p className="mt-2 text-sm opacity-90 leading-relaxed max-w-xl">
                        {dbModule?.description || (displayModule as any)?.description || "Progresse étape par étape en complétant les activités ci-dessous pour remporter ton badge."}
                    </p>
                </div>
            </section>

            {/* ─── Section Progression du Module ─── */}
            <section className="mt-6 rounded-2xl border border-violet-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                    <h2 className="text-sm font-extrabold text-violet-950">Ta progression dans ce module</h2>
                    <div className="mt-3 flex items-center gap-3">
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-violet-100">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
                                style={{ width: `${progression}%` }}
                            />
                        </div>
                        <div className="text-xl font-black text-violet-950">{progression}%</div>
                    </div>
                </div>
                {progression === 100 ? (
                    <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200/50 p-4">
                        <Trophy className="h-8 w-8 text-amber-500 shrink-0" />
                        <div>
                            <div className="text-xs font-bold text-amber-800">Félicitations !</div>
                            <div className="text-[11px] text-amber-700/80">Tu as complété ce module à 100% !</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-xs font-medium text-violet-500 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
                        Complète toutes les activités pour gagner ton badge de champion !
                    </div>
                )}
            </section>

            {/* ─── Liste des activités ─── */}
            <section className="mt-8 mb-6">
                <h3 className="text-base font-bold text-violet-900 tracking-wide uppercase">Les étapes à franchir</h3>
                <div className="mt-4 space-y-4">
                    {activites.map((act, index) => {
                        const isTermine = act.statut === 'termine';
                        const isVerrouille = act.statut === 'verrouille';

                        return (
                            <div
                                key={act.id}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition-all bg-white ${isVerrouille
                                    ? 'border-slate-100 bg-slate-50/50 opacity-60'
                                    : isTermine
                                        ? 'border-emerald-100 shadow-[0_2px_8px_rgba(16,185,129,0.04)]'
                                        : 'border-violet-200 shadow-sm hover:border-violet-300'
                                    }`}
                            >
                                <div className="flex gap-4 items-start">
                                    {/* Indicateur de statut */}
                                    <div className="mt-0.5 shrink-0">
                                        {isTermine ? (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                                                <CheckCircle className="h-5 w-5" />
                                            </div>
                                        ) : isVerrouille ? (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                <Lock className="h-4.5 w-4.5" />
                                            </div>
                                        ) : (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 font-bold text-xs">
                                                {index + 1}
                                            </div>
                                        )}
                                    </div>

                                    {/* Description de l'activité */}
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                                                {act.type === 'lecon' ? '📖 Leçon' : act.type === 'quiz' ? '❓ Quiz' : '✏️ Exercice'}
                                            </span>
                                            {act.difficulte && (
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                                    act.difficulte === 'DIFFICILE'
                                                        ? 'bg-rose-50 text-rose-700 border border-rose-100'
                                                        : act.difficulte === 'MOYEN'
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                }`}>
                                                    {act.difficulte === 'DIFFICILE' ? '🔥 Difficile' : act.difficulte === 'MOYEN' ? '⚡ Moyen' : '🌱 Facile'}
                                                </span>
                                            )}
                                            {act.score && (
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${act.parfait ? 'bg-emerald-50 text-emerald-600' : 'bg-violet-50 text-violet-600'}`}>
                                                    <Star className="h-3 w-3 fill-current" /> Score : {act.score}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="mt-1 text-sm font-extrabold text-violet-950">{act.titre}</h4>
                                        <p className="mt-1 text-[12.5px] leading-relaxed text-violet-500">{act.description}</p>
                                    </div>
                                </div>

                                {/* Bouton d'action */}
                                <div className="sm:shrink-0 flex items-center justify-end">
                                    {isVerrouille ? (
                                        <button disabled className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed">
                                            <Lock className="h-4 w-4" /> Bloqué
                                        </button>
                                    ) : isTermine ? (
                                        <Link
                                            href={`/enfant/modules/${id}/activite/${act.id}`}
                                            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                                        >
                                            Revoir l&apos;activité
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/enfant/modules/${id}/activite/${act.id}`}
                                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-xs font-black text-white hover:from-violet-700 hover:to-purple-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                        >
                                            <Play className="h-3.5 w-3.5 fill-current" /> C&apos;est parti !
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div >
    );
}
