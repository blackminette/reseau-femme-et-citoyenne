// * src/app/(dashboard-adultes)/admin/pedagogie/adultes/[id]/listeExercice/[coursIdExercice]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getListeExercice } from './actions';
import { ArrowLeft, BrainCircuit, ChevronRight, Loader2, Plus, Puzzle, HelpCircle, FileText } from 'lucide-react';

interface ExerciceInfo {
    id: number;
    titre: string;
    type: string;
}

export default function ListeExercice() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [exercice, setExercice] = useState<ExerciceInfo[]>([]);

    const params = useParams();

    const paramId = params?.id;
    const paramCoursId = params?.coursIdExercice;

    const moduleId = typeof paramId === 'string' ? parseInt(paramId, 10) : null;
    const coursId = typeof paramCoursId === 'string' ? parseInt(paramCoursId, 10) : null;

    useEffect(() => {
        const handleGetListeExercice = async () => {
            if (!coursId || isNaN(coursId)) {
                return;
            }

            setError(null);
            setIsLoading(true);

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

        handleGetListeExercice();
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

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 text-violet-900 min-h-screen">
            {/* Fil d'Ariane & Bouton Retour */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Link href={`/admin/pedagogie/adultes/${moduleId}`} className="hover:text-violet-600 transition-colors">Pédagogie</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-600">Exercices du cours</span>
            </div>

            {/* En-tête de la page */}
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
                    onClick={() => alert("Redirection vers la création d'exercice...")}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-all shadow-xs cursor-pointer active:scale-98 self-start sm:self-center"
                >
                    <Plus className="h-4 w-4" />
                    Ajouter un exercice
                </button>
            </div>

            {/* Gestion des différents états visuels */}
            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl border border-slate-200/80 shadow-xs gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Chargement des exercices...</p>
                </div>
            ) : error ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-medium text-rose-700">
                    {error}
                </div>
            ) : exercice.length > 0 ? ( // Correction de la faute d'orthographe "lenght"
                <div className="grid grid-cols-1 gap-3">
                    {exercice.map((ex) => (
                        <div
                            key={ex.id}
                            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/80 hover:border-violet-300 hover:shadow-xs transition-all group"
                        >
                            <div className="flex items-center gap-3.5">
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
                            </div>

                            {/* Actions sur l'exercice */}
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/admin/pedagogie/adultes/${moduleId}/listeExercice/${coursId}/${ex.id}`}
                                    className="px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg text-xs font-semibold transition-all"
                                >
                                    Modifier
                                </Link>
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
        </div>
    );
}