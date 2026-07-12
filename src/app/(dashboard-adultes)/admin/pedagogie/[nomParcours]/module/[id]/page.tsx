// * src/app/(dashboard-adultes)/admin/pedagogie/[nomParcours]/module/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getModuleAndCours, creerCours, supprimerCours, changerOrdreCours } from './actions';
import Modal from '@/components/Modal';
import Link from 'next/link';
import { ChevronRight, ArrowUp, ArrowDown, BrainCircuit, Trash2 } from 'lucide-react';

interface CoursInfo {
    id: number;
    titre: string;
    description: string | null;
    ordreDansModule: number;
    createdAt: Date;
}

interface ModuleInfo {
    id: number;
    titre: string;
    description: string | null;
    createdAt: Date;
    cours: CoursInfo[];
}

export default function AdminModulePage() {
    const [error, setError] = useState<string | null>(null);
    const [module, setModule] = useState<ModuleInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [coursId, setCoursId] = useState<number | null>(null);

    const params = useParams();
    const nomParcours = params.nomParcours as string;
    const id = params.id as string;
    const moduleId = parseInt(id, 10);

    const trierLesCours = (coursListe: CoursInfo[]) => {
        return [...coursListe].sort((a, b) => a.ordreDansModule - b.ordreDansModule);
    };

    useEffect(() => {
        const handleGetModule = async () => {
            if (!moduleId) return;
            setError(null);
            setIsLoading(true);

            const result = await getModuleAndCours(moduleId);
            if (result.success && result.data) {
                const moduleData = result.data as unknown as ModuleInfo;
                moduleData.cours = trierLesCours(moduleData.cours);
                setModule(moduleData);
            } else {
                setError(result.error || "Impossible de charger le module.");
            }
            setIsLoading(false);
        };

        handleGetModule();
    }, [moduleId]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;
        const data = new FormData(form);
        const titre = data.get('titre') as string;

        const result = await creerCours(moduleId, { titre }, nomParcours);
        if (result.success && result.data) {
            setModule(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    cours: trierLesCours([result.data as unknown as CoursInfo, ...prev.cours])
                };
            });
            setIsModalOpen(false);
            form.reset();
        } else {
            setError(result.error || "Une erreur est survenue.");
        }
    };

    const handleDelete = async () => {
        if (coursId === null) return;
        setError(null);

        const result = await supprimerCours(coursId, nomParcours);
        if (result.success) {
            setModule(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    cours: prev.cours.filter(c => c.id !== coursId)
                };
            });
            setIsModalDeleteOpen(false);
            setCoursId(null);
        } else {
            setError("Une erreur est survenue.");
        }
    };

    const handleReordonner = async (coursId: number, direction: 'HAUT' | 'BAS') => {
        if (!module) return;
        setError(null);

        const result = await changerOrdreCours(coursId, direction, moduleId, nomParcours);

        if (result.success && result.data) {
            const result = await getModuleAndCours(moduleId);
            const moduleData = result.data as unknown as ModuleInfo;
            moduleData.cours = trierLesCours(moduleData.cours);
            setModule(moduleData);
        } else {
            setError(result.error || "Impossible de modifier l'ordre.");
        }
    };

    if (isLoading) {
        return <div className="p-6">Chargement...</div>;
    }

    if (error || !module) {
        return <div className="p-6 text-amber-600">{error || "Module introuvable."}</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col space-y-4 mb-6">
                <Link
                    href={`/admin/pedagogie/${nomParcours}`}
                    className="text-sm text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1 w-fit"
                >
                    <ChevronRight className="h-3 w-3 rotate-180" />
                    Retour à la gestion des modules
                </Link>

                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-violet-950">
                        Détails du module : {module.titre}
                    </h1>
                    {module.description && (
                        <p className="text-sm text-violet-600 max-w-2xl leading-relaxed">
                            {module.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="border-t border-violet-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-violet-900">Liste des cours associés</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-3 py-1.5 bg-violet-600 text-white rounded-md hover:bg-violet-700 text-sm font-medium transition-colors"
                    >
                        + Nouveau cours
                    </button>
                </div>

                {module.cours && module.cours.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {module.cours.map((cours, index) => (
                            <div
                                key={cours.id}
                                className="bg-white border border-violet-200 rounded-xl shadow-sm flex items-center justify-between gap-2 hover:border-violet-300 hover:shadow-md transition-all group pr-3"
                            >
                                <Link
                                    href={`/admin/pedagogie/${nomParcours}/module/${moduleId}/cours/${cours.id}`}
                                    className="flex-1 min-w-0 p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                >
                                    <div className="min-w-0">
                                        <h3 className="font-medium text-violet-950 truncate group-hover:text-violet-600 transition-colors">
                                            {index + 1}. {cours.titre}
                                        </h3>
                                    </div>
                                </Link>

                                <div className="flex items-center gap-1 relative z-10">
                                    <Link
                                        href={`/admin/pedagogie/${nomParcours}/module/${moduleId}/listeExercice/${cours.id}`}
                                        className="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium text-slate-600 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-all active:scale-95"
                                    >
                                        <BrainCircuit className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
                                        Exercices
                                    </Link>

                                    <button
                                        onClick={() => handleReordonner(cours.id, 'HAUT')}
                                        disabled={index === 0}
                                        className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                        title="Monter le cours"
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => handleReordonner(cours.id, 'BAS')}
                                        disabled={index === module.cours.length - 1}
                                        className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                        title="Descendre le cours"
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </button>

                                    <span className="w-[1px] h-4 bg-slate-200 mx-1"></span>

                                    <button
                                        onClick={() => {
                                            setCoursId(cours.id);
                                            setIsModalDeleteOpen(true);
                                        }}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all flex items-center justify-center shrink-0"
                                        title="Supprimer le cours"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-violet-600 italic">Aucun cours n'est associé à ce module pour le moment.</p>
                )}
            </div>

            {/* MODAL DE CREATION */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Créer un nouveau cours"
            >
                <div className="bg-white p-6 rounded-lg">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label htmlFor="titre" className="block text-sm font-medium text-violet-800">
                                Titre du cours <span className="text-amber-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="titre"
                                name="titre"
                                required
                                className="mt-1 block w-full border border-violet-200 rounded-md shadow-sm p-2 text-sm focus:ring-violet-500 focus:border-violet-500"
                                placeholder="Entrez le titre du cours"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-violet-700 hover:text-violet-900 font-medium text-sm"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-violet-600 text-white hover:bg-violet-700 font-medium rounded-md text-sm"
                            >
                                Créer
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* MODAL DE SUPPRESSION */}
            <Modal
                isOpen={isModalDeleteOpen}
                onClose={() => setIsModalDeleteOpen(false)}
                title="Confirmer la suppression"
            >
                <div className="bg-white p-6 rounded-lg">
                    <p className="text-violet-800 text-sm">
                        Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalDeleteOpen(false)}
                            className="px-4 py-2 text-violet-700 hover:text-violet-900 font-medium text-sm"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDelete()}
                            className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 font-medium rounded-md text-sm"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}