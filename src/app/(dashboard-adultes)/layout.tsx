// * src/app/(app-avec-header)/(dashboard)/layout.tsx
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
        <div className="flex flex-col min-h-screen bg-[#eedeff]">
            {/* Notre composant Header s'affichera tout en haut */}
            <Header />

            {/* Le contenu de la page (/partenaire, /membre, etc.) s'injecte ici */}
            <main className="grow">
                {children}
            </main>
            {/* Notre composant Footer s'affichera tout en bas */}
            <Footer />
        </div>
    );
}
