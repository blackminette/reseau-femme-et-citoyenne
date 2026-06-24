// * src/app/(dashboard-enfant)/enfant/modules/[id]/page.tsx
'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
};

type Params = Promise<{ id: string }>;

function getMockActivitesForModule(id: string): Activite[] {
    if (id !== 'napoleon') {
        return [];
    }

    return [
        {
            id: '1',
            titre: 'Découvrir Napoléon',
            description: "Comprendre qui il était et pourquoi il est une figure importante de l'histoire française.",
            type: 'lecon',
            statut: 'a_faire',
        },
        {
            id: '2',
            titre: 'Napoléon et son époque',
            description: "Lire le texte pour voir ce qu'il a changé et ce que son époque a produit.",
            type: 'lecon',
            statut: 'verrouille',
        },
        {
            id: '3',
            titre: 'Les limites à connaître',
            description: "Relever les points essentiels sur le Code civil, les droits des femmes et l'esclavage.",
            type: 'exercice',
            statut: 'verrouille',
        },
        {
            id: '4',
            titre: 'Quiz Napoléon',
            description: "Vérifier ce que tu as retenu avec des questions courtes.",
            type: 'quiz',
            statut: 'verrouille',
        },
    ];
}

function isActivityCompleted(actId: string): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    try {
        const raw = window.localStorage.getItem(`rfc_enfant_act_${actId}`);
        if (!raw) {
            return false;
        }

        const parsed = JSON.parse(raw);
        return Boolean(parsed?.completed);
    } catch {
        return false;
    }
}

function hydrateSequentialActivities(activities: Activite[]): Activite[] {
    let unlockedNext = false;

    return activities.map((activity) => {
        const completed = isActivityCompleted(activity.id);

        if (completed) {
            unlockedNext = true;
            return { ...activity, statut: 'termine' as const };
        }

        if (!unlockedNext) {
            unlockedNext = true;
            return { ...activity, statut: 'a_faire' as const };
        }

        return { ...activity, statut: 'verrouille' as const };
    });
}

export default function EnfantModuleDetailPage({ params }: { params: Params }) {
    const { id } = use(params);
    const [activites, setActivites] = useState<Activite[]>([]);
    const [progression, setProgression] = useState(0);
    const [dbModule, setDbModule] = useState<{ label: string; slug: string; progression: number } | null>(null);
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
                        
                        // Enrichir les statuts des leçons (lues en local)
                        const enrichedActivites = dbMod.activites.map((act: any) => {
                            if (act.type === 'lecon') {
                                const localData = localStorage.getItem(`rfc_enfant_act_${act.id}`);
                                if (localData) {
                                    try {
                                        const parsed = JSON.parse(localData);
                                        if (parsed.completed) {
                                            return { ...act, statut: 'termine', score: '1/1', parfait: true };
                                        }
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }
                            }
                            return act;
                        });

                        // Déterminer l'état (tout déverrouillé pour l'exploration libre)
                        const finalActivites = enrichedActivites.map((act: any) => {
                            if (act.statut === 'termine') {
                                return act;
                            }
                            return { ...act, statut: 'a_faire' };
                        });

                        // Re-calculer la progression globale
                        const completedCount = finalActivites.filter((a: any) => a.statut === 'termine').length;
                        const total = finalActivites.length;
                        const newProgression = total > 0 ? Math.round((completedCount / total) * 100) : 0;

                        setActivites(finalActivites);
                        setProgression(newProgression);
                    } else {
                        const fallbackActivites = getMockActivitesForModule(id);
                        if (fallbackActivites.length > 0) {
                            const hydratedActivities = hydrateSequentialActivities(fallbackActivites);
                            const completedCount = hydratedActivities.filter((activity) => activity.statut === 'termine').length;
                            setActivites(hydratedActivities);
                            setProgression(Math.round((completedCount / hydratedActivities.length) * 100));
                        }
                    }
                }
            } catch (err) {
                console.error("Erreur de chargement du module/profil depuis le serveur :", err);
            }
            setLoading(false);
        }

        loadData();
    }, [id, isParcours]);

    // Récupération des informations statiques du module/parcours
    const currentModule = MODULES.find((m) => m.id === id) || 
        (dbModule ? MODULES.find((m) => m.id === dbModule.slug) : null);

    const fallbackModule = {
        id: id,
        label: dbModule ? dbModule.label : "Module",
        Icon: BookOpen,
        progression: progression,
        from: "#66bb6a",
        to: "#2e7d32"
    };

    const displayModule = currentModule ? {
        ...currentModule,
        label: dbModule ? dbModule.label : currentModule.label,
        progression: progression
    } : (dbModule ? fallbackModule : null);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-violet-900">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
                <p className="mt-4 text-violet-500">Chargement de ton aventure...</p>
            </div>
        );
    }

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
                <div className="flex flex-wrap items-center justify-between gap-5 mt-2">
                    <div>
                        <h1 className="flex items-center gap-2.5 text-[26px] font-extrabold tracking-tight text-violet-950">
                            <span 
                                className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                                style={{ backgroundImage: `linear-gradient(135deg, ${meta.from}, ${meta.to})` }}
                            >
                                <meta.Icon className="h-5 w-5" aria-hidden />
                            </span>
                            Parcours : {meta.label}
                        </h1>
                        <p className="text-[13px] text-violet-600">Choisis un module pour commencer à apprendre et t&apos;exercer !</p>
                    </div>

                    {/* Badge Enfant */}
                    <div className="flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 shadow-[0_2px_12px_rgba(109,91,168,0.07)]">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                            {enfant.initiales}
                        </div>
                        <div className="leading-tight">
                            <div className="text-[13px] font-bold text-violet-950">{enfant.prenom} {enfant.nom}</div>
                            <div className="text-[11px] text-violet-500">{enfant.age} ans</div>
                        </div>
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
                                        style={{ backgroundImage: `linear-gradient(135deg, ${meta.from}dd, ${meta.to}dd)` }}
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
                                                        backgroundImage: `linear-gradient(90deg, ${meta.from}, ${meta.to})`
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
            <div className="flex flex-wrap items-center justify-between gap-5 mt-2">
                <div>
                    <h1 className="flex items-center gap-2.5 text-[26px] font-extrabold tracking-tight text-violet-950">
                        <span 
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                            style={{ backgroundImage: `linear-gradient(135deg, ${displayModule.from}, ${displayModule.to})` }}
                        >
                            <displayModule.Icon className="h-5 w-5" aria-hidden />
                        </span>
                        {displayModule.label}
                    </h1>
                    <p className="text-[13px] text-violet-600">Progresse étape par étape en complétant les activités ci-dessous.</p>
                </div>
                
                {/* Badge Enfant */}
                <div className="flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 shadow-[0_2px_12px_rgba(109,91,168,0.07)]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                        {enfant.initiales}
                    </div>
                    <div className="leading-tight">
                        <div className="text-[13px] font-bold text-violet-950">{enfant.prenom} {enfant.nom}</div>
                        <div className="text-[11px] text-violet-500">{enfant.age} ans</div>
                    </div>
                </div>
            </div>

            {/* ─── Hero visuel du module ─── */}
            <section className="mt-6 overflow-hidden rounded-[28px] border border-orange-100 bg-gradient-to-br from-[#fffaf2] via-white to-[#fff0dc] shadow-[0_12px_40px_rgba(194,104,32,0.08)]">
                <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="relative flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-700 shadow-sm">
                                <Star className="h-3.5 w-3.5" aria-hidden />
                                Napoléon
                            </div>
                            <h2 className="mt-4 max-w-xl text-[28px] font-black leading-tight text-slate-900 sm:text-[34px]">
                                Comprendre un personnage clé de l&apos;histoire française
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
                                Analysons Napoléon avec rigueur : ses actions, ses réussites, mais aussi ses limites.
                                Pas de glorification, juste des faits.
                            </p>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm">
                                <div className="text-[11px] font-black uppercase tracking-widest text-orange-500">Leçon</div>
                                <div className="mt-1 text-sm font-bold text-slate-900">Découvrir</div>
                            </div>
                            <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm">
                                <div className="text-[11px] font-black uppercase tracking-widest text-orange-500">Quiz</div>
                                <div className="mt-1 text-sm font-bold text-slate-900">Réviser</div>
                            </div>
                            <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm">
                                <div className="text-[11px] font-black uppercase tracking-widest text-orange-500">Révisions</div>
                                <div className="mt-1 text-sm font-bold text-slate-900">Mémoriser</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative min-h-[320px] lg:min-h-full p-4 sm:p-6">
                        <div className="absolute inset-4 sm:inset-6 rounded-[30px] bg-gradient-to-br from-[#f9ecd6] via-[#f4dcc0] to-[#d98b54]" />

                        <div className="absolute left-6 top-6 right-[32%] bottom-[24%] overflow-hidden rounded-[26px] border border-white/70 shadow-[0_18px_40px_rgba(92,54,18,0.18)]">
                            <Image
                                src="/images/enfants/napoleon-study.webp"
                                alt="Napoléon dans son étude"
                                fill
                                priority
                                className="object-cover"
                                style={{ objectPosition: '50% 15%' }}
                                sizes="(min-width: 1024px) 28vw, 100vw"
                            />
                        </div>

                        <div className="absolute right-6 top-10 bottom-10 w-[42%] overflow-hidden rounded-[28px] border border-white/70 shadow-[0_18px_50px_rgba(92,54,18,0.22)] rotate-2">
                            <Image
                                src="/images/enfants/napoleon-crossing-alps.jpg"
                                alt="Napoléon traversant les Alpes"
                                fill
                                className="object-cover object-center"
                                sizes="(min-width: 1024px) 18vw, 40vw"
                            />
                        </div>

                        <div className="absolute left-10 bottom-8 w-[58%] rounded-2xl border border-white/70 bg-white/88 p-3 shadow-[0_10px_24px_rgba(92,54,18,0.12)] backdrop-blur-sm">
                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-700">Repères historiques</div>
                            <div className="mt-1 text-sm font-bold text-slate-900">Deux regards sur Napoléon</div>
                            <p className="mt-0.5 text-[11px] leading-4 text-slate-600">
                                Un portrait d&apos;étude et une scène historique pour ouvrir le module avec des images authentiques.
                            </p>
                        </div>

                        <div className="absolute inset-0 rounded-[30px] bg-gradient-to-r from-white/0 via-white/0 to-white/10" />
                    </div>
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
                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition-all bg-white ${
                                    isVerrouille 
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
        </div>
    );
}
