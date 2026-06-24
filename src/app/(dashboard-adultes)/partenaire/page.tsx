// * src/app/(dashboard-adultes)/(dashboard)/partenaire/page.tsx
'use client';

import React from 'react';

/**
 * Page d'accueil de l'espace Entreprise Partenaire.
 * Accessible uniquement pour le rôle 'PARTENAIRE' grâce au Middleware.
 */
export default function PartenaireDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* En-tête */}
                <header className="mb-8 border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold text-slate-800">Espace Partenaire</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Gestion des réservations de locaux et planification d'ateliers privés.
                    </p>
                </header>

                {/* Section de contenu temporaire */}
                <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-700 mb-2">Bienvenue</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Cet espace vous permet de réserver des créneaux horaires pour votre entreprise.
                        Le formulaire de demande de réservation avec option de paiement (En ligne / Sur place)
                        sera intégré ici à la prochaine étape.
                    </p>

                    {/* Badge d'état informatif */}
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Rôle vérifié : Partenaire Externe
                    </div>
                </div>
            </div>
        </div>
    );
}