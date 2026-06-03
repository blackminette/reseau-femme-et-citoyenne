// * src/components/UserDropdown.tsx
'use client';

/**
 Menu déroulant (Dropdown) affiché dans le Header pour la gestion du compte.
 Il affiche les options de connexion/inscription si l'utilisateur est anonyme,
 ou le lien vers son tableau de bord et la déconnexion selon son rôle s'il est connecté.
 Gère automatiquement la fermeture lors d'un clic à l'extérieur.
 */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UserRole } from '@/types/auth';
import { supabaseClient } from '@/lib/supabaseClient';

interface UserDropdownProps {
    role: UserRole | null;
}

export default function UserDropdown({ role }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Ferme le menu si on clique en dehors du composant
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Déconnexion de la session Supabase
    const handleLogout = async () => {
        await supabaseClient.auth.signOut();
        setIsOpen(false);
    };

    return (
        // Conteneur principal en position relative pour caler la boîte déroulante
        <div className="relative inline-block text-left" ref={dropdownRef}>

            {/* Bouton déclencheur du menu */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 whitespace-nowrap"
            >
                <span>{role ? 'Mon Compte' : 'Menu'}</span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Fenêtre déroulante alignée et étendue vers la gauche */}
            {isOpen && (
                <div
                    className="absolute right-0 text-left bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50"
                    style={{
                        position: 'absolute',
                        right: '0px',
                        left: 'auto',
                        width: '12rem',
                        textAlign: 'left'
                    }}
                >
                    {role ? (
                        /* OPTIONS SI CONNECTÉ */
                        <>
                            <div style={{ padding: '8px 16px', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>
                                {role.toLowerCase()}
                            </div>
                            <Link
                                href={`/${role.toLowerCase()}`}
                                onClick={() => setIsOpen(false)}
                                style={{ display: 'block', padding: '8px 16px', fontSize: '14px', color: '#334155', textDecoration: 'none' }}
                            >
                                Mon Tableau de bord
                            </Link>
                            <Link
                                href="/"
                                onClick={handleLogout}
                                style={{ width: '100%', textAlign: 'left', display: 'block', padding: '8px 16px', fontSize: '14px', color: '#dc2626', background: 'none', border: 'none', borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}
                            >
                                Déconnexion
                            </Link>
                        </>
                    ) : (
                        /* OPTIONS SI NON CONNECTÉ */
                        <>
                            <div style={{ padding: '8px 16px', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>
                                Authentification
                            </div>
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                style={{ display: 'block', padding: '8px 16px', fontSize: '14px', color: '#334155', textDecoration: 'none' }}
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setIsOpen(false)}
                                style={{ display: 'block', padding: '8px 16px', fontSize: '14px', color: '#334155', textDecoration: 'none' }}
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