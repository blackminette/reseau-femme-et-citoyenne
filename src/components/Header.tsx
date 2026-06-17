// * src/components/Header.tsx
'use client';

/**
    Barre de navigation principale (Header) visible sur tout le site.
    Elle détecte la session Supabase en temps réel, récupère le rôle de l'utilisateur
    dans la base de données Prisma, et adapte les liens ainsi que le menu déroulant.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserRole } from '@/types/auth';
import UserDropdown from './UserDropdown';
import { supabaseClient } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function Header() {
    const [role, setRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            setIsLoading(true);
            console.log('[Header] Vérification de la session Supabase...');

            const {
                data: { user },
                error: authError,
            } = await supabaseClient.auth.getUser();

            if (authError && authError.message !== 'Auth session missing!') {
                console.error('[Header] Erreur Auth Supabase :', authError.message);
            }

            if (user) {
                console.log('[Header] Utilisateur connecté trouvé dans Supabase :', user.email);

                const { data: profiles, error: dbError } = await supabaseClient
                    .from('Utilisateur')
                    .select('role')
                    .eq('id', user.id);

                if (dbError) {
                    console.error('[Header] Erreur BDD (Table Utilisateur) :', dbError.message);
                    setRole(null);
                } else if (profiles && profiles.length > 0) {
                    setRole(profiles[0].role as UserRole);
                } else {
                    setRole(null);
                }
            } else {
                setRole(null);
            }

            setIsLoading(false);
        };

        fetchUserRole();

        const {
            data: { subscription },
        } = supabaseClient.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                fetchUserRole();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Ferme le menu mobile après un clic sur un lien.
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/70 backdrop-blur-md shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-24 items-center justify-between">
                    {/* Logo de l'association */}
                    <div className="flex shrink-0 items-center">
                        <Link href="/" className="flex items-center gap-3 transition hover:opacity-90 group">
                            <Image
                                src="/logo.ico"
                                alt="Logo RFC06"
                                width={256}
                                height={256}
                                className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                            />
                            <div className="hidden flex-col lg:flex">
                                <span className="text-xl font-black leading-none bg-gradient-to-r from-[#260936] to-[#ffd166] bg-clip-text text-transparent uppercase tracking-tighter">
                                    Réseau Femme
                                </span>
                                <span className="text-sm font-bold leading-none text-[#260936]/70 uppercase tracking-[0.2em] ml-0.5">
                                    & Citoyenne
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Liens de navigation centraux : cachés sur mobile, visibles à partir de md */}
                    <div className="hidden items-center space-x-1 md:flex">
                        <Link
                            href="/"
                            className="px-4 py-2 text-sm font-bold text-[#260936] transition-all hover:text-[#ffd166] hover:bg-[#260936]/5 rounded-full"
                        >
                            Accueil
                        </Link>

                        <Link
                            href="/a-propos"
                            className="px-4 py-2 text-sm font-bold text-[#260936] transition-all hover:text-[#ffd166] hover:bg-[#260936]/5 rounded-full"
                        >
                            À propos
                        </Link>

                        <Link
                            href="/ateliers"
                            className="px-4 py-2 text-sm font-bold text-[#260936] transition-all hover:text-[#ffd166] hover:bg-[#260936]/5 rounded-full"
                        >
                            Ateliers
                        </Link>

                        <Link
                            href="/actualites"
                            className="px-4 py-2 text-sm font-bold text-[#260936] transition-all hover:text-[#ffd166] hover:bg-[#260936]/5 rounded-full"
                        >
                            Actualités
                        </Link>

                        {!isLoading && role === 'ADMIN' && (
                            <Link
                                href="/admin"
                                className="ml-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-black text-red-700 transition hover:bg-red-100 uppercase tracking-widest"
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Section droite : profil + bouton burger mobile */}
                    <div className="flex items-center gap-3">
                        {isLoading ? (
                            <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100/50" />
                        ) : (
                            <UserDropdown role={role} />
                        )}

                        {/* Bouton burger animé */}
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((open) => !open)}
                            className={`group relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-slate-100/50 hover:text-slate-900 active:scale-90 focus:outline-none focus:ring-2 focus:ring-slate-300 md:hidden ${
                                isMenuOpen ? 'bg-slate-100/50 shadow-inner' : ''
                            }`}
                            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                        >
                            <span className="sr-only">{isMenuOpen ? 'Fermer' : 'Ouvrir'}</span>
                            <span className={`absolute h-0.5 w-6 rounded-full bg-current transition-all ${isMenuOpen ? 'rotate-45' : '-translate-y-2'}`} />
                            <span className={`absolute h-0.5 w-6 rounded-full bg-current transition-all ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                            <span className={`absolute h-0.5 w-6 rounded-full bg-current transition-all ${isMenuOpen ? '-rotate-45' : 'translate-y-2'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu mobile animé */}
            <div
                id="mobile-menu"
                className={`grid border-t border-slate-200/50 bg-white/80 backdrop-blur-md transition-all duration-300 md:hidden ${
                    isMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="space-y-1 px-2 pb-4 pt-3">
                        <Link
                            href="/"
                            onClick={closeMenu}
                            className="block rounded-md px-3 py-2 text-base font-bold text-[#260936] hover:text-[#ffd166] hover:bg-[#260936]/5 transition-colors"
                        >
                            Accueil
                        </Link>
                        <Link
                            href="/a-propos"
                            onClick={closeMenu}
                            className="block rounded-md px-3 py-2 text-base font-bold text-[#260936] hover:text-[#ffd166] hover:bg-[#260936]/5 transition-colors"
                        >
                            À propos
                        </Link>
                        <Link
                            href="/ateliers"
                            onClick={closeMenu}
                            className="block rounded-md px-3 py-2 text-base font-bold text-[#260936] hover:text-[#ffd166] hover:bg-[#260936]/5 transition-colors"
                        >
                            Ateliers
                        </Link>
                        <Link
                            href="/actualites"
                            onClick={closeMenu}
                            className="block rounded-md px-3 py-2 text-base font-bold text-[#260936] hover:text-[#ffd166] hover:bg-[#260936]/5 transition-colors"
                        >
                            Actualités
                        </Link>
                        {!isLoading && role === 'ADMIN' && (
                            <Link
                                href="/admin"
                                onClick={closeMenu}
                                className="mt-4 block rounded-full border border-red-200 bg-red-50 px-3 py-2 text-center text-sm font-black text-red-700 uppercase"
                            >
                                Admin
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
