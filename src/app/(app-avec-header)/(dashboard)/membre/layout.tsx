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
        // Le conteneur principal (fond légèrement violacé, comme la maquette)
        <div className="min-h-screen bg-[#f8f6fc]">

            {/* Barre latérale fixe à gauche, sous le header global (h-16), jusqu'en bas */}
            <aside className="fixed top-16 bottom-0 left-0 z-40 w-64 overflow-y-auto border-r border-[#ece7f5] bg-white p-5">
                <MemberSideMenu />
            </aside>

            {/* Zone de droite décalée de la largeur du menu (w-64 = 16rem) */}
            <main className="ml-64 p-8">
                <div className="mx-auto max-w-6xl">
                    {children}
                </div>
            </main>

        </div>
    );
}