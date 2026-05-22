// * src/components/UserDropdown.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { UserRole } from '@/types/auth';

interface UserDropdownProps {
    role: UserRole;
}

export default function UserDropdown({ role }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Le "Ref" permet d'identifier notre menu déroulant dans la page
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Détecter un clic en dehors du menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false); // Ferme le menu si on clique en dehors
            }
        }

        document.addEventListener('mousedown', handleClickOutside); // On écoute les clics sur tout le document

        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Nettoyage de l'écouteur lors du démontage du composant
        };
    }, [isOpen]);

    return (
        // On attache la Ref sur le conteneur principal
        <div className="relative inline-block text-left" ref={dropdownRef}>

            {/* Bouton déclencheur */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center w-full rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <span>Mon Profil ({role})</span>
                <svg className="ml-2 -mr-1 h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Le Menu Déroulant */}
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-slate-100 focus:outline-none z-50">

                    {/* Section Liens d'actions */}
                    <div className="py-1">
                        <Link
                            href={role === 'ADMIN' ? '/admin' : `/${role.toLowerCase()}`}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Mon Tableau de bord
                        </Link>
                        <Link
                            href="/parametres"
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Paramètres
                        </Link>
                    </div>

                    {/* Section Déconnexion */}
                    <div className="py-1">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                alert('Déconnexion simulée');
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 font-medium"
                        >
                            Se déconnecter
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}