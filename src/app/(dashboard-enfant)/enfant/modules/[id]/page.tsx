// * src/app/(dashboard-enfant)/enfant/modules/[id]/page.tsx
'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
    ChevronLeft, Play, CheckCircle, Lock, Trophy, 
    Star, Sparkles, BookOpen
} from 'lucide-react';
import { ENFANT, MODULES } from '@/lib/enfant-data';
import { obtenirProfilEnfant, obtenirDetailsModuleDepuisDB } from '../actions';

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

// Dictionnaire des activités par module (défini au niveau client pour modifications dynamiques)
const INITIAL_ACTIVITES_MOCK: Record<string, Activite[]> = {
    lecture: [
        { id: 'l1', titre: "L'alphabet et ses mystères", description: "Apprends à reconnaître les lettres et associe-les à des animaux rigolos !", type: 'lecon', statut: 'a_faire' },
        { id: 'l2', titre: "Quiz — Les sons complexes", description: "Trouve les mots qui contiennent des sons comme 'OU', 'AN' ou 'CH'.", type: 'quiz', statut: 'verrouille' },
    ],
    numerique: [
        { id: 'n1', titre: "Leçon : Souris et clavier n'ont plus de secret", description: "Découvre les fonctions principales de ton ordinateur.", type: 'lecon', statut: 'a_faire' },
        { id: 'n2', titre: "Quiz : Les bons réflexes sur Internet", description: "Apprends à naviguer en toute sécurité en évitant les pièges courants.", type: 'quiz', statut: 'verrouille' },
    ],
    robotique: [
        { id: 'r1', titre: "Leçon : Qu'est-ce qu'un robot ?", description: "Découvre comment fonctionne un robot et fais la différence avec un simple jouet.", type: 'lecon', statut: 'a_faire' },
        { id: 'r2', titre: "Quiz : Les capteurs du robot", description: "Sais-tu comment le robot voit et bouge ? Fais le test !", type: 'quiz', statut: 'verrouille' },
    ],
    anglais: [
        { id: 'a1', titre: "Quiz : Les couleurs en anglais", description: "Yellow, green, red... Associe chaque couleur à son mot anglais.", type: 'quiz', statut: 'a_faire' },
        { id: 'a2', titre: "Leçon : Les mots magiques", description: "Apprends les formules de politesse de base : Hello, Please, Thank you.", type: 'lecon', statut: 'verrouille' },
    ],
    civique: [
        { id: 'c1', titre: "Leçon : Les symboles de la République", description: "Le drapeau, la Marianne et la Marseillaise : découvre leur histoire.", type: 'lecon', statut: 'a_faire' },
        { id: 'c2', titre: "Quiz : La vie en société", description: "Pourquoi avons-nous des règles et comment nous aident-elles à mieux vivre ensemble ?", type: 'quiz', statut: 'verrouille' },
    ],
    eco: [
        { id: 'e1', titre: "Leçon : Le grand jeu du tri sélectif", description: "Apprends dans quelle poubelle jeter le plastique, le carton et le verre.", type: 'lecon', statut: 'a_faire' },
        { id: 'e2', titre: "Quiz : Les bons éco-gestes", description: "Fais la chasse au gaspillage à la maison avec ce quiz interactif.", type: 'quiz', statut: 'verrouille' },
    ],
};

type Params = Promise<{ id: string }>;

export default function EnfantModuleDetailPage({ params }: { params: Params }) {
    const { id } = use(params);
    const [activites, setActivites] = useState<Activite[]>([]);
    const [progression, setProgression] = useState(0);
    const [dbModule, setDbModule] = useState<any>(null);
    const [enfant, setEnfant] = useState<any>(ENFANT);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        
        async function loadData() {
            setLoading(true);
            try {
                // Charger le profil enfant
                const prof = await obtenirProfilEnfant();
                if (prof) setEnfant(prof);

                // Charger le module et ses exercices
                const dbMod = await obtenirDetailsModuleDepuisDB(id);
                if (dbMod) {
                    setDbModule(dbMod);
                    setActivites(dbMod.activites as Activite[]);
                    setProgression(dbMod.progression);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.error("Erreur de chargement du module/profil depuis le serveur :", err);
            }

            // Fallback aux mocks statiques et localStorage
            const baseActivites = INITIAL_ACTIVITES_MOCK[id] || [];
            let updatedActivites: Activite[] = [...baseActivites];
            let completedCount = 0;

            updatedActivites = updatedActivites.map((act) => {
                const savedState = localStorage.getItem(`rfc_enfant_act_${act.id}`);
                if (savedState) {
                    const data = JSON.parse(savedState);
                    completedCount++;
                    return {
                        ...act,
                        statut: 'termine',
                        score: data.score || undefined,
                        parfait: data.parfait || false
                    };
                }
                return act;
            });

            let unlockedNext = false;
            updatedActivites = updatedActivites.map((act) => {
                if (act.statut === 'termine') return act;
                if (!unlockedNext) {
                    unlockedNext = true;
                    return { ...act, statut: 'a_faire' };
                }
                return { ...act, statut: 'verrouille' };
            });

            const total = updatedActivites.length;
            const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
            
            setActivites(updatedActivites);
            setProgression(pct);
            setLoading(false);
        }

        loadData();
    }, [id]);

    // Récupération des informations statiques du module (pour l'icône et les dégradés)
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

    if (!displayModule) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-violet-900">
                <h2 className="text-2xl font-bold">Oups ! Ce module n'existe pas.</h2>
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
                    href="/enfant/modules" 
                    className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3.5 py-2 text-xs font-bold text-violet-700 shadow-xs hover:bg-violet-50 hover:text-violet-900 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" /> Retour aux modules
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
                                                {act.type === 'lecon' ? '📖 Leçon' : act.type === 'quiz' ? '❓ Quiz' : '✏️ Exercice de dessin'}
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
                                            Revoir l'activité
                                        </Link>
                                    ) : (
                                        <Link 
                                            href={`/enfant/modules/${id}/activite/${act.id}`}
                                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-xs font-black text-white hover:from-violet-700 hover:to-purple-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                        >
                                            <Play className="h-3.5 w-3.5 fill-current" /> C'est parti !
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
