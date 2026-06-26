// * src/app/(dashboard-adultes)/admin/pedagogie/[nomParcours]/page.tsx
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { listerTousLesModules, creerModule, supprimerModule, modifierModule, activateModule } from './actions';
import { BookOpen, FolderPlus, GraduationCap, ChevronRight, AlertCircle, Pencil, Trash, Eye, EyeOff, BarChart } from 'lucide-react';
import Modal from '@/components/Modal';
import { Parcours, Difficulte } from '@prisma/client';
import { useParams } from 'next/navigation';

interface ModuleAvecCompte {
    id: number;
    titre: string;
    description: string | null;
    isPublished: boolean;
    difficulte: Difficulte;
    _count: {
        cours: number;
    };
}

const PARCOURS_CONFIG: Record<string, { enum: Parcours; label: string; }> = {
    "numerique-adulte": { enum: Parcours.NUMERIQUE_ADULTE, label: "Numérique (Adultes)" },
    "oral": { enum: Parcours.ORAL, label: "Expression Orale (Adultes)" },
    "bureautique": { enum: Parcours.BUREAUTIQUE, label: "Bureautique (Adultes)" },
    "comprehension-lecture": { enum: Parcours.COMPREHENSION_LECTURE, label: "Compréhension Lecture (Enfants)" },
    "numerique": { enum: Parcours.NUMERIQUE, label: "Numérique (Enfants)" },
    "anglais": { enum: Parcours.ANGLAIS, label: "Anglais (Enfants)" },
    "eco-citoyennete": { enum: Parcours.ECO_CITOYENNETE, label: "Éco-Citoyenneté (Enfants)" },
    "education-civique": { enum: Parcours.EDUCATION_CIVIQUE, label: "Éducation Civique (Enfants)" },
    "robotique": { enum: Parcours.ROBOTIQUE, label: "Robotique (Enfants)" }
};

const DIFFICULTE_STYLES: Record<Difficulte, { label: string; classes: string }> = {
    FACILE: { label: 'Facile', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    MOYEN: { label: 'Moyen', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
    DIFFICILE: { label: 'Difficile', classes: 'bg-rose-50 text-rose-700 border-rose-200' }
};

export default function PedagogiePage() {
    const [modules, setModules] = useState<ModuleAvecCompte[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [modalCreateIsOpen, setModalCreateIsOpen] = useState(false);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
    const [modalEditIsOpen, setModalEditIsOpen] = useState(false);

    const params = useParams();
    const nomParcours = params.nomParcours as string;
    const config = PARCOURS_CONFIG[nomParcours];

    if (!config) {
        throw new Error(`Parcours inconnu : ${nomParcours}`);
    }

    const parcours = config.enum;

    // État du formulaire contenant maintenant la difficulté
    const [formData, setFormData] = useState<{ titre: string; description: string; difficulte: Difficulte }>({
        titre: '',
        description: '',
        difficulte: Difficulte.FACILE
    });

    useEffect(() => {
        async function fetchModules() {
            setIsLoading(true);
            const result = await listerTousLesModules(parcours);
            if (result.success && result.data) {
                setModules(result.data as unknown as ModuleAvecCompte[]);
            } else {
                setError(result.error || "Une erreur est survenue.");
            }
            setIsLoading(false);
        }
        fetchModules();
    }, [parcours]);

    const ouvrirModalModification = (module: ModuleAvecCompte) => {
        setSelectedModuleId(module.id);
        setFormData({
            titre: module.titre,
            description: module.description || '',
            difficulte: module.difficulte,
        });
        setModalEditIsOpen(true);
    };

    const handleCreateModule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;
        const data = new FormData(form);
        const titre = (data.get('titre') as string) || '';
        const description = (data.get('description') as string) || '';
        const difficulte = (data.get('difficulte') as Difficulte) || Difficulte.FACILE;

        const result = await creerModule({ titre, description, difficulte }, parcours, nomParcours);
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

        const result = await supprimerModule(selectedModuleId, nomParcours);
        if (result.success) {
            setModules(prev => prev.filter(m => m.id !== selectedModuleId));
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
            description: formData.description,
            difficulte: formData.difficulte
        }, nomParcours);

        if (result.success && result.data) {
            setModalEditIsOpen(false);
            setFormData({ titre: '', description: '', difficulte: Difficulte.FACILE });
            setSelectedModuleId(null);
            setModules(prev => prev.map(m => m.id === selectedModuleId ? (result.data as unknown as ModuleAvecCompte) : m));
        } else {
            setError(result.error || "Une erreur est survenue.");
        }
    };

    const handleActiveModule = async (modId: number) => {
        const selectedModule = modules.find(m => m.id === modId);
        if (!selectedModule) return;
        setError(null);

        const newStatus = !selectedModule.isPublished;
        const result = await activateModule(modId, newStatus, nomParcours);

        if (result.success) {
            setModules(prev => prev.map(m => m.id === modId ? (result.data as unknown as ModuleAvecCompte) : m));
        } else {
            setError(result.error || "Une erreur est survenue.");
        }
    };

    return (
        <div className="p-6 pl-8 pr-8 mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col">
                <Link href="/admin/pedagogie" className="text-sm text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1">
                    <ChevronRight className="h-3 w-3 rotate-180" />
                    Retour à la pédagogie
                </Link>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-violet-100 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-violet-950 tracking-tight flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-violet-600" />
                            Modules : {config.label}
                        </h1>
                        <p className="text-sm text-violet-600 mt-1">Gérez les modules d'apprentissage de ce parcours.</p>
                    </div>

                    <button
                        onClick={() => {
                            setFormData({ titre: '', description: '', difficulte: Difficulte.FACILE });
                            setModalCreateIsOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-md hover:bg-violet-700 transition-colors"
                    >
                        <FolderPlus className="h-4 w-4" />
                        Nouveau Module
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-700 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="bg-white border border-violet-200 rounded-2xl p-5 space-y-4 shadow-sm">
                            <div className="h-5 bg-violet-100 rounded-md w-1/3 animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-6 bg-violet-200 rounded-md w-3/4 animate-pulse" />
                                <div className="h-4 bg-violet-100 rounded-md w-full animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && !error && modules.length === 0 && (
                <div className="text-center py-16 bg-white border border-dashed border-violet-200 rounded-2xl p-8 max-w-md mx-auto">
                    <div className="h-12 w-12 bg-violet-50 text-violet-500 flex items-center justify-center rounded-xl mx-auto mb-4">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-violet-950">Aucun module pédagogique</h3>
                    <p className="text-xs text-violet-600 mt-1 max-w-xs mx-auto">Commencez par créer votre premier module thématique.</p>
                </div>
            )}

            {!isLoading && !error && modules.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map(module => {
                        const badgeStyle = DIFFICULTE_STYLES[module.difficulte] || DIFFICULTE_STYLES.FACILE;
                        return (
                            <div
                                key={module.id}
                                className={`group bg-white border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 relative
                                ${module.isPublished ? 'border-violet-200 hover:shadow-md' : 'border-slate-200 border-dashed bg-slate-50/50 opacity-85'}`}
                            >
                                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${module.isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                        {module.isPublished ? 'Publié' : 'Brouillon'}
                                    </span>
                                </div>

                                <Link href={`/admin/pedagogie/${nomParcours}/module/${module.id}`} className="pr-16">
                                    <div className="space-y-3">
                                        {/* Insertion du Badge de Difficulté */}
                                        <div className="flex items-center gap-1">
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badgeStyle.classes}`}>
                                                <BarChart className="h-3 w-3" />
                                                {badgeStyle.label}
                                            </span>
                                        </div>
                                        <h3 className={`font-bold text-base tracking-tight ${module.isPublished ? 'text-violet-900' : 'text-slate-500'}`}>{module.titre}</h3>
                                        <p className={`text-xs line-clamp-2 ${module.isPublished ? 'text-violet-600' : 'text-slate-400'}`}>{module.description || "Aucune description."}</p>
                                    </div>
                                </Link>

                                <div className="mt-5 pt-4 border-t border-violet-100 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 text-violet-700 font-medium bg-violet-50 px-2 py-1 rounded-md">
                                        <BookOpen className="h-3.5 w-3.5 text-violet-500" />
                                        <span>{module._count.cours} cours</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleActiveModule(module.id)}
                                            className={`p-1.5 rounded-xl border flex items-center justify-center shadow-sm cursor-pointer ${module.isPublished ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}
                                        >
                                            {module.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                        <button onClick={() => ouvrirModalModification(module)} className="text-violet-600 text-xs font-semibold flex items-center gap-1"><Pencil className="h-3.5 w-3.5" /> Modifier</button>
                                        <button onClick={() => { setSelectedModuleId(module.id); setModalDeleteIsOpen(true); }} className="text-amber-600 text-xs font-semibold flex items-center gap-1"><Trash className="h-3.5 w-3.5" /> Supprimer</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de Création */}
            <Modal isOpen={modalCreateIsOpen} onClose={() => setModalCreateIsOpen(false)} title="Créer un nouveau module pédagogique">
                <div className="bg-white p-6 rounded-lg">
                    <form onSubmit={handleCreateModule} className="space-y-4">
                        <div>
                            <label htmlFor="titre" className="block text-sm font-medium text-violet-800">Titre du module <span className="text-amber-500">*</span></label>
                            <input type="text" id="titre" name="titre" required className="mt-1 block w-full border border-violet-200 rounded-md p-2 text-sm" placeholder="Entrez le titre du module" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-violet-800">Description du module</label>
                            <textarea id="description" name="description" rows={3} className="mt-1 block w-full border border-violet-200 rounded-md p-2 text-sm" placeholder="Entrez la description du module" />
                        </div>
                        <div>
                            <label htmlFor="difficulte" className="block text-sm font-medium text-violet-800">Difficulté <span className="text-amber-500">*</span></label>
                            <select id="difficulte" name="difficulte" required className="mt-1 block w-full border border-violet-200 rounded-md p-2 text-sm bg-white">
                                <option value="FACILE">Facile</option>
                                <option value="MOYEN">Moyen</option>
                                <option value="DIFFICILE">Difficile</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={() => setModalCreateIsOpen(false)} className="px-4 py-2 text-sm text-slate-500">Annuler</button>
                            <button type="submit" className="px-4 py-2 bg-violet-600 text-white rounded-md text-sm">Créer</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal de Suppression */}
            <Modal isOpen={modalDeleteIsOpen} onClose={() => setModalDeleteIsOpen(false)} title="Confirmer la suppression">
                <div className="bg-white p-6 rounded-lg">
                    <p className="text-violet-800 text-sm">Êtes-vous sûr de vouloir supprimer ce module ? Cette action est irréversible.</p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setModalDeleteIsOpen(false)} className="px-4 py-2 text-sm text-slate-500">Annuler</button>
                        <button type="button" onClick={handleDeleteModule} className="px-4 py-2 bg-amber-500 text-white rounded-md text-sm">Supprimer</button>
                    </div>
                </div>
            </Modal>

            {/* Modal de Modification */}
            <Modal isOpen={modalEditIsOpen} onClose={() => setModalEditIsOpen(false)} title="Modifier un module pédagogique">
                <div className="bg-white p-6 rounded-lg">
                    <form onSubmit={handleModifierModule} className="space-y-4">
                        <div>
                            <label htmlFor="edit-titre" className="block text-sm font-medium text-violet-800">Titre du module <span className="text-amber-500">*</span></label>
                            <input type="text" id="edit-titre" required className="mt-1 block w-full border border-violet-200 rounded-md p-2 text-sm" value={formData.titre} onChange={e => setFormData({ ...formData, titre: e.target.value })} />
                        </div>
                        <div>
                            <label htmlFor="edit-description" className="block text-sm font-medium text-violet-800">Description du module</label>
                            <textarea id="edit-description" rows={3} className="mt-1 block w-full border border-violet-200 rounded-md p-2 text-sm" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div>
                            <label htmlFor="edit-difficulte" className="block text-sm font-medium text-violet-800">Difficulté <span className="text-amber-500">*</span></label>
                            <select id="edit-difficulte" className="mt-1 block w-full border border-violet-200 rounded-md p-2 text-sm bg-white" value={formData.difficulte} onChange={e => setFormData({ ...formData, difficulte: e.target.value as Difficulte })}>
                                <option value="FACILE">Facile</option>
                                <option value="MOYEN">Moyen</option>
                                <option value="DIFFICILE">Difficile</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={() => setModalEditIsOpen(false)} className="px-4 py-2 text-sm text-slate-500">Annuler</button>
                            <button type="submit" className="px-4 py-2 bg-violet-600 text-white rounded-md text-sm">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}