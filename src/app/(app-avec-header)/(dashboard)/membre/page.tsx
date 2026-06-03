// * src/app/(dashboard)/membre/page.tsx
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

                {/* Menu */}
                <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-700 mb-4">Menu</h2>
                    <section className="space-y-3 flex flex-col">
                        <Link href="/membre/enfants" className="text-slate-600 hover:text-blue-500">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                Mes enfants
                            </button>
                        </Link>

                        <Link href="/membre/reserver" className="text-slate-600 hover:text-blue-500">
                            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                                Reserver
                            </button>
                        </Link>

                        <Link href="/membre/reservations" className="text-slate-600 hover:text-blue-500">
                            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
                                Mes réservations
                            </button>
                        </Link>
                    </section>
                </div>

            </div>
        </div>
    );
}