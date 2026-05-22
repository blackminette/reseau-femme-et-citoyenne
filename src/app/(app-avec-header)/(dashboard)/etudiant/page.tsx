// * src/app/(dashboard)/etudiant/page.tsx
'use client';

import React from 'react';

/**
 * Page d'accueil de l'espace Pédagogique Étudiant.
 * Accessible uniquement pour le rôle 'ETUDIANT'.
 */
export default function EtudiantDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold text-slate-800">Espace Étudiant</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Accès autonome à vos cours, supports PDF et évaluations.
                    </p>
                </header>

                <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-700 mb-2">Mon Parcours Pédagogique</h2>
                    <p className="text-slate-600 text-sm mb-4">
                        Vous pouvez consulter vos leçons et passer vos quiz en toute autonomie. Vos scores seront enregistrés.
                    </p>

                    <div className="p-4 bg-emerald-50 text-emerald-800 rounded border border-emerald-100 text-sm font-medium">
                        🎓 Statut d'apprentissage : Actif (Compte invité par lien interne)
                    </div>
                </div>
            </div>
        </div>
    );
}