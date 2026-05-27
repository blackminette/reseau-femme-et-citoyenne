// * src/components/Header.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserRole } from '@/types/auth';
import UserDropdown from './UserDropdown';
import { supabaseClient } from '@/lib/supabaseClient'; // Import du client browser

/**
 * Composant Header Global et Dynamique.
 * Adapte ses boutons de navigation en fonction du rôle de l'utilisateur.
 */
export default function Header() {
    // États pour stocker le rôle et le chargement
    const [role, setRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fonction pour récupérer l'utilisateur et son rôle en BDD
        const fetchUserRole = async () => {
            setIsLoading(true);
            const { data: { user } } = await supabaseClient.auth.getUser();

            if (user && user.email) {
                // Requête client pour récupérer le rôle dans la table Prisma
                const { data: profile, error } = await supabaseClient
                    .from('Utilisateur')
                    .select('role')
                    .eq('email', user.email)
                    .single();

                if (!error && profile) {
                    setRole(profile.role as UserRole);
                } else {
                    setRole(null);
                }
            } else {
                setRole(null);
            }
            setIsLoading(false);
        };

        fetchUserRole();

        // Écouter les événements d'authentification (Connexion / Déconnexion)
        // Permet de rafraîchir le header instantanément sans recharger la page
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                fetchUserRole();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

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

                    {/* Liens de navigation centraux */}
                    <div className="flex sm:space-x-4 items-center">
                        <Link href="/" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium">
                            Accueil
                        </Link>

                        {/* Onglets pour l'ADMIN */}
                        {!isLoading && role === 'ADMIN' && (
                            <>
                                <Link href="/admin" className="bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm font-medium border border-red-200">
                                    Console Admin
                                </Link>
                                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Mode : Admin</span>
                            </>
                        )}
                    </div>

                    {/* Section Profil / Connexion (à droite) */}
                    <div className="flex items-center">
                        {isLoading ? (
                            // Petit indicateur discret pendant le chargement de la session
                            <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
                        ) : role ? (
                            <div className="flex items-center gap-3">
                                {/* Menu déroulant avec le rôle dynamique */}
                                <UserDropdown role={role} />
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