// * src/app/(dashboard-adultes)/(dashboard)/membre/reservations/page.tsx
'use client';

import React from 'react';

/**
 * Page listant les réservations d'ateliers associatifs publics pour les enfants rattachés au compte parent.
 * Accessible uniquement pour le rôle 'MEMBRE'.
 */

export default function MembreReservationsPage() {
    return (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
                Mes réservations d'ateliers
            </h1>
            <p className="text-slate-600 text-sm">
                Page pour voir et gérer les réservations d'ateliers associatifs publics.
            </p>
        </div>
    );
}