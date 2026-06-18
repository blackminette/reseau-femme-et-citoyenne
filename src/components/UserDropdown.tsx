// * src/components/UserDropdown.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Router utilise pour securiser la redirection
import { UserRole } from '@/types/auth';
import { supabaseClient } from '@/lib/supabaseClient';

interface UserDropdownProps {
    role: UserRole | null;
}

export default function UserDropdown({ role }: UserDropdownProps) {
    const roleNormalise = role?.toUpperCase();

    const dashboardHref =
        roleNormalise === 'ADMIN'
            ? '/admin'
            : roleNormalise === 'MEMBRE'
              ? '/membre'
              : roleNormalise === 'ENFANT'
                ? '/enfant'
                : roleNormalise === 'PARTENAIRE'
                  ? '/partenaire'
                  : roleNormalise === 'BENEVOLE'
                    ? '/benevole'
                    : roleNormalise === 'INTERVENANT' || roleNormalise === 'INTERVENANTE'
                      ? '/intervenant'
                      : '/accueil';
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter(); // Instanciation du router

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        // On attend que Supabase confirme la deconnexion avant de rediriger
        await supabaseClient.auth.signOut();
        setIsOpen(false);
        router.push('/'); // Redirection apres destruction de la session
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>

            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 whitespace-nowrap"
            >
                <span>{role ? 'Mon Compte' : 'Profil'}</span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 origin-top-right"
                    role="menu"
                >
                    {role ? (
                        <>
                            <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                                {role}
                            </div>
                            <Link
                                href={dashboardHref}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                role="menuitem"
                            >
                                Mon Tableau de bord
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                                role="menuitem"
                            >
                                DECONNEXION
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                                Authentification
                            </div>
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                role="menuitem"
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                role="menuitem"
                            >
                                Inscription
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
