// * src/app/(dashboard-adultes)/layout.tsx
import React from 'react';
import Header from '@/components/Header';

/**
 * Layout spécifique pour l'espace Dashboard et l'accueil.
 * Il englobe toutes les pages enfants avec le Header commun.
 */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Notre composant Header s'affichera tout en haut */}
            <Header />

            {/* Le contenu de la page (/partenaire, /membre, etc.) s'injecte ici */}
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}