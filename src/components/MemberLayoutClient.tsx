'use client';
// * src/components/MemberLayoutClient.tsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import MemberSideMenu from '@/components/MemberSideMenu';

/** Gère la sidebar fixe (desktop) et le tiroir burger (mobile) pour l'espace membre. */
export default function MemberLayoutClient({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-violet-50">

            {/* Fond semi-transparent derrière le tiroir sur mobile */}
            {open && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 md:hidden"
                    onClick={() => setOpen(false)}
                    aria-hidden
                />
            )}

            {/* Sidebar — fixe sur desktop, tiroir depuis la gauche sur mobile */}
            <aside
                className={`fixed bottom-0 left-0 top-16 z-40 w-64 overflow-y-auto border-r border-violet-200 bg-white p-5 transition-transform duration-300 ease-in-out md:translate-x-0 ${
                    open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                }`}
            >
                <MemberSideMenu onNavigate={() => setOpen(false)} />
            </aside>

            {/* Zone de contenu */}
            <main className="md:ml-64">

                {/* Barre burger — visible uniquement sur mobile */}
                <div className="sticky top-16 z-20 flex items-center gap-3 border-b border-violet-200 bg-white px-4 py-3 md:hidden">
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        className="rounded-lg p-1.5 text-violet-600 transition-colors hover:bg-violet-50"
                        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
                        aria-expanded={open}
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                    <span className="text-sm font-semibold text-violet-900">Espace Membre</span>
                </div>

                <div className="p-4 sm:p-8">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
