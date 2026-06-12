// * src/app/(dashboard-adultes)/(dashboard)/admin/pedagogie/enfants/page.tsx
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { listerTousLesModules, creerModule, supprimerModule, modifierModule } from './actions';
import { BookOpen, FolderPlus, GraduationCap, ChevronRight, AlertCircle, Pencil, Trash } from 'lucide-react';
import Modal from '@/components/Modal';

interface ModuleAvecCompte {
    id: number;
    titre: string;
    description: string | null;
    createdAt: Date;
    _count: {
        cours: number;
    };
}

export default function PedagogieEnfantsPage() {
    const [modules, setModules] = useState<ModuleAvecCompte[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [modalCreateIsOpen, setModalCreateIsOpen] = useState(false);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
    const [modalEditIsOpen, setModalEditIsOpen] = useState(false);

    const [formData, setFormData] = useState({
        titre: '',
        description: ''
    });

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

    const ouvrirModalModification = (module: ModuleAvecCompte) => {
        setSelectedModuleId(module.id);
        setFormData({
            titre: module.titre,
            description: module.description || ''
        });
        setModalEditIsOpen(true);
    };

    const handleCreateModule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;
        const data = new FormData(form);
        const titre = data.get('titre') as string;
        const description = data.get('description') as string;

        const result = await creerModule({ titre, description });
        if (result.success && result.data) {
            setModules(prev => [result.data as unknown as ModuleAvecCompte, ...prev]);
            setModalCreateIsOpen(false);
            form.reset();
        } else {
            setError(result.error || "Une erreur est survenue.");
        }
    };

    const handleDeleteModule = async () => {
        if (selectedModuleId === null) return;
        setError(null);

        const result = await supprimerModule(selectedModuleId);
        if (result.success) {
            setModules(prev => prev.filter(module => module.id !== selectedModuleId));
            setModalDeleteIsOpen(false);
            setSelectedModuleId(null);
        } else {
            setError(result.error || "Une erreur est survenue.");
        }
    };

    const handleModifierModule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedModuleId === null) return;
        setError(null);

        const result = await modifierModule({
            id: selectedModuleId,
            titre: formData.titre,
            description: formData.description
        });

        if (result.success && result.data) {
            setModalEditIsOpen(false);
            setFormData({ titre: '', description: '' });
            setSelectedModuleId(null);
            setModules(prev => prev.map(m => m.id === selectedModuleId ? (result.data as unknown as ModuleAvecCompte) : m));
        } else {
            setError(result.error || "Une erreur est survenue.");
        }
    };

    return (
        <div className="p-6 pl-8 pr-8 mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col">
                <Link href="/admin/pedagogie" className="text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1">
                    <ChevronRight className="h-3 w-3 rotate-180" />
                    Retour à la pédagogie
                </Link>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-indigo-600" />
                            Modules pédagogiques pour enfants
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Gerez les modules d'apprentissage.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setFormData({ titre: '', description: '' });
                            setModalCreateIsOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        <FolderPlus className="h-4 w-4" />
                        Nouveau Module
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

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

            {!isLoading && !error && modules.length === 0 && (
                <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl p-8 max-w-md mx-auto">
                    <div className="h-12 w-12 bg-slate-50 text-slate-400 flex items-center justify-center rounded-xl mx-auto mb-4">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">Aucun module pédagogique</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Commencez par créer votre premier module thématique pour y ajouter des chapitres et des exercices.
                    </p>
                    <button
                        onClick={() => setModalCreateIsOpen(true)}
                        className="mt-4 inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 gap-1"
                    >
                        Créer le premier module <ChevronRight className="h-3 w-3" />
                    </button>
                </div>
            )}

            {!isLoading && !error && modules.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            className="group bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md hover:shadow-slate-100 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 relative"
                        >
                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-base tracking-tight group-hover:text-indigo-600 transition-colors">
                                        {module.titre}
                                    </h3>
                                    <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                                        {module.description || "Aucune description fournie pour ce module pédagogique."}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 text-slate-600 font-medium bg-slate-50 px-2 py-1 rounded-md">
                                    <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{module._count.cours} {module._count.cours > 1 ? 'cours' : 'cours'}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => ouvrirModalModification(module)}
                                        className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 group/link"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                        Modifier
                                    </button>

                                    <button
                                        onClick={() => { setSelectedModuleId(module.id); setModalDeleteIsOpen(true); }}
                                        className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 group/link"
                                    >
                                        <Trash className="h-3.5 w-3.5" />
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={modalCreateIsOpen}
                onClose={() => setModalCreateIsOpen(false)}
                title="Créer un nouveau module pédagogique"
            >
                <div className="bg-white p-6 rounded-lg">
                    <form onSubmit={handleCreateModule} className="space-y-4">
                        <div>
                            <label htmlFor="titre" className="block text-sm font-medium text-slate-700">
                                Titre du module <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="titre"
                                name="titre"
                                required
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Entrez le titre du module"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                                Description du module
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Entrez la description du module"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setModalCreateIsOpen(false)}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-medium rounded-md text-sm"
                            >
                                Créer
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal
                isOpen={modalDeleteIsOpen}
                onClose={() => setModalDeleteIsOpen(false)}
                title="Confirmer la suppression"
            >
                <div className="bg-white p-6 rounded-lg">
                    <p className="text-slate-700 text-sm">
                        Êtes-vous sûr de vouloir supprimer ce module ? Cette action est irréversible.
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setModalDeleteIsOpen(false)}
                            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteModule}
                            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 font-medium rounded-md text-sm"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modalEditIsOpen}
                onClose={() => setModalEditIsOpen(false)}
                title="Modifier un module pédagogique"
            >
                <div className="bg-white p-6 rounded-lg">
                    <form onSubmit={handleModifierModule} className="space-y-4">
                        <div>
                            <label htmlFor="edit-titre" className="block text-sm font-medium text-slate-700">
                                Titre du module <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="edit-titre"
                                name="titre"
                                required
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Entrez le titre du module"
                                value={formData.titre}
                                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-description" className="block text-sm font-medium text-slate-700">
                                Description du module
                            </label>
                            <textarea
                                id="edit-description"
                                name="description"
                                rows={3}
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Entrez la description du module"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setModalEditIsOpen(false)}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-medium rounded-md text-sm"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}