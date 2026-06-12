// * src/app/(app-avec-header)/(dashboard)/membre/enfants/page.tsx
'use client';

import Link from 'next/link';
import React from 'react';

/**
 * DESCRIPTION :
 * Page de l'espace membre listant les enfants rattachés au compte parent.
 * Elle se concentre uniquement sur le contenu fonctionnel.
 */

export default function MembreEnfantsPage() {
    return (
        // Conteneur de contenu simple, sans fioritures de structure globale
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <Link href="/membre/enfants/ajouter" className="text-2xl font-bold text-slate-800 mb-2 inline-block">
                <button className="mr-4 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Ajouter un enfant
                </button>
            </Link>

            <h1 className="text-2xl font-bold text-slate-800 mb-2">
                Gestion des enfants
            </h1>

            <p className="text-slate-600 text-sm">
                Page pour voir et gérer les comptes enfants rattachés à ce compte parent.
            </p>

        </div>
    );
}