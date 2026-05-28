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

export default function Header() {
    const [role, setRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Récupère l'utilisateur Supabase puis son rôle en BDD
        const fetchUserRole = async () => {
            setIsLoading(true);
            console.log("[Header] Vérification de la session Supabase...");

            const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

            if (authError) {
                console.error("[Header] Erreur Auth Supabase :", authError.message);
            }

            if (user) {
                console.log("[Header] Utilisateur connecté trouvé dans Supabase :", user.email);

                // Récupération du profil utilisateur (Prisma) via Supabase
                const { data: profile, error: dbError } = await supabaseClient
                    .from('Utilisateur')
                    .select('role')
                    .eq('email', user.email)
                    .single();

                if (dbError) {
                    console.error("[Header] Erreur BDD (Table Utilisateur) :", dbError.message);
                    console.log("[Header] Conseil : Vérifie si ton adresse email existe bien dans ta table Utilisateur sur Supabase !");
                    setRole(null);
                } else if (profile) {
                    console.log("[Header] Rôle trouvé en BDD :", profile.role);
                    setRole(profile.role as UserRole);
                }
            } else {
                console.log("[Header] Aucun utilisateur connecté (session vide).");
                setRole(null);
            }
            setIsLoading(false);
        };

        // Lancement au chargement du composant
        fetchUserRole();

        // Écouteur en temps réel pour capter les connexions, déconnexions et mises à jour
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                fetchUserRole();
            }
        });

        // Nettoyage de l'écouteur à la destruction du composant
        return () => subscription.unsubscribe();
    }, []);

    return (
        <nav className="bg-white border-b border-slate-200 w-full sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo de l'association */}
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

                        {/* Onglet sécurisé : visible uniquement pour les administrateurs connectés */}
                        {!isLoading && role === 'ADMIN' && (
                            <Link href="/admin" className="bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm font-medium border border-red-200">
                                Console Admin
                            </Link>
                        )}
                    </div>

                    {/* Section Profil, Connexion & Menu déroulant (Droite) */}
                    <div className="flex items-center gap-3">
                        {isLoading ? (
                            // Squelette de chargement (Animation pulse)
                            <div className="w-24 h-9 bg-slate-100 rounded-lg animate-pulse" />
                        ) : (
                            // Menu déroulant dynamique avec injection du rôle actuel
                            <UserDropdown role={role} />
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}