// * src/app/(dashboard-adultes)/admin/pedagogie/adultes/[coursId]/cours/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, MoveRight, MoveLeft } from 'lucide-react';
import { getCours } from './actions';

interface PageCours {
    numeroPage: number;
    titre: string;
    texteExplicatif: string;
    imageUrl: string | null;
}

interface CoursInfo {
    id: number;
    titre: string;
    ordreDansModule: number;
    contenu: PageCours[];
    createdAt: Date;
}

export default function AdminModifieCoursPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cours, setCours] = useState<CoursInfo | null>(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const params = useParams();
    const router = useRouter();

    const moduleId = parseInt(params.id as string, 10);
    const coursId = parseInt(params.coursId as string, 10);

    useEffect(() => {
        const handleGetCours = async () => {
            if (!coursId) return;
            setError(null);
            setIsLoading(true);

            const result = await getCours(coursId);
            if (result.success && result.data) {
                const coursData = result.data as any;
                let contenuPages: PageCours[] = [];

                try {
                    contenuPages = typeof coursData.contenu === 'string'
                        ? JSON.parse(coursData.contenu)
                        : (coursData.contenu || []);
                } catch (e) {
                    contenuPages = [];
                }

                setCours({
                    ...coursData,
                    contenu: contenuPages
                });
            } else {
                setError(result.error || "Impossible de charger le cours.");
            }
            setIsLoading(false);
        };

        handleGetCours();
    }, [coursId]);

    if (isLoading) {
        return <div className="p-6 text-sm text-violet-600">Chargement du cours...</div>;
    }

    if (error || !cours) {
        return <div className="p-6 text-amber-600">{error || "Cours introuvable."}</div>;
    }

    return (
        <div className="p-6 space-y-6">
            {/* Fil d'ariane / Bouton Retour */}
            <div className="flex flex-col space-y-4 mb-6">
                <Link
                    href={`/admin/pedagogie/adultes/${moduleId}`}
                    className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1 w-fit"
                >
                    <ChevronRight className="h-3 w-3 rotate-180" />
                    Retour au module
                </Link>

                <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                        Cours #{cours.ordreDansModule}
                    </span>
                    <h1 className="text-2xl font-bold tracking-tight text-violet-950">
                        {cours.titre}
                    </h1>
                </div>
            </div>

            {/* Section Affichage du contenu JSON (Les Pages) */}
            <div className="border-t border-violet-100 pt-6">
                <h2 className="text-lg font-semibold text-violet-900 mb-6">Contenu pédagogique du cours</h2>

                {cours.contenu && cours.contenu.length > 0 ? (
                    <div className="space-y-6">
                        {(() => {
                            const page = cours.contenu[currentPageIndex];
                            if (!page) return null;

                            return (
                                <div className="bg-white border border-violet-200 rounded-xl shadow-sm p-6 space-y-4 min-h-[350px] flex flex-col justify-between">
                                    <div>
                                        {/* Header de la Page */}
                                        <div className="flex items-center justify-between border-b border-violet-50 pb-3 mb-4">
                                            <h3 className="font-bold text-violet-950 text-base">
                                                Page {page.numeroPage || currentPageIndex + 1} : {page.titre}
                                            </h3>
                                            <span className="px-2 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-md">
                                                Slide vue unique
                                            </span>
                                        </div>

                                        {/* Contenu texte et image de la Page */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                            {/* Texte explicatif */}
                                            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                                {page.texteExplicatif}
                                            </div>

                                            {/* Image de la page (si elle existe) */}
                                            {page.imageUrl ? (
                                                <div className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center max-h-64">
                                                    <img
                                                        src={page.imageUrl}
                                                        alt={page.titre}
                                                        className="object-contain w-full h-full max-h-64"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="border border-dashed border-slate-200 rounded-lg bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center h-40">
                                                    <span className="text-xs text-slate-400 italic">Aucune illustration sur cette page</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Barre de navigation (Boutons + Compteur) */}
                        <div className="flex items-center justify-between bg-violet-50 border border-violet-100 rounded-xl p-4 shadow-sm">
                            {/* Bouton Précédent */}
                            <button
                                onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentPageIndex === 0}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-violet-200 rounded-lg text-sm font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <MoveLeft className="h-3 w-3" />
                                Précédent
                            </button>

                            {/* Compteur central */}
                            <div className="text-sm font-semibold text-violet-950 bg-violet-100/80 px-4 py-1.5 rounded-full">
                                Page <span className="text-amber-600">{currentPageIndex + 1}</span> sur {cours.contenu.length}
                            </div>

                            {/* Bouton Suivant */}
                            <button
                                onClick={() => setCurrentPageIndex(prev => Math.min(cours.contenu.length - 1, prev + 1))}
                                disabled={currentPageIndex === cours.contenu.length - 1}
                                className="flex items-center gap-2 px-4 py-2 bg-violet-600 rounded-lg text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-40 disabled:hover:bg-violet-600 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                Suivant
                                <MoveRight className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 border border-dashed border-violet-200 rounded-xl bg-violet-50/20">
                        <p className="text-sm text-violet-600 italic">Ce cours ne contient aucune page de texte pour le moment.</p>
                        <p className="text-xs text-slate-400 mt-1">Vous pourrez bientôt ajouter des pages de contenu ici.</p>
                    </div>
                )}
            </div>
        </div>
    );
}