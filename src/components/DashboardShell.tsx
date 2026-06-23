'use client';
// * src/components/DashboardShell.tsx
import { useState, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

/**
 * Coquille commune des espaces dashboard (membre, partenaire...).
 * - Desktop (md+) : sidebar fixe à gauche.
 * - Mobile : sidebar masquée, remplacée par un bouton burger ouvrant un tiroir
 *   glissant depuis la gauche. Le tiroir se ferme au changement de page.
 */
type Props = {
    /** Contenu de la sidebar (ex : <PartenaireSideMenu />). */
    sidebar: ReactNode;
    /** Libellé affiché à côté du burger sur mobile. */
    titre: string;
    /** true si l'espace est sous le header global (h-24) → décale d'autant. */
    sousHeader?: boolean;
    children: ReactNode;
};

export default function DashboardShell({ sidebar, titre, sousHeader = false, children }: Props) {
    const [ouvert, setOuvert] = useState(false);
    const pathname = usePathname();

    // Ferme le tiroir dès qu'on change de page.
    useEffect(() => {
        setOuvert(false);
    }, [pathname]);

    const top = sousHeader ? 'top-24' : 'top-0';

    return (
        <div className="min-h-screen bg-violet-50">

            {/* Fond semi-transparent derrière le tiroir (mobile uniquement) */}
            {ouvert && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setOuvert(false)}
                    aria-hidden
                />
            )}

            {/* Sidebar : fixe sur desktop, tiroir glissant sur mobile */}
            <aside
                className={`fixed ${top} bottom-0 left-0 z-50 w-64 overflow-y-auto border-r border-violet-200 bg-white p-5 transition-transform duration-300 ease-in-out md:z-40 md:translate-x-0 ${
                    ouvert ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                }`}
            >
                {sidebar}
            </aside>

            {/* Zone de contenu (décalée de la sidebar uniquement sur desktop) */}
            <div className="md:ml-64">

                {/* Barre burger — visible uniquement sur mobile */}
                <div className={`sticky ${top} z-30 flex items-center gap-3 border-b border-violet-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden`}>
                    <button
                        type="button"
                        onClick={() => setOuvert((o) => !o)}
                        className="rounded-lg p-1.5 text-violet-600 transition-colors hover:bg-violet-50"
                        aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
                        aria-expanded={ouvert}
                    >
                        {ouvert ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                    <span className="text-sm font-semibold text-violet-900">{titre}</span>
                </div>

                <main className="p-4 sm:p-8">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
