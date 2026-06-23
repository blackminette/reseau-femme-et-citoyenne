// * src/components/MemberMobileNav.tsx
'use client';

/**
 * DESCRIPTION :
 * En-tête mobile + tiroir latéral (drawer) pour l'espace membre.
 * Même patron que ChildMobileNav : affiché uniquement sur les écrans < md.
 */

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import MemberSideMenu from './MemberSideMenu';

export default function MemberMobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Fermer le menu quand la page change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Empêcher le défilement du fond quand le drawer est ouvert
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <div className="md:hidden">
            {/* Barre de navigation supérieure */}
            <header className="flex h-16 items-center justify-between border-b border-violet-200 bg-white px-4 shadow-xs">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                        M
                    </div>
                    <div>
                        <h2 className="text-sm font-bold leading-none text-violet-900">Espace Membre</h2>
                        <span className="mt-0.5 block text-[10px] font-medium text-violet-500">Mon compte</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors"
                    aria-label="Ouvrir le menu"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </header>

            {/* Overlay tiroir latéral */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Fond semi-transparent */}
                    <div
                        className="fixed inset-0 bg-violet-950/40 backdrop-blur-xs transition-opacity duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Contenu du tiroir */}
                    <div className="relative flex w-full max-w-[280px] flex-1 flex-col bg-white p-5 shadow-xl transition-transform duration-300 ease-in-out">
                        {/* Bouton fermer */}
                        <div className="absolute right-4 top-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-100 bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors"
                                aria-label="Fermer le menu"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="h-full overflow-y-auto pt-6">
                            <MemberSideMenu onClose={() => setIsOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
