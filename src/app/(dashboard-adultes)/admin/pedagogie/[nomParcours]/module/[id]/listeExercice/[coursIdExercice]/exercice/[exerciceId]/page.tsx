// * src/app/(dashboard-adultes)/admin/pedagogie/[nomParcours]/module/[id]/listeExercice/[coursIdExercice]/exercice/[exerciceId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, MoveRight, MoveLeft, Pencil, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { getExercice, modifierTitreExercice, modifierContenuExercice } from './actions';
import Modal from '@/components/Modal';
import { supabaseClient } from '@/lib/supabaseClient';
import { options } from '@fullcalendar/core/preact.js';

interface PageExercice {
    id: string | number;         // "q1" ou des nombres/timestamp
    numeroPage: number;          // Indexation pour la navigation
    question: string;            // Intitulé de la question
    options: string[];           // Tableau d'options (QCM / Vrai-Faux / Images)
    reponseCorrecte: string;     // Réponse attendue
}

interface ExerciceInfo {
    id: number;
    titre: string;
    ordre: number;
    type: "QCM" | "IMAGES_ORDRE" | "VRAI_FAUX"; // Lecture seule depuis exerciceInfo
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

    // States éditables pour le contenu des questions
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [editQuestion, setEditQuestion] = useState("");

    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const params = useParams();
    const moduleId = parseInt(params.id as string, 10);
    const coursId = parseInt(params.coursIdExercice as string, 10);
    const exerciceId = parseInt(params.exerciceId as string, 10);
    const nomParcours = params.nomParcours as string;

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

                const pagesNormalisees = contenuPages.map((page, idx) => ({
                    ...page,
                    numeroPage: page.numeroPage || idx + 1
                }));

                // Détermination stricte du type récupéré de la base de données
                const typeDatabase = exerciceData.type;
                const typeValide: "QCM" | "IMAGES_ORDRE" | "VRAI_FAUX" =
                    (typeDatabase === "VRAI_FAUX" || typeDatabase === "IMAGES_ORDRE" || typeDatabase === "QCM")
                        ? typeDatabase
                        : "QCM";

                setExercice({
                    ...exerciceData,
                    type: typeValide,
                    contenu: pagesNormalisees
                });
            } else {
                setError(result.error || "Impossible de charger l'exercice.");
            }
            setIsLoading(false);
        };

        handleGetExercice();
    }, [exerciceId]);

    // Resynchronisation des inputs au changement de page
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

        const result = await modifierContenuExercice(exercice.id, nouveauContenu, moduleId, nomParcours);
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

        const miseAJourReponse = currentPage.reponseCorrecte === ancienneValeur ? valeur : currentPage.reponseCorrecte;

        const nouveauContenu = [...exercice.contenu ?? exercice.contenu];
        nouveauContenu[currentPageIndex] = {
            ...currentPage,
            options: nouvellesOptions,
            reponseCorrecte: miseAJourReponse
        };

        setExercice(prev => prev ? { ...prev, contenu: nouveauContenu } : null);
        await modifierContenuExercice(exercice.id, nouveauContenu, moduleId, nomParcours);
    };

    const handleCreate = async () => {
        if (!exercice) return;

        // Initialisation automatique des options et réponses selon le type de l'exercice
        let options = ["Option A", "Option B"];
        let reponseCorrecte = "Option A";

        if (exercice.type === "VRAI_FAUX") {
            options = ["Vrai", "Faux"];
            reponseCorrecte = "Vrai";
        } else if (exercice.type === "IMAGES_ORDRE") {
            options = ["Image 1", "Image 2", "Image 3"];
            reponseCorrecte = "1,2,3";
        }

        const nouvellePage: PageExercice = {
            id: `q-${Date.now()}`,
            numeroPage: exercice.contenu.length + 1,
            question: "Nouvelle question ?",
            options,
            reponseCorrecte
        };

        const nouveauContenu = [...exercice.contenu, nouvellePage];
        setExercice(prev => prev ? { ...prev, contenu: nouveauContenu } : null);
        setCurrentPageIndex(nouveauContenu.length - 1);

        await modifierContenuExercice(exercice.id, nouveauContenu, moduleId, nomParcours);
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

        await modifierContenuExercice(exercice.id, nouveauContenu, moduleId, nomParcours);
    };

    const handleReordonner = async (numeroPage: number, direction: 'HAUT' | 'BAS') => {
        if (!exercice) return;

        const findIndexActuel = exercice.contenu.findIndex(p => p.numeroPage === numeroPage);
        if (findIndexActuel === -1) return;

        const nouvelIndex = direction === 'HAUT' ? findIndexActuel - 1 : findIndexActuel + 1;
        if (nouvelIndex < 0 || nouvelIndex >= exercice.contenu.length) return;

        const nouveauContenu = [...exercice.contenu];
        [nouveauContenu[findIndexActuel], nouveauContenu[nouvelIndex]] = [nouveauContenu[nouvelIndex], nouveauContenu[findIndexActuel]];

        const contenuReindexe = nouveauContenu.map((page, idx) => ({ ...page, numeroPage: idx + 1 }));

        if (currentPageIndex === findIndexActuel) setCurrentPageIndex(nouvelIndex);
        else if (currentPageIndex === nouvelIndex) setCurrentPageIndex(findIndexActuel);

        setExercice(prev => prev ? { ...prev, contenu: contenuReindexe } : null);
        await modifierContenuExercice(exercice.id, contenuReindexe, moduleId, nomParcours);
    };

    const handleSupprimerOption = async (optionIndex: number) => {
        if (!exercice) return;
        const currentPage = exercice.contenu[currentPageIndex];
        if (!currentPage || !currentPage.options) return;

        if (currentPage.options.length <= 1) {
            alert("Une question doit posséder au moins une option de réponse.");
            return;
        }

        const optionASupprimer = currentPage.options[optionIndex];
        const nouvellesOptions = currentPage.options.filter((_, idx) => idx !== optionIndex);

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
        await modifierContenuExercice(exercice.id, nouveauContenu, moduleId, nomParcours);
    };

    const handleImageOptionChange = async (optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !exercice) return;

        try {
            setIsUploadingImage(true);
            setError(null);

            // 1. Générer un nom unique (Utilisation sécurisée de exercice.id)
            const extension = file.name.split('.').pop();
            const nomFichier = `exercice-${exercice.id}-option-${optionIndex}-${Date.now()}.${extension}`;

            // 2. Envoyer le fichier vers le bucket
            const { data, error: uploadError } = await supabaseClient.storage
                .from('exercice-image')
                .upload(nomFichier, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // 3. Récupérer l'URL publique de la nouvelle image
            const { data: { publicUrl } } = supabaseClient.storage
                .from('exercice-image')
                .getPublicUrl(nomFichier);

            // 4. SUPPRESSION DE L'ANCIENNE IMAGE
            const ancienneImageUrl = exercice.contenu[currentPageIndex]?.options?.[optionIndex];

            if (ancienneImageUrl && (ancienneImageUrl.startsWith('http') || ancienneImageUrl.startsWith('/'))) {

                // ÉTAPE CLÉ : Extraire le chemin à partir de la structure de l'URL Supabase
                // Une URL Supabase ressemble à : .../storage/v1/object/public/exercice-image/nomDuFichier.png
                // En coupant après le nom du bucket ('exercice-image/'), on récupère le chemin exact requis pour le .remove()
                const partiesUrl = ancienneImageUrl.split('exercice-image/');
                const cheminFichierSupabase = partiesUrl[1]; // Contient le nom ou "dossier/nom"

                if (cheminFichierSupabase) {
                    // On passe le chemin complet extrait à Supabase
                    const { error: removeError } = await supabaseClient.storage
                        .from('exercice-image')
                        .remove([cheminFichierSupabase]);

                    if (removeError) {
                        console.warn("L'ancienne image n'a pas pu être supprimée du bucket :", removeError.message);
                    }
                }
            }

            // 5. Sauvegarder la nouvelle URL publique
            await handleModifierOption(optionIndex, publicUrl);

        } catch (err: any) {
            console.error("Erreur lors du traitement de l'image :", err);
            setError(err.message || "Erreur lors du téléversement de l'image.");
        } finally {
            setIsUploadingImage(false);
            e.target.value = "";
        }
    };

    const handleSupprimerImageOption = async (optionIndex: number) => {
        if (!exercice) return;

        // 1. Récupérer l'URL de l'image à cet index précis
        const ancienneImageUrl = exercice.contenu[currentPageIndex]?.options?.[optionIndex];
        if (!ancienneImageUrl) return;

        try {
            setIsUploadingImage(true);
            setError(null);

            // 2. Supprimer le fichier physiquement du Storage Supabase
            if (ancienneImageUrl.startsWith('http') || ancienneImageUrl.startsWith('/')) {
                // Extraction propre du chemin (gère les dossiers et sous-dossiers éventuels)
                const partiesUrl = ancienneImageUrl.split('exercice-image/');
                const cheminFichierSupabase = partiesUrl[1];

                if (cheminFichierSupabase) {
                    const { error: deleteError } = await supabaseClient.storage
                        .from('exercice-image')
                        .remove([cheminFichierSupabase]);

                    if (deleteError) throw deleteError;
                }
            }

            // 3. Mettre à jour le tableau en BDD pour vider la valeur textuelle de cette option
            // On remplace l'URL par une chaîne vide pour signifier qu'il n'y a plus d'image
            await handleModifierOption(optionIndex, "");

        } catch (err: any) {
            console.error("Erreur lors de la suppression de l'image :", err);
            setError("Erreur lors de la suppression du fichier sur le serveur.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Rendu dynamique selon la propriété "type" de l'exercice (Lecture seule)
    const renderInterfaceParType = (page: PageExercice, type: "QCM" | "IMAGES_ORDRE" | "VRAI_FAUX") => {
        switch (type) {
            case "VRAI_FAUX":
                return (
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sélectionnez la réponse correcte :</label>
                        <div className="flex gap-4">
                            {["Vrai", "Faux"].map((val) => (
                                <label key={val} className={`flex items-center gap-3 p-4 rounded-xl border flex-1 cursor-pointer transition-all ${page.reponseCorrecte === val ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-900' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                                    <input
                                        type="radio"
                                        name="vraiFauxReponse"
                                        checked={page.reponseCorrecte === val}
                                        onChange={() => handleSauvegarderPage('reponseCorrecte', val)}
                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    {val}
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case "IMAGES_ORDRE":
                return (
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                            Configuration de l'ordre des images :
                        </label>
                        <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3">
                            <p className="text-xs text-amber-800">
                                Ordre attendu (séparé par des virgules, ex: <code>1,2,3</code>) :
                            </p>
                            <input
                                type="text"
                                value={page.reponseCorrecte || ""}
                                onChange={(e) => handleSauvegarderPage('reponseCorrecte', e.target.value)}
                                placeholder="Ex: 1,2,3"
                                className="max-w-xs font-mono font-bold text-slate-800 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 bg-white"
                            />

                            {/* Grille d'images */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                                {(page.options || []).map((optUrl, idx) => {
                                    const estUneUrl = optUrl && (optUrl.startsWith('http') || optUrl.startsWith('/'));

                                    return (
                                        <div key={idx} className="p-3 border border-slate-200 rounded-xl bg-white flex flex-col gap-2 relative group/item">
                                            {/* Badge d'indexation de l'image */}
                                            <div className="flex items-center justify-between">
                                                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    {idx + 1}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        // Important : On supprime d'abord le fichier sur le storage, 
                                                        // PUIS on retire la case du tableau global.
                                                        await handleSupprimerImageOption(idx);
                                                        await handleSupprimerOption(idx);
                                                    }}
                                                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                                                    title="Supprimer ce repère"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* Zone d'affichage ou d'upload de l'image */}
                                            <div className="relative border border-slate-100 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center h-36 w-full group/img">
                                                {estUneUrl ? (
                                                    <>
                                                        <img
                                                            src={optUrl}
                                                            alt={`Repère ${idx + 1}`}
                                                            className="object-contain w-full h-full max-h-36 transition-opacity group-hover/img:opacity-40"
                                                        />
                                                        {/* Actions au survol de l'image */}
                                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                                            <label className="px-2 py-1 bg-white text-violet-700 font-medium text-[10px] rounded-lg shadow-md hover:bg-violet-50 transition-all flex items-center gap-1 cursor-pointer">
                                                                <Pencil className="w-2.5 h-2.5" /> Changer
                                                                <input
                                                                    type="file"
                                                                    onChange={(e) => handleImageOptionChange(idx, e)}
                                                                    accept="image/*"
                                                                    disabled={isUploadingImage}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                            <button
                                                                type="button"
                                                                onClick={async () => {
                                                                    // Nettoyage de la syntaxe avec des points-virgules et async/await
                                                                    await handleSupprimerImageOption(idx);
                                                                    await handleModifierOption(idx, "");
                                                                }}
                                                                disabled={isUploadingImage}
                                                                className="px-2 py-1 bg-red-600 text-white font-medium text-[10px] rounded-lg shadow-md hover:bg-red-700 transition-all flex items-center gap-1 cursor-pointer"
                                                            >
                                                                <Trash2 className="w-2.5 h-2.5" /> Retirer
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    /* Bouton d'upload si la case ne contient pas encore d'URL valide */
                                                    <label className="w-full h-full flex flex-col items-center justify-center text-center p-2 transition-all cursor-pointer hover:bg-violet-50/30 group/btn disabled:opacity-50">
                                                        <div className="p-1.5 bg-slate-100 rounded-full text-slate-400 group-hover/btn:bg-violet-100 group-hover/btn:text-violet-600 transition-all mb-1">
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </div>
                                                        <span className="text-[10px] font-semibold text-slate-500 group-hover/btn:text-violet-700 transition-colors">
                                                            Ajouter l'image
                                                        </span>
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleImageOptionChange(idx, e)}
                                                            accept="image/*"
                                                            disabled={isUploadingImage}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}

                                                {/* Écran de chargement local */}
                                                {isUploadingImage && (
                                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-[10px] text-violet-600 font-medium animate-pulse">
                                                        Envoi...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Le bouton Ajouter un repère reste inchangé et fonctionnel */}
                            <button
                                type="button"
                                onClick={() => handleSauvegarderPage('options', [...(page.options || []), `Image ${(page.options || []).length + 1}`])}
                                className="text-xs text-violet-600 hover:text-violet-800 font-semibold flex items-center gap-1 mt-2 cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" /> Ajouter un repère d'image
                            </button>
                        </div>
                    </div>
                );

            case "QCM":
            default:
                return (
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Options de réponse & Sélection de la réponse correcte :</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(page.options || []).map((option, idx) => (
                                <div key={idx} className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all group/option ${page.reponseCorrecte === option ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200'}`}>
                                    <div className="flex items-center gap-3 flex-1">
                                        <input
                                            type="radio"
                                            name="reponseCorrecte"
                                            checked={page.reponseCorrecte === option}
                                            onChange={() => handleSauvegarderPage('reponseCorrecte', option)}
                                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                                        />
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleModifierOption(idx, e.target.value)}
                                            className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-violet-500 text-sm font-medium text-slate-700 focus:outline-none pb-0.5"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleSupprimerOption(idx)}
                                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all opacity-0 group-hover/option:opacity-100 focus:opacity-100 cursor-pointer shrink-0"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {(!page.options || page.options.length < 4) && (
                            <button
                                type="button"
                                onClick={() => handleSauvegarderPage('options', [...(page.options || []), `Nouvelle Option ${(page.options || []).length + 1}`])}
                                className="text-xs text-violet-600 hover:text-violet-800 font-semibold flex items-center gap-1 mt-2 cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" /> Ajouter un choix alternatif
                            </button>
                        )}
                    </div>
                );
        }
    };

    if (isLoading) return <div className="p-6 text-sm text-violet-600">Chargement...</div>;
    if (error || !exercice) return <div className="p-6 text-amber-600">{error || "Introuvable."}</div>;

    const pageActuelle = exercice.contenu[currentPageIndex];

    return (
        <div className="p-6 space-y-6">
            {/* Fil d'Ariane & Titre */}
            <div className="flex flex-col space-y-4">
                <Link href={`/admin/pedagogie/${nomParcours}/module/${moduleId}/listeExercice/${coursId}`} className="text-sm text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1 w-fit">
                    <ChevronRight className="h-3 w-3 rotate-180" /> Retour aux exercices
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                                        await modifierTitreExercice(exercice.id, editTitre, moduleId, nomParcours);
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

                    {/* Affichage informatif du Type d'Exercice (Lecture Seule) */}
                    <div className="flex flex-col gap-1 w-full max-w-xs bg-slate-50 border border-slate-200 p-3 rounded-xl shadow-sm">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type de Quiz affecté :</label>
                        <span className="text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-1.5 rounded-lg inline-block w-full text-center">
                            {exercice.type === "QCM" && "QCM (Choix Multiples)"}
                            {exercice.type === "VRAI_FAUX" && "Vrai / Faux"}
                            {exercice.type === "IMAGES_ORDRE" && "Ordre d'images"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Zone Principale du Contenu */}
            <div className="border-t border-violet-100 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-lg font-semibold text-violet-900">Structure du Questionnaire <span className="text-sm font-normal text-slate-500">({exercice.type})</span></h2>
                    <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => setIsModalOpen(true)} className="px-3 py-1.5 bg-violet-50 text-violet-700 hover:bg-violet-600 hover:text-white rounded-lg text-sm border border-violet-200 transition-colors cursor-pointer">Réorganiser</button>
                        <button onClick={handleDelete} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-700 hover:text-white rounded-lg text-sm border border-red-200 transition-colors cursor-pointer">Supprimer la Question</button>
                        <button onClick={handleCreate} className="px-3 py-1.5 bg-violet-600 text-white hover:bg-violet-700 rounded-lg text-sm transition-colors flex items-center gap-1 cursor-pointer"><Plus className="w-4 h-4" /> Ajouter une question</button>
                    </div>
                </div>

                {pageActuelle ? (
                    <div className="space-y-6">
                        <div className="bg-white border border-violet-200 rounded-xl p-6 shadow-sm space-y-6">

                            {/* Intitulé / Question de la page */}
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

                            {/* Rendu dynamique basé sur la clé "type" de l'exercice parent */}
                            {renderInterfaceParType(pageActuelle, exercice.type)}

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