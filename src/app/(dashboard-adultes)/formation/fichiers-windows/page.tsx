// * src/app/(dashboard-adultes)/formation/fichiers-windows/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Menu, Check, ArrowLeft, ArrowRight, Compass, Eye, BookOpen, Target,
    Search, HelpCircle, BadgeCheck, Lightbulb, FileText, Briefcase,
    Folder, FolderOpen, FileSpreadsheet, Image as ImageIcon, File,
    ListChecks, Trophy, Star, Award, Monitor, Sparkles, Info, Network, RotateCcw,
    type LucideIcon,
} from 'lucide-react';
import {
    obtenirProgressionFormation, sauvegarderEtapeFormation,
    enregistrerScoreQuizFormation, terminerModuleFormation,
} from '../actions';

// Identifiant de ce module pour le suivi de progression en base.
const MODULE_CLE = 'fichiers-windows';

/*
 * Module de formation adulte « Gérer ses fichiers sur Windows ».
 * Parcours en 7 étapes (Découvrir → Validation), thème violet du design system.
 * Page autonome plein écran (hors sidebar membre), contenu statique pour la maquette.
 */

// ─── Métadonnées des 7 étapes (barre de progression) ───
type Etape = { titre: string; label: string; Icon: LucideIcon };
const ETAPES: Etape[] = [
    { titre: 'Découvrir', label: 'Découvrir', Icon: Compass },
    { titre: 'Observer', label: 'Observer', Icon: Eye },
    { titre: 'Comprendre', label: 'Comprendre', Icon: BookOpen },
    { titre: 'Mission pratique', label: 'Mission', Icon: Target },
    { titre: 'Situation réelle', label: 'Situation réelle', Icon: Search },
    { titre: 'Quiz', label: 'Quiz', Icon: HelpCircle },
    { titre: 'Validation', label: 'Validation', Icon: BadgeCheck },
];

// ─── Encadré coloré réutilisable (gauche / droite) ───
type Tone = 'violet' | 'green' | 'amber';
const TONES: Record<Tone, { box: string; icon: string; titre: string }> = {
    violet: { box: 'bg-violet-50 border-violet-100', icon: 'text-violet-600', titre: 'text-violet-900' },
    green: { box: 'bg-emerald-50 border-emerald-100', icon: 'text-emerald-600', titre: 'text-emerald-800' },
    amber: { box: 'bg-amber-50 border-amber-100', icon: 'text-amber-600', titre: 'text-amber-900' },
};

function Encadre({ tone, Icon, titre, children }: { tone: Tone; Icon: LucideIcon; titre: string; children: React.ReactNode }) {
    const t = TONES[tone];
    return (
        <div className={`rounded-2xl border ${t.box} p-4`}>
            <div className={`flex items-center gap-2 text-sm font-bold ${t.titre}`}>
                <Icon className={`h-4 w-4 shrink-0 ${t.icon}`} strokeWidth={2.25} />
                {titre}
            </div>
            <div className="mt-2 text-[13px] leading-relaxed text-slate-600">{children}</div>
        </div>
    );
}

// ─── Petite ligne de fichier / dossier dans l'explorateur ───
function Ligne({ Icon, color, nom, date, type, taille }: { Icon: LucideIcon; color: string; nom: string; date: string; type: string; taille: string }) {
    return (
        <div className="grid grid-cols-[1.6fr_1fr_1.2fr_0.7fr] items-center gap-2 border-b border-slate-100 px-3 py-1.5 text-[12px] text-slate-600 hover:bg-violet-50/40">
            <span className="flex items-center gap-2 font-medium text-slate-700">
                <Icon className={`h-4 w-4 shrink-0 ${color}`} strokeWidth={2} /> {nom}
            </span>
            <span>{date}</span>
            <span className="truncate">{type}</span>
            <span className="text-right tabular-nums">{taille}</span>
        </div>
    );
}

// ─── Noeud d'arborescence (dossier) ───
function Noeud({ nom, niveau = 0, Icon = Folder }: { nom: string; niveau?: number; Icon?: LucideIcon }) {
    return (
        <div className="flex items-center gap-1.5 py-1 text-[13px] text-slate-700" style={{ paddingLeft: niveau * 18 }}>
            <Icon className="h-4 w-4 shrink-0 text-amber-400" strokeWidth={2} fill="currentColor" />
            <span className="font-medium">{nom}</span>
        </div>
    );
}

export default function ModuleFichiersWindows() {
    const router = useRouter();
    const [etape, setEtape] = useState(0); // 0..6
    const courante = ETAPES[etape];
    const estDerniere = etape === ETAPES.length - 1;

    // Reprise : charge la dernière étape atteinte en base au montage.
    useEffect(() => {
        obtenirProgressionFormation(MODULE_CLE)
            .then((p) => {
                if (!p.terminee && p.etapeActuelle > 0 && p.etapeActuelle < ETAPES.length) {
                    setEtape(p.etapeActuelle);
                }
            })
            .catch(() => { });
    }, []);

    // Change d'étape et enregistre la progression en base.
    const allerEtape = (i: number) => {
        const cible = Math.max(0, Math.min(i, ETAPES.length - 1));
        setEtape(cible);
        void sauvegarderEtapeFormation(MODULE_CLE, cible, ETAPES.length);
    };
    const suivant = () => allerEtape(etape + 1);
    const precedent = () => allerEtape(etape - 1);

    // Termine le module puis revient au dashboard.
    const terminer = async () => {
        await terminerModuleFormation(MODULE_CLE, ETAPES.length);
        router.push('/formation');
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-800">
            {/* Décor de fond : taches dégradées floutées */}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
                <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
                <div className="absolute bottom-16 left-1/3 h-64 w-64 rounded-full bg-fuchsia-200/20 blur-3xl" />
            </div>

            {/* Animation d'apparition à chaque changement d'étape */}
            <style>{`@keyframes etapeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* ── Barre supérieure ── */}
            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <button className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Menu">
                            <Menu className="h-5 w-5" />
                        </button>
                        <h1 className="truncate text-[15px] font-bold text-violet-950 sm:text-base">
                            <span className="hidden sm:inline">Module : </span>
                            <span className="font-extrabold">Gérer ses fichiers sur Windows</span>
                        </h1>
                    </div>
                    <span className="shrink-0 text-xs font-extrabold text-violet-600 sm:text-sm">
                        Étape {etape + 1} sur {ETAPES.length}
                    </span>
                </div>

                {/* ── Barre de progression (7 ronds) ── */}
                <div className="mx-auto max-w-7xl px-5 pb-5">
                    <div className="flex items-start justify-between">
                        {ETAPES.map((e, i) => {
                            const fait = i < etape;
                            const actif = i === etape;
                            return (
                                <React.Fragment key={e.label}>
                                    <div className="flex w-0 flex-1 flex-col items-center">
                                        <button
                                            onClick={() => allerEtape(i)}
                                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 sm:h-9 sm:w-9 ${
                                                fait
                                                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-300/50'
                                                    : actif
                                                        ? 'scale-110 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-400/50 ring-4 ring-violet-200'
                                                        : 'border-2 border-slate-200 bg-white text-slate-400 hover:border-violet-300'
                                            }`}
                                        >
                                            {fait ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                                        </button>
                                        <span className={`mt-2 hidden text-center text-[11px] leading-tight sm:block ${actif ? 'font-bold text-violet-700' : 'text-slate-400'}`}>
                                            {e.label}
                                        </span>
                                    </div>
                                    {i < ETAPES.length - 1 && (
                                        <div className={`mt-4 h-1 flex-1 rounded-full transition-colors duration-300 ${i < etape ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-slate-200'}`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* ── Corps : 2 colonnes (ré-animé à chaque étape) ── */}
            <main key={etape} style={{ animation: 'etapeIn .35s ease-out' }} className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[340px_1fr]">
                {/* Colonne gauche : titre + description + encadrés */}
                <div>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm shadow-violet-300/60">
                        <courante.Icon className="h-3.5 w-3.5" strokeWidth={2.5} /> Étape {etape + 1}
                    </span>
                    <h2 className="mt-3 bg-gradient-to-br from-violet-900 via-violet-700 to-purple-600 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">{courante.titre}</h2>
                    <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-violet-500 to-violet-300" />
                    <div className="mt-5 space-y-4">{panneauGauche(etape)}</div>
                </div>

                {/* Colonne droite : contenu de l'étape (avec filigrane d'icône en fond) */}
                <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/70 via-white to-white p-6 shadow-sm">
                    <courante.Icon aria-hidden className="pointer-events-none absolute -right-7 -top-7 h-36 w-36 text-violet-100/80" strokeWidth={1.5} />
                    <div className="relative">{panneauDroite(etape)}</div>
                </div>
            </main>

            {/* ── Barre de navigation ── */}
            <footer className="sticky bottom-0 z-20 border-t border-slate-200/80 bg-white/85 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
                    <button
                        onClick={precedent}
                        disabled={etape === 0}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ArrowLeft className="h-4 w-4" /> Précédent
                    </button>
                    <button
                        onClick={estDerniere ? terminer : suivant}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:from-violet-700 hover:to-purple-700"
                    >
                        {estDerniere ? (
                            <>Terminer le module <Check className="h-4 w-4" strokeWidth={3} /></>
                        ) : (
                            <>Suivant <ArrowRight className="h-4 w-4" /></>
                        )}
                    </button>
                </div>
            </footer>
        </div>
    );
}

// ════════════════════ PANNEAU GAUCHE (description + encadrés) ════════════════════
function panneauGauche(etape: number): React.ReactNode {
    switch (etape) {
        case 0:
            return (
                <>
                    <p className="text-[13px] leading-relaxed text-slate-600">
                        Bienvenue ! Dans ce module, vous allez apprendre à organiser et retrouver
                        facilement vos fichiers sur un ordinateur Windows. Une bonne organisation vous
                        fait gagner du temps au quotidien, au travail comme à la maison.
                    </p>
                    <Encadre tone="violet" Icon={Target} titre="Ce que vous allez apprendre">
                        Comprendre l’arborescence des dossiers, créer une organisation logique, classer,
                        retrouver et déplacer vos fichiers en toute confiance.
                    </Encadre>
                    <Encadre tone="amber" Icon={Lightbulb} titre="Conseil">
                        Prenez votre temps et avancez étape par étape. Vous pourrez revenir en arrière à
                        tout moment avec le bouton « Précédent ».
                    </Encadre>
                </>
            );
        case 1:
            return (
                <>
                    <p className="text-[13px] leading-relaxed text-slate-600">
                        Avant d’agir, prenons le temps d’<b className="text-violet-700">observer</b> une
                        situation concrète. L’image ci-contre montre l’explorateur de fichiers de Windows.
                        Observez attentivement cette organisation : repérez les éléments présents à l’écran
                        et les informations importantes.
                    </p>
                    <Encadre tone="amber" Icon={Lightbulb} titre="Indice">
                        Regardez attentivement le volet de gauche et le contenu du dossier sélectionné.
                        Repérez les noms des dossiers, les types de fichiers et les colonnes d’informations.
                    </Encadre>
                </>
            );
        case 2:
            return (
                <>
                    <p className="text-[13px] leading-relaxed text-slate-600">
                        Maintenant que vous avez observé, comprenons comment les fichiers et les dossiers
                        sont <b className="text-violet-700">structurés</b> sur Windows. Tout est organisé
                        comme un arbre : des dossiers qui contiennent d’autres dossiers et des fichiers.
                    </p>
                    <Encadre tone="violet" Icon={Network} titre="L’arborescence">
                        Un dossier peut contenir des sous-dossiers et des fichiers. On parle d’arborescence
                        car la structure ressemble aux branches d’un arbre.
                    </Encadre>
                    <Encadre tone="green" Icon={FileText} titre="Le type de fichier">
                        L’extension (.docx, .xlsx, .jpg…) indique le type du fichier et le programme qui
                        permet de l’ouvrir.
                    </Encadre>
                </>
            );
        case 3:
            return (
                <>
                    <p className="text-[13px] leading-relaxed text-slate-600">
                        À vous de jouer ! Vous allez mettre en pratique ce que vous venez d’apprendre en
                        organisant les fichiers fournis sur votre ordinateur. Suivez les consignes pas à pas.
                    </p>
                    <Encadre tone="violet" Icon={Target} titre="Objectif">
                        Créer une arborescence de dossiers claire et classer les fichiers au bon endroit.
                    </Encadre>
                    <ol className="space-y-2 text-[13px] text-slate-600">
                        {[
                            'Créez un dossier principal nommé « Gestion_fichiers » sur votre Bureau.',
                            'À l’intérieur, créez trois sous-dossiers : Documents, Photos et Autres.',
                            'Déplacez chaque fichier dans le dossier qui correspond à son contenu.',
                            'Vérifiez que tous les fichiers sont bien classés.',
                        ].map((txt, i) => (
                            <li key={i} className="flex gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-bold text-white">{i + 1}</span>
                                {txt}
                            </li>
                        ))}
                    </ol>
                    <Encadre tone="amber" Icon={Lightbulb} titre="Conseil">
                        Réfléchissez à la nature du fichier pour choisir le bon dossier. Un document Word ira
                        dans « Documents », une photo dans « Photos », etc.
                    </Encadre>
                </>
            );
        case 4:
            return (
                <>
                    <p className="text-[13px] leading-relaxed text-slate-600">
                        Vous allez maintenant appliquer tout ce que vous avez appris dans une situation
                        concrète inspirée du quotidien professionnel.
                    </p>
                    <Encadre tone="violet" Icon={Target} titre="Votre objectif">
                        Retrouver rapidement des documents importants et organiser les fichiers d’un projet
                        pour faciliter le travail de toute l’équipe.
                    </Encadre>
                    <Encadre tone="violet" Icon={FileText} titre="Contexte">
                        Vous êtes assistant(e) administratif(ve) dans une PME. Les fichiers sont éparpillés
                        et votre responsable vous demande de remettre de l’ordre avant la réunion de
                        cet après-midi.
                    </Encadre>
                    <Encadre tone="amber" Icon={ListChecks} titre="Compétences mobilisées">
                        Identifier l’arborescence, retrouver les fichiers demandés, organiser dans une
                        arborescence logique, renommer et déplacer si nécessaire.
                    </Encadre>
                </>
            );
        case 5:
            return (
                <>
                    <p className="text-[13px] leading-relaxed text-slate-600">
                        Félicitations ! Vous avez presque terminé. Ce quiz vous permet de vérifier vos
                        connaissances et de valider les compétences acquises. Vous obtiendrez un résultat à
                        la fin pour suivre vos progrès.
                    </p>
                    <Encadre tone="amber" Icon={Lightbulb} titre="Conseils">
                        <ul className="list-disc space-y-1 pl-4">
                            <li>Relisez bien les consignes.</li>
                            <li>Il peut y avoir plusieurs bonnes réponses.</li>
                            <li>En cas d’hésitation, fiez-vous à ce que vous avez appris !</li>
                        </ul>
                    </Encadre>
                    <Encadre tone="violet" Icon={Trophy} titre="Bon à savoir">
                        Pour réussir, vous devez obtenir au moins 70 % de bonnes réponses. Vous pourrez
                        revoir les réponses à la fin.
                    </Encadre>
                </>
            );
        default:
            return (
                <>
                    <p className="text-[13px] leading-relaxed text-slate-600">
                        Félicitations ! Vous avez terminé toutes les étapes de ce module. Cette dernière
                        étape vous permet de valider vos connaissances et de faire le point sur les
                        compétences acquises.
                    </p>
                    <Encadre tone="green" Icon={BadgeCheck} titre="Objectif atteint">
                        <p className="mb-1">Vous êtes maintenant capable de :</p>
                        <ul className="space-y-1">
                            {[
                                'Comprendre l’organisation des fichiers et dossiers sur Windows',
                                'Créer une arborescence logique',
                                'Retrouver, classer et déplacer les fichiers',
                                'Identifier les types de fichiers et leurs informations',
                                'Appliquer ces compétences dans une situation réelle',
                            ].map((c) => (
                                <li key={c} className="flex gap-1.5">
                                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={3} /> {c}
                                </li>
                            ))}
                        </ul>
                    </Encadre>
                    <Encadre tone="amber" Icon={Lightbulb} titre="Et après ?">
                        Vous pouvez maintenant passer à d’autres modules pour continuer à développer vos
                        compétences numériques.
                    </Encadre>
                </>
            );
    }
}

// ════════════════════ PANNEAU DROITE (contenu de l'étape) ════════════════════
function panneauDroite(etape: number): React.ReactNode {
    switch (etape) {
        case 0:
            return <EtapeDecouvrir />;
        case 1:
            return <EtapeObserver />;
        case 2:
            return <EtapeComprendre />;
        case 3:
            return <EtapeMission />;
        case 4:
            return <EtapeSituation />;
        case 5:
            return <EtapeQuiz />;
        default:
            return <EtapeValidation />;
    }
}

// ─── Étape 1 : Découvrir ───
function EtapeDecouvrir() {
    const cartes = [
        { Icon: Folder, color: 'text-violet-600 bg-violet-100', titre: 'Les dossiers', txt: 'Des « boîtes » qui rangent vos fichiers et d’autres dossiers.' },
        { Icon: FileText, color: 'text-sky-600 bg-sky-100', titre: 'Les fichiers', txt: 'Vos documents, photos, tableurs… chacun a un type.' },
        { Icon: Network, color: 'text-emerald-600 bg-emerald-100', titre: 'L’arborescence', txt: 'L’organisation en arbre qui relie tout ensemble.' },
        { Icon: Search, color: 'text-amber-600 bg-amber-100', titre: 'Retrouver vite', txt: 'Une bonne organisation = du temps gagné chaque jour.' },
    ];
    return (
        <div>
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-violet-900">
                <Sparkles className="h-5 w-5 text-violet-600" /> Pourquoi bien gérer ses fichiers ?
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                Sur un ordinateur, tout est rangé dans des fichiers et des dossiers. Quand c’est bien
                organisé, on retrouve tout en quelques secondes. Découvrons les notions de base avant de
                passer à la pratique.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {cartes.map((c) => (
                    <div key={c.titre} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${c.color}`}>
                            <c.Icon className="h-5 w-5" strokeWidth={2.25} />
                        </span>
                        <h4 className="mt-3 text-sm font-bold text-violet-950">{c.titre}</h4>
                        <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{c.txt}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Étape 2 : Observer (explorateur Windows simulé + questions) ───
function EtapeObserver() {
    const dossiers = ['Administratif', 'Clients', 'Comptabilité', 'Courriers', 'Projets', 'Ressources'];
    const fichiers = [
        { Icon: FileSpreadsheet, color: 'text-emerald-600', nom: 'Budget_2024.xlsx', date: '11/04/2024 15:42', type: 'Feuille de calcul', taille: '24 Ko' },
        { Icon: FileText, color: 'text-sky-600', nom: 'Compte_rendu_reunion.docx', date: '10/04/2024 09:30', type: 'Document Word', taille: '18 Ko' },
        { Icon: Monitor, color: 'text-amber-600', nom: 'Presentation_projet.pptx', date: '08/04/2024 14:22', type: 'Présentation', taille: '2 145 Ko' },
        { Icon: File, color: 'text-slate-500', nom: 'Liste_contacts.txt', date: '07/04/2024 16:05', type: 'Document texte', taille: '1 Ko' },
        { Icon: ImageIcon, color: 'text-pink-600', nom: 'Photo_equipe.jpg', date: '06/04/2024 11:20', type: 'Fichier JPG', taille: '1 356 Ko' },
    ];
    return (
        <div>
            {/* Fenêtre explorateur (défile horizontalement sur mobile) */}
            <div className="-mx-1 overflow-x-auto pb-1">
            <div className="min-w-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-500">
                        <Folder className="h-3.5 w-3.5 text-amber-400" fill="currentColor" /> Ce PC <span className="text-slate-300">›</span> Documents
                    </div>
                    <div className="ml-auto flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-400">
                        <Search className="h-3 w-3" /> Rechercher
                    </div>
                </div>
                <div className="grid grid-cols-[150px_1fr]">
                    {/* Volet gauche */}
                    <div className="border-r border-slate-100 bg-slate-50/60 p-2 text-[12px] text-slate-600">
                        <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">Accès rapide</p>
                        {['Bureau', 'Téléchargements', 'Documents', 'Images', 'Musique', 'Vidéos'].map((d, i) => (
                            <p key={d} className={`flex items-center gap-1.5 rounded px-2 py-1 ${i === 2 ? 'bg-violet-100 font-semibold text-violet-700' : ''}`}>
                                <Folder className="h-3.5 w-3.5 text-amber-400" fill="currentColor" /> {d}
                            </p>
                        ))}
                        <p className="mt-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">Ce PC</p>
                        <p className="flex items-center gap-1.5 px-2 py-1"><Monitor className="h-3.5 w-3.5 text-slate-400" /> Disque local (C:)</p>
                    </div>
                    {/* Liste fichiers */}
                    <div>
                        <div className="grid grid-cols-[1.6fr_1fr_1.2fr_0.7fr] gap-2 border-b border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-500">
                            <span>Nom</span><span>Modifié le</span><span>Type</span><span className="text-right">Taille</span>
                        </div>
                        {dossiers.map((d) => (
                            <Ligne key={d} Icon={Folder} color="text-amber-400" nom={d} date="12/04/2024 10:15" type="Dossier de fichiers" taille="—" />
                        ))}
                        {fichiers.map((f) => (
                            <Ligne key={f.nom} {...f} />
                        ))}
                    </div>
                </div>
            </div>
            </div>

            {/* Questions d'observation */}
            <div className="mt-6">
                <h3 className="flex items-center gap-2 text-base font-extrabold text-violet-900">
                    <Eye className="h-5 w-5 text-violet-600" /> Questions d’observation
                </h3>
                <div className="mt-3 space-y-3">
                    {[
                        'Combien de dossiers sont présents dans le dossier « Documents » ?',
                        'Quels types de fichiers peut-on trouver ? Donnez au moins trois exemples.',
                        'Quelle information permet de connaître la date de modification d’un fichier ?',
                    ].map((q, i) => (
                        <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                            <div className="flex flex-1 items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[12px] font-bold text-violet-700">{i + 1}</span>
                                <span className="text-[13px] text-slate-600">{q}</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Votre réponse…"
                                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 sm:w-40"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Étape 3 : Comprendre ───
function EtapeComprendre() {
    return (
        <div>
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-violet-900">
                <BookOpen className="h-5 w-5 text-violet-600" /> L’arborescence des dossiers
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                Sur Windows, les fichiers sont rangés dans une structure en arbre. Un dossier peut contenir
                des sous-dossiers, qui contiennent eux-mêmes des fichiers. Voici un exemple :
            </p>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <Noeud nom="Ce PC" Icon={Monitor} />
                <Noeud nom="Documents" niveau={1} />
                <Noeud nom="Clients" niveau={2} />
                <Noeud nom="Comptabilité" niveau={2} />
                <Noeud nom="Images" niveau={1} />
                <Noeud nom="Vacances" niveau={2} />
            </div>

            <h3 className="mt-6 flex items-center gap-2 text-base font-extrabold text-violet-900">
                <FileText className="h-5 w-5 text-violet-600" /> Reconnaître le type d’un fichier
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                    { ext: '.docx', txt: 'Document Word', Icon: FileText, color: 'text-sky-600 bg-sky-50' },
                    { ext: '.xlsx', txt: 'Feuille de calcul Excel', Icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50' },
                    { ext: '.jpg', txt: 'Image / photo', Icon: ImageIcon, color: 'text-pink-600 bg-pink-50' },
                    { ext: '.txt', txt: 'Document texte simple', Icon: File, color: 'text-slate-600 bg-slate-100' },
                ].map((f) => (
                    <div key={f.ext} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
                        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.color}`}>
                            <f.Icon className="h-5 w-5" strokeWidth={2.25} />
                        </span>
                        <div>
                            <div className="text-sm font-bold text-violet-950">{f.ext}</div>
                            <div className="text-[12px] text-slate-500">{f.txt}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Étape 4 : Mission pratique ───
function EtapeMission() {
    const taches = ['Dossier principal créé', 'Sous-dossiers créés : Documents, Photos, Autres', 'Fichiers déplacés dans le bon dossier', 'Vérification finale effectuée'];
    return (
        <div>
            <h3 className="flex items-center gap-2 text-base font-extrabold text-violet-900">
                <Folder className="h-5 w-5 text-violet-600" /> Votre mission
            </h3>
            <p className="mt-1 text-[13px] text-slate-600">Organisez les fichiers ci-dessous selon l’arborescence demandée.</p>

            {/* Arborescence cible */}
            <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <Noeud nom="Bureau" Icon={Monitor} />
                <Noeud nom="Gestion_fichiers" niveau={1} Icon={FolderOpen} />
                <Noeud nom="Documents" niveau={2} />
                <Noeud nom="Photos" niveau={2} />
                <Noeud nom="Autres" niveau={2} />
            </div>

            {/* Fichiers à classer */}
            <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">Fichiers à classer</p>
                {[
                    { Icon: FileText, color: 'text-sky-600', nom: 'Contrat_location.docx', type: 'Document Word' },
                    { Icon: FileSpreadsheet, color: 'text-emerald-600', nom: 'Budget_mensuel.xlsx', type: 'Feuille de calcul' },
                    { Icon: ImageIcon, color: 'text-pink-600', nom: 'Photo_famille.png', type: 'Fichier PNG' },
                    { Icon: File, color: 'text-slate-500', nom: 'Notes.txt', type: 'Document texte' },
                ].map((f) => (
                    <div key={f.nom} className="flex items-center gap-2 border-b border-slate-50 px-1 py-1.5 text-[12px] text-slate-600 last:border-0">
                        <f.Icon className={`h-4 w-4 ${f.color}`} strokeWidth={2} />
                        <span className="font-medium text-slate-700">{f.nom}</span>
                        <span className="ml-auto text-slate-400">{f.type}</span>
                    </div>
                ))}
            </div>

            {/* Zone de travail (cases à cocher) */}
            <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-violet-900">
                    <ListChecks className="h-4 w-4 text-violet-600" /> Zone de travail
                </h4>
                <p className="mt-1 text-[12px] text-slate-500">Réalisez votre mission sur votre ordinateur, puis cochez chaque étape validée.</p>
                <div className="mt-3 space-y-2">
                    {taches.map((t) => (
                        <Coche key={t} label={t} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Étape 5 : Situation réelle ───
function EtapeSituation() {
    return (
        <div className="space-y-5">
            <div>
                <h3 className="flex items-center gap-2 text-base font-extrabold text-violet-900">
                    <Briefcase className="h-5 w-5 text-violet-600" /> Le scénario
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                    Votre responsable, M. Martin, vous remet la liste des éléments à retrouver et à organiser
                    sur votre ordinateur (Bureau).
                </p>
            </div>

            {/* À retrouver */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="mb-2 text-[12px] font-bold text-violet-800">À retrouver :</p>
                {['Le document « Contrat_client.docx »', 'La présentation « Projet_client.pptx »', 'Le fichier Excel « Budget_previsionnel.xlsx »'].map((t, i) => (
                    <div key={t} className="flex items-center gap-2 py-1 text-[13px] text-slate-600">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">{i + 1}</span>
                        {t}
                    </div>
                ))}
            </div>

            {/* À organiser */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="mb-2 text-[12px] font-bold text-violet-800">À organiser dans « Projet_Client » :</p>
                <Noeud nom="Projet_Client" Icon={FolderOpen} />
                {['01_Documents', '02_Presentations', '03_Tableurs', '04_Images', '05_Divers'].map((d) => (
                    <Noeud key={d} nom={d} niveau={1} />
                ))}
            </div>

            {/* Consignes */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="mb-2 flex items-center gap-2 text-[13px] font-bold text-violet-800">
                    <ListChecks className="h-4 w-4 text-violet-600" /> Consignes
                </p>
                <ol className="space-y-1.5 text-[13px] text-slate-600">
                    {[
                        'Explorez les dossiers présents sur le Bureau.',
                        'Retrouvez les 3 fichiers demandés.',
                        'Créez l’arborescence « Projet_Client » avec les sous-dossiers indiqués.',
                        'Déplacez chaque fichier dans le dossier approprié.',
                        'Vérifiez que tout est bien classé et facile à retrouver.',
                    ].map((c, i) => (
                        <li key={i} className="flex gap-2">
                            <span className="font-bold text-violet-500">{i + 1}.</span> {c}
                        </li>
                    ))}
                </ol>
            </div>

            <Encadre tone="green" Icon={Lightbulb} titre="Conseil">
                Prenez le temps de réfléchir à l’emplacement le plus logique pour chaque fichier. Une bonne
                organisation vous fera gagner du temps au quotidien !
            </Encadre>
        </div>
    );
}

// ─── Étape 6 : Quiz ───
const QUIZ: { q: string; multi?: boolean; options: { txt: string; bon: boolean }[]; Icon: LucideIcon }[] = [
    {
        q: 'Qu’est-ce qu’un dossier sur Windows ?',
        multi: true,
        Icon: Folder,
        options: [
            { txt: 'Un dossier est un fichier comme les autres.', bon: false },
            { txt: 'Un dossier permet de regrouper des fichiers et d’autres dossiers.', bon: true },
            { txt: 'Un dossier sert uniquement à stocker des images.', bon: false },
            { txt: 'Un dossier permet d’organiser et de retrouver facilement ses fichiers.', bon: true },
        ],
    },
    {
        q: 'Dans l’explorateur de fichiers, que représente l’arborescence ?',
        Icon: Network,
        options: [
            { txt: 'La liste de tous les fichiers d’un dossier.', bon: false },
            { txt: 'La structure en forme d’arbre qui montre les dossiers et sous-dossiers.', bon: true },
            { txt: 'La taille des fichiers sur le disque.', bon: false },
            { txt: 'Les fichiers récents ouverts.', bon: false },
        ],
    },
    {
        q: 'Quelle information permet d’identifier le type d’un fichier ?',
        Icon: FileText,
        options: [
            { txt: 'Le nom du fichier.', bon: false },
            { txt: 'La date de modification.', bon: false },
            { txt: 'L’extension du fichier (ex : .docx, .jpg, .xlsx).', bon: true },
            { txt: 'La taille du fichier.', bon: false },
        ],
    },
    {
        q: 'Quelle est la bonne action pour déplacer un fichier dans un autre dossier ?',
        Icon: FolderOpen,
        options: [
            { txt: 'Copier le fichier puis le coller dans le nouveau dossier.', bon: false },
            { txt: 'Supprimer le fichier puis le recréer dans le nouveau dossier.', bon: false },
            { txt: 'Couper le fichier puis le coller dans le nouveau dossier.', bon: true },
            { txt: 'Renommer le fichier avec le nom du nouveau dossier.', bon: false },
        ],
    },
];

function EtapeQuiz() {
    // Réponses cochées par question (indices des options) + état de validation.
    const [reponses, setReponses] = useState<Record<number, number[]>>({});
    const [valide, setValide] = useState(false);

    const toggle = (qi: number, oi: number, multi: boolean) => {
        if (valide) return;
        setReponses((prev) => {
            const cur = prev[qi] ?? [];
            if (multi) {
                return { ...prev, [qi]: cur.includes(oi) ? cur.filter((x) => x !== oi) : [...cur, oi] };
            }
            return { ...prev, [qi]: [oi] };
        });
    };

    // Une question est juste si l'ensemble coché correspond exactement aux bonnes réponses.
    const questionCorrecte = (qi: number): boolean => {
        const choisis = [...(reponses[qi] ?? [])].sort((a, b) => a - b);
        const bons = QUIZ[qi].options.map((o, i) => (o.bon ? i : -1)).filter((i) => i >= 0).sort((a, b) => a - b);
        return choisis.length === bons.length && choisis.every((v, i) => v === bons[i]);
    };

    const score = QUIZ.reduce((acc, _q, qi) => acc + (questionCorrecte(qi) ? 1 : 0), 0);
    const reussi = score >= Math.ceil(QUIZ.length * 0.7);

    const valider = () => {
        setValide(true);
        void enregistrerScoreQuizFormation(MODULE_CLE, score, QUIZ.length); // sauvegarde en base
    };
    const recommencer = () => {
        setReponses({});
        setValide(false);
    };

    return (
        <div className="space-y-4">
            {QUIZ.map((item, qi) => (
                <div key={qi} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h4 className="flex gap-2 text-sm font-bold text-violet-950">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[12px] text-white">{qi + 1}</span>
                                {item.q}
                            </h4>
                            <p className="mt-1 pl-8 text-[11px] text-slate-400">
                                {item.multi ? 'Choisissez la ou les bonnes réponses.' : 'Choisissez la bonne réponse.'}
                            </p>
                        </div>
                        <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-500 sm:inline-flex">
                            <item.Icon className="h-5 w-5" strokeWidth={2} />
                        </span>
                    </div>
                    <div className="mt-3 space-y-2 pl-8">
                        {item.options.map((opt, oi) => {
                            const sel = (reponses[qi] ?? []).includes(oi);
                            let etat: 'neutre' | 'bon' | 'mauvais' = 'neutre';
                            if (valide) {
                                if (opt.bon) etat = 'bon';
                                else if (sel) etat = 'mauvais';
                            }
                            return (
                                <OptionQuiz
                                    key={oi}
                                    label={opt.txt}
                                    multi={item.multi}
                                    checked={sel}
                                    etat={etat}
                                    fige={valide}
                                    onToggle={() => toggle(qi, oi, !!item.multi)}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}

            {!valide ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-violet-50/50 p-3">
                    <span className="flex items-center gap-2 text-[12px] text-slate-500">
                        <Target className="h-4 w-4 text-violet-600" /> Une fois toutes les questions répondues, validez vos réponses.
                    </span>
                    <button
                        onClick={valider}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-[12px] font-extrabold text-white shadow-md hover:from-violet-700 hover:to-purple-700"
                    >
                        Valider mes réponses <Check className="h-4 w-4" strokeWidth={3} />
                    </button>
                </div>
            ) : (
                <div className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${reussi ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                    <div className="flex items-center gap-3">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${reussi ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                            {reussi ? <Trophy className="h-5 w-5" /> : <RotateCcw className="h-5 w-5" />}
                        </span>
                        <div>
                            <p className={`text-sm font-extrabold ${reussi ? 'text-emerald-800' : 'text-amber-800'}`}>Score : {score} / {QUIZ.length}</p>
                            <p className="text-[12px] text-slate-500">
                                {reussi ? 'Bravo, quiz réussi ! Votre score est enregistré.' : 'Il faut au moins 70 % de bonnes réponses. Vous pouvez réessayer.'}
                            </p>
                        </div>
                    </div>
                    {!reussi && (
                        <button
                            onClick={recommencer}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-4 py-2 text-[12px] font-bold text-amber-700 hover:bg-amber-50"
                        >
                            <RotateCcw className="h-4 w-4" /> Recommencer
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Étape 7 : Validation ───
function EtapeValidation() {
    const recap = [
        { t: 'Découvrir', d: 'Vous avez découvert l’explorateur de fichiers de Windows.' },
        { t: 'Observer', d: 'Vous avez observé les éléments et répondu aux questions.' },
        { t: 'Comprendre', d: 'Vous avez compris l’arborescence des dossiers et fichiers.' },
        { t: 'Mission', d: 'Vous avez organisé les fichiers selon les consignes données.' },
        { t: 'Situation réelle', d: 'Vous avez résolu un cas concret d’organisation de fichiers.' },
        { t: 'Quiz', d: 'Vous avez obtenu 100 % au quiz de validation.' },
        { t: 'Validation', d: 'Vous avez validé l’ensemble des compétences du module.' },
    ];
    return (
        <div>
            {/* En-tête félicitations */}
            <div className="flex items-start gap-3">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                    <Trophy className="h-6 w-6" strokeWidth={2.25} />
                </span>
                <div>
                    <h3 className="text-lg font-black text-violet-950">Félicitations !</h3>
                    <p className="text-[13px] text-slate-600">Vous avez réussi toutes les étapes de ce module. Voici le récapitulatif de votre progression.</p>
                </div>
            </div>

            {/* Score global */}
            <div className="mt-5 flex flex-col items-center gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row">
                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                    <svg className="h-28 w-28 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeDasharray="100 100" strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-black text-emerald-600">100%</span>
                        <span className="text-[10px] font-bold text-slate-400">Réussi</span>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold text-violet-900">Votre score global</p>
                    <p className="mt-1 text-[13px] text-slate-500">7 / 7 étapes complétées</p>
                    <p className="mt-1 text-[13px] font-semibold text-emerald-600">Bravo, excellent travail !</p>
                </div>
            </div>

            {/* Récapitulatif des étapes */}
            <div className="mt-5">
                <h4 className="text-sm font-extrabold text-violet-900">Récapitulatif des étapes</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {recap.map((r, i) => (
                        <div key={r.t} className="flex items-start gap-2.5 rounded-2xl border border-slate-100 bg-white p-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-bold text-white">{i + 1}</span>
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[13px] font-bold text-violet-950">{r.t}</span>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                                        <Check className="h-3 w-3" strokeWidth={3} /> Complété
                                    </span>
                                </div>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{r.d}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Votre réussite */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                <Award className="h-9 w-9 shrink-0 text-violet-500" strokeWidth={1.75} />
                <div>
                    <p className="text-sm font-bold text-violet-900">Votre réussite</p>
                    <p className="text-[12px] leading-relaxed text-slate-600">
                        Vous maîtrisez désormais les bases essentielles pour gérer vos fichiers sur Windows.
                        Continuez à pratiquer pour gagner en efficacité au quotidien !
                    </p>
                </div>
                <Star className="ml-auto hidden h-6 w-6 shrink-0 text-amber-400 sm:block" fill="currentColor" />
            </div>
        </div>
    );
}

// ─── Case à cocher interactive (mission) ───
function Coche({ label }: { label: string }) {
    const [on, setOn] = useState(false);
    return (
        <button onClick={() => setOn(!on)} className="flex w-full items-center gap-2.5 text-left text-[13px] text-slate-600">
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${on ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 bg-white'}`}>
                {on && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className={on ? 'text-slate-400 line-through' : ''}>{label}</span>
        </button>
    );
}

// ─── Option de quiz (contrôlée : sélection + correction après validation) ───
function OptionQuiz({ label, multi, checked, etat, fige, onToggle }: {
    label: string; multi?: boolean; checked: boolean; etat: 'neutre' | 'bon' | 'mauvais'; fige: boolean; onToggle: () => void;
}) {
    const tone =
        etat === 'bon' ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
            : etat === 'mauvais' ? 'border-rose-300 bg-rose-50 text-rose-700'
                : checked ? 'border-violet-300 bg-violet-50 text-violet-800'
                    : 'border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50/40';
    const coche = checked || etat === 'bon';
    const boxClass =
        etat === 'bon' ? 'border-emerald-600 bg-emerald-600 text-white'
            : coche ? 'border-violet-600 bg-violet-600 text-white'
                : 'border-slate-300 bg-white';
    return (
        <button
            type="button"
            onClick={onToggle}
            disabled={fige}
            className={`flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-left text-[13px] transition disabled:cursor-default ${tone}`}
        >
            <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center border-2 transition ${multi ? 'rounded-md' : 'rounded-full'} ${boxClass}`}>
                {coche && (multi ? <Check className="h-2.5 w-2.5" strokeWidth={4} /> : <span className="h-1.5 w-1.5 rounded-full bg-white" />)}
            </span>
            {label}
        </button>
    );
}
