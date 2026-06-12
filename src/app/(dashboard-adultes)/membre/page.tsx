// * src/app/(dashboard-adultes)/(dashboard)/membre/page.tsx
'use client';

import Link from 'next/link';
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
                        Suivi des enfants et inscriptions aux ateliers associatifs publics.
                    </p>
                </header>

                {/* Section Principale */}
                <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mb-6">
                    <h2 className="text-lg font-semibold text-slate-700 mb-2">Tableau de bord</h2>
                    <p className="text-slate-600 text-sm">
                        Retrouvez ici la gestion de votre profil et le suivi pédagogique de vos enfants rattachés.
                    </p>
                </div>
            </div>
        </div>
    );
}