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

                const { data: profile, error: dbError } = await supabaseClient
                    .from('Utilisateur')
                    .select('role')
                    .eq('email', user.email)
                    .single();

                if (dbError) {
                    console.error('[Header] Erreur BDD (Table Utilisateur) :', dbError.message);
                    setRole(null);
                } else if (profile) {
                    setRole(profile.role as UserRole);
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
                        <Link href="/" className="flex items-center gap-2 transition hover:opacity-90">
                            <Image
                                src="/logo.ico"
                                alt="Logo RFC06"
                                width={256}
                                height={256}
                                className="h-24 w-24"
                            />
                        </Link>
                    </div>

                    {/* Liens de navigation centraux : cachés sur mobile, visibles à partir de md */}
                    <div className="hidden items-center space-x-4 md:flex">
                        <Link
                            href="/"
                            className="px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                        >
                            Accueil
                        </Link>

                        <Link
                            href="/a-propos"
                            className="px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                        >
                            À propos
                        </Link>

                        <Link
                            href="/ateliers"
                            className="px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                        >
                            Ateliers
                        </Link>

                        <Link
                            href="/actualites"
                            className="px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                        >
                            Actualités
                        </Link>

                        {!isLoading && role === 'ADMIN' && (
                            <Link
                                href="/admin"
                                className="rounded-md border border-red-200 bg-red-50/80 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                            >
                                Console Admin
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

                        {/* Bouton burger animé : les trois barres se transforment progressivement en croix */}
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((open) => !open)}
                            className={`group relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-slate-100/50 hover:text-slate-900 active:scale-90 focus:outline-none focus:ring-2 focus:ring-slate-300 md:hidden motion-reduce:transition-none ${
                                isMenuOpen ? 'bg-slate-100/50 shadow-inner' : ''
                            }`}
                            aria-label={isMenuOpen ? 'Fermer le menu principal' : 'Ouvrir le menu principal'}
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">
                                {isMenuOpen ? 'Fermer le menu principal' : 'Ouvrir le menu principal'}
                            </span>

                            {/* Barre du haut */}
                            <span
                                aria-hidden="true"
                                className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
                                    isMenuOpen
                                        ? 'translate-y-0 rotate-45'
                                        : '-translate-y-2 rotate-0 group-hover:-translate-y-2.5'
                                }`}
                            />

                            {/* Barre du milieu */}
                            <span
                                aria-hidden="true"
                                className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-200 ease-out motion-reduce:transition-none ${
                                    isMenuOpen
                                        ? 'scale-x-0 opacity-0'
                                        : 'scale-x-100 opacity-100'
                                }`}
                            />

                            {/* Barre du bas */}
                            <span
                                aria-hidden="true"
                                className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
                                    isMenuOpen
                                        ? 'translate-y-0 -rotate-45'
                                        : 'translate-y-2 rotate-0 group-hover:translate-y-2.5'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu mobile animé : il reste dans le DOM et se déplie doucement */}
            <div
                id="mobile-menu"
                aria-hidden={!isMenuOpen}
                className={`grid border-t border-slate-200/50 bg-white/80 shadow-sm backdrop-blur-md transition-[grid-template-rows,opacity,transform] duration-420ms ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden motion-reduce:transition-none ${
                    isMenuOpen
                        ? 'grid-rows-[1fr] translate-y-0 opacity-100'
                        : 'pointer-events-none grid-rows-[0fr] -translate-y-1 opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="space-y-1 px-2 pb-4 pt-3 sm:px-3">
                        <Link
                            href="/"
                            onClick={closeMenu}
                            tabIndex={isMenuOpen ? 0 : -1}
                            className={`block rounded-md px-3 py-2 text-base font-medium text-slate-600 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-1 hover:bg-slate-50 hover:text-slate-900 motion-reduce:transition-none ${
                                isMenuOpen
                                    ? 'translate-x-0 opacity-100 delay-75'
                                    : '-translate-x-2 opacity-0 delay-0'
                            }`}
                        >
                            Accueil
                        </Link>

                        <Link
                            href="/a-propos"
                            onClick={closeMenu}
                            tabIndex={isMenuOpen ? 0 : -1}
                            className={`block rounded-md px-3 py-2 text-base font-medium text-slate-600 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-1 hover:bg-slate-50 hover:text-slate-900 motion-reduce:transition-none ${
                                isMenuOpen
                                    ? 'translate-x-0 opacity-100 delay-100'
                                    : '-translate-x-2 opacity-0 delay-0'
                            }`}
                        >
                            À propos
                        </Link>

                        <Link
                            href="/ateliers"
                            onClick={closeMenu}
                            tabIndex={isMenuOpen ? 0 : -1}
                            className={`block rounded-md px-3 py-2 text-base font-medium text-slate-600 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-1 hover:bg-slate-50 hover:text-slate-900 motion-reduce:transition-none ${
                                isMenuOpen
                                    ? 'translate-x-0 opacity-100 delay-150'
                                    : '-translate-x-2 opacity-0 delay-0'
                            }`}
                        >
                            Ateliers
                        </Link>

                        <Link
                            href="/actualites"
                            onClick={closeMenu}
                            tabIndex={isMenuOpen ? 0 : -1}
                            className={`block rounded-md px-3 py-2 text-base font-medium text-slate-600 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-1 hover:bg-slate-50 hover:text-slate-900 motion-reduce:transition-none ${
                                isMenuOpen
                                    ? 'translate-x-0 opacity-100 delay-200'
                                    : '-translate-x-2 opacity-0 delay-0'
                            }`}
                        >
                            Actualités
                        </Link>

                        {!isLoading && role === 'ADMIN' && (
                            <Link
                                href="/admin"
                                onClick={closeMenu}
                                tabIndex={isMenuOpen ? 0 : -1}
                                className={`mt-4 block rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-base font-medium text-red-700 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-1 hover:bg-red-100 motion-reduce:transition-none ${
                                    isMenuOpen
                                        ? 'translate-x-0 opacity-100 delay-300'
                                        : '-translate-x-2 opacity-0 delay-0'
                                }`}
                            >
                                Console Admin
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}