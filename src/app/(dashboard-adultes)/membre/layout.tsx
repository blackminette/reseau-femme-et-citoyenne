// * src/app/(dashboard-adultes)/membre/layout.tsx

import React from 'react';
import MemberSideMenu from '@/components/MemberSideMenu';
import MemberMobileNav from '@/components/MemberMobileNav';

/**
 * Layout de l'espace membre.
 * Même design responsive que l'espace enfant : sidebar classique sur bureau,
 * barre supérieure mobile + drawer sur mobile.
 */

export default function MembreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-violet-50 flex flex-col md:flex-row">

            {/* En-tête mobile (masqué sur bureau, affiché sur mobile) */}
            <MemberMobileNav />

            {/* Barre latérale sticky à gauche, sur toute la hauteur (masquée sur mobile, affichée sur bureau) */}
            <aside className="hidden md:block sticky top-0 h-screen z-40 w-64 shrink-0 overflow-y-auto border-r border-violet-200 bg-white p-5">
                <MemberSideMenu />
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