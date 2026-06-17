// * src/components/AdminSideMenu.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { deconnexionUtilisateur } from '@/app/auth/auth';
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    GraduationCap,
    Inbox,
    ClipboardCheck,
    ChevronRight,
    LogOut
} from 'lucide-react';

interface SidebarLinkProps {
    href: string;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
}

export default function AdminSideMenu() {
    const pathname = usePathname();

    // Composant interne pour factoriser le style des liens et gérer l'état actif
    const SidebarLink = ({ href, label, icon, badge }: SidebarLinkProps) => {
        const isActive = pathname === href;

        return (
            <Link
                href={href}
                className={`group w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-between relative ${isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
            >
                {/* Indicateur de bordure gauche pour l'onglet actif */}
                {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-indigo-600 rounded-r-md" />
                )}

                <div className="flex items-center gap-3">
                    <span className={`transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}>
                        {icon}
                    </span>
                    <span>{label}</span>
                </div>

                {/* Gestion optionnelle des badges (ex: messages non lus, réservations pending) */}
                {badge ? (
                    <span className={`text-xxs px-2 py-0.5 rounded-full font-bold transition-colors ${isActive ? 'bg-indigo-200/60 text-indigo-700' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}>
                        {badge}
                    </span>
                ) : (
                    <ChevronRight className={`h-3.5 w-3.5 transition-all opacity-0 -translate-x-1 ${isActive ? 'opacity-0' : 'group-hover:opacity-100 group-hover:translate-x-0 text-slate-400'
                        }`} />
                )}
            </Link>
        );
    };

    return (
        <div className="w-full flex flex-col gap-6 select-none">

            <div className="px-3 py-2 border-b border-violet-100 pb-4 mb-2 flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    A
                </div>
                <div className="truncate">
                    <h2 className="text-sm font-bold text-violet-900 leading-none truncate">Console Admin</h2>
                    <span className="text-[10px] font-medium text-violet-500 mt-0.5 block">Gestion Espace</span>
                </div>
            </div>

            {/* SECTION 1 : VUE D'ENSEMBLE */}
            <div className="flex flex-col gap-1 w-full">
                <h3 className="text-xxs font-bold uppercase tracking-widest text-slate-400 mb-1 px-3">
                    Vue d'ensemble
                </h3>
                <SidebarLink
                    href="/admin"
                    label="Tableau de bord"
                    icon={<LayoutDashboard className="h-4 w-4" />}
                />
            </div>

            {/* SECTION 2 : ACTIVITÉS & VENTES */}
            <div className="flex flex-col gap-1 w-full">
                <h3 className="text-xxs font-bold uppercase tracking-widest text-slate-400 mb-1 px-3">
                    Gestion des activités
                </h3>
                <SidebarLink
                    href="/admin/reservations"
                    label="Réservations"
                    icon={<ClipboardCheck className="h-4 w-4" />}
                // Optionnel : Tu pourras lier ce badge à un état global ou un context plus tard
                // badge="PENDING" 
                />
                <SidebarLink
                    href="/admin/ateliers"
                    label="Planning & Ateliers"
                    icon={<CalendarDays className="h-4 w-4" />}
                />
                <SidebarLink
                    href="/admin/pedagogie"
                    label="Pédagogie & Cours"
                    icon={<GraduationCap className="h-4 w-4" />}
                />
            </div>

            {/* SECTION 3 : RELATIONS HUMAINES */}
            <div className="flex flex-col gap-1 w-full">
                <h3 className="text-xxs font-bold uppercase tracking-widest text-slate-400 mb-1 px-3">
                    Membres & Échanges
                </h3>
                <SidebarLink
                    href="/admin/membres"
                    label="Membres & Familles"
                    icon={<Users className="h-4 w-4" />}
                />
                <SidebarLink
                    href="/admin/messagerie"
                    label="Messagerie"
                    icon={<Inbox className="h-4 w-4" />}
                />
            </div>

            <div className="pt-4 border-t border-violet-100 mt-auto">
                <form action={deconnexionUtilisateur}>
                    <button
                        type="submit"
                        className="w-full px-3 py-2.5 text-sm font-medium text-violet-600 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-all duration-200 flex items-center gap-3 group text-left"
                    >
                        <LogOut className="h-4 w-4 text-violet-500 group-hover:text-amber-500 transition-colors shrink-0" />
                        <span className="truncate">Déconnexion</span>
                    </button>
                </form>
            </div>
        </div>
    );
}