// * src/app/(dashboard-adultes)/membre/modules/[id]/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, HelpCircle, Lock, Check, ChevronRight } from 'lucide-react';
import { obtenirDetailsModuleAdulte } from '../../actions';

export default async function ModuleDetailAdultePage(
    props: { params: Promise<{ id: string }> }
) {
    const { id } = await props.params;
    const module = await obtenirDetailsModuleAdulte(id);

    if (!module) {
        return (
            <div className="text-violet-900">
                <Link
                    href="/membre/modules"
                    className="group mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 transition-colors hover:text-violet-800"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    Retour aux modules
                </Link>
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 bg-white p-16 text-center">
                    <BookOpen className="h-12 w-12 text-violet-300" />
                    <h3 className="mt-4 text-lg font-bold text-violet-950">Module introuvable</h3>
                    <p className="mt-2 text-sm text-violet-500">Ce module n&apos;existe pas ou n&apos;est plus disponible.</p>
                </div>
            </div>
        );
    }

    const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
        lecon: BookOpen,
        quiz: HelpCircle,
    };

    return (
        <div className="text-violet-900">

            <Link
                href="/membre/modules"
                className="group mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 transition-colors hover:text-violet-800"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Retour aux modules
            </Link>

            {/* En-tête du module */}
            <div className="rounded-2xl border border-violet-200 bg-white p-6 shadow-xs">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-violet-950">
                    {module.label}
                </h1>
                {module.description && (
                    <p className="mt-2 text-sm text-violet-600">{module.description}</p>
                )}
                <div className="mt-4 flex items-center gap-4">
                    <div className="text-2xl font-extrabold text-violet-700">{module.progression}%</div>
                    <div className="flex-1 h-2.5 overflow-hidden rounded-full bg-violet-100">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600 transition-all duration-500"
                            style={{ width: `${module.progression}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Liste des activités */}
            <section className="mt-6">
                <h2 className="text-lg font-semibold tracking-tight text-violet-800 mb-4">Activités</h2>
                <div className="space-y-3">
                    {module.activites.map((act) => {
                        const ActIcon = ICON_MAP[act.type] || BookOpen;
                        const isLocked = act.statut === 'verrouille';
                        const isDone = act.statut === 'termine';
                        const isOpen = act.statut === 'a_faire';

                        return (
                            <div
                                key={act.id}
                                className={`relative rounded-2xl border bg-white p-4 shadow-xs transition-all ${
                                    isLocked
                                        ? 'border-slate-200 opacity-60'
                                        : isDone
                                            ? 'border-emerald-200'
                                            : 'border-violet-200 hover:shadow-md'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Icône statut */}
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                        isDone
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : isLocked
                                                ? 'bg-slate-100 text-slate-400'
                                                : 'bg-violet-50 text-violet-600'
                                    }`}>
                                        {isDone ? <Check className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : <ActIcon className="h-5 w-5" />}
                                    </div>

                                    {/* Contenu */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${isDone ? 'text-emerald-700' : isLocked ? 'text-slate-400' : 'text-violet-950'}`}>
                                                {act.titre}
                                            </span>
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                                act.type === 'quiz'
                                                    ? 'bg-amber-50 text-amber-600'
                                                    : 'bg-violet-50 text-violet-600'
                                            }`}>
                                                {act.type === 'quiz' ? 'Quiz' : 'Leçon'}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-[12px] text-violet-500 line-clamp-1">{act.description}</p>
                                        {act.score && (
                                            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${act.parfait ? 'bg-emerald-50 text-emerald-600' : 'bg-violet-50 text-violet-600'}`}>
                                                Score : {act.score}
                                            </span>
                                        )}
                                    </div>

                                    {/* Flèche */}
                                    {isOpen && (
                                        <Link
                                            href={`/membre/modules/${module.id}/activite/${act.id}`}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white transition-colors hover:bg-violet-700"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                    {isDone && (
                                        <Link
                                            href={`/membre/modules/${module.id}/activite/${act.id}`}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100"
                                        >
                                            <ChevronRight className="h-4 w-4" />
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
