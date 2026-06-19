'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    CalendarDays,
    LayoutDashboard,
    Rocket,
    UploadCloud,
} from 'lucide-react';

interface SidebarLinkProps {
    href: string;
    label: ReactNode;
    icon: ReactNode;
    pathname: string;
}

function isLienActif(pathname: string, href: string): boolean {
    if (href === '/intervenant') {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarLink({ href, label, icon, pathname }: SidebarLinkProps) {
    const isActive = isLienActif(pathname, href);

        return (
            <Link
                href={href}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                    ? 'bg-[#eedeff] font-semibold text-[#752fbb] shadow-[0_10px_22px_rgba(117,47,187,0.10)]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
                {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-md bg-[#752fbb]" />
                )}

                <span
                    className={`transition-colors duration-200 ${
                    isActive
                        ? 'text-[#752fbb]'
                        : 'text-slate-400 group-hover:text-slate-600'
                }`}
                >
                    {icon}
            </span>

            <span>{label}</span>
        </Link>
    );
}

export default function IntervenantSideMenu() {
    const pathname = usePathname();

    return (
        <div className="flex w-full select-none flex-col gap-6">
            <div className="flex w-full flex-col gap-1">
                <h3 className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Espace intervenant
                </h3>

                <SidebarLink
                    href="/intervenant"
                    label="Dashboard"
                    icon={<LayoutDashboard className="h-4 w-4" />}
                    pathname={pathname}
                />
            </div>

            <div className="flex w-full flex-col gap-1">
                <h3 className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Mes outils
                </h3>

                <SidebarLink
                    href="/intervenant/creneaux"
                    label={<>Cr&eacute;neaux</>}
                    icon={<CalendarDays className="h-4 w-4" />}
                    pathname={pathname}
                />

                <SidebarLink
                    href="/intervenant/animer"
                    label="Animer"
                    icon={<Rocket className="h-4 w-4" />}
                    pathname={pathname}
                />

                <SidebarLink
                    href="/intervenant/televerser"
                    label={<>T&eacute;l&eacute;verser</>}
                    icon={<UploadCloud className="h-4 w-4" />}
                    pathname={pathname}
                />
            </div>
        </div>
    );
}
