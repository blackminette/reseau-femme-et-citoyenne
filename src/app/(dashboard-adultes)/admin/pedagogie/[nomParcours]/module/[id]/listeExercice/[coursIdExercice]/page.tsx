// * src/app/(dashboard-adultes)/admin/pedagogie/[nomParcours]/module/[id]/listeExercice/[coursIdExercice]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { changerOrdreExercice, creerExercice, getListeExercice, supprimerExercice } from './actions';
import { BrainCircuit, ChevronRight, Loader2, Plus, Puzzle, HelpCircle, FileText, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import Modal from '@/components/Modal';

interface ExerciceInfo {
    id: number;
    titre: string;
    type: string;
    ordre: number;
}

export default function ListeExercice() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [exercice, setExercice] = useState<ExerciceInfo[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const params = useParams();

    const paramId = params?.id;
    const paramCoursId = params?.coursIdExercice;
    const nomParcours = params?.nomParcours as string;

    const moduleId = typeof paramId === 'string' ? parseInt(paramId, 10) : null;
    const coursId = typeof paramCoursId === 'string' ? parseInt(paramCoursId, 10) : null;

    useEffect(() => {
        const initialLoad = async () => {
            if (!coursId || isNaN(coursId)) return;
            setIsLoading(true);
            setError(null);
            try {
                const result = await getListeExercice(coursId);
                if (result.success && result.data) {
                    setExercice(result.data as ExerciceInfo[]);
                } else {
                    setError("Impossible de charger les exercices de ce cours.");
                }
            } catch (err) {
                setError("Une erreur réseau ou serveur est survenue.");
            } finally {
                setIsLoading(false);
            }
        };

        initialLoad();
    }, [coursId]);

    const getExerciceIcon = (type: string) => {
        switch (type?.toUpperCase()) {
            case 'QCM':
                return <HelpCircle className="w-5 h-5 text-violet-600" />;
            case 'IMAGES_ORDRE':
                return <Puzzle className="w-5 h-5 text-violet-600" />;
            default:
                return <FileText className="w-5 h-5 text-violet-600" />;
        }
    };

    const rafraichirDonnees = async () => {
        if (!coursId || isNaN(coursId)) return;
        try {
            const result = await getListeExercice(coursId);
            if (result.success && result.data) {
                setExercice(result.data as ExerciceInfo[]);
            }
        } catch (err) {
            console.error("Erreur lors du rafraîchissement des données", err);
        }
    };

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!coursId || !moduleId) return;
        setError(null);

        const form = e.currentTarget;
        const data = new FormData(form);
        const titre = data.get('titre') as string;
        const type = data.get('type') as string;
        const ordre = exercice.length + 1;

        const result = await creerExercice(coursId, { titre, type, ordre }, moduleId, nomParcours)
        if (result?.success) {
            setIsModalOpen(false);
            form.reset();
            await rafraichirDonnees();
        } else {
            setError(result?.error || "Une erreur est survenue.");
        }
    }

    const handleDelete = async (exerciceId: number) => {
        if (!coursId || !moduleId || !exerciceId) return;
        setError(null);

        try {
            const result = await supprimerExercice(exerciceId, coursId, moduleId, nomParcours);
            if (result?.success) {
                await rafraichirDonnees();
            } else {
                setError(result?.error || "Impossible de supprimer l'exercice.");
            }
        } catch (err) {
            setError("Une erreur réseau ou serveur est survenue lors de la suppression.");
        }
    }

    const handleReordonner = async (exerciceId: number, direction: "HAUT" | "BAS") => {
        if (!exercice || !coursId || !moduleId) return;
        setError(null);

        const result = await changerOrdreExercice(exerciceId, direction, coursId, moduleId, nomParcours)

        if (result.success) {
            await rafraichirDonnees();
        } else {
            setError(result?.error || "Une erreur est survenue lors du déplacement.")
        }
    }

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 text-violet-900 min-h-screen">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Link href={`/admin/pedagogie/${nomParcours}/module/${moduleId}`} className="hover:text-violet-600 transition-colors">Pédagogie</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-600">Exercices du cours</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl border border-violet-100 hidden sm:block">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-violet-950 tracking-tight">Exercices du cours</h1>
                        <p className="text-sm text-slate-500 mt-1">Gérez et organisez les évaluations, QCM et activités de ce support pédagogique.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-all shadow-xs cursor-pointer active:scale-98 self-start sm:self-center"
                >
                    <Plus className="h-4 w-4" />
                    Ajouter un exercice
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl border border-slate-200/80 shadow-xs gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Chargement des exercices...</p>
                </div>
            ) : error ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-medium text-rose-700">
                    {error}
                </div>
            ) : exercice.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                    {exercice.map((ex, index) => (
                        <div
                            key={ex.id}
                            className="flex items-center justify-between bg-white rounded-xl border border-slate-200/80 hover:border-violet-300 hover:shadow-xs transition-all group"
                        >
                            <Link
                                href={`/admin/pedagogie/${nomParcours}/module/${moduleId}/listeExercice/${coursId}/exercice/${ex.id}`}
                                className="flex-1 flex items-center gap-3.5 p-4 cursor-pointer"
                            >
                                <div className="p-2.5 bg-violet-50/60 rounded-xl border border-violet-100/50 group-hover:bg-violet-100/50 transition-colors">
                                    {getExerciceIcon(ex.type)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 group-hover:text-violet-950 transition-colors">
                                        {ex.titre}
                                    </h3>
                                    <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 rounded-md">
                                        {ex.type || 'Standard'}
                                    </span>
                                </div>
                            </Link>

                            {/* Section Actions */}
                            <div className="p-4 flex items-center gap-2 shrink-0">
                                {/* Bouton Monter (Masqué ou désactivé pour le tout premier cours) */}
                                <button
                                    onClick={() => handleReordonner(ex.id, 'HAUT')}
                                    disabled={index === 0}
                                    className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                    title="Monter le cours"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>

                                {/* Bouton Descendre (Masqué ou désactivé pour le tout dernier cours) */}
                                <button
                                    onClick={() => handleReordonner(ex.id, 'BAS')}
                                    disabled={index === exercice.length - 1}
                                    className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                    title="Descendre le cours"
                                >
                                    <ArrowDown className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50/50 hover:bg-rose-600 hover:text-white border border-rose-100 hover:border-rose-600 rounded-lg transition-all shadow-xs cursor-pointer active:scale-98"
                                    onClick={(e) => {
                                        if (confirm("Voulez-vous vraiment supprimer cet exercice ? Cette action est irréversible.")) {
                                            handleDelete(ex.id);
                                        }
                                    }}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center h-48 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl text-center p-6">
                    <p className="text-sm font-medium text-slate-500">Aucun exercice n'a encore été rattaché à ce cours.</p>
                    <p className="text-xs text-slate-400 mt-1">Commencez dès maintenant en cliquant sur le bouton d'ajout.</p>
                </div>
            )}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title='Ajouter un nouvel exercice'
            >
                <div className="p-1">
                    <form onSubmit={handleCreate} className="space-y-5">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="titre" className="text-sm font-semibold text-violet-950">
                                    Titre de l'exercice
                                </label>
                                <input
                                    type="text"
                                    id="titre"
                                    name="titre"
                                    required
                                    placeholder="Ex: Quiz sur les variables"
                                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="type" className="text-sm font-semibold text-violet-950">
                                    Format de l'activité
                                </label>
                                <div className="relative">
                                    <select
                                        name="type"
                                        id="type"
                                        className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:outline-hidden focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="QCM">Questionnaire à choix multiples (QCM)</option>
                                        <option value="IMAGES_ORDRE">Rangement d'images dans l'ordre</option>
                                        <option value="QUESTION_OUVERTE">Question ouverte (Réponse écrite)</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 rounded-xl shadow-xs transition-all cursor-pointer active:scale-98"
                            >
                                Créer l'exercice
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}