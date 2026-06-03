// * src/app/(app-avec-header)/(dashboard)/membre/enfants/ajouter/page.tsx
'use client';

import React from 'react';

/**
 * Page de l'espace membre listant les enfants rattachés au compte parent.
 * Elle se concentre uniquement sur le contenu fonctionnel.
 */

export default function MembreEnfantsAjouterPage() {
    return (
        // Conteneur de contenu simple, sans fioritures de structure globale
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
                Ajouter un enfant
            </h1>

            <p className="text-slate-600 text-sm">
                Page pour ajouter un enfant rattaché à ce compte parent.
            </p>

        </div>
    );
}