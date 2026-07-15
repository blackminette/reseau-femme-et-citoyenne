// * src/app/(dashboard-adultes)/admin/pedagogie/[nomParcours]/module/[id]/documents/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabaseClient';
import { ChevronRight, FileText, Trash2, Loader2, FileUp, AlertCircle } from 'lucide-react';

interface SupabaseFile {
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: {
        size: number;
        mimetype: string;
    }
}

const BUCKET_NAME = 'documents-pedagogiques';

export default function AdminModuleDocumentsPage() {
    const params = useParams();
    const nomParcours = params.nomParcours as string;
    const moduleId = params.id as string;

    const [files, setFiles] = useState<SupabaseFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Récupérer la liste des PDF associés au module
    const chargerDocuments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: storageError } = await supabaseClient.storage
                .from(BUCKET_NAME)
                .list(`modules/${moduleId}`, {
                    limit: 100,
                    sortBy: { column: 'name', order: 'asc' }
                    // 🎯 L'option 'include' a été supprimée d'ici pour régler l'erreur TS2353
                });

            if (storageError) throw storageError;

            const fichiersValides = (data || []).filter(f => f.name !== '.emptyFolderPlaceholder');
            setFiles(fichiersValides as unknown as SupabaseFile[]);
        } catch (err: any) {
            console.error("Erreur chargement documents :", err);
            setError("Impossible de charger les documents associés à ce module.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (moduleId) {
            chargerDocuments();
        }
    }, [moduleId]);

    // 2. Fonction de Téléversement (Upload)
    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            alert("Seuls les fichiers au format PDF sont autorisés.");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
            const filePath = `modules/${moduleId}/${Date.now()}_${cleanName}`;

            const { error: uploadError } = await supabaseClient.storage
                .from(BUCKET_NAME)
                .upload(filePath, selectedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            await chargerDocuments();
        } catch (err: any) {
            console.error("Erreur lors de l'upload :", err);
            setError("Une erreur est survenue lors du téléversement du fichier.");
        } finally {
            setIsUploading(false);
        }
    };

    // 3. Fonction de Suppression (Delete)
    const handleDeleteFile = async (fileName: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer le document "${fileName}" ?`)) return;

        try {
            const filePath = `modules/${moduleId}/${fileName}`;
            const { error: deleteError } = await supabaseClient.storage
                .from(BUCKET_NAME)
                .remove([filePath]);

            if (deleteError) throw deleteError;

            setFiles(prev => prev.filter(f => f.name !== fileName));
        } catch (err: any) {
            console.error("Erreur lors de la suppression :", err);
            alert("Impossible de supprimer le document.");
        }
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'Ko', 'Mo', 'Go'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const handleOpenFile = async (fileName: string) => {
        try {
            const { data, error } = await supabaseClient.storage
                .from(BUCKET_NAME)
                .createSignedUrl(`modules/${moduleId}/${fileName}`, 60); // Lien valide 60 secondes

            if (error) throw error;

            if (data?.signedUrl) {
                window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
            }
        } catch (err) {
            console.error("Erreur génération URL signée :", err);
            alert("Impossible d'ouvrir le document.");
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* Fil d'ariane */}
            <div>
                <Link
                    href={`/admin/pedagogie/${nomParcours}/module/${moduleId}`}
                    className="text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1 w-fit"
                >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Retour aux détails du module
                </Link>
            </div>

            {/* En-tête de la page */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Documents & Supports PDF</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Ajoutez ou supprimez les fichiers de cours téléchargeables pour ce module.
                    </p>
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-violet-600/10 transition-all active:scale-[0.98] cursor-pointer">
                    {isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Téléversement...</span>
                        </>
                    ) : (
                        <>
                            <FileUp className="w-4 h-4" />
                            <span>Ajouter un PDF</span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleUploadFile}
                        disabled={isUploading}
                        className="hidden"
                    />
                </label>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Liste des fichiers */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-sm font-bold text-slate-700">Fichiers disponibles ({files.length})</h2>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                        <span className="text-sm">Chargement des documents...</span>
                    </div>
                ) : files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center text-slate-400 gap-3">
                        <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
                            <FileText className="w-8 h-8 text-slate-300" />
                        </div>
                        <div className="max-w-xs">
                            <p className="text-sm font-semibold text-slate-700">Aucun document pour le moment</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Cliquez sur "Ajouter un PDF" ci-dessus pour lier un support à ce module.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {files.map((file) => (
                            <div key={file.id || file.name} className="flex items-center justify-between p-4 hover:bg-slate-50/60 transition-colors group">
                                <div className="flex items-center gap-3 truncate max-w-[75%]">
                                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="truncate">
                                        <button
                                            onClick={() => handleOpenFile(file.name)}
                                            className="text-sm font-semibold text-slate-800 hover:text-violet-600 hover:underline truncate block text-left cursor-pointer"
                                        >
                                            {file.name.replace(/^\d+_/, '')}
                                        </button>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Taille : {formatBytes(file.metadata?.size || 0)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDeleteFile(file.name)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    title="Supprimer ce document"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}