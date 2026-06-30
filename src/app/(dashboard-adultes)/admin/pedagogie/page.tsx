// * src/app/(dashboard-adultes)/admin/pedagogie/page.tsx
'use client';

/** Page pour pour choisir et rediriger vers la bonne section (Adultes ou Enfants). */

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, Users, Baby, ArrowRight, BookOpen, Settings,
  FolderPlus, Plus, PlusCircle, AlertCircle, Sparkles, Check, Trash2, Edit
} from 'lucide-react';
import Modal from '@/components/Modal';
import { listerModulesParPublic, ajouterCoursDansModule, ajouterExerciceDansCours, modifierCoursDansModule, ModuleData } from './actions';

interface BuilderQuestion {
    id: number;
    question: string;
    options: string[];
    reponseCorrecte: string;
    explication?: string;
}

export default function PedagogiePage() {
    const [modulesAdultes, setModulesAdultes] = useState<ModuleData[]>([]);
    const [modulesEnfants, setModulesEnfants] = useState<ModuleData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state for adding Cours / Lesson
    const [modalCoursOpen, setModalCoursOpen] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
    const [coursTitre, setCoursTitre] = useState('');
    
    // Multi-page builder states for new Course
    const [coursPages, setCoursPages] = useState<Array<{ id: number; titre: string; texte: string }>>([
        { id: 1, titre: '', texte: '' }
    ]);

    // Modal state for editing Cours / Lesson
    const [modalEditCoursOpen, setModalEditCoursOpen] = useState(false);
    const [editCoursId, setEditCoursId] = useState<number | null>(null);
    const [editCoursTitre, setEditCoursTitre] = useState('');
    
    // Multi-page builder states for editing Course
    const [editCoursPages, setEditCoursPages] = useState<Array<{ id: number; titre: string; texte: string }>>([
        { id: 1, titre: '', texte: '' }
    ]);

    // Modal state for adding Exercice / Quiz
    const [modalExOpen, setModalExOpen] = useState(false);
    const [selectedCoursId, setSelectedCoursId] = useState<number | null>(null);
    const [exTitre, setExTitre] = useState('');
    const [exInstructions, setExInstructions] = useState('');
    const [exType, setExType] = useState<'QUIZ' | 'DESSIN' | 'TEXTE' | 'COMPLEMENT'>('QUIZ');
    
    // Interactive Builder State (replaces raw JSON)
    const [questions, setQuestions] = useState<BuilderQuestion[]>([
        { id: 1, question: '', options: ['', ''], reponseCorrecte: '' }
    ]);

    // Load modules structure
    async function loadData() {
        setLoading(true);
        try {
            const resAdults = await listerModulesParPublic('ADULTE');
            const resKids = await listerModulesParPublic('ENFANT');
            if (resAdults.success && resAdults.data) setModulesAdultes(resAdults.data);
            if (resKids.success && resKids.data) setModulesEnfants(resKids.data);
        } catch (err) {
            setError("Erreur lors de la récupération des données.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleAddCours = async () => {
        if (!selectedModuleId || !coursTitre.trim()) return;

        // Map pages into the required schema format
        const cleanPages = coursPages.filter(p => p.texte.trim() !== '' || p.titre.trim() !== '');
        const pagesPayload = cleanPages.length > 0 
            ? cleanPages.map(p => ({ titre: p.titre.trim(), texte: p.texte.trim() }))
            : [{ titre: coursTitre, texte: "" }];

        const res = await ajouterCoursDansModule({
            moduleId: selectedModuleId,
            titre: coursTitre,
            contenuHTML: JSON.stringify(pagesPayload)
        });
        if (res.success) {
            setModalCoursOpen(false);
            setCoursTitre('');
            setCoursPages([{ id: 1, titre: '', texte: '' }]);
            loadData();
        } else {
            alert(res.error || "Une erreur est survenue.");
        }
    };

    const openEditCoursModal = (cours: any) => {
        setEditCoursId(cours.id);
        setEditCoursTitre(cours.titre);
        
        let pagesList: Array<{ id: number; titre: string; texte: string }> = [];
        let rawContent = '';
        
        if (Array.isArray(cours.contenu) && cours.contenu.length > 0) {
            rawContent = cours.contenu[0];
        } else if (typeof cours.contenu === 'string') {
            rawContent = cours.contenu;
        }

        try {
            if (rawContent && (rawContent.startsWith('[') || rawContent.startsWith('{'))) {
                const parsed = JSON.parse(rawContent);
                if (Array.isArray(parsed)) {
                    pagesList = parsed.map((p, idx) => ({
                        id: idx + 1,
                        titre: p.titre || '',
                        texte: p.texte || ''
                    }));
                }
            }
        } catch (e) {
            console.error("Error parsing course pages JSON:", e);
        }

        if (pagesList.length === 0) {
            pagesList = [{ id: 1, titre: cours.titre, texte: rawContent || '' }];
        }

        setEditCoursPages(pagesList);
        setModalEditCoursOpen(true);
    };

    const handleEditCours = async () => {
        if (!editCoursId || !editCoursTitre.trim()) return;

        const cleanPages = editCoursPages.filter(p => p.texte.trim() !== '' || p.titre.trim() !== '');
        const pagesPayload = cleanPages.length > 0 
            ? cleanPages.map(p => ({ titre: p.titre.trim(), texte: p.texte.trim() }))
            : [{ titre: editCoursTitre, texte: "" }];

        const res = await modifierCoursDansModule({
            coursId: editCoursId,
            titre: editCoursTitre,
            contenuHTML: JSON.stringify(pagesPayload)
        });
        if (res.success) {
            setModalEditCoursOpen(false);
            setEditCoursId(null);
            setEditCoursTitre('');
            setEditCoursPages([{ id: 1, titre: '', texte: '' }]);
            loadData();
        } else {
            alert(res.error || "Une erreur est survenue.");
        }
    };

    // Helper functions for add course pages builder
    const addCoursPage = () => {
        setCoursPages(prev => [...prev, { id: Date.now(), titre: '', texte: '' }]);
    };
    const removeCoursPage = (id: number) => {
        setCoursPages(prev => prev.filter(p => p.id !== id));
    };
    const updateCoursPageTitle = (id: number, val: string) => {
        setCoursPages(prev => prev.map(p => p.id === id ? { ...p, titre: val } : p));
    };
    const updateCoursPageText = (id: number, val: string) => {
        setCoursPages(prev => prev.map(p => p.id === id ? { ...p, texte: val } : p));
    };

    // Helper functions for edit course pages builder
    const addEditCoursPage = () => {
        setEditCoursPages(prev => [...prev, { id: Date.now(), titre: '', texte: '' }]);
    };
    const removeEditCoursPage = (id: number) => {
        setEditCoursPages(prev => prev.filter(p => p.id !== id));
    };
    const updateEditCoursPageTitle = (id: number, val: string) => {
        setEditCoursPages(prev => prev.map(p => p.id === id ? { ...p, titre: val } : p));
    };
    const updateEditCoursPageText = (id: number, val: string) => {
        setEditCoursPages(prev => prev.map(p => p.id === id ? { ...p, texte: val } : p));
    };

    const handleAddExercice = async () => {
        if (!selectedCoursId || !exTitre.trim()) return;
        
        // Filter out empty questions
        const cleanQuestions = questions.filter(q => q.question.trim() !== '');
        if (exType === 'QUIZ' && cleanQuestions.length === 0) {
            alert("Veuillez ajouter au moins une question pour le quiz.");
            return;
        }

        // Convert the interactive builder state to the database JSON string
        const generatedJsonString = JSON.stringify(
            exType === 'QUIZ'
                ? cleanQuestions.map(q => {
                    const cleanOpts = q.options.filter(o => o.trim() !== '');
                    const correctIdx = cleanOpts.indexOf(q.reponseCorrecte);
                    return {
                        q: q.question.trim(),
                        answer: correctIdx !== -1 ? correctIdx : 0,
                        options: cleanOpts,
                        explication: q.explication?.trim() || "Bonne réponse !"
                    };
                })
                : [] // default empty payload for drawings/puzzles text types for now
        );

        const res = await ajouterExerciceDansCours({
            coursId: selectedCoursId,
            titre: exTitre,
            instructions: exInstructions,
            type: exType,
            contenu: generatedJsonString
        });

        if (res.success) {
            setModalExOpen(false);
            setExTitre('');
            setExInstructions('');
            setQuestions([{ id: 1, question: '', options: ['', ''], reponseCorrecte: '', explication: '' }]);
            loadData();
        } else {
            alert(res.error || "Une erreur est survenue.");
        }
    };

    // Helper functions to manage builder state
    const addQuestion = () => {
        setQuestions(prev => [
            ...prev,
            { id: Date.now(), question: '', options: ['', ''], reponseCorrecte: '', explication: '' }
        ]);
    };

    const updateQuestionExplication = (id: number, text: string) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, explication: text } : q));
    };

    const removeQuestion = (id: number) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const updateQuestionText = (id: number, text: string) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, question: text } : q));
    };

    const updateOptionText = (qId: number, oIdx: number, val: string) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === qId) {
                const updatedOptions = [...q.options];
                updatedOptions[oIdx] = val;
                return { ...q, options: updatedOptions };
            }
            return q;
        }));
    };

    const addOption = (qId: number) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === qId) {
                return { ...q, options: [...q.options, ''] };
            }
            return q;
        }));
    };

    const removeOption = (qId: number, oIdx: number) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === qId) {
                return { ...q, options: q.options.filter((_, idx) => idx !== oIdx) };
            }
            return q;
        }));
    };

    const selectCorrectAnswer = (qId: number, value: string) => {
        setQuestions(prev => prev.map(q => q.id === qId ? { ...q, reponseCorrecte: value } : q));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            
            {/* En-tête de la page */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                        <GraduationCap className="h-5 w-5" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Espace Admin</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pédagogie & Programmes</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Gérez les parcours pédagogiques, concevez les leçons et construisez des exercices interactifs pour les apprenants.
                    </p>
                </div>
            </div>

            {/* Quick Links cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section Adultes */}
                <Link
                    href="/admin/pedagogie/adultes"
                    className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 text-left"
                >
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                            <Users className="h-6 w-6" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                            Gérer les modules adultes <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                    </div>
                    <div className="mt-5 space-y-1">
                        <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            Modules Adultes
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Gestion des cours continus, ateliers thématiques, plannings de formation et suivi des niveaux pédagogiques pour adultes.
                        </p>
                    </div>
                </Link>

                {/* Section Enfants */}
                <Link
                    href="/admin/pedagogie/enfants"
                    className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-orange-200 transition-all duration-200 text-left"
                >
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors duration-200">
                            <Baby className="h-6 w-6" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full group-hover:text-orange-600 group-hover:bg-orange-50 transition-colors">
                            Suivi des élèves (Enfants) <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                    </div>
                    <div className="mt-5 space-y-1">
                        <h2 className="text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                            Suivi & Progression Enfants
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Suivi détaillé des scores d'apprentissage RFC06, bilan de compétences acquises ou fragiles, et recommandations d'apprentissage.
                        </p>
                    </div>
                </Link>
            </div>

            {/* Course & Exercise Builder Header */}
            <div className="pt-4 border-t border-slate-100">
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    Créateur de Leçons et d'Exercices (Builder)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Ajoutez directement des cours à vos modules ou attachez des exercices interactifs.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="text-xs text-slate-400">Chargement des structures de cours...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* ADULT SECTION BUILDER */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Parcours Adultes</h3>
                            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                {modulesAdultes.length} Modules
                            </span>
                        </div>

                        {modulesAdultes.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Aucun module adulte disponible.</p>
                        ) : (
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {modulesAdultes.map((mod) => (
                                    <div key={mod.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">{mod.titre}</h4>
                                                <p className="text-[11px] text-slate-400">{mod.description || 'Pas de description'}</p>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedModuleId(mod.id); setModalCoursOpen(true); }}
                                                className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors"
                                            >
                                                <Plus className="h-3 w-3" /> Ajouter cours
                                            </button>
                                        </div>

                                        {/* List of lessons */}
                                        <div className="pl-3 border-l-2 border-slate-100 space-y-2">
                                            {mod.cours.length === 0 ? (
                                                <p className="text-[10px] text-slate-400 italic">Aucun cours dans ce module.</p>
                                            ) : (
                                                mod.cours.map((crs) => (
                                                    <div key={crs.id} className="bg-slate-50/70 border border-slate-100/50 p-2.5 rounded-lg space-y-2">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                                <span className="font-semibold text-slate-700 truncate">{crs.ordreDansModule}. {crs.titre}</span>
                                                                <button
                                                                    onClick={() => openEditCoursModal(crs)}
                                                                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                                                                    title="Modifier la leçon"
                                                                >
                                                                    <Edit className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => { setSelectedCoursId(crs.id); setModalExOpen(true); }}
                                                                className="inline-flex items-center gap-0.5 text-[9px] font-black text-indigo-600 hover:text-indigo-700 uppercase shrink-0"
                                                            >
                                                                <PlusCircle className="h-3 w-3" /> Exercice
                                                            </button>
                                                        </div>

                                                        {/* Exercises inside lesson */}
                                                        {crs.exercices.length > 0 && (
                                                            <div className="pl-2.5 border-l border-indigo-100/75 space-y-1">
                                                                {crs.exercices.map((ex) => (
                                                                    <div key={ex.id} className="flex justify-between items-center text-[10px] text-slate-500">
                                                                        <span>• {ex.titre}</span>
                                                                        <span className="bg-slate-200 text-slate-700 text-[8px] font-bold px-1 rounded-sm uppercase">{ex.type}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* KIDS SECTION BUILDER */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Parcours Enfants</h3>
                            <span className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                {modulesEnfants.length} Modules
                            </span>
                        </div>

                        {modulesEnfants.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Aucun module enfant disponible.</p>
                        ) : (
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {modulesEnfants.map((mod) => (
                                    <div key={mod.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">{mod.titre}</h4>
                                                <p className="text-[11px] text-slate-400">{mod.description || 'Pas de description'}</p>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedModuleId(mod.id); setModalCoursOpen(true); }}
                                                className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 px-2 py-1 rounded-md transition-colors"
                                            >
                                                <Plus className="h-3 w-3" /> Ajouter cours
                                            </button>
                                        </div>

                                        {/* List of lessons */}
                                        <div className="pl-3 border-l-2 border-slate-100 space-y-2">
                                            {mod.cours.length === 0 ? (
                                                <p className="text-[10px] text-slate-400 italic">Aucun cours dans ce module.</p>
                                            ) : (
                                                mod.cours.map((crs) => (
                                                    <div key={crs.id} className="bg-slate-50/70 border border-slate-100/50 p-2.5 rounded-lg space-y-2">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                                <span className="font-semibold text-slate-700 truncate">{crs.ordreDansModule}. {crs.titre}</span>
                                                                <button
                                                                    onClick={() => openEditCoursModal(crs)}
                                                                    className="p-1 text-slate-400 hover:text-orange-600 hover:bg-slate-100 rounded transition-colors"
                                                                    title="Modifier la leçon"
                                                                >
                                                                    <Edit className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => { setSelectedCoursId(crs.id); setModalExOpen(true); }}
                                                                className="inline-flex items-center gap-0.5 text-[9px] font-black text-orange-600 hover:text-orange-700 uppercase shrink-0"
                                                            >
                                                                <PlusCircle className="h-3 w-3" /> Exercice
                                                            </button>
                                                        </div>

                                                        {/* Exercises inside lesson */}
                                                        {crs.exercices.length > 0 && (
                                                            <div className="pl-2.5 border-l border-orange-100/75 space-y-1">
                                                                {crs.exercices.map((ex) => (
                                                                    <div key={ex.id} className="flex justify-between items-center text-[10px] text-slate-500">
                                                                        <span>• {ex.titre}</span>
                                                                        <span className="bg-slate-200 text-slate-700 text-[8px] font-bold px-1 rounded-sm uppercase">{ex.type}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            )}

            {/* MODAL COUVERTURE AJOUT LEÇON / COURS */}
            <Modal
                isOpen={modalCoursOpen}
                onClose={() => setModalCoursOpen(false)}
                title="Ajouter un nouveau cours dans le module"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Titre global du cours</label>
                        <input
                            type="text"
                            value={coursTitre}
                            onChange={e => setCoursTitre(e.target.value)}
                            placeholder="Ex : Qui était Napoléon ?"
                            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white font-semibold text-slate-800"
                        />
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-indigo-700 uppercase">Pages du cours</h4>
                            <button
                                onClick={addCoursPage}
                                className="px-2 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-[9px] font-bold"
                            >
                                + Ajouter une page
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {coursPages.map((page, idx) => (
                                <div key={page.id} className="border border-slate-100 bg-slate-50/50 rounded-xl p-3 space-y-2 relative">
                                    {coursPages.length > 1 && (
                                        <button
                                            onClick={() => removeCoursPage(page.id)}
                                            className="absolute top-2 right-2 text-rose-500 text-[10px] font-bold hover:underline"
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                    <div className="pr-12">
                                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Titre Page {idx + 1}</label>
                                        <input
                                            type="text"
                                            value={page.titre}
                                            onChange={e => updateCoursPageTitle(page.id, e.target.value)}
                                            placeholder="Ex : Qui était Napoléon ?"
                                            className="w-full border border-slate-200 rounded-lg p-1.5 text-xs bg-white focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Contenu Page {idx + 1}</label>
                                        <textarea
                                            value={page.texte}
                                            onChange={e => updateCoursPageText(page.id, e.target.value)}
                                            placeholder="Rédigez le texte de cette page..."
                                            rows={3}
                                            className="w-full border border-slate-200 rounded-lg p-1.5 text-xs bg-white focus:outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                            onClick={() => setModalCoursOpen(false)}
                            className="px-3 py-1.5 text-xs text-slate-400 font-semibold hover:text-slate-600"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleAddCours}
                            className="px-4 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Confirmer
                        </button>
                    </div>
                </div>
            </Modal>

            {/* MODAL COUVERTURE MODIFICATION LEÇON / COURS */}
            <Modal
                isOpen={modalEditCoursOpen}
                onClose={() => setModalEditCoursOpen(false)}
                title="Modifier le cours / la leçon"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Titre global du cours</label>
                        <input
                            type="text"
                            value={editCoursTitre}
                            onChange={e => setEditCoursTitre(e.target.value)}
                            placeholder="Ex : Qui était Napoléon ?"
                            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white font-semibold text-slate-800"
                        />
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-indigo-700 uppercase">Pages du cours</h4>
                            <button
                                onClick={addEditCoursPage}
                                className="px-2 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-[9px] font-bold"
                            >
                                + Ajouter une page
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {editCoursPages.map((page, idx) => (
                                <div key={page.id} className="border border-slate-100 bg-slate-50/50 rounded-xl p-3 space-y-2 relative">
                                    {editCoursPages.length > 1 && (
                                        <button
                                            onClick={() => removeEditCoursPage(page.id)}
                                            className="absolute top-2 right-2 text-rose-500 text-[10px] font-bold hover:underline"
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                    <div className="pr-12">
                                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Titre Page {idx + 1}</label>
                                        <input
                                            type="text"
                                            value={page.titre}
                                            onChange={e => updateEditCoursPageTitle(page.id, e.target.value)}
                                            placeholder="Ex : Qui était Napoléon ?"
                                            className="w-full border border-slate-200 rounded-lg p-1.5 text-xs bg-white focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Contenu Page {idx + 1}</label>
                                        <textarea
                                            value={page.texte}
                                            onChange={e => updateEditCoursPageText(page.id, e.target.value)}
                                            placeholder="Rédigez le texte de cette page..."
                                            rows={3}
                                            className="w-full border border-slate-200 rounded-lg p-1.5 text-xs bg-white focus:outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                            onClick={() => setModalEditCoursOpen(false)}
                            className="px-3 py-1.5 text-xs text-slate-400 font-semibold hover:text-slate-600"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleEditCours}
                            className="px-4 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Enregistrer
                        </button>
                    </div>
                </div>
            </Modal>

            {/* MODAL COUVERTURE AJOUT EXERCICE / QUIZ */}
            <Modal
                isOpen={modalExOpen}
                onClose={() => setModalExOpen(false)}
                title="Ajouter un exercice ou quiz interactif"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Titre de l'exercice</label>
                            <input
                                type="text"
                                value={exTitre}
                                onChange={e => setExTitre(e.target.value)}
                                placeholder="Ex : Quiz d'évaluation de téléchargement"
                                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type d'exercice</label>
                            <select
                                value={exType}
                                onChange={e => setExType(e.target.value as any)}
                                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="QUIZ">Quiz à choix multiples</option>
                                <option value="TEXTE">Réponse textuelle</option>
                                <option value="DESSIN">Activité dessin/puzzle</option>
                                <option value="COMPLEMENT">Exercice à trous</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Consignes / Instructions pour l'élève</label>
                        <textarea
                            value={exInstructions}
                            onChange={e => setExInstructions(e.target.value)}
                            placeholder="Ex : Réponds aux questions suivantes sur le dossier..."
                            rows={2}
                            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    {/* INTERACTIVE BUILDER FOR QUIZZES */}
                    {exType === 'QUIZ' ? (
                        <div className="space-y-4 pt-2 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xs font-bold text-indigo-700 uppercase">Questions du Quiz</h4>
                                <button
                                    onClick={addQuestion}
                                    className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md text-[10px] font-bold transition-colors"
                                >
                                    + Ajouter question
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                                {questions.map((q, qIdx) => (
                                    <div key={q.id} className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-3 relative">
                                        <button 
                                            onClick={() => removeQuestion(q.id)}
                                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 rounded-lg"
                                            title="Supprimer la question"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>

                                        <div className="pr-6">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Question {qIdx + 1}</label>
                                            <input
                                                type="text"
                                                value={q.question}
                                                onChange={e => updateQuestionText(q.id, e.target.value)}
                                                placeholder="Ex : Quelle commande permet de créer un dossier ?"
                                                className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none"
                                            />
                                        </div>

                                        {/* Options Builder */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="block text-[9px] font-bold text-slate-400 uppercase">Options de réponse</label>
                                                <button
                                                    onClick={() => addOption(q.id)}
                                                    className="text-[9px] font-bold text-indigo-600 hover:underline"
                                                >
                                                    + Ajouter option
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {q.options.map((opt, oIdx) => (
                                                    <div key={oIdx} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1.5">
                                                        <input 
                                                            type="radio" 
                                                            name={`correct-${q.id}`}
                                                            checked={q.reponseCorrecte === opt && opt !== ''}
                                                            onChange={() => selectCorrectAnswer(q.id, opt)}
                                                            title="Définir comme réponse correcte"
                                                            className="h-3.5 w-3.5 text-indigo-600"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={opt}
                                                            onChange={e => {
                                                                updateOptionText(q.id, oIdx, e.target.value);
                                                                // Sync correct answer value if changed
                                                                if (q.reponseCorrecte === opt) {
                                                                    selectCorrectAnswer(q.id, e.target.value);
                                                                }
                                                            }}
                                                            placeholder={`Option ${oIdx + 1}`}
                                                            className="flex-1 text-xs border-0 focus:outline-none p-0"
                                                        />
                                                        {q.options.length > 2 && (
                                                            <button 
                                                                onClick={() => removeOption(q.id, oIdx)}
                                                                className="text-slate-300 hover:text-rose-500 font-bold text-[10px] px-1"
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Explication de la réponse (facultatif)</label>
                                            <input
                                                type="text"
                                                value={q.explication || ''}
                                                onChange={e => updateQuestionExplication(q.id, e.target.value)}
                                                placeholder="Ex : Après le coup d'État de 1799, Napoléon devient Premier Consul."
                                                className="w-full border border-slate-200 rounded-lg p-1.5 text-xs bg-white focus:outline-none"
                                            />
                                        </div>

                                        {q.reponseCorrecte === '' && (
                                            <p className="text-[9px] text-amber-600 font-semibold flex items-center gap-1">
                                                ⚠️ N'oublie pas de cocher le bouton radio de la réponse correcte.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                            <h5 className="text-xs font-bold text-slate-700">Type d'exercice : {exType}</h5>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Les exercices textuels, créatifs de dessin ou puzzles de complément se basent principalement sur les consignes rédigées ci-dessus.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                            onClick={() => setModalExOpen(false)}
                            className="px-3 py-1.5 text-xs text-slate-400 font-semibold hover:text-slate-600"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleAddExercice}
                            className="px-4 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Créer l'exercice
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}