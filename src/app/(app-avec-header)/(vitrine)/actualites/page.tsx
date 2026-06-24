// * src/app/(app-avec-header)/actualites/page.tsx
import React from 'react';

/**
 * Page dynamique "Actualités" de l'application.
 * Accessible à tous les utilisateurs, même non authentifiés.
 * Contient les actualités de l'association.
 */

export default function ActualitesPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Actualités</h1>
            <p className="text-gray-700 text-lg">
                Bienvenue sur la page des actualités !
            </p>
        </div>
    );
}
