// * src/app/(dashboard-adultes)/formation/page.tsx
import React from 'react';
import Link from 'next/link';
import {
    GraduationCap, ArrowRight, Layers, Clock, BarChart3, Sparkles,
    CheckCircle2, Lock,
} from 'lucide-react';
import { MODULES, nbEtapes, type ModuleFormation } from './modules-data';
import { obtenirProgressionFormation, type ProgressionFormationDTO } from './actions';

/*
 * Catalogue de l'espace formation adulte.
 * Liste tous les modules (modules-data) et lit la progression en base
 * pour ceux qui sont disponibles. Server component.
 */

export default async function FormationDashboard() {
    const dispos = MODULES.filter((m) => m.disponible);
    const progs = await Promise.all(dispos.map((m) => obtenirProgressionFormation(m.slug)));
    const progParSlug = new Map(dispos.map((m, i) => [m.slug, progs[i]]));

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-800">
            {/* Décor de fond */}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-violet-300/25 blur-3xl" />
                <div className="absolute -right-24 top-44 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
            </div>

            {/* En-tête */}
            <header className="relative z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
                        <GraduationCap className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-violet-950">Espace formation</h1>
                        <p className="text-[13px] text-slate-500">Développez vos compétences à votre rythme</p>
                    </div>
                </div>
            </header>

            <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
                {/* Bandeau d'accroche */}
                <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-600 to-purple-700 p-8 text-white shadow-lg shadow-violet-300/40">
                    <div aria-hidden className="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
                    <GraduationCap aria-hidden className="pointer-events-none absolute -bottom-6 right-2 h-32 w-32 text-white/10" strokeWidth={1.5} />
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                        <Sparkles className="h-3.5 w-3.5" /> Espace formation
                    </span>
                    <h2 className="relative mt-3 max-w-lg text-2xl font-black leading-tight sm:text-3xl">
                        Apprenez à votre rythme, une étape à la fois.
                    </h2>
                    <p className="relative mt-2 max-w-md text-[13px] text-violet-100">
                        Des parcours guidés et concrets pour développer vos compétences numériques et du quotidien.
                    </p>
                </div>

                {/* Titre de section */}
                <div className="mb-5 flex items-end justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-black tracking-tight text-violet-950">Vos modules</h3>
                        <p className="mt-0.5 text-[13px] text-slate-500">Choisissez un module pour commencer.</p>
                    </div>
                    <span className="shrink-0 text-[13px] font-bold text-violet-600">{dispos.length} disponible{dispos.length > 1 ? 's' : ''}</span>
                </div>

                {/* Grille des modules */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {MODULES.map((m) => (
                        <CarteModule key={m.slug} module={m} prog={progParSlug.get(m.slug)} />
                    ))}
                </div>
            </main>
        </div>
    );
}

// ───── Carte d'un module du catalogue ─────
function CarteModule({ module: m, prog }: { module: ModuleFormation; prog?: ProgressionFormationDTO }) {
    const total = nbEtapes(m);
    const degrade = { backgroundImage: `linear-gradient(to bottom right, ${m.from}, ${m.to})` };

    // Carte « bientôt disponible »
    if (!m.disponible) {
        return (
            <div className="relative flex flex-col rounded-3xl border border-dashed border-slate-200 bg-white/60 p-6">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    {m.categorie}
                </span>
                <span className="mt-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                    <m.icon className="h-7 w-7" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-lg font-black text-slate-500">{m.titre}</h3>
                <p className="mt-1 flex-1 text-[13px] leading-relaxed text-slate-400">{m.description}</p>
                <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-[12px] font-bold text-slate-400">
                    <Lock className="h-3.5 w-3.5" /> Bientôt disponible
                </span>
            </div>
        );
    }

    const href = m.href ?? `/formation/${m.slug}`;
    const statut = prog?.terminee ? 'termine' : prog && prog.etapeActuelle > 0 ? 'en-cours' : 'nouveau';
    const cta = statut === 'termine' ? 'Revoir' : statut === 'en-cours' ? 'Reprendre' : 'Commencer';
    const statutLabel = statut === 'termine' ? 'Terminé' : statut === 'en-cours' ? 'En cours' : 'Non commencé';
    const pct = prog?.progression ?? 0;

    return (
        <Link
            href={href}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-violet-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-200/50"
        >
            {/* Accent décoratif haut (couleur du module) */}
            <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={degrade} />

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                {m.categorie}
            </span>

            <span className="mt-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110" style={degrade}>
                <m.icon className="h-7 w-7" strokeWidth={2} />
            </span>

            <h3 className="mt-4 text-lg font-black text-violet-950">{m.titre}</h3>
            <p className="mt-1 flex-1 text-[13px] leading-relaxed text-slate-500">{m.description}</p>

            {/* Méta-infos */}
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-medium text-slate-400">
                <span className="inline-flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {total} étapes</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~{m.dureeMin} min</span>
                <span className="inline-flex items-center gap-1"><BarChart3 className="h-3.5 w-3.5" /> {m.niveau}</span>
            </div>

            {/* Progression */}
            <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={`inline-flex items-center gap-1 ${statut === 'termine' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {statut === 'termine' && <CheckCircle2 className="h-3.5 w-3.5" />} {statutLabel}
                    </span>
                    <span className="text-slate-400">{pct} %</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${statut === 'termine' ? 'bg-emerald-500' : 'bg-violet-500'}`} style={{ width: `${pct}%` }} />
                </div>
            </div>

            {/* CTA */}
            <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-md transition group-hover:from-violet-700 group-hover:to-purple-700">
                {cta} le module
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
        </Link>
    );
}
