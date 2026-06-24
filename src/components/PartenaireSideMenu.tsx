'use client';
// * src/components/PartenaireSideMenu.tsx

/**
 * Barre latérale de l'espace partenaire.
 * Même langage visuel que les sidebars membre et admin : marque, navigation
 * sectionnée avec état actif (fond indigo + barre latérale), chevron au survol
 * et déconnexion. Palette violette, icônes lucide-react.
 */

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    ClipboardList,
    CalendarPlus,
    MessagesSquare,
    CalendarDays,
    Globe,
    ChevronRight,
    LogOut,
    type LucideIcon,
} from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';
import { MESSAGES_NON_LUS } from '@/lib/partenaire-data';

type Lien = { href: string; label: string; Icon: LucideIcon; badge?: number };

const SECTIONS: { titre: string; liens: Lien[] }[] = [
    {
        titre: "Vue d'ensemble",
        liens: [{ href: '/partenaire', label: 'Accueil', Icon: LayoutDashboard }],
    },
    {
        titre: 'Mes réservations',
        liens: [
            { href: '/partenaire/ateliers', label: 'Mes demandes', Icon: ClipboardList },
            { href: '/partenaire/ateliers/ajouter', label: 'Nouvelle demande', Icon: CalendarPlus },
            { href: '/partenaire/planning', label: 'Voir le planning', Icon: CalendarDays },
        ],
    },
    {
        titre: 'Échanges',
        liens: [
            { href: '/partenaire/messagerie', label: 'Messages', Icon: MessagesSquare, badge: MESSAGES_NON_LUS },
        ],
    },
    {
        titre: 'Navigation',
        liens: [{ href: '/', label: 'Voir le site', Icon: Globe }],
    },
];

export default function PartenaireSideMenu() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabaseClient.auth.signOut();
        router.push('/');
    };

    return (
        <div className="flex h-full flex-col select-none">

            {/* Marque */}
            <div className="mb-2 flex items-center gap-2.5 border-b border-violet-100 px-3 pb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                    P
                </div>
                <div className="truncate">
                    <h2 className="truncate text-sm font-bold leading-none text-violet-900">Espace Partenaire</h2>
                    <span className="mt-0.5 block text-[10px] font-medium text-violet-500">Compte partenaire</span>
                </div>
            </div>

            {/* Navigation sectionnée */}
            <nav className="flex flex-1 flex-col gap-6">
                {SECTIONS.map((section) => (
                    <div key={section.titre} className="flex w-full flex-col gap-1">
                        <h3 className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {section.titre}
                        </h3>
                        {section.liens.map(({ href, label, Icon, badge }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? 'bg-indigo-50 font-semibold text-indigo-600'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-md bg-indigo-600" />
                                    )}
                                    <div className="flex items-center gap-3">
                                        <span className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}>
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <span>{label}</span>
                                    </div>
                                    {badge ? (
                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                            isActive ? 'bg-indigo-200/60 text-indigo-700' : 'bg-violet-100 text-violet-600'
                                        }`}>
                                            {badge}
                                        </span>
                                    ) : (
                                        <ChevronRight
                                            className={`h-3.5 w-3.5 -translate-x-1 text-slate-400 opacity-0 transition-all ${
                                                isActive ? '' : 'group-hover:translate-x-0 group-hover:opacity-100'
                                            }`}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Déconnexion */}
            <div className="mt-auto border-t border-violet-100 pt-4">
                <button
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-violet-600 transition-all duration-200 hover:bg-amber-50 hover:text-amber-600"
                >
                    <LogOut className="h-4 w-4 shrink-0 text-violet-500 transition-colors group-hover:text-amber-500" />
                    <span className="truncate">Se déconnecter</span>
                </button>
            </div>
        </div>
    );
}
