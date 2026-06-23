// * src/app/(dashboard-adultes)/(dashboard)/membre/layout.tsx

import React from 'react';
import MemberSideMenu from '@/components/MemberSideMenu';

/**
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
        // Conteneur principal (fond violet, aligné sur la console admin)
        <div className="min-h-screen bg-violet-50 flex flex-row">

            {/* Barre latérale sticky à gauche, sous le header global, jusqu'en bas */}
            <aside className="sticky top-[116px] h-[calc(100vh-116px)] z-40 w-64 shrink-0 overflow-y-auto border-r border-violet-200 bg-white p-5">
                <MemberSideMenu />
            </aside>

            {/* Zone de droite */}
            <main className="flex-1 p-8">
                <div className="mx-auto max-w-6xl">
                    {children}
                </div>
            </main>

        </div>
    );
}