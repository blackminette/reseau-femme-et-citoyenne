'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, BarChart2 } from 'lucide-react';

export default function EnfantNavbar() {
    const pathname = usePathname();

    const tabs = [
        {
            href: '/enfant',
            label: 'Accueil',
            Icon: Home,
            active: pathname === '/enfant'
        },
        {
            href: '/enfant/modules',
            label: 'Mes modules',
            Icon: List,
            active: pathname.startsWith('/enfant/modules')
        },
        {
            href: '/enfant/badges',
            label: 'Mes progrès',
            Icon: BarChart2,
            active: pathname === '/enfant/badges' || pathname.startsWith('/enfant/badges')
        }
    ];

    return (
        <nav className="flex items-center gap-1 bg-[#f1f3f9] border border-slate-200/50 p-1 rounded-[16px]">
            {tabs.map((tab) => {
                const IconComp = tab.Icon;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-[12px] transition-all ${
                            tab.active
                                ? 'bg-white text-violet-700 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                        }`}
                    >
                        <IconComp className={`h-4 w-4 ${tab.active ? 'text-violet-600' : 'text-slate-400'}`} />
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}
