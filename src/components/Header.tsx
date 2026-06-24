// * src/components/Header.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { UserRole } from '@/types/auth';
import UserDropdown from './UserDropdown';
import { supabaseClient } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function Header() {
    const [role, setRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // États pour le desktop (gérés par click-outside)
    const [isProposOpen, setIsProposOpen] = useState(false);
    const [isAteliersOpen, setIsAteliersOpen] = useState(false);

    // États pour le mobile (clic direct)
    const [isProposMobileOpen, setIsProposMobileOpen] = useState(false);
    const [isAteliersMobileOpen, setIsAteliersMobileOpen] = useState(false);

    const proposRef = useRef<HTMLDivElement>(null);
    const ateliersRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            setIsLoading(true);
            const { data: { user } } = await supabaseClient.auth.getUser();

            if (user) {
                const { data: profiles } = await supabaseClient
                    .from('Utilisateur')
                    .select('role')
                    .eq('id', user.id);

                if (profiles && profiles.length > 0) {
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
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                fetchUserRole();
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    // Fermeture globale des menus
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (proposRef.current && !proposRef.current.contains(event.target as Node)) {
                setIsProposOpen(false);
            }
            if (ateliersRef.current && !ateliersRef.current.contains(event.target as Node)) {
                setIsAteliersOpen(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const closeAllMenus = () => {
        setIsMenuOpen(false);
        setIsProposOpen(false);
        setIsAteliersOpen(false);
        setIsProposMobileOpen(false);
        setIsAteliersMobileOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/70 backdrop-blur-md shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-25 items-center justify-between flex-wrap lg:flex-nowrap gap-4 py-2">
                    {/* Logo */}
                    <div className="flex shrink-0 items-center">
                        <Link href="/" onClick={closeAllMenus} className="flex items-center gap-2 transition hover:opacity-90">
                            <Image
                                src="/RFC_Logo.webp"
                                alt="Logo RFC06"
                                width={280}
                                height={94}
                                className="h-28 w-auto object-contain mt-4"
                                priority
                            />
                            <div className="flex flex-col text-[10px] sm:text-sm">
                                <span className="font-black bg-gradient-to-r from-[#260936] to-[#ffd166] bg-clip-text text-transparent uppercase tracking-tighter">
                                    Réseau Femme
                                </span>
                                <span className="font-bold text-[#260936]/70 uppercase tracking-[0.1em]">
                                    & Citoyenne 06
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Nav Links (Desktop) */}
                    <div className="hidden items-center space-x-0.5 lg:space-x-3 lg:flex whitespace-nowrap">
                        <Link href="/" className="px-2 lg:px-4 py-2 text-sm font-bold text-[#260936] transition-all hover:text-[#ffd166] hover:bg-[#260936]/5 rounded-full">Accueil</Link>

                        {/* Dropdown À propos */}
                        <div className="relative" ref={proposRef}>
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation();
                                    setIsProposOpen(!isProposOpen);
                                    setIsAteliersOpen(false);
                                }} 
                                className="px-2 lg:px-4 py-2 text-sm font-bold text-[#260936] transition-all hover:text-[#ffd166] hover:bg-[#260936]/5 rounded-full flex items-center gap-1"
                            >
                                À propos
                                <svg className={`w-3 h-3 transition-transform ${isProposOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {isProposOpen && (
                                <div className="absolute left-0 top-full w-40 bg-white rounded-xl shadow-lg py-2 border border-slate-100 z-50">
                                    <Link href="/a-propos#histoire" onClick={closeAllMenus} className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#260936]/5 hover:text-[#260936]">Histoire</Link>
                                    <Link href="/a-propos#equipe" onClick={closeAllMenus} className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#260936]/5 hover:text-[#260936]">Équipe</Link>
                                    <Link href="/a-propos#partenaires" onClick={closeAllMenus} className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#260936]/5 hover:text-[#260936]">Partenaires</Link>
                                </div>
                            )}
                        </div>

                        {/* Dropdown Ateliers */}
                        <div className="relative" ref={ateliersRef}>
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation();
                                    setIsAteliersOpen(!isAteliersOpen);
                                    setIsProposOpen(false);
                                }} 
                                className="px-2 lg:px-4 py-2 text-sm font-bold text-[#260936] transition-all hover:text-[#ffd166] hover:bg-[#260936]/5 rounded-full flex items-center gap-1"
                            >
                                Ateliers
                                <svg className={`w-3 h-3 transition-transform ${isAteliersOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {isAteliersOpen && (
                                <div className="absolute left-0 top-full w-40 bg-white rounded-xl shadow-lg py-2 border border-slate-100 z-50">
                                    <Link href="/ateliers/tous-les-ateliers" onClick={closeAllMenus} className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#260936]/5 hover:text-[#260936]">Tous les ateliers</Link>
                                    <Link href="/ateliers/planning" onClick={closeAllMenus} className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#260936]/5 hover:text-[#260936]">Planning</Link>
                                </div>
                            )}
                        </div>

                        <Link href="/actualites" className="px-2 lg:px-4 py-2 text-sm font-bold text-[#260936] transition-all hover:text-[#ffd166] hover:bg-[#260936]/5 rounded-full">Actualités</Link>
                        <Link href="/dons" className="px-2 lg:px-4 py-2 text-sm font-bold text-[#260936] transition-all hover:text-[#ffd166] hover:bg-[#260936]/5 rounded-full">Don</Link>
                        <Link href="/contact" className="px-2 lg:px-4 py-2 text-sm font-bold text-[#260936] transition-all hover:text-[#ffd166] hover:bg-[#260936]/5 rounded-full">Contact</Link>
                        
                        {!isLoading && role === 'ADMIN' && (
                            <Link href="/admin" className="ml-1 rounded-full border border-red-200 bg-red-50 px-2 lg:px-3 py-1.5 text-xs font-black text-red-700 transition hover:bg-red-100 uppercase tracking-widest">
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-1">
                        {isLoading ? (
                            <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100/50" />
                        ) : (
                            <UserDropdown role={role} />
                        )}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                            className="lg:hidden p-2 text-[#260936] hover:bg-slate-100/50 rounded-lg transition-colors"
                            aria-label="Menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu mobile animé */}
            <div
                id="mobile-menu"
                className={`grid border-t border-slate-200/50 bg-white/80 backdrop-blur-md transition-all duration-300 lg:hidden ${
                    isMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="space-y-1 px-2 pb-4 pt-3">
                        <Link href="/" onClick={closeAllMenus} className="block rounded-md px-3 py-2 text-base font-bold text-[#260936] hover:text-[#ffd166] hover:bg-[#260936]/5 transition-colors">Accueil</Link>
                        
                        {/* Mobile À propos */}
                        <div>
                            <button onClick={() => setIsProposMobileOpen(!isProposMobileOpen)} className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-bold text-[#260936] hover:text-[#ffd166] hover:bg-[#260936]/5 transition-colors">
                                À propos <span>{isProposMobileOpen ? '-' : '+'}</span>
                            </button>
                            <div className={`grid transition-all duration-300 ease-in-out ${isProposMobileOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <div className="pl-6 space-y-1 pb-2">
                                        <Link href="/a-propos#histoire" onClick={closeAllMenus} className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:text-[#260936]">Histoire</Link>
                                        <Link href="/a-propos#equipe" onClick={closeAllMenus} className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:text-[#260936]">Équipe</Link>
                                        <Link href="/a-propos#partenaires" onClick={closeAllMenus} className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:text-[#260936]">Partenaires</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Ateliers */}
                        <div>
                            <button onClick={() => setIsAteliersMobileOpen(!isAteliersMobileOpen)} className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-bold text-[#260936] hover:text-[#ffd166] hover:bg-[#260936]/5 transition-colors">
                                Ateliers <span>{isAteliersMobileOpen ? '-' : '+'}</span>
                            </button>
                            <div className={`grid transition-all duration-300 ease-in-out ${isAteliersMobileOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <div className="pl-6 space-y-1 pb-2">
                                        <Link href="/ateliers/tous-les-ateliers" onClick={closeAllMenus} className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:text-[#260936]">Tous les ateliers</Link>
                                        <Link href="/ateliers/planning" onClick={closeAllMenus} className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:text-[#260936]">Planning</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/actualites" onClick={closeAllMenus} className="block rounded-md px-3 py-2 text-base font-bold text-[#260936] hover:text-[#ffd166] hover:bg-[#260936]/5 transition-colors">Actualités</Link>
                        <Link href="/dons" onClick={closeAllMenus} className="block rounded-md px-3 py-2 text-base font-bold text-[#260936] hover:text-[#ffd166] hover:bg-[#260936]/5 transition-colors">Don</Link>
                        <Link href="/contact" onClick={closeAllMenus} className="block rounded-md px-3 py-2 text-base font-bold text-[#260936] hover:text-[#ffd166] hover:bg-[#260936]/5 transition-colors">Contact</Link>
                        
                        {!isLoading && role === 'ADMIN' && (
                            <Link href="/admin" onClick={closeAllMenus} className="mt-4 block rounded-full border border-red-200 bg-red-50 px-3 py-2 text-center text-sm font-black text-red-700 uppercase">
                                Admin
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
