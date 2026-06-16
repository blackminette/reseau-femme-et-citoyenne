// * src/components/MemberSideMenu.tsx
'use client';

/**
 * DESCRIPTION :
 * Barre latérale de l'espace membre (compte parent).
 * Reproduit la maquette validée : bloc marque, navigation à icônes avec
 * état actif en dégradé violet, encart d'aide et bouton de déconnexion.
 */

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

// Liens du menu : icône (emoji), libellé et destination.
const LIENS = [
    { icon: '📊', label: 'Tableau de bord', href: '/membre' },
    { icon: '👨‍👩‍👧', label: 'Mes enfants', href: '/membre/enfants' },
    { icon: '📈', label: 'Progression détaillée', href: '/membre#progression-detail' },
    { icon: '🎨', label: 'Ateliers & Réservations', href: '/membre/reserver' },
    { icon: '🗓️', label: 'Mes réservations', href: '/membre/reservations' },
    { icon: '💡', label: 'Conseils & Astuces', href: '/membre#conseils' },
    { icon: '🆘', label: 'Contact', href: '/contact' },
];

export default function MemberSideMenu() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabaseClient.auth.signOut();
        router.push('/');
    };

    return (
        <div className="flex h-full flex-col">

            {/* Bloc marque */}
            <Link href="/membre" className="flex items-center gap-3 border-b border-[#f0ecf8] pb-5 mb-4">
                <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#1a1f4e] to-[#2c3a8e] leading-none text-white">
                    <small className="text-[8px] font-semibold tracking-wider opacity-85">RFC</small>
                    <span className="text-[15px] font-extrabold">06</span>
                </div>
                <div className="leading-tight">
                    <div className="text-lg font-bold text-[#6d5ba8]">Réseau F&amp;C</div>
                    <div className="mt-0.5 text-[11px] text-slate-400">Espace parent</div>
                </div>
            </Link>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col gap-0.5">
                {LIENS.map(({ icon, label, href }) => {
                    // Lien actif : uniquement les vrais liens de page (sans ancre #...).
                    // Les ancres (#progression-detail, #conseils) ne déclenchent pas l'état actif.
                    const estAncre = href.includes('#');
                    const actif = !estAncre && (href === '/membre' ? pathname === '/membre' : pathname === href);
                    return (
                        <Link
                            key={label}
                            href={href}
                            className={
                                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ' +
                                (actif
                                    ? 'bg-gradient-to-br from-[#9b8cff] to-[#6d5ba8] font-semibold text-white shadow-[0_4px_14px_rgba(155,140,255,0.3)]'
                                    : 'text-[#6b6b7b] hover:bg-[#f4f1fb] hover:text-[#6d5ba8]')
                            }
                        >
                            <span className="w-[22px] text-center text-lg">{icon}</span>
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Encart d'aide */}
            <div className="mt-4 rounded-2xl bg-[#f4f1fb] p-4">
                <h4 className="mb-1.5 text-[13px] font-bold text-[#6d5ba8]">Besoin d&apos;aide ?</h4>
                <p className="mb-3 text-[11px] leading-relaxed text-[#7d7d8a]">
                    Consultez notre centre d&apos;aide ou contactez-nous.
                </p>
                <Link
                    href="/contact"
                    className="block w-full rounded-lg border border-[#d4cef0] bg-white py-2 text-center text-xs font-semibold text-[#6d5ba8] transition-colors hover:border-[#6d5ba8] hover:bg-[#6d5ba8] hover:text-white"
                >
                    Centre d&apos;aide
                </Link>
            </div>

            {/* Déconnexion */}
            <button
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#fff3f3] py-2.5 text-[13px] font-semibold text-[#d63031] transition-colors hover:bg-[#ffd6d6]"
            >
                🚪 Se déconnecter
            </button>
        </div>
    );
}
