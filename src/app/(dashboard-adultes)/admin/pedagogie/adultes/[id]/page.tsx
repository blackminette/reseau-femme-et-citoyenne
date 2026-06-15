// * src/app/(dashboard-adultes)/admin/pedagogie/adultes/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getModuleAndCours } from './actions';

interface CoursInfo {
    id: number;
    titre: string;
    description: string | null;
    ordreDansModule: number;
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

    if (isLoading) {
        return <div className="p-6">Chargement...</div>;
    }

    if (error || !module) {
        return <div className="p-6 text-rose-600">{error || "Module introuvable."}</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Détails du module : {module.titre}</h1>
                {module.description && <p className="text-slate-500 mt-2">{module.description}</p>}
            </div>

            <div className="border-t border-slate-100 pt-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Liste des cours associés</h2>

                {module.cours && module.cours.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {module.cours.map((cours) => (
                            <div key={cours.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                                <h3 className="font-medium text-slate-900">{cours.titre}</h3>
                                {cours.description && <p className="text-sm text-slate-500 mt-1">{cours.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 italic">Aucun cours n'est associé à ce module pour le moment.</p>
                )}
            </div>
        </div>
    );
}