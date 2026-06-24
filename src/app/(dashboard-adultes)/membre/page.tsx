// * src/app/(dashboard)/membre/page.tsx
'use client';

import React from 'react';
import Link from "next/link";
import {
    Users,
    CalendarCheck,
    CalendarPlus,
    TrendingUp,
    Award,
    Star,
    Clock,
    Calendar,
    Flame,
    Target,
    CheckCircle2,
    AlertTriangle,
    Lightbulb,
    ArrowUpRight,
    Plus,
    UserPlus,
    type LucideIcon,
} from "lucide-react";
import { MEMBRE, ENFANTS_RATTACHES, ACTIVITES, RESERVATIONS, type Metriques } from "@/lib/membre-data";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export const metadata = {
    title: "Mon espace membre",
    description: "Suivez votre progression et celle de vos enfants, gérez vos réservations.",
};

// Grille des 6 métriques, réutilisée pour le membre et chaque enfant.
function MetriquesGrid({ m }: { m: Metriques }) {
    return (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-violet-50 p-3.5">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-500">
                    <TrendingUp className="h-3.5 w-3.5" /> Progression globale
                </div>
                <div className="text-2xl font-extrabold text-violet-700">{m.progression}%</div>
                <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-violet-200">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600" style={{ width: `${m.progression}%` }} />
                </div>
            </div>

            <div className="rounded-xl bg-violet-50 p-3.5">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-500">
                    <Star className="h-3.5 w-3.5" /> Module préféré
                </div>
                <div className="flex items-center gap-2 text-[15px] font-bold text-violet-950">
                    <m.ModuleIcon className="h-5 w-5 text-violet-600" />
                    <span>{m.modulePref}</span>
                </div>
            </div>

            <div className="rounded-xl bg-violet-50 p-3.5">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-500">
                    <Clock className="h-3.5 w-3.5" /> Temps passé
                </div>
                <div className="text-xl font-extrabold text-violet-950">{m.temps}</div>
                <div className="mt-0.5 text-[11px] text-violet-500">estimé sur les activités</div>
            </div>

            <div className="rounded-xl bg-violet-50 p-3.5">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-500">
                    <Calendar className="h-3.5 w-3.5" /> Dernière activité
                </div>
                <div className="text-[15px] font-bold text-violet-950">{m.derniere}</div>
            </div>

            <div className="rounded-xl bg-amber-50 p-3.5">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600">
                    <Flame className="h-3.5 w-3.5" /> Série actuelle
                </div>
                <div className="text-2xl font-extrabold text-amber-600">
                    {m.serie} <span className="text-[13px] font-semibold">jour{m.serie > 1 ? "s" : ""}</span>
                </div>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3.5">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                    <Target className="h-3.5 w-3.5" /> Quizz réussis
                </div>
                <div className="text-2xl font-extrabold text-emerald-600">
                    {m.quizReussis}<span className="text-sm font-semibold text-violet-400">/{m.quizTotal}</span>
                </div>
            </div>
        </div>
    );
}

export default async function MembreDashboard({
    searchParams,
}: {
    searchParams: Promise<{ vue?: string }>;
}) {
    // ╔═══════════════ DÉMO — À SUPPRIMER quand la BDD sera branchée ═══════════════╗
    // Bascule l'état Avec/Sans enfant via l'URL (?vue=avec / ?vue=sans) pour la démo.
    // Pour retirer : supprimer ce bloc + le sélecteur plus bas + le paramètre `searchParams`
    // de la signature, puis remplacer par une seule ligne :
    //     const ENFANTS = ENFANTS_RATTACHES;   (ou le fetch BDD des enfants du membre)
    const { vue } = await searchParams;
    const aDesEnfants = vue !== "sans";
    const ENFANTS = aDesEnfants ? ENFANTS_RATTACHES : [];
    // ╚═════════════════════════════════════════════════════════════════════════════╝

    const STATS: { Icon: LucideIcon; valeur: string; label: string; accent: "violet" | "amber" }[] = [
        { Icon: TrendingUp, valeur: `${MEMBRE.progression}%`, label: "Ma progression", accent: "violet" },
        { Icon: Award, valeur: String(MEMBRE.badges), label: "Mes badges", accent: "amber" },
        { Icon: Users, valeur: String(ENFANTS.length), label: "Enfants suivis", accent: "violet" },
        { Icon: CalendarCheck, valeur: String(RESERVATIONS.length), label: "Réservations", accent: "amber" },
    ];

    const ACTIONS: { href: string; Icon: LucideIcon; titre: string; texte: string }[] = [
        { href: "/membre/enfants", Icon: Users, titre: "Mes enfants", texte: aDesEnfants ? "Voir et ajouter" : "Ajouter un enfant" },
        { href: "/membre/reserver", Icon: CalendarPlus, titre: "Réserver un atelier", texte: "S'inscrire à une session" },
        { href: "/membre/reservations", Icon: CalendarCheck, titre: "Mes réservations", texte: "Consulter & gérer" },
    ];

    return (
        <div className="text-violet-900">

            {/* ─── Sélecteur d'aperçu démo (à retirer une fois la BDD branchée) ─── */}
            <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-violet-300 bg-violet-50/60 px-3 py-2 text-xs">
                <span className="font-semibold text-violet-500">Aperçu démo :</span>
                <Link
                    href="/membre?vue=avec"
                    className={`rounded-lg px-3 py-1 transition-colors ${aDesEnfants ? "bg-violet-600 font-semibold text-white" : "font-medium text-violet-600 hover:bg-violet-100"}`}
                >
                    Avec enfants
                </Link>
                <Link
                    href="/membre?vue=sans"
                    className={`rounded-lg px-3 py-1 transition-colors ${!aDesEnfants ? "bg-violet-600 font-semibold text-white" : "font-medium text-violet-600 hover:bg-violet-100"}`}
                >
                    Sans enfant
                </Link>
            </div>

            {/* ─── En-tête ─── */}
            <PageHeader
                titre="Mon espace membre"
                sousTitre={aDesEnfants
                    ? "Suivez votre progression et celle de vos enfants, gérez vos réservations."
                    : "Bienvenue ! Suivez votre progression et ajoutez un enfant pour suivre la sienne."}
            />

            {/* ─── Vue d'ensemble : statistiques ─── */}
            <section className="mt-8">
                <h3 className="text-lg font-semibold tracking-tight text-violet-800">Vue d&apos;ensemble</h3>
                <div className="mt-4 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {STATS.map(({ Icon, valeur, label, accent }) => (
                        <div key={label} className="flex items-center gap-4 rounded-2xl border border-violet-200 bg-white p-6 shadow-xs">
                            <div className={`rounded-xl p-3 ${accent === "amber" ? "bg-amber-50 text-amber-600" : "bg-violet-50 text-violet-600"}`}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold tracking-tight text-violet-950">{valeur}</span>
                                <p className="text-sm font-medium text-violet-600">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Actions rapides ─── */}
            <section className="mt-8">
                <h3 className="text-lg font-semibold tracking-tight text-violet-800">Actions rapides</h3>
                <div className="mt-4 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {ACTIONS.map(({ href, Icon, titre, texte }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group block rounded-2xl border border-violet-200 bg-white p-6 shadow-xs transition-all duration-200 hover:border-violet-500 hover:shadow-lg hover:shadow-violet-100"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 transition-colors duration-200 group-hover:bg-violet-600 group-hover:text-white">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-violet-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-500" />
                            </div>
                            <h4 className="text-lg font-bold text-violet-950 transition-colors group-hover:text-violet-600">{titre}</h4>
                            <p className="mt-1 text-sm text-violet-600">{texte}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ─── Ma progression (le membre est aussi un apprenant) ─── */}
            <section className="mt-8">
                <h3 className="text-lg font-semibold tracking-tight text-violet-800">Ma progression</h3>
                <div className="mt-4 max-w-5xl rounded-2xl border border-violet-200 bg-white p-6 shadow-xs">

                    {/* En-tête membre */}
                    <div className="mb-4 flex items-center gap-3.5 border-b border-violet-100 pb-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                            {MEMBRE.initiales}
                        </div>
                        <div className="flex-1">
                            <div className="text-[15px] font-bold text-violet-950">{MEMBRE.prenom} {MEMBRE.nom}</div>
                            <div className="text-xs text-violet-500">Mon parcours de formation</div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-[11px] font-semibold text-violet-600">
                            <Flame className="h-3.5 w-3.5" /> {MEMBRE.serie} jour{MEMBRE.serie > 1 ? "s" : ""} de suite
                        </span>
                    </div>

                    {/* Métriques du membre */}
                    <MetriquesGrid m={MEMBRE} />

                    {/* Modules suivis par le membre */}
                    <div className="mt-4">
                        <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-violet-500">Mes modules en cours</div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {MEMBRE.modules.map(({ Icon, label }) => (
                                <div key={label} className="flex items-center gap-3 rounded-xl border border-violet-200 bg-white p-3.5">
                                    <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-[13px] font-semibold text-violet-900">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Contenu conditionnel : avec ou sans enfant ─── */}
            {aDesEnfants ? (
                <>
                    {/* Suivi de mes enfants */}
                    <section className="mt-8">
                        <h3 className="text-lg font-semibold tracking-tight text-violet-800">Suivi de mes enfants</h3>
                        <div className="mt-4 grid max-w-5xl gap-6">
                            {ENFANTS.map((c) => (
                                <div key={c.username} className="rounded-2xl border border-violet-200 bg-white p-6 shadow-xs">

                                    {/* En-tête enfant */}
                                    <div className="mb-4 flex items-center gap-3.5 border-b border-violet-100 pb-4">
                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${c.couleur} text-base font-bold text-white`}>
                                            {c.initiales}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[15px] font-bold text-violet-950">{c.prenom} {c.nom}</div>
                                            <div className="text-xs text-violet-500">{c.age} ans · @{c.username}</div>
                                        </div>
                                        <Link
                                            href="/membre/enfants"
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-violet-600 transition-colors hover:bg-violet-50"
                                        >
                                            Voir le profil <ArrowUpRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>

                                    {/* Métriques de l'enfant */}
                                    <MetriquesGrid m={c} />

                                    {/* Difficultés / aucune difficulté */}
                                    {c.difficulte ? (
                                        <div className="mt-3.5 rounded-xl border-l-4 border-rose-500 bg-rose-50 px-4 py-3.5">
                                            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
                                                <AlertTriangle className="h-4 w-4" /> Difficultés détectées
                                            </div>
                                            <div className="text-[13px] leading-relaxed text-violet-700">
                                                {c.difficulte.map((d) => (
                                                    <span key={d} className="mr-1 mt-1 inline-block rounded-full bg-white px-2.5 py-0.5 font-semibold text-rose-600">{d}</span>
                                                ))}
                                            </div>
                                            <div className="mt-2 flex items-center gap-1.5 text-[11.5px] text-violet-500">
                                                <Lightbulb className="h-3.5 w-3.5" /> Encouragez {c.prenom} à refaire les leçons de ces modules.
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-3.5 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3.5">
                                            <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                                                <CheckCircle2 className="h-4 w-4" /> Aucune difficulté détectée
                                            </div>
                                            <div className="text-[12.5px] text-violet-700">{c.prenom} progresse bien sur l&apos;ensemble des modules. Continuez ainsi !</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Activité récente */}
                    <section className="mt-8 mb-4">
                        <h3 className="text-lg font-semibold tracking-tight text-violet-800">Activité récente</h3>
                        <div className="mt-4 max-w-5xl rounded-2xl border border-violet-200 bg-white p-5 shadow-xs">
                            {ACTIVITES.map((a, i) => (
                                <div key={i} className="flex items-center gap-3 border-b border-violet-100 py-2.5 last:border-0">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                                        <a.Icon className="h-[18px] w-[18px]" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-[13px] font-semibold text-violet-900">{a.enfant} {a.action}</div>
                                        <div className="truncate text-[11px] text-violet-500">{a.module} • {a.date}</div>
                                    </div>
                                    <div className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${a.parfait ? "bg-emerald-50 text-emerald-600" : "bg-violet-50 text-violet-600"}`}>
                                        {a.score}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            ) : (
                /* ─── État vide : aucun enfant rattaché ─── */
                <section className="mt-8 mb-4">
                    <h3 className="text-lg font-semibold tracking-tight text-violet-800">Mes enfants</h3>
                    <EmptyState
                        className="mt-4"
                        Icon={UserPlus}
                        titre="Aucun enfant pour le moment"
                        texte="Ajoutez un enfant à votre compte pour suivre sa progression, ses ateliers et ses badges. Son tableau de bord détaillé apparaîtra ici."
                        action={{ href: "/membre/enfants/ajouter", label: "Ajouter un enfant", Icon: Plus }}
                    />
                </section>
            )}
        </div>
    );
}
