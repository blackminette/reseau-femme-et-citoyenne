// * src/app/(dashboard-enfant)/enfant/page.tsx
import React from 'react';
import {
    Target, Award, TrendingUp, BookOpen, Laptop, Cpu, Languages,
    Landmark, Leaf, HelpCircle, Palette, Star, Check, Crown, Trophy
} from "lucide-react";
import Link from "next/link";
import {
    ENFANT as MOCK_ENFANT,
    MODULES as MOCK_MODULES,
    BADGES as MOCK_BADGES,
    DERNIER_BADGE as MOCK_DERNIER_BADGE,
    RESULTATS as MOCK_RESULTATS,
    ACTIVITE as MOCK_ACTIVITE
} from "@/lib/enfant-data";
import { obtenirProfilEnfant, obtenirModulesDepuisDB, obtenirActiviteRecente } from "./modules/actions";

export const metadata = {
    title: "Mon espace",
    description: "Suis ta progression, tes modules et tes badges.",
};

const METADATA_MAP = {
    lecture: { Icon: BookOpen, from: "#66bb6a", to: "#2e7d32" },
    numerique: { Icon: Laptop, from: "#42a5f5", to: "#0d47a1" },
    robotique: { Icon: Cpu, from: "#9b8cff", to: "#6d5ba8" },
    anglais: { Icon: Languages, from: "#ec407a", to: "#880e4f" },
    civique: { Icon: Landmark, from: "#ffa726", to: "#e65100" },
    napoleon: { Icon: Crown, from: "#f59e0b", to: "#7c2d12" },
    eco: { Icon: Leaf, from: "#26a69a", to: "#00695c" },
};

const ICON_MAP_ACT = {
    LECON: BookOpen,
    QUIZ: HelpCircle,
    DESSIN: Palette
};

export default async function EnfantDashboard() {
    const profile = await obtenirProfilEnfant();
    const modulesRes = await obtenirModulesDepuisDB();
    const recentScores = await obtenirActiviteRecente();

    const enfant = profile || MOCK_ENFANT;

    // Map modules with dynamic progress
    const listModules = modulesRes && modulesRes.modules && modulesRes.modules.length > 0
        ? modulesRes.modules.map(mod => {
            const meta = METADATA_MAP[mod.slug as keyof typeof METADATA_MAP] || { Icon: BookOpen, from: "#6d5ba8", to: "#5b4a98" };
            return {
                id: mod.id,
                slug: mod.slug,
                label: mod.label,
                Icon: meta.Icon,
                progression: mod.progression,
                from: meta.from,
                to: meta.to
            };
        })
        : MOCK_MODULES;

    const isMock = !modulesRes || modulesRes.source === 'mock';

    // Map recent activities/results
    const listResultats = !isMock
        ? recentScores.map(s => ({
            id: s.id,
            Icon: ICON_MAP_ACT[s.type as keyof typeof ICON_MAP_ACT] || HelpCircle,
            titre: s.nomActivite,
            date: s.date,
            score: s.score,
            parfait: s.parfait
        }))
        : MOCK_RESULTATS;

    const listActivite = !isMock
        ? recentScores.map(s => ({
            id: s.id,
            Icon: s.parfait ? Star : Check,
            titre: s.titre,
            module: s.module,
            date: s.date,
            score: s.score,
            parfait: s.parfait
        }))
        : MOCK_ACTIVITE;

    const listBadges = isMock
        ? MOCK_BADGES
        : [
            { label: "1ers pas", Icon: Target, desc: "Terminer sa première activité.", obtenu: recentScores && recentScores.length > 0 },
            { label: "Score parfait", Icon: Star, desc: "Obtenir une note maximale.", obtenu: recentScores && recentScores.some(s => s.parfait) },
            { label: "Assidu", Icon: Trophy, desc: "Compléter 10 activités au total.", obtenu: enfant.progression >= 80 },
            { label: "Expert", Icon: Crown, desc: "Obtenir 5 scores parfaits.", obtenu: enfant.progression === 100 },
        ];

    const dernierBadge = listBadges.find(b => b.obtenu) || (isMock ? MOCK_DERNIER_BADGE : null);

    return (
        <div className="text-violet-900">

            {/* ─── Barre du haut : titre + chip enfant ─── */}
            <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                    <h1 className="text-[26px] font-bold tracking-tight text-violet-950">Bonjour {enfant.prenom} !</h1>
                    <p className="text-[13px] text-violet-600">Tu as {enfant.age} ans — continue comme ça, tu fais des progrès incroyables !</p>
                </div>
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

            {/* ─── Mission du jour ─── */}
            <section className="relative mt-6 flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[20px] bg-gradient-to-br from-violet-500 to-purple-600 p-7 text-white">
                <div className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full bg-white/[0.07]" aria-hidden />
                <div className="pointer-events-none absolute right-32 -bottom-20 h-36 w-36 rounded-full bg-white/5" aria-hidden />
                <div className="relative flex-1">
                    <h2 className="mb-1 flex items-center gap-2 text-[26px] font-bold">
                        <Target className="h-6 w-6" aria-hidden /> Mission du jour
                    </h2>
                    <p className="text-sm opacity-90">Termine une activité dans un module et continue à progresser !</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold">
                        <Award className="h-4 w-4" aria-hidden /> {enfant.badgesObtenus} badges obtenus
                    </div>
                </div>
                <div className="relative z-10 min-w-[220px] rounded-2xl bg-white/15 p-4 backdrop-blur">
                    <div className="mb-2 text-[11px] font-medium opacity-90">Progression globale</div>
                    <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/25">
                            <div className="h-full rounded-full bg-white" style={{ width: `${enfant.progression}%` }} />
                        </div>
                        <div className="text-lg font-extrabold">{enfant.progression}%</div>
                    </div>
                </div>
            </section>

            {/* ─── Zone d'orientation personnalisée (Difficultés & Recommandations) ─── */}
            {((enfant.difficultes && enfant.difficultes.length > 0) || (enfant.recommandations && enfant.recommandations.length > 0)) && (
                <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Zones de difficulté */}
                    <div className="rounded-[20px] border border-red-100 bg-red-50/50 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-red-700 font-extrabold text-sm mb-2">
                                <span>⚠️</span> Objectif d'amélioration
                            </div>
                            <h4 className="text-[15px] font-black text-violet-950">Mes zones d'amélioration</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Voici les parcours où tu as rencontré des défis. Reprends-les pour t'améliorer !
                            </p>
                            <div className="mt-4 space-y-2">
                                {enfant.difficultes && enfant.difficultes.length > 0 ? (
                                    enfant.difficultes.map((d: any, idx: number) => (
                                        <div key={idx} className="bg-white border border-red-100 rounded-xl p-3 flex justify-between items-center text-xs">
                                            <div className="font-bold text-slate-800">{d.module}</div>
                                            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black text-[10px]">{d.pourcentage}% réussite</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white border border-green-150 rounded-xl p-4 text-center text-xs font-semibold text-emerald-700">
                                        ✨ Magnifique ! Tu n'as pas de difficultés détectées actuellement.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recommandations ciblées */}
                    <div className="rounded-[20px] border border-indigo-100 bg-indigo-50/50 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-sm mb-2">
                                <span>🎯</span> Recommandations de ton tuteur
                            </div>
                            <h4 className="text-[15px] font-black text-violet-950">Mes défis recommandés</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Les activités parfaites pour toi aujourd'hui afin de franchir un nouveau cap !
                            </p>
                            <div className="mt-4 space-y-2">
                                {enfant.recommandations && enfant.recommandations.length > 0 ? (
                                    enfant.recommandations.map((r: any, idx: number) => (
                                        <Link
                                            href={`/enfant/modules/${r.moduleSlug}`}
                                            key={idx}
                                            className="block bg-white border border-indigo-100 hover:border-indigo-300 rounded-xl p-3 shadow-xs hover:shadow-md transition-all group"
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <div>
                                                    <div className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{r.titre}</div>
                                                    <div className="text-[10px] text-slate-400 mt-0.5">{r.raison}</div>
                                                </div>
                                                <span className="shrink-0 bg-indigo-600 text-white px-2 py-0.5 rounded-lg text-[9px] font-black group-hover:bg-indigo-700 transition-colors">
                                                    {r.action}
                                                </span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="bg-white border border-slate-100 rounded-xl p-4 text-center text-xs font-semibold text-slate-400">
                                        Aucun défi à recommander pour l'instant.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Mes parcours ─── */}
            <section id="modules" className="mt-8 scroll-mt-6">
                <h3 className="text-lg font-semibold tracking-tight text-violet-800">Mes parcours</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
                    {listModules.map(({ id, slug, label, Icon, progression, from, to }) => (
                        <Link
                            href={`/enfant/modules/${slug || id}`}
                            key={id}
                            className="flex flex-col justify-between rounded-2xl p-5 text-white shadow-[0_4px_16px_rgba(109,91,168,0.12)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-violet-300"
                            style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
                        >
                            <div>
                                <Icon className="h-7 w-7" aria-hidden />
                                <div className="mt-3 text-sm font-bold leading-tight">{label}</div>
                            </div>
                            <div className="mt-6">
                                <div className="text-2xl font-extrabold">{progression}%</div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/30">
                                    <div className="h-full rounded-full bg-white" style={{ width: `${progression}%` }} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ─── 3 panneaux : résultats / badges / activité ─── */}
            <section className="mt-8 mb-4 grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Mes derniers résultats */}
                <div id="resultats" className="rounded-2xl border border-violet-200 bg-white p-5 shadow-xs scroll-mt-6">
                    <div className="mb-3.5 text-[15px] font-bold text-violet-950">Mes derniers résultats</div>
                    {listResultats.length > 0 ? (
                        listResultats.map(({ id, Icon, titre, date, score, parfait }) => (
                            <div key={id} className="flex items-center gap-3 border-b border-violet-100 py-2.5 last:border-0">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-[13px] font-semibold text-violet-900">{titre}</div>
                                    <div className="text-[11px] text-violet-500">{date}</div>
                                </div>
                                <div className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${parfait ? "bg-emerald-50 text-emerald-600" : "bg-violet-50 text-violet-600"}`}>
                                    {score}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center min-h-[150px]">
                            <HelpCircle className="h-9 w-9 text-violet-300 animate-pulse" />
                            <p className="mt-2 text-xs text-violet-500 font-semibold">Aucun résultat pour le moment.</p>
                            <p className="text-[10px] text-violet-400 mt-1">Réponds à un quiz pour voir tes scores !</p>
                        </div>
                    )}
                </div>

                {/* Mes badges */}
                <div id="badges" className="rounded-2xl border border-violet-200 bg-white p-5 shadow-xs scroll-mt-6">
                    <div className="mb-3.5 flex items-center justify-between">
                        <span className="text-[15px] font-bold text-violet-950">Mes badges</span>
                        <Link 
                            href="/enfant/badges" 
                            className="text-xs font-black text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            Voir tout →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {listBadges.map(({ label, Icon, desc, obtenu }) => (
                            <div
                                key={label}
                                title={desc}
                                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center ${obtenu ? "border-violet-200 bg-violet-50" : "border-slate-100 bg-slate-50 opacity-60"}`}
                            >
                                <Icon className={`h-7 w-7 ${obtenu ? "text-amber-500" : "text-slate-300"}`} aria-hidden />
                                <span className={`text-[11px] font-semibold ${obtenu ? "text-violet-900" : "text-slate-400"}`}>{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Bandeau dernier badge débloqué */}
                    {dernierBadge && (
                        <div className="mt-3 flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-amber-500">
                                <dernierBadge.Icon className="h-[18px] w-[18px]" aria-hidden />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[12px] font-bold text-amber-700">Badge : {dernierBadge.label}</div>
                                <div className="truncate text-[11px] text-amber-600/80">{dernierBadge.desc}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Activité récente */}
                <div id="progres" className="rounded-2xl border border-violet-200 bg-white p-5 shadow-xs scroll-mt-6">
                    <div className="mb-3.5 flex items-center gap-1.5 text-[15px] font-bold text-violet-950">
                        <TrendingUp className="h-4 w-4 text-violet-600" aria-hidden /> Activité récente
                    </div>
                    {listActivite.length > 0 ? (
                        listActivite.map(({ id, Icon, titre, module, date, score, parfait }) => (
                            <div key={id} className="flex items-center gap-3 border-b border-violet-100 py-2.5 last:border-0">
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${parfait ? "bg-amber-50 text-amber-500" : "bg-violet-50 text-violet-600"}`}>
                                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-[13px] font-semibold text-violet-900">{titre}</div>
                                    <div className="truncate text-[11px] text-violet-500">{module} • {date}</div>
                                </div>
                                <div className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${parfait ? "bg-emerald-50 text-emerald-600" : "bg-violet-50 text-violet-600"}`}>
                                    {score}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center min-h-[150px]">
                            <TrendingUp className="h-9 w-9 text-violet-300 animate-pulse" />
                            <p className="mt-2 text-xs text-violet-500 font-semibold">Aucune activité récente.</p>
                            <p className="text-[10px] text-violet-400 mt-1">Tes leçons complétées s'afficheront ici !</p>
                        </div>
                    )}
                </div>

            </section>
        </div>
    );
}
