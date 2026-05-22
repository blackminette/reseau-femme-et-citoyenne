// src/app/(dashboard)/membre/page.tsx
'use client';

import React from 'react';

/**
 * Page d'accueil de l'espace Membre (Parents / Adultes).
 * Accessible uniquement pour le rôle 'MEMBRE'.
 */
export default function MembreDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* En-tête */}
                <header className="mb-8 border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold text-slate-800">Espace Adhérant & Famille</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Suivi des enfants, inscriptions aux ateliers associatifs publics et boîte à idées.
                    </p>
                </header>

                {/* Section Principale */}
                <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mb-6">
                    <h2 className="text-lg font-semibold text-slate-700 mb-2">Tableau de bord</h2>
                    <p className="text-slate-600 text-sm">
                        Retrouvez ici la gestion de votre profil et le suivi pédagogique de vos enfants rattachés.
                    </p>
                </div>

                {/* Future zone pour la Boîte à idées */}
                <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
                    <h3 className="text-amber-800 font-medium mb-1">💡 Une suggestion ou un projet d'atelier ?</h3>
                    <p className="text-amber-700 text-sm mb-3">
                        Partagez vos idées directement avec l'équipe administrative de l'association.
                    </p>
                    <button className="px-4 py-2 bg-amber-600 text-white rounded text-sm font-medium hover:bg-amber-700 transition-colors">
                        Oouvrir la Boîte à idées (Bientôt disponible)
                    </button>
                </div>
            </div>
        </div>
    );
}