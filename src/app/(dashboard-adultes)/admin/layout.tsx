// * src/app/(dashboard-adultes)/admin/layout.tsx

import React from 'react';
import AdminSideMenu from '@/components/AdminSideMenu';
import { deconnexionUtilisateur } from '@/app/auth/auth';

/**
 * Layout unique de l'espace admin. 
 * Il intègre la barre latérale sur toute la hauteur à gauche et gère le défilement
 * indépendant de la zone de contenu à droite.
 */

export default function MembreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-violet-50 flex">

            {/* Barre latérale fixe à gauche (Prend strictement 1/6 de la largeur) */}
            <aside className="w-1/6 fixed top-0 bottom-0 left-0 bg-white border-r border-violet-200 z-50 p-5 flex flex-col justify-between overflow-y-auto">
                <div className="flex flex-col gap-6">
                    {/* En-tête de marque / Logo du Panel Admin */}
                    <div className="px-3 py-2 border-b border-violet-100 pb-4 mb-2 flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            A
                        </div>
                        <div className="truncate">
                            <h2 className="text-sm font-bold text-violet-900 leading-none truncate">Console Admin</h2>
                            <span className="text-[10px] font-medium text-violet-500 mt-0.5 block">Gestion Espace</span>
                        </div>
                    </div>

                    {/* Menu de navigation principal */}
                    <AdminSideMenu />
                </div>

                {/* Pied de page / Bouton de déconnexion */}
                <div className="pt-4 border-t border-violet-100 mt-auto">
                    <form action={deconnexionUtilisateur}>
                        <button
                            type="submit"
                            className="w-full px-3 py-2.5 text-sm font-medium text-violet-600 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-all duration-200 flex items-center gap-3 group text-left"
                        >
                            <svg
                                className="h-4 w-4 text-violet-500 group-hover:text-amber-500 transition-colors shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="truncate">Déconnexion</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Zone de droite décalée proprement par rapport à la largeur de la sidebar fixe (1/6) */}
            <main className="w-5/6 ml-auto min-h-screen flex flex-col">

                {/* Contenu de la page de l'administration */}
                <div className="flex-1">
                    <div className="mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>

        </div>
    );
}