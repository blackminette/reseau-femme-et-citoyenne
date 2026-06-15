'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getModuleAndCours, creerCours, supprimerCours } from './actions';
import Modal from '@/components/Modal';

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
    const id = params.id as string;
    const moduleId = parseInt(id, 10);

    useEffect(() => {
        const handleGetModule = async () => {
            if (!moduleId) return;
            setError(null);
            setIsLoading(true);

            const result = await getModuleAndCours(moduleId);
            if (result.success && result.data) {
                setModule(result.data as unknown as ModuleInfo);
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

        const result = await creerCours(moduleId, { titre });
        if (result.success && result.data) {
            setModule(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    cours: [result.data as unknown as CoursInfo, ...prev.cours]
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

        const result = await supprimerCours(coursId);
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
            setError("Une erreur est survenue.")
        }
    }

    if (isLoading) {
        return <div className="p-6">Chargement...</div>;
    }

    if (error || !module) {
        return <div className="p-6 text-amber-600">{error || "Module introuvable."}</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-violet-950">Détails du module : {module.titre}</h1>
                {module.description && <p className="text-violet-600 mt-2">{module.description}</p>}
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
                        {module.cours.map((cours) => (
                            <div key={cours.id} className="flex p-4 bg-white border border-violet-200 rounded-xl shadow-sm">
                                <div>
                                    <h3 className="font-medium text-violet-950">{cours.titre}</h3>
                                </div>
                                <div>
                                    <button onClick={() => { setIsModalDeleteOpen(true), setCoursId(cours.id) }}>Supprimer</button>
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
                        Êtes-vous sûr de vouloir supprimer ce module ? Cette action est irréversible.
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