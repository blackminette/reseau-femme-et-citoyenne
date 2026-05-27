// * src/components/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { UserRole } from '@/types/auth';
import UserDropdown from './UserDropdown';

/**
 * Composant Header Global et Dynamique.
 * Adapte ses boutons de navigation en fonction du rôle de l'utilisateur.
 */
export default function Header() {

    const fakeRole: UserRole | null = 'ADMIN'; // <-- Changez ici pour simuler différents rôles

    return (
        <nav className="bg-white border-b border-slate-200 w-full sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo / Nom de l'asso */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-xl font-bold text-indigo-600 tracking-tight hover:opacity-90">
                            🤝 MonAsso
                        </Link>
                    </div>

                    <div className="flex sm:space-x-4 items-center">
                        <Link href="/" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">
                            Accueil
                        </Link>

                        <Link href="/a-propos" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">
                            À propos
                        </Link>

                        <Link href="/ateliers" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">
                            Ateliers
                        </Link>

                        <Link href='/actualites' className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">
                            Actualités
                        </Link>

                        {/* Onglets pour l'ADMIN */}
                        {/* {fakeRole === 'ADMIN' && (
                            <>
                                <Link href="/admin" className="bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm font-medium border border-red-200">
                                    Console Admin
                                </Link>
                                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Mode : Dieu</span>
                            </>
                        )} */}

                        {/* Onglets pour le PARTENAIRE */}
                        {fakeRole === 'PARTENAIRE' && (
                            <>
                                <Link href="/partenaire" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">
                                    Réserver un créneau
                                </Link>
                                <Link href="/partenaire/factures" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">
                                    Mes Factures
                                </Link>
                            </>
                        )}

                        {/* Onglets pour le MEMBRE */}
                        {fakeRole === 'MEMBRE' && (
                            <>
                                <Link href="/membre" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">
                                    Ma Famille
                                </Link>
                                <Link href="/membre" className="text-amber-700 bg-amber-50 px-3 py-2 rounded-md text-sm font-medium border border-amber-200">
                                    💡 Boîte à idées
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="flex items-center">
                        {fakeRole ? (
                            <div className="flex items-center gap-3">
                                {/* On appelle notre menu déroulant ici en lui passant le rôle */}
                                <UserDropdown role={fakeRole} />
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/signup"
                                    className="ml-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Inscription
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}