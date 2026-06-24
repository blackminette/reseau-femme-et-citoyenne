// * src/app/(dashboard-enfant)/layout.tsx
import React from 'react';
import ChildSideMenu from '@/components/ChildSideMenu';
import ChildMobileNav from '@/components/ChildMobileNav';

/**
 * DESCRIPTION :
 * Layout de l'espace enfant. App autonome (pas de header global) : la sidebar
 * occupe toute la hauteur à gauche, le contenu défile à droite.
 * Même design violet que les espaces membre et admin.
 * Version responsive : barre supérieure mobile + drawer, sidebar classique sur bureau.
 */

export default function EnfantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-violet-50 flex flex-col md:flex-row">

            {/* En-tête mobile (masqué sur bureau, affiché sur mobile) */}
            <ChildMobileNav />

            {/* Barre latérale sticky à gauche, sur toute la hauteur (masquée sur mobile, affichée sur bureau) */}
            <aside className="hidden md:block sticky top-0 h-screen z-40 w-64 shrink-0 overflow-y-auto border-r border-violet-200 bg-white p-5">
                <ChildSideMenu />
            </aside>

            {/* Zone de droite */}
            <main className="flex-grow p-4 sm:p-6 md:p-8">
                <div className="mx-auto max-w-6xl">
                    {children}
                </div>
            </main>

        </div>
    );
}
