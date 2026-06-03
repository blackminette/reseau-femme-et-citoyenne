// * src/app/(app-avec-header)/(dashboard)/membre/layout.tsx
import React from 'react';
import MemberSideMenu from '@/components/MemberSideMenu';

/**
 * DESCRIPTION :
 * Layout unique de l'espace membre. 
 * Il applique le menu fixe à gauche et injecte les pages à droite via {children}.
 * Utilise une marge fixe à gauche pour empêcher le contenu de se superposer sous le menu.
 */

export default function MembreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Le conteneur principal
        <div className="min-h-screen bg-slate-50">

            {/* Barre latérale fixe à gauche (Prend strictement 1/6 de la largeur) */}
            <aside className="w-1/6 fixed inset-y-16 left-0 bg-white border-r border-slate-200 z-40 p-4">
                <MemberSideMenu />
            </aside>

            {/* Zone de droite décalée de force par une marge équivalente à la largeur du menu (1/6 = 16.666667%) */}
            <main className="ml-[16.666667%] p-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>

        </div>
    );
}