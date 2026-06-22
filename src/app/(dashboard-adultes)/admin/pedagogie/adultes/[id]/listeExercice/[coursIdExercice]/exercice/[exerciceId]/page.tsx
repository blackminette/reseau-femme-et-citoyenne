// * src/app/(dashboard-adultes)/admin/pedagogie/adultes/[id]/listeExercice/[coursIdExercice]/exercice/[exerciceId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, MoveRight, MoveLeft, Pencil, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { getExercice, modifierTitreExercice, modifierContenuExercice } from './actions';
import Modal from '@/components/Modal';

interface PageExercice {
    id: string | number;         // Adapté pour recevoir "q1" (string) ou des nombres
    numeroPage: number;          // Indexation pour la navigation
    question: string;            // Reçu depuis le seed
    options: string[];           // Tableau d'options du QCM
    reponseCorrecte: string;     // Réponse attendue
    type: string;                // "QCM", "Slide", etc.
}

interface ExerciceInfo {
    id: number;
    titre: string;
    ordre: number;
    contenu: PageExercice[];
    createdAt: Date;
}

export default function AdminModifieExercicePage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [exercice, setExercice] = useState<ExerciceInfo | null>(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isEditingTitre, setIsEditingTitre] = useState(false);
    const [editTitre, setEditTitre] = useState("");

    // States éditables pour le contenu des questions de QCM
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [editQuestion, setEditQuestion] = useState("");

    const params = useParams();
    const moduleId = parseInt(params.id as string, 10);
    const coursId = parseInt(params.coursIdExercice as string, 10);
    const exerciceId = parseInt(params.exerciceId as string, 10);

    useEffect(() => {
        const handleGetExercice = async () => {
            if (!exerciceId) return;
            setError(null);
            setIsLoading(true);

            const result = await getExercice(exerciceId);
            if (result.success && result.data) {
                const exerciceData = result.data as any;
                let contenuPages: PageExercice[] = [];

                try {
                    contenuPages = typeof exerciceData.contenu === 'string'
                        ? JSON.parse(exerciceData.contenu)
                        : (exerciceData.contenu || []);
                } catch (e) {
                    contenuPages = [];
                }

                // Normalisation : on s'assure que chaque élément a un numeroPage pour l'UI
                const pagesNormalisees = contenuPages.map((page, idx) => ({
                    ...page,
                    numeroPage: page.numeroPage || idx + 1,
                    type: page.type || "QCM" // Par défaut selon votre seed
                }));

                setExercice({
                    ...exerciceData,
                    contenu: pagesNormalisees
                });
            } else {
                setError(result.error || "Impossible de charger l'exercice.");
            }
            setIsLoading(false);
        };

        handleGetExercice();
    }, [exerciceId]);

    // Resynchronisation des inputs d'édition au changement de page
    useEffect(() => {
        if (exercice) {
            setEditTitre(exercice.titre);
            const currentPage = exercice.contenu[currentPageIndex];
            if (currentPage) {
                setEditQuestion(currentPage.question || "");
            }
        }
    }, [exercice, currentPageIndex]);

    const handleSauvegarderPage = async <K extends keyof PageExercice>(cle: K, nouvelleValeur: PageExercice[K]) => {
        if (!exercice) return;

        const nouveauContenu = [...exercice.contenu];
        nouveauContenu[currentPageIndex] = {
            ...nouveauContenu[currentPageIndex],
            [cle]: nouvelleValeur
        };

        setExercice(prev => prev ? { ...prev, contenu: nouveauContenu } : null);

        const result = await modifierContenuExercice(exercice.id, nouveauContenu, moduleId);
        if (!result.success) {
            setError(result.error || "Impossible de sauvegarder les modifications.");
        }
    };

    const handleModifierOption = async (optionIndex: number, valeur: string) => {
        if (!exercice) return;
        const currentPage = exercice.contenu[currentPageIndex];
        if (!currentPage) return;

        const nouvellesOptions = [...(currentPage.options || [])];
        const ancienneValeur = nouvellesOptions[optionIndex];
        nouvellesOptions[optionIndex] = valeur;

        // Si l'option modifiée était la bonne réponse, on met aussi à jour la bonne réponse
        const miseAJourReponse = currentPage.reponseCorrecte === ancienneValeur ? valeur : currentPage.reponseCorrecte;

        const nouveauContenu = [...exercice.contenu];
        nouveauContenu[currentPageIndex] = {
            ...currentPage,
            options: nouvellesOptions,
            reponseCorrecte: miseAJourReponse
        };

        setExercice(prev => prev ? { ...prev, contenu: nouveauContenu } : null);
        await modifierContenuExercice(exercice.id, nouveauContenu, moduleId);
    };

    const handleCreate = async () => {
        if (!exercice) return;

        const nouvellePage: PageExercice = {
            id: `q-${Date.now()}`,
            numeroPage: exercice.contenu.length + 1,
            question: "Nouvelle question ?",
            options: ["Option A", "Option B"],
            reponseCorrecte: "Option A",
            type: "QCM"
        };

        const nouveauContenu = [...exercice.contenu, nouvellePage];
        setExercice(prev => prev ? { ...prev, contenu: nouveauContenu } : null);
        setCurrentPageIndex(nouveauContenu.length - 1);

        await modifierContenuExercice(exercice.id, nouveauContenu, moduleId);
    };

    const handleDelete = async () => {
        if (!exercice || exercice.contenu.length === 0) return;
        if (!confirm("Supprimer cette question ?")) return;

        const contenuFiltre = exercice.contenu.filter((_, index) => index !== currentPageIndex);
        const nouveauContenu = contenuFiltre.map((page, index) => ({
            ...page,
            numeroPage: index + 1
        }));

        setExercice(prev => prev ? { ...prev, contenu: nouveauContenu } : null);
        setCurrentPageIndex(Math.max(0, nouveauContenu.length - 1));

        await modifierContenuExercice(exercice.id, nouveauContenu, moduleId);
    };

    const handleReordonner = async (numeroPage: number, direction: 'HAUT' | 'BAS') => {
        if (!exercice) return;
        const indexActuel = exercice.contenu.findIndex(p => p.numeroPage === numeroPage);
        if (indexActuel === -1) return;

        const nouvelIndex = direction === 'HAUT' ? indexActuel - 1 : indexActuel + 1;
        if (nouvelIndex < 0 || nouvelIndex >= exercice.contenu.length) return;

        const nouveauContenu = [...exercice.contenu];
        [nouveauContenu[indexActuel], nouveauContenu[nouvelIndex]] = [nouveauContenu[nouvelIndex], nouveauContenu[indexActuel]];

        const contenuReindexe = nouveauContenu.map((page, idx) => ({ ...page, numeroPage: idx + 1 }));

        if (currentPageIndex === indexActuel) setCurrentPageIndex(nouvelIndex);
        else if (currentPageIndex === nouvelIndex) setCurrentPageIndex(indexActuel);

        setExercice(prev => prev ? { ...prev, contenu: contenuReindexe } : null);
        await modifierContenuExercice(exercice.id, contenuReindexe, moduleId);
    };

    const handleSupprimerOption = async (optionIndex: number) => {
        if (!exercice) return;
        const currentPage = exercice.contenu[currentPageIndex];
        if (!currentPage || !currentPage.options) return;

        // Sécurité : Éviter d'avoir un QCM vide (minimum 1 ou 2 options selon votre besoin)
        if (currentPage.options.length <= 1) {
            alert("Un QCM doit posséder au moins une option de réponse.");
            return;
        }

        const optionASupprimer = currentPage.options[optionIndex];

        // On filtre pour enlever l'option sélectionnée
        const nouvellesOptions = currentPage.options.filter((_, idx) => idx !== optionIndex);

        // Si l'option supprimée était la bonne réponse, on réassigne par défaut la première option restante
        let miseAJourReponse = currentPage.reponseCorrecte;
        if (currentPage.reponseCorrecte === optionASupprimer) {
            miseAJourReponse = nouvellesOptions[0] || "";
        }

        const nouveauContenu = [...exercice.contenu];
        nouveauContenu[currentPageIndex] = {
            ...currentPage,
            options: nouvellesOptions,
            reponseCorrecte: miseAJourReponse
        };

        setExercice(prev => prev ? { ...prev, contenu: nouveauContenu } : null);

        // Sauvegarde en base de données
        const result = await modifierContenuExercice(exercice.id, nouveauContenu, moduleId);
        if (!result.success) {
            setError(result.error || "Impossible de sauvegarder après la suppression de l'option.");
        }
    };

    if (isLoading) return <div className="p-6 text-sm text-violet-600">Chargement...</div>;
    if (error || !exercice) return <div className="p-6 text-amber-600">{error || "Introuvable."}</div>;

    const pageActuelle = exercice.contenu[currentPageIndex];

    return (
        <div className="p-6 space-y-6">
            {/* Fil d'Ariane & Titre */}
            <div className="flex flex-col space-y-4">
                <Link href={`/admin/pedagogie/adultes/${moduleId}/listeExercice/${coursId}`} className="text-sm text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1 w-fit">
                    <ChevronRight className="h-3 w-3 rotate-180" /> Retour aux exercices
                </Link>

                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Exercice #{exercice.ordre} ({exercice.contenu.length} Questions)</span>
                    {isEditingTitre ? (
                        <input
                            type="text"
                            value={editTitre}
                            onChange={(e) => setEditTitre(e.target.value)}
                            onBlur={async () => {
                                setIsEditingTitre(false);
                                if (editTitre.trim() && editTitre !== exercice.titre) {
                                    setExercice(prev => prev ? { ...prev, titre: editTitre } : null);
                                    await modifierTitreExercice(exercice.id, editTitre, moduleId);
                                }
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                            autoFocus
                            className="text-2xl font-bold text-violet-950 border-b-2 border-violet-500 bg-transparent focus:outline-none block w-full max-w-md"
                        />
                    ) : (
                        <div onClick={() => setIsEditingTitre(true)} className="flex items-center gap-2 cursor-pointer w-fit group">
                            <h1 className="text-2xl font-bold text-violet-950 group-hover:text-violet-700 transition-colors">{exercice.titre}</h1>
                            <Pencil className="w-4 h-4 text-slate-400 group-hover:text-violet-600" />
                        </div>
                    )}
                </div>
            </div>

            {/* Zone Principale du Contenu */}
            <div className="border-t border-violet-100 pt-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-violet-900">Structure du Questionnaire</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsModalOpen(true)} className="px-3 py-1.5 bg-violet-50 text-violet-700 hover:bg-violet-600 hover:text-white rounded-lg text-sm border border-violet-200 transition-colors cursor-pointer">Réorganiser</button>
                        <button onClick={handleDelete} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-700 hover:text-white rounded-lg text-sm border border-red-200 transition-colors cursor-pointer">Supprimer la Question</button>
                        <button onClick={handleCreate} className="px-3 py-1.5 bg-violet-600 text-white hover:bg-violet-700 rounded-lg text-sm transition-colors flex items-center gap-1 cursor-pointer"><Plus className="w-4 h-4" /> Ajouter une question</button>
                    </div>
                </div>

                {pageActuelle ? (
                    <div className="space-y-6">
                        <div className="bg-white border border-violet-200 rounded-xl p-6 shadow-sm space-y-6">

                            {/* Question principale */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Intitulé de la Question :</label>
                                {isEditingQuestion ? (
                                    <input
                                        type="text"
                                        value={editQuestion}
                                        onChange={(e) => setEditQuestion(e.target.value)}
                                        onBlur={() => {
                                            setIsEditingQuestion(false);
                                            if (editQuestion.trim() && editQuestion !== pageActuelle.question) {
                                                handleSauvegarderPage('question', editQuestion);
                                            }
                                        }}
                                        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                        autoFocus
                                        className="w-full font-semibold text-slate-800 p-2 border border-violet-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                                    />
                                ) : (
                                    <div onClick={() => setIsEditingQuestion(true)} className="p-3 bg-slate-50 rounded-lg border border-transparent hover:border-dashed hover:border-violet-300 cursor-pointer flex justify-between items-center group">
                                        <p className="font-semibold text-slate-800">{pageActuelle.question || "Cliquez pour écrire la question..."}</p>
                                        <Pencil className="w-4 h-4 text-slate-400 group-hover:text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                )}
                            </div>

                            {/* Options du QCM */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Options de réponse & Sélection de la réponse correcte :</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(pageActuelle.options || []).map((option, idx) => (
                                        <div key={idx} className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all group/option ${pageActuelle.reponseCorrecte === option ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200'}`}>
                                            <div className="flex items-center gap-3 flex-1">
                                                {/* Bouton radio pour désigner la bonne réponse */}
                                                <input
                                                    type="radio"
                                                    name="reponseCorrecte"
                                                    checked={pageActuelle.reponseCorrecte === option}
                                                    onChange={() => handleSauvegarderPage('reponseCorrecte', option)}
                                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                                                    title="Marquer comme réponse correcte"
                                                />
                                                {/* Input de texte de l'option */}
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => handleModifierOption(idx, e.target.value)}
                                                    className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-violet-500 text-sm font-medium text-slate-700 focus:outline-none pb-0.5"
                                                />
                                            </div>

                                            {/* Bouton pour supprimer l'option spécifique */}
                                            <button
                                                type="button"
                                                onClick={() => handleSupprimerOption(idx)}
                                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all opacity-0 group-hover/option:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                                                title="Supprimer cette option"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleSauvegarderPage('options', [...(pageActuelle.options || []), `Nouvelle Option ${(pageActuelle.options || []).length + 1}`])}
                                    className="text-xs text-violet-600 hover:text-violet-800 font-semibold flex items-center gap-1 mt-2 cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Ajouter un choix alternatif
                                </button>
                            </div>

                            {/* Navigation Bas de page */}
                            <div className="flex items-center justify-between bg-violet-50 border border-violet-100 rounded-xl p-4 shadow-sm">
                                <button onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))} disabled={currentPageIndex === 0} className="flex items-center gap-2 px-4 py-2 bg-white border border-violet-200 rounded-lg text-sm font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                                    <MoveLeft className="h-3 w-3" /> Précédent
                                </button>
                                <div className="text-sm font-semibold text-violet-950 bg-violet-100/80 px-4 py-1.5 rounded-full">
                                    Question <span className="text-amber-600">{currentPageIndex + 1}</span> sur {exercice.contenu.length}
                                </div>
                                <button onClick={() => setCurrentPageIndex(prev => Math.min(exercice.contenu.length - 1, prev + 1))} disabled={currentPageIndex === exercice.contenu.length - 1} className="flex items-center gap-2 px-4 py-2 bg-violet-600 rounded-lg text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                                    Suivant <MoveRight className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 border border-dashed border-violet-200 rounded-xl bg-violet-50/20">
                        <p className="text-sm text-violet-600 italic">Aucune question dans ce Quiz.</p>
                    </div>
                )}
            </div>

            {/* Modal d'Ordre */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Modifier l'ordre des questions">
                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto p-1">
                    {exercice.contenu.map((page, index) => (
                        <div key={page.id || index} className="bg-slate-50 border border-violet-100 rounded-xl flex items-center justify-between p-3 hover:bg-white transition-all">
                            <div className="flex items-center gap-3 truncate max-w-[70%]">
                                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">{index + 1}</span>
                                <h3 className="text-sm font-medium text-violet-950 truncate">{page.question}</h3>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handleReordonner(page.numeroPage, 'HAUT')} disabled={index === 0} className="p-1.5 text-slate-400 hover:text-violet-600 disabled:opacity-20 cursor-pointer"><ArrowUp className="w-4 h-4" /></button>
                                <button onClick={() => handleReordonner(page.numeroPage, 'BAS')} disabled={index === exercice.contenu.length - 1} className="p-1.5 text-slate-400 hover:text-violet-600 disabled:opacity-20 cursor-pointer"><ArrowDown className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}