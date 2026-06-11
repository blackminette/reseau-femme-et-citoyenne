// * src/app/(app-avec-header)/(dashboard)/admin/pedagogie/adultes/page.tsx
'use client';

/** Page pour choisir et rediriger vers le bon module pédagogique. */

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { listerTousLesModules } from './actions';
import { BookOpen, FolderPlus, GraduationCap, ChevronRight, AlertCircle } from 'lucide-react';
import Modal from '@/components/Modal';

// Type local pour correspondre aux données retournées avec le compteur Prisma
interface ModuleAvecCompte {
    id: number;
    titre: string;
    description: string | null;
    niveauRequis: string;
    createdAt: Date;
    _count: {
        cours: number;
    };
}

export default function PedagogieAdultesPage() {
    const [modules, setModules] = useState<ModuleAvecCompte[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        async function fetchModules() {
            setIsLoading(true);
            const result = await listerTousLesModules();
            if (result.success && result.data) {
                setModules(result.data as unknown as ModuleAvecCompte[]);
            } else {
                setError(result.error || "Une erreur est survenue.");
            }
            setIsLoading(false);
        }

        fetchModules();
    }, []);

    // Helper pour styliser dynamiquement les badges de niveau
    const getBadgeColor = (niveau: string) => {
        switch (niveau) {
            case 'NIVEAU_1':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'NIVEAU_2':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'NIVEAU_3':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 animate-fade-in">

            {/* EN-TÊTE DE LA PAGE */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-indigo-600" />
                        Pédagogie Adultes
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Gérez les modules d'apprentissage, organisez l'ordre des cours et supervisez les exercices.
                    </p>
                </div>

                {/* Bouton d'action pour la création */}
                <button
                    onClick={() => setModalIsOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                    <FolderPlus className="h-4 w-4" />
                    Nouveau Module
                </button>
            </div>

            {/* GESTION DE L'ERREUR */}
            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* ÉTAT DE CHARGEMENT (SKELETONS) */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                            <div className="h-5 bg-slate-100 rounded-md w-1/3 animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-6 bg-slate-200 rounded-md w-3/4 animate-pulse" />
                                <div className="h-4 bg-slate-100 rounded-md w-full animate-pulse" />
                            </div>
                            <div className="pt-4 border-t border-slate-50 flex justify-between">
                                <div className="h-4 bg-slate-100 rounded-md w-1/4 animate-pulse" />
                                <div className="h-4 bg-slate-200 rounded-md w-1/3 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ÉTAT VIDE */}
            {!isLoading && !error && modules.length === 0 && (
                <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl p-8 max-w-md mx-auto">
                    <div className="h-12 w-12 bg-slate-50 text-slate-400 flex items-center justify-center rounded-xl mx-auto mb-4">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">Aucun module pédagogique</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Commencez par créer votre premier module thématique pour y ajouter des chapitres et des exercices.
                    </p>
                    <Link
                        href="/admin/pedagogie/adultes/nouveau"
                        className="mt-4 inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 gap-1"
                    >
                        Créer le premier module <ChevronRight className="h-3 w-3" />
                    </Link>
                </div>
            )}

            {/* AFFICHAGE DE LA GRILLE DE MODULES */}
            {!isLoading && !error && modules.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            className="group bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md hover:shadow-slate-100 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 relative"
                        >
                            <div className="space-y-3">
                                {/* Badge Niveau */}
                                <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getBadgeColor(module.niveauRequis)}`}>
                                    {module.niveauRequis.replace('_', ' ')}
                                </span>

                                {/* Titre & Description */}
                                <div>
                                    <h3 className="font-bold text-slate-800 text-base tracking-tight group-hover:text-indigo-600 transition-colors">
                                        {module.titre}
                                    </h3>
                                    <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                                        {module.description || "Aucune description fournie pour ce module pédagogique."}
                                    </p>
                                </div>
                            </div>

                            {/* Bas de carte */}
                            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 text-slate-600 font-medium bg-slate-50 px-2 py-1 rounded-md">
                                    <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{module._count.cours} {module._count.cours > 1 ? 'cours' : 'cours'}</span>
                                </div>

                                <Link
                                    href={`/admin/pedagogie/adultes/${module.id}`}
                                    className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-0.5 group/link"
                                >
                                    Gérer
                                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}