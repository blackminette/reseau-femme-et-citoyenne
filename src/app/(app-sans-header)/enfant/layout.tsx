// * src/app/(app-sans-header)/enfant/layout.tsx
import React from 'react';
import ChildSideMenu from '@/components/ChildSideMenu';

/**
 * DESCRIPTION :
 * Layout de l'espace enfant. App autonome (pas de header global) : la sidebar
 * occupe toute la hauteur à gauche, le contenu défile à droite.
 * Même design violet que les espaces membre et admin.
 */

export default function EnfantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-violet-50">

            {/* Barre latérale fixe à gauche, sur toute la hauteur */}
            <aside className="fixed top-0 bottom-0 left-0 z-40 w-64 overflow-y-auto border-r border-violet-200 bg-white p-5">
                <ChildSideMenu />
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
