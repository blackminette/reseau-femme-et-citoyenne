// * src/app/(dashboard-adultes)/membre/page.tsx
import React from 'react';
import {
    Target, Award, TrendingUp, BookOpen, Laptop, Cpu, Languages,
    Landmark, Leaf, HelpCircle, Star, Check, Crown, Trophy,
    Users, CalendarCheck, CalendarPlus, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { MEMBRE, ENFANTS_RATTACHES, RESERVATIONS } from "@/lib/membre-data";
import { obtenirProfilMembre, obtenirModulesAdulteDepuisDB, obtenirActiviteRecenteAdulte } from "./actions";

export const metadata = {
    title: "Mon espace membre",
    description: "Suivez votre progression, vos modules et vos badges.",
};

const METADATA_MAP: Record<string, { Icon: React.ComponentType<{ className?: string }>; from: string; to: string }> = {
    lecture: { Icon: BookOpen, from: "#66bb6a", to: "#2e7d32" },
    numerique: { Icon: Laptop, from: "#42a5f5", to: "#0d47a1" },
    robotique: { Icon: Cpu, from: "#9b8cff", to: "#6d5ba8" },
    anglais: { Icon: Languages, from: "#ec407a", to: "#880e4f" },
    civique: { Icon: Landmark, from: "#ffa726", to: "#e65100" },
    eco: { Icon: Leaf, from: "#26a69a", to: "#00695c" },
    communication: { Icon: BookOpen, from: "#7c4dff", to: "#4a148c" },
    juridique: { Icon: Landmark, from: "#ff7043", to: "#bf360c" },
};

const ICON_MAP_ACT: Record<string, React.ComponentType<{ className?: string }>> = {
    LECON: BookOpen,
    QUIZ: HelpCircle,
};

export default async function MembreDashboard() {
    const profile = await obtenirProfilMembre();
    const modulesRes = await obtenirModulesAdulteDepuisDB();
    const recentScores = await obtenirActiviteRecenteAdulte();

    const membre = profile || {
        prenom: MEMBRE.prenom,
        nom: MEMBRE.nom,
        initiales: MEMBRE.initiales,
        progression: MEMBRE.progression,
        badgesObtenus: MEMBRE.badges
    };

    // Map modules avec progression dynamique
    const listModules = modulesRes && modulesRes.modules && modulesRes.modules.length > 0
        ? modulesRes.modules.map(mod => {
            const meta = METADATA_MAP[mod.slug as keyof typeof METADATA_MAP] || { Icon: BookOpen, from: "#6d5ba8", to: "#5b4a98" };
            return {
                id: mod.id,
                label: mod.label,
                Icon: meta.Icon,
                progression: mod.progression,
                from: meta.from,
                to: meta.to
            };
          })
        : [];

    const isMock = !modulesRes || modulesRes.source === 'mock';

    // Activités récentes
    const listResultats = !isMock
        ? recentScores.map(s => ({
            id: s.id,
            Icon: ICON_MAP_ACT[s.type as keyof typeof ICON_MAP_ACT] || HelpCircle,
            titre: s.nomActivite,
            date: s.date,
            score: s.score,
            parfait: s.parfait
          }))
        : [];

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
        : [];

    const listBadges = isMock
        ? [
            { label: "1ers pas", Icon: Target, desc: "Terminer sa première activité.", obtenu: false },
            { label: "Score parfait", Icon: Star, desc: "Obtenir une note maximale.", obtenu: false },
            { label: "Assidu(e)", Icon: Trophy, desc: "Compléter 10 activités au total.", obtenu: false },
            { label: "Expert(e)", Icon: Crown, desc: "Obtenir 5 scores parfaits.", obtenu: false },
          ]
        : [
            { label: "1ers pas", Icon: Target, desc: "Terminer sa première activité.", obtenu: recentScores && recentScores.length > 0 },
            { label: "Score parfait", Icon: Star, desc: "Obtenir une note maximale.", obtenu: recentScores && recentScores.some(s => s.parfait) },
            { label: "Assidu(e)", Icon: Trophy, desc: "Compléter 10 activités au total.", obtenu: (membre.progression ?? 0) >= 80 },
            { label: "Expert(e)", Icon: Crown, desc: "Obtenir 5 scores parfaits.", obtenu: (membre.progression ?? 0) === 100 },
        ];

    const dernierBadge = listBadges.find(b => b.obtenu) || null;

    // Stats rapides
    const STATS = [
        { Icon: TrendingUp, valeur: `${membre.progression ?? 0}%`, label: "Ma progression", accent: "violet" as const },
        { Icon: Award, valeur: String(membre.badgesObtenus ?? 0), label: "Mes badges", accent: "amber" as const },
        { Icon: Users, valeur: String(ENFANTS_RATTACHES.length), label: "Enfants suivis", accent: "violet" as const },
        { Icon: CalendarCheck, valeur: String(RESERVATIONS.length), label: "Réservations", accent: "amber" as const },
    ];

    // Actions rapides
    const ACTIONS = [
        { href: "/membre/modules", Icon: BookOpen, titre: "Mes modules", texte: "Continuer à apprendre" },
        { href: "/membre/reserver", Icon: CalendarPlus, titre: "Réserver un atelier", texte: "S'inscrire à une session" },
        { href: "/membre/enfants", Icon: Users, titre: "Mes enfants", texte: "Voir et ajouter" },
    ];

    return (
        <div className="text-violet-900">

            {/* ─── Barre du haut : titre + chip membre ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-violet-950">
                        Bonjour, {membre.prenom} 👋
                    </h1>
                    <p className="mt-1 text-sm text-violet-600">
                        Suivez votre progression et celle de vos enfants.
                    </p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-white px-4 py-3 shadow-xs">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                        {membre.initiales}
                    </div>
                    <div className="leading-tight">
                        <div className="text-[13px] font-bold text-violet-950">{membre.prenom} {membre.nom}</div>
                        <div className="text-[11px] text-violet-500">Membre</div>
                    </div>
                </div>
            </div>

            {/* ─── Stats rapides ─── */}
            <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {STATS.map(({ Icon, valeur, label, accent }) => (
                    <div
                        key={label}
                        className={`flex items-center gap-3 rounded-2xl border border-violet-200 bg-white p-4 shadow-xs`}
                    >
                        <div className={`rounded-xl p-2.5 ${accent === "amber" ? "bg-amber-50 text-amber-600" : "bg-violet-50 text-violet-600"}`}>
                            <Icon className="h-5 w-5" aria-hidden />
                        </div>
                        <div>
                            <div className="text-xl font-extrabold text-violet-950">{valeur}</div>
                            <div className="text-[11px] font-medium text-violet-500">{label}</div>
                        </div>
                    </div>
                ))}
            </section>

            {/* ─── Actions rapides ─── */}
            <section className="mt-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {ACTIONS.map(({ href, Icon, titre, texte }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group flex items-center gap-3 rounded-2xl border border-violet-200 bg-white p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 transition-colors group-hover:bg-violet-100">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-violet-950">{titre}</div>
                                <div className="text-[11px] text-violet-500">{texte}</div>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-violet-300 transition-all group-hover:text-violet-600" />
                        </Link>
                    ))}
                </div>
            </section>

            {/* ─── Mes modules ─── */}
            {listModules.length > 0 && (
                <section id="modules" className="mt-8 scroll-mt-6">
                    <h3 className="text-lg font-semibold tracking-tight text-violet-800">Mes modules</h3>
                    <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                        {listModules.map(({ id, label, Icon, progression, from, to }) => (
                            <Link
                                href={`/membre/modules/${id}`}
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
            )}

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
                            <p className="text-[10px] text-violet-400 mt-1">Complétez un quiz pour voir vos scores !</p>
                        </div>
                    )}
                </div>

                {/* Mes badges */}
                <div id="badges" className="rounded-2xl border border-violet-200 bg-white p-5 shadow-xs scroll-mt-6">
                    <div className="mb-3.5 text-[15px] font-bold text-violet-950">Mes badges</div>
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
                            <p className="text-[10px] text-violet-400 mt-1">Vos leçons complétées s&apos;afficheront ici !</p>
                        </div>
                    )}
                </div>

            </section>
        </div>
    );
}