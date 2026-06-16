// * src/app/(dashboard-adultes)/admin/pedagogie/adultes/[coursId]/cours/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, MoveRight, MoveLeft, Pencil } from 'lucide-react';
// On importe la nouvelle action serveur ici
import { getCours, modifierTitreCours, modifierContenuCours } from './actions';

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

    const [isEditingTitre, setIsEditingTitre] = useState(false);
    const [editTitre, setEditTitre] = useState(cours?.titre || "");

    const [isEditingPageTitre, setIsEditingPageTitre] = useState(false);
    const [isEditingPageTexte, setIsEditingPageTexte] = useState(false);
    const [editPageTitre, setEditPageTitre] = useState("");
    const [editPageTexte, setEditPageTexte] = useState("");

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

    // Met à jour les champs d'édition dès qu'on change de page (Suivant/Précédent)
    useEffect(() => {
        if (cours) {
            setEditTitre(cours.titre);
            const currentPage = cours.contenu[currentPageIndex];
            if (currentPage) {
                setEditPageTitre(currentPage.titre);
                setEditPageTexte(currentPage.texteExplicatif);
            }
        }
    }, [cours, currentPageIndex]);

    // Fonction globale pour sauvegarder le JSON complet
    const handleSauvegarderPage = async (cle: 'titre' | 'texteExplicatif', nouvelleValeur: string) => {
        if (!cours) return;

        const nouveauContenu = [...cours.contenu];

        nouveauContenu[currentPageIndex] = {
            ...nouveauContenu[currentPageIndex],
            [cle]: nouvelleValeur
        };

        setCours(prev => prev ? { ...prev, contenu: nouveauContenu } : null);

        const result = await modifierContenuCours(cours.id, nouveauContenu, moduleId);
        if (!result.success) {
            setError(result.error || "Impossible de sauvegarder les modifications de la page.");
        }
    };

    if (isLoading) {
        return <div className="p-6 text-sm text-violet-600">Chargement du cours...</div>;
    }

    if (error || !cours) {
        return <div className="p-6 text-amber-600">{error || "Cours introuvable."}</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col space-y-4 mb-6">
                <Link
                    href={`/admin/pedagogie/adultes/${moduleId}`}
                    className="text-sm text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1 w-fit"
                >
                    <ChevronRight className="h-3 w-3 rotate-180" />
                    Retour au module
                </Link>

                <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                        Cours #{cours.ordreDansModule}
                    </span>
                    {isEditingTitre ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={editTitre}
                                onChange={(e) => setEditTitre(e.target.value)}
                                onBlur={async () => {
                                    setIsEditingTitre(false);
                                    if (editTitre.trim() && editTitre !== cours.titre) {
                                        setCours(prev => prev ? { ...prev, titre: editTitre } : null);
                                        const result = await modifierTitreCours(cours.id, editTitre, moduleId);
                                        if (!result.success) { setError("Une erreur est survenue."); }
                                    } else {
                                        setEditTitre(cours.titre);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') e.currentTarget.blur();
                                    if (e.key === 'Escape') { setEditTitre(cours.titre); setIsEditingTitre(false); }
                                }}
                                autoFocus
                                className="text-2xl font-bold tracking-tight text-violet-950 border-b-2 border-violet-500 bg-transparent focus:outline-none p-0 max-w-md"
                            />
                            <span className="text-xs text-slate-400 italic">(Pressez Entrée pour valider ou Echap pour annuler)</span>
                        </div>
                    ) : (
                        <div
                            onClick={() => setIsEditingTitre(true)}
                            className="flex items-center gap-2 group cursor-pointer w-fit"
                        >
                            <h1 className="text-2xl font-bold tracking-tight text-violet-950 group-hover:text-violet-700 transition-colors">
                                {cours.titre}
                            </h1>
                            <Pencil className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors shrink-0" />
                        </div>
                    )}
                </div>
            </div>

            {/* Section Affichage du contenu JSON */}
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
                                        {/* Header de la Page (Modifiable au clic) */}
                                        <div className="flex items-center justify-between border-b border-violet-50 pb-3 mb-4">
                                            {isEditingPageTitre ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={editPageTitre}
                                                        onChange={(e) => setEditPageTitre(e.target.value)}
                                                        onBlur={() => {
                                                            setIsEditingPageTitre(false);
                                                            if (editPageTitre.trim() && editPageTitre !== page.titre) {
                                                                handleSauvegarderPage('titre', editPageTitre);
                                                            } else {
                                                                setEditPageTitre(page.titre);
                                                            }
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') e.currentTarget.blur();
                                                            if (e.key === 'Escape') { setEditPageTitre(page.titre); setIsEditingPageTitre(false); }
                                                        }}
                                                        autoFocus
                                                        className="font-bold text-violet-950 text-base border-b border-violet-400 bg-transparent focus:outline-none max-w-md w-full"
                                                    />
                                                    <span className="text-xs text-slate-400 italic">(Pressez Entrée pour valider ou Echap pour annuler)</span>
                                                </div>
                                            ) : (
                                                <h3
                                                    onClick={() => setIsEditingPageTitre(true)}
                                                    className="font-bold text-violet-950 text-base flex items-center gap-2 group cursor-pointer hover:text-violet-700 transition-colors"
                                                >
                                                    Page {page.numeroPage || currentPageIndex + 1} : {page.titre}
                                                    <Pencil className="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-500 transition-colors" />
                                                </h3>
                                            )}
                                            <span className="px-2 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-md">
                                                Slide vue unique
                                            </span>
                                        </div>

                                        {/* Contenu texte et image de la Page */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                                            {/* Texte explicatif (Modifiable au clic) */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Texte explicatif :</label>
                                                {isEditingPageTexte ? (
                                                    <div>
                                                        <textarea
                                                            value={editPageTexte}
                                                            onChange={(e) => setEditPageTexte(e.target.value)}
                                                            onBlur={() => {
                                                                setIsEditingPageTexte(false);
                                                                if (editPageTexte !== page.texteExplicatif) {
                                                                    handleSauvegarderPage('texteExplicatif', editPageTexte);
                                                                }
                                                            }}
                                                            onKeyDown={(e) => {
                                                                // Shift+Entrée pour aller à la ligne, Entrée seule valide la modification
                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                    e.preventDefault();
                                                                    e.currentTarget.blur();
                                                                }
                                                            }}
                                                            autoFocus
                                                            rows={6}
                                                            className="w-full text-sm text-slate-700 leading-relaxed p-2 border border-violet-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 whitespace-pre-line"
                                                        />
                                                        <span className="text-xs text-slate-400 italic">(Pressez Entrée pour valider, shift+Entrée pour aller à la ligne)</span>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => setIsEditingPageTexte(true)}
                                                        className="text-sm text-slate-700 leading-relaxed whitespace-pre-line border border-transparent hover:border-dashed hover:border-violet-300 hover:bg-violet-50/20 p-2 rounded-lg cursor-pointer transition-all group relative"
                                                    >
                                                        <Pencil className="w-4 h-4 text-slate-400 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        {page.texteExplicatif || <span className="text-slate-400 italic">Aucun texte pour le moment. Cliquez pour en ajouter un.</span>}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Image de la page */}
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

                        {/* Barre de navigation */}
                        <div className="flex items-center justify-between bg-violet-50 border border-violet-100 rounded-xl p-4 shadow-sm">
                            <button
                                onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentPageIndex === 0}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-violet-200 rounded-lg text-sm font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <MoveLeft className="h-3 w-3" />
                                Précédent
                            </button>

                            <div className="text-sm font-semibold text-violet-950 bg-violet-100/80 px-4 py-1.5 rounded-full">
                                Page <span className="text-amber-600">{currentPageIndex + 1}</span> sur {cours.contenu.length}
                            </div>

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
                    </div>
                )}
            </div>
        </div>
    );
}