// * src/app/(dashboard-adultes)/formation/Parcours.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Menu, Check, ArrowLeft, ArrowRight, HelpCircle, BadgeCheck,
    Target, Trophy, Award, Star, RotateCcw, Lightbulb,
    Volume2, VolumeX, Link2, type LucideIcon,
} from 'lucide-react';
import type { ModuleFormation, Tone, Encadre as EncadreT, Bloc, QuizItem, EtapeContenu } from './modules-data';
import {
    sauvegarderEtapeFormation, enregistrerScoreQuizFormation, terminerModuleFormation,
} from './actions';

/*
 * Moteur générique d'affichage d'un parcours de formation.
 * Reçoit un module (avec ses étapes + quiz) et reconstruit l'expérience complète :
 * timeline, panneau gauche (titre + encadrés), panneau droite (contenu), quiz noté,
 * écran de validation, navigation et sauvegarde de la progression en base.
 */

const TONES: Record<Tone, { box: string; icon: string; titre: string }> = {
    violet: { box: 'bg-violet-50 border-violet-100', icon: 'text-violet-600', titre: 'text-violet-900' },
    green: { box: 'bg-emerald-50 border-emerald-100', icon: 'text-emerald-600', titre: 'text-emerald-800' },
    amber: { box: 'bg-amber-50 border-amber-100', icon: 'text-amber-600', titre: 'text-amber-900' },
    blue: { box: 'bg-sky-50 border-sky-100', icon: 'text-sky-600', titre: 'text-sky-800' },
};

function Encadre({ tone, icon: Icon, titre, texte, items }: EncadreT) {
    const t = TONES[tone];
    return (
        <div className={`rounded-2xl border ${t.box} p-4`}>
            <div className={`flex items-center gap-2 text-sm font-bold ${t.titre}`}>
                <Icon className={`h-4 w-4 shrink-0 ${t.icon}`} strokeWidth={2.25} /> {titre}
            </div>
            {texte && <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{texte}</p>}
            {items && (
                <ul className="mt-2 space-y-1 text-[13px] text-slate-600">
                    {items.map((it, i) => (
                        <li key={i} className="flex gap-1.5"><Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${t.icon}`} strokeWidth={3} /> {it}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// Rendu d'un bloc de contenu (panneau droite).
function BlocRendu({ bloc }: { bloc: Bloc }) {
    if (bloc.type === 'texte') {
        return (
            <div>
                {bloc.titre && (
                    <h3 className="flex items-center gap-2 text-base font-extrabold text-violet-900">
                        {bloc.icon && <bloc.icon className="h-5 w-5 text-violet-600" />} {bloc.titre}
                    </h3>
                )}
                <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{bloc.texte}</p>
            </div>
        );
    }
    if (bloc.type === 'liste') {
        return (
            <div>
                {bloc.titre && (
                    <h3 className="mb-2 flex items-center gap-2 text-base font-extrabold text-violet-900">
                        {bloc.icon && <bloc.icon className="h-5 w-5 text-violet-600" />} {bloc.titre}
                    </h3>
                )}
                <ol className="space-y-2 text-[13px] text-slate-600">
                    {bloc.items.map((it, i) => (
                        <li key={i} className="flex gap-2.5">
                            {bloc.ordonnee ? (
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-bold text-white">{i + 1}</span>
                            ) : (
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" strokeWidth={3} />
                            )}
                            {it}
                        </li>
                    ))}
                </ol>
            </div>
        );
    }
    if (bloc.type === 'encadre') {
        return <Encadre tone={bloc.tone} icon={bloc.icon} titre={bloc.titre} texte={bloc.texte} items={bloc.items} />;
    }
    if (bloc.type === 'associer') {
        return <BlocAssocier titre={bloc.titre} paires={bloc.paires} />;
    }
    // cartes
    return (
        <div className="grid gap-3 sm:grid-cols-3">
            {bloc.items.map((c, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                        <c.icon className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <h4 className="mt-3 text-sm font-bold text-violet-950">{c.titre}</h4>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{c.texte}</p>
                </div>
            ))}
        </div>
    );
}

type Etape = { label: string; titre: string; icon: LucideIcon; kind: 'contenu' | 'quiz' | 'validation'; index: number };

export default function Parcours({ module }: { module: ModuleFormation }) {
    const router = useRouter();
    const contenus = module.etapes ?? [];
    const quiz = module.quiz ?? [];
    const aQuiz = quiz.length > 0;

    // Construction de la timeline : étapes de contenu + (Quiz) + Validation.
    const ETAPES: Etape[] = [
        ...contenus.map((e, i) => ({ label: e.label, titre: e.titre, icon: e.icon, kind: 'contenu' as const, index: i })),
        ...(aQuiz ? [{ label: 'Quiz', titre: 'Quiz', icon: HelpCircle, kind: 'quiz' as const, index: -1 }] : []),
        { label: 'Validation', titre: 'Validation', icon: BadgeCheck, kind: 'validation' as const, index: -1 },
    ];
    const TOTAL = ETAPES.length;

    const [etape, setEtape] = useState(0);
    const courante = ETAPES[etape];
    const estDerniere = etape === TOTAL - 1;

    const allerEtape = (i: number) => {
        const cible = Math.max(0, Math.min(i, TOTAL - 1));
        setEtape(cible);
        void sauvegarderEtapeFormation(module.slug, cible, TOTAL);
    };
    const suivant = () => allerEtape(etape + 1);
    const precedent = () => allerEtape(etape - 1);
    const terminer = async () => { await terminerModuleFormation(module.slug, TOTAL); router.push('/formation'); };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-800">
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
                <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
            </div>
            <style>{`@keyframes etapeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* Barre supérieure */}
            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <button onClick={() => router.push('/formation')} className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Retour au catalogue">
                            <Menu className="h-5 w-5" />
                        </button>
                        <h1 className="truncate text-[15px] font-bold text-violet-950 sm:text-base">
                            <span className="hidden sm:inline">Module : </span>
                            <span className="font-extrabold">{module.titre}</span>
                        </h1>
                    </div>
                    <span className="shrink-0 text-xs font-extrabold text-violet-600 sm:text-sm">Étape {etape + 1} sur {TOTAL}</span>
                </div>

                {/* Timeline */}
                <div className="mx-auto max-w-7xl px-5 pb-5">
                    <div className="flex items-start justify-between">
                        {ETAPES.map((e, i) => {
                            const fait = i < etape;
                            const actif = i === etape;
                            return (
                                <React.Fragment key={`${e.label}-${i}`}>
                                    <div className="flex w-0 flex-1 flex-col items-center">
                                        <button
                                            onClick={() => allerEtape(i)}
                                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 sm:h-9 sm:w-9 ${fait
                                                ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-300/50'
                                                : actif
                                                    ? 'scale-110 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-400/50 ring-4 ring-violet-200'
                                                    : 'border-2 border-slate-200 bg-white text-slate-400 hover:border-violet-300'}`}
                                        >
                                            {fait ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                                        </button>
                                        <span className={`mt-2 hidden text-center text-[11px] leading-tight sm:block ${actif ? 'font-bold text-violet-700' : 'text-slate-400'}`}>{e.label}</span>
                                    </div>
                                    {i < TOTAL - 1 && <div className={`mt-4 h-1 flex-1 rounded-full transition-colors duration-300 ${i < etape ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-slate-200'}`} />}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Corps */}
            <main key={etape} style={{ animation: 'etapeIn .35s ease-out' }} className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[340px_1fr]">
                {/* Gauche */}
                <div>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm shadow-violet-300/60">
                        <courante.icon className="h-3.5 w-3.5" strokeWidth={2.5} /> Étape {etape + 1}
                    </span>
                    <h2 className="mt-3 bg-gradient-to-br from-violet-900 via-violet-700 to-purple-600 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">{courante.titre}</h2>
                    <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-violet-500 to-violet-300" />
                    <div className="mt-4"><BoutonEcouter texte={texteAEcouter(courante, contenus)} /></div>
                    <div className="mt-5 space-y-4">{panneauGauche(courante, contenus, ETAPES)}</div>
                </div>

                {/* Droite */}
                <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/70 via-white to-white p-6 shadow-sm">
                    <courante.icon aria-hidden className="pointer-events-none absolute -right-7 -top-7 h-36 w-36 text-violet-100/80" strokeWidth={1.5} />
                    <div className="relative">{panneauDroite(courante, contenus, quiz, module, ETAPES)}</div>
                </div>
            </main>

            {/* Navigation */}
            <footer className="sticky bottom-0 z-20 border-t border-slate-200/80 bg-white/85 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
                    <button onClick={precedent} disabled={etape === 0} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                        <ArrowLeft className="h-4 w-4" /> Précédent
                    </button>
                    <button onClick={estDerniere ? terminer : suivant} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:from-violet-700 hover:to-purple-700">
                        {estDerniere ? (<>Terminer le module <Check className="h-4 w-4" strokeWidth={3} /></>) : (<>Suivant <ArrowRight className="h-4 w-4" /></>)}
                    </button>
                </div>
            </footer>
        </div>
    );
}

// ───── Panneau gauche selon le type d'étape ─────
function panneauGauche(courante: Etape, contenus: EtapeContenu[], ETAPES: Etape[]): React.ReactNode {
    if (courante.kind === 'contenu') {
        const c = contenus[courante.index];
        return (
            <>
                <p className="text-[13px] leading-relaxed text-slate-600">{c.description}</p>
                {c.encadres?.map((e, i) => <Encadre key={i} {...e} />)}
            </>
        );
    }
    if (courante.kind === 'quiz') {
        return (
            <>
                <p className="text-[13px] leading-relaxed text-slate-600">Ce quiz vous permet de vérifier vos connaissances et de valider les compétences acquises.</p>
                <Encadre tone="amber" icon={Lightbulb} titre="Conseils" items={['Lisez bien chaque question.', 'Il peut y avoir plusieurs bonnes réponses.', 'Fiez-vous à ce que vous avez appris !']} />
                <Encadre tone="violet" icon={Trophy} titre="Bon à savoir" texte="Pour réussir, visez au moins 70 % de bonnes réponses. Vous pouvez réessayer." />
            </>
        );
    }
    // validation
    return (
        <>
            <p className="text-[13px] leading-relaxed text-slate-600">Félicitations ! Vous avez terminé toutes les étapes de ce module. Faisons le point sur ce que vous avez appris.</p>
            <Encadre tone="green" icon={BadgeCheck} titre="Objectif atteint" items={ETAPES.filter((e) => e.kind === 'contenu').map((e) => e.titre)} />
            <Encadre tone="amber" icon={Lightbulb} titre="Et après ?" texte="Vous pouvez passer à d'autres modules pour continuer à développer vos compétences." />
        </>
    );
}

// ───── Panneau droite selon le type d'étape ─────
function panneauDroite(
    courante: Etape,
    contenus: EtapeContenu[],
    quiz: QuizItem[],
    module: ModuleFormation,
    ETAPES: Etape[],
): React.ReactNode {
    if (courante.kind === 'contenu') {
        const c = contenus[courante.index];
        return <div className="space-y-5">{c.blocs.map((b, i) => <BlocRendu key={i} bloc={b} />)}</div>;
    }
    if (courante.kind === 'quiz') {
        return <Quiz quiz={quiz} moduleSlug={module.slug} />;
    }
    return <Validation contenus={ETAPES.filter((e) => e.kind === 'contenu')} titre={module.titre} />;
}

// ───── Étape Quiz (interactive + sauvegarde) ─────
function Quiz({ quiz, moduleSlug }: { quiz: QuizItem[]; moduleSlug: string }) {
    const [reponses, setReponses] = useState<Record<number, number[]>>({});
    const [valide, setValide] = useState(false);

    const toggle = (qi: number, oi: number, multi: boolean) => {
        if (valide) return;
        setReponses((prev) => {
            const cur = prev[qi] ?? [];
            if (multi) return { ...prev, [qi]: cur.includes(oi) ? cur.filter((x) => x !== oi) : [...cur, oi] };
            return { ...prev, [qi]: [oi] };
        });
    };
    const questionCorrecte = (qi: number) => {
        const choisis = [...(reponses[qi] ?? [])].sort((a, b) => a - b);
        const bons = quiz[qi].options.map((o, i) => (o.bon ? i : -1)).filter((i) => i >= 0).sort((a, b) => a - b);
        return choisis.length === bons.length && choisis.every((v, i) => v === bons[i]);
    };
    const score = quiz.reduce((acc, _q, qi) => acc + (questionCorrecte(qi) ? 1 : 0), 0);
    const reussi = score >= Math.ceil(quiz.length * 0.7);
    const valider = () => { setValide(true); void enregistrerScoreQuizFormation(moduleSlug, score, quiz.length); };
    const recommencer = () => { setReponses({}); setValide(false); };

    return (
        <div className="space-y-4">
            {quiz.map((item, qi) => (
                <div key={qi} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                        <h4 className="flex gap-2 text-sm font-bold text-violet-950">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[12px] text-white">{qi + 1}</span>
                            {item.q}
                        </h4>
                        <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-500 sm:inline-flex">
                            <item.icon className="h-5 w-5" strokeWidth={2} />
                        </span>
                    </div>
                    <div className="mt-3 space-y-2 pl-8">
                        {item.options.map((opt, oi) => {
                            const sel = (reponses[qi] ?? []).includes(oi);
                            let etat: 'neutre' | 'bon' | 'mauvais' = 'neutre';
                            if (valide) { if (opt.bon) etat = 'bon'; else if (sel) etat = 'mauvais'; }
                            return <OptionQuiz key={oi} label={opt.txt} multi={item.multi} checked={sel} etat={etat} fige={valide} onToggle={() => toggle(qi, oi, !!item.multi)} />;
                        })}
                    </div>
                </div>
            ))}
            {!valide ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-violet-50/50 p-3">
                    <span className="flex items-center gap-2 text-[12px] text-slate-500"><Target className="h-4 w-4 text-violet-600" /> Validez une fois toutes les questions répondues.</span>
                    <button onClick={valider} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-[12px] font-extrabold text-white shadow-md hover:from-violet-700 hover:to-purple-700">Valider mes réponses <Check className="h-4 w-4" strokeWidth={3} /></button>
                </div>
            ) : (
                <div className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${reussi ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                    <div className="flex items-center gap-3">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${reussi ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{reussi ? <Trophy className="h-5 w-5" /> : <RotateCcw className="h-5 w-5" />}</span>
                        <div>
                            <p className={`text-sm font-extrabold ${reussi ? 'text-emerald-800' : 'text-amber-800'}`}>Score : {score} / {quiz.length}</p>
                            <p className="text-[12px] text-slate-500">{reussi ? 'Bravo, quiz réussi ! Votre score est enregistré.' : 'Il faut au moins 70 %. Vous pouvez réessayer.'}</p>
                        </div>
                    </div>
                    {!reussi && <button onClick={recommencer} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-4 py-2 text-[12px] font-bold text-amber-700 hover:bg-amber-50"><RotateCcw className="h-4 w-4" /> Recommencer</button>}
                </div>
            )}
        </div>
    );
}

function OptionQuiz({ label, multi, checked, etat, fige, onToggle }: { label: string; multi?: boolean; checked: boolean; etat: 'neutre' | 'bon' | 'mauvais'; fige: boolean; onToggle: () => void }) {
    const tone = etat === 'bon' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : etat === 'mauvais' ? 'border-rose-300 bg-rose-50 text-rose-700' : checked ? 'border-violet-300 bg-violet-50 text-violet-800' : 'border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50/40';
    const coche = checked || etat === 'bon';
    const boxClass = etat === 'bon' ? 'border-emerald-600 bg-emerald-600 text-white' : coche ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 bg-white';
    return (
        <button type="button" onClick={onToggle} disabled={fige} className={`flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-left text-[13px] transition disabled:cursor-default ${tone}`}>
            <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center border-2 transition ${multi ? 'rounded-md' : 'rounded-full'} ${boxClass}`}>
                {coche && (multi ? <Check className="h-2.5 w-2.5" strokeWidth={4} /> : <span className="h-1.5 w-1.5 rounded-full bg-white" />)}
            </span>
            {label}
        </button>
    );
}

// ───── Étape Validation ─────
function Validation({ contenus, titre }: { contenus: Etape[]; titre: string }) {
    return (
        <div>
            <div className="flex items-start gap-3">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600"><Trophy className="h-6 w-6" strokeWidth={2.25} /></span>
                <div>
                    <h3 className="text-lg font-black text-violet-950">Félicitations !</h3>
                    <p className="text-[13px] text-slate-600">Vous avez terminé le module « {titre} ». Voici le récapitulatif de votre progression.</p>
                </div>
            </div>

            <div className="mt-5 flex flex-col items-center gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row">
                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                    <svg className="h-28 w-28 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeDasharray="100 100" strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex flex-col items-center"><span className="text-2xl font-black text-emerald-600">100%</span><span className="text-[10px] font-bold text-slate-400">Réussi</span></div>
                </div>
                <div>
                    <p className="text-sm font-bold text-violet-900">Votre progression</p>
                    <p className="mt-1 text-[13px] text-slate-500">{contenus.length} étapes complétées</p>
                    <p className="mt-1 text-[13px] font-semibold text-emerald-600">Bravo, excellent travail !</p>
                </div>
            </div>

            <div className="mt-5">
                <h4 className="text-sm font-extrabold text-violet-900">Récapitulatif des étapes</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {contenus.map((e, i) => (
                        <div key={i} className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-bold text-white">{i + 1}</span>
                            <span className="flex-1 text-[13px] font-bold text-violet-950">{e.titre}</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600"><Check className="h-3 w-3" strokeWidth={3} /> Complété</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                <Award className="h-9 w-9 shrink-0 text-violet-500" strokeWidth={1.75} />
                <div>
                    <p className="text-sm font-bold text-violet-900">Votre réussite</p>
                    <p className="text-[12px] leading-relaxed text-slate-600">Vous avez acquis de nouvelles compétences. Continuez à pratiquer pour gagner en autonomie !</p>
                </div>
                <Star className="ml-auto hidden h-6 w-6 shrink-0 text-amber-400 sm:block" fill="currentColor" />
            </div>
        </div>
    );
}

// ───── Bouton « Écouter » (lecture vocale FR du texte de l'étape) ─────
function BoutonEcouter({ texte }: { texte: string }) {
    const [actif, setActif] = useState(false);
    useEffect(() => () => { try { window.speechSynthesis?.cancel(); } catch { } }, []);
    const basculer = () => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        if (actif) { window.speechSynthesis.cancel(); setActif(false); return; }
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(texte);
        u.lang = 'fr-FR';
        u.rate = 0.95;
        u.onend = () => setActif(false);
        u.onerror = () => setActif(false);
        window.speechSynthesis.speak(u);
        setActif(true);
    };
    return (
        <button
            onClick={basculer}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold shadow-sm transition ${actif ? 'border-violet-300 bg-violet-100 text-violet-700' : 'border-violet-200 bg-white text-violet-700 hover:bg-violet-50'}`}
        >
            {actif ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {actif ? 'Arrêter la lecture' : 'Écouter cette étape'}
        </button>
    );
}

// ───── Exercice interactif « Relier » (associer par clic, peu de lecture) ─────
function BlocAssocier({ titre, paires }: { titre?: string; paires: { gauche: string; droite: string }[] }) {
    // Colonne droite affichée dans un ordre fixe (tri alpha) pour ne pas être alignée sur la gauche.
    const droites = paires.map((p, i) => ({ id: i, txt: p.droite })).sort((a, b) => a.txt.localeCompare(b.txt));
    const [selG, setSelG] = useState<number | null>(null);
    const [liens, setLiens] = useState<Record<number, number>>({}); // index gauche -> id droite (= index paire d'origine)
    const [verifie, setVerifie] = useState(false);

    const choisirD = (droiteId: number) => {
        if (verifie || selG === null) return;
        setLiens((prev) => ({ ...prev, [selG]: droiteId }));
        setSelG(null);
    };
    const correct = (gi: number) => liens[gi] === gi;
    const tousReliees = Object.keys(liens).length === paires.length;
    const score = paires.reduce((a, _p, gi) => a + (correct(gi) ? 1 : 0), 0);

    return (
        <div>
            {titre && <h3 className="mb-3 flex items-center gap-2 text-base font-extrabold text-violet-900"><Link2 className="h-5 w-5 text-violet-600" /> {titre}</h3>}
            <div className="grid grid-cols-2 gap-3">
                {/* Gauche */}
                <div className="space-y-2">
                    {paires.map((p, gi) => {
                        const relie = liens[gi] !== undefined;
                        let cls = 'border-slate-200 bg-white hover:border-violet-300 text-slate-700';
                        if (verifie && relie) cls = correct(gi) ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-rose-300 bg-rose-50 text-rose-700';
                        else if (selG === gi) cls = 'border-violet-500 bg-violet-50 text-violet-800';
                        else if (relie) cls = 'border-violet-300 bg-violet-50/60 text-violet-800';
                        return (
                            <button key={gi} onClick={() => { if (!verifie) setSelG(gi); }} disabled={verifie} className={`flex w-full items-start gap-2 rounded-xl border p-3 text-left text-[13px] font-medium transition ${cls}`}>
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-bold text-white">{gi + 1}</span>
                                <span>{p.gauche}{relie && <span className="text-violet-500"> → {droites.find((d) => d.id === liens[gi])?.txt}</span>}</span>
                            </button>
                        );
                    })}
                </div>
                {/* Droite */}
                <div className="space-y-2">
                    {droites.map((d) => {
                        const choisi = Object.values(liens).includes(d.id);
                        return (
                            <button key={d.id} onClick={() => choisirD(d.id)} disabled={verifie || choisi} className={`flex w-full items-center rounded-xl border p-3 text-left text-[13px] transition ${choisi ? 'border-violet-200 bg-violet-50/40 text-violet-400' : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300'} ${selG !== null && !choisi ? 'ring-2 ring-violet-200' : ''}`}>
                                {d.txt}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-[12px] text-slate-500">{verifie ? `${score} / ${paires.length} bonnes réponses` : 'Cliquez à gauche, puis à droite, pour relier.'}</span>
                {!verifie ? (
                    <button onClick={() => setVerifie(true)} disabled={!tousReliees} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-[12px] font-extrabold text-white shadow-md hover:from-violet-700 hover:to-purple-700 disabled:opacity-40">Vérifier <Check className="h-4 w-4" strokeWidth={3} /></button>
                ) : (
                    <button onClick={() => { setLiens({}); setSelG(null); setVerifie(false); }} className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-4 py-2 text-[12px] font-bold text-violet-700 hover:bg-violet-50"><RotateCcw className="h-4 w-4" /> Recommencer</button>
                )}
            </div>
        </div>
    );
}

// Construit le texte lu à voix haute pour une étape.
function texteAEcouter(courante: Etape, contenus: EtapeContenu[]): string {
    if (courante.kind === 'contenu') {
        const c = contenus[courante.index];
        const m: string[] = [c.titre, c.description];
        for (const e of c.encadres ?? []) { m.push(e.titre); if (e.texte) m.push(e.texte); if (e.items) m.push(...e.items); }
        for (const b of c.blocs) {
            if (b.type === 'texte') { if (b.titre) m.push(b.titre); m.push(b.texte); }
            else if (b.type === 'liste') { if (b.titre) m.push(b.titre); m.push(...b.items); }
            else if (b.type === 'encadre') { m.push(b.titre); if (b.texte) m.push(b.texte); if (b.items) m.push(...b.items); }
            else if (b.type === 'cartes') { for (const ca of b.items) m.push(ca.titre, ca.texte); }
            else if (b.type === 'associer') { if (b.titre) m.push(b.titre); }
        }
        return m.join('. ');
    }
    if (courante.kind === 'quiz') return 'Quiz. Choisissez la ou les bonnes réponses, puis validez.';
    return 'Félicitations ! Vous avez terminé le module.';
}
