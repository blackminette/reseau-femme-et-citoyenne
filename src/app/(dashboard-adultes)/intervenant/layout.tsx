import React from 'react';
import Link from 'next/link';
import { deconnexionUtilisateur } from '@/app/auth/auth';
import IntervenantSideMenu from '@/components/IntervenantSideMenu';
import { BadgeCheck, LogOut, Sparkles } from 'lucide-react';

export default function IntervenantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-[9999] flex h-screen flex-col overflow-hidden bg-[#f7f1ff] text-slate-900">
            <header className="flex h-[60px] shrink-0 items-center border-b border-[#eedeff] bg-white px-8 text-[17px] shadow-sm">
                <div className="flex w-[120px] items-center gap-2 text-[20px] font-bold tracking-tight text-[#752fbb]">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#eedeff] text-[#752fbb]">
                        <Sparkles className="h-4 w-4" />
                    </span>
                    LOGO
                </div>

                <nav className="flex flex-1 items-center justify-center gap-10">
                    <Link href="/" className="font-medium text-slate-600 hover:text-[#752fbb]">
                        Accueil
                    </Link>

                    <Link href="/ateliers" className="font-medium text-slate-600 hover:text-[#752fbb]">
                        Nos Ateliers
                    </Link>

                    <Link href="/actualites" className="font-medium text-slate-600 hover:text-[#752fbb]">
                        Actualit&eacute;s
                    </Link>

                    <Link href="/a-propos" className="font-medium text-slate-600 hover:text-[#752fbb]">
                        A propos
                    </Link>

                    <Link href="/don" className="font-medium text-slate-600 hover:text-[#752fbb]">
                        Don
                    </Link>

                    <Link href="/contact" className="font-medium text-slate-600 hover:text-[#752fbb]">
                        Contact
                    </Link>
                </nav>

                <div className="flex w-[220px] justify-center">
                    <div className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-xl border border-[#eedeff] bg-[#fdfbff] px-4 py-2 text-center text-sm font-semibold text-[#752fbb] shadow-sm">
                        <BadgeCheck className="h-4 w-4 text-[#bc96e6]" />
                        Compte Intervenant
                    </div>
                </div>
            </header>

            <div className="flex min-h-0 flex-1">
                <aside className="flex w-1/6 shrink-0 flex-col justify-between border-r border-[#eedeff] bg-white p-5">
                    <div className="flex flex-col gap-6">
                        <div className="mb-2 flex items-center gap-2.5 border-b border-[#f0e4ff] px-3 py-2 pb-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#752fbb] text-sm font-bold text-white shadow-[0_10px_18px_rgba(117,47,187,0.22)]">
                                I
                            </div>

                            <div className="truncate">
                                <h2 className="truncate text-sm font-bold leading-none text-[#260936]">
                                    Espace intervenant
                                </h2>
                                <span className="mt-0.5 block text-[10px] font-medium text-[#bc96e6]">
                                    Animation et suivi
                                </span>
                            </div>
                        </div>

                        <IntervenantSideMenu />
                    </div>

                    <div className="mt-auto border-t border-[#f0e4ff] pt-4">
                        <form action={deconnexionUtilisateur}>
                            <button
                                type="submit"
                                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-[#eedeff] hover:text-[#752fbb]"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="truncate">D&eacute;connexion</span>
                            </button>
                        </form>
                    </div>
                </aside>

                <main className="min-w-0 flex-1 overflow-y-auto bg-[#f7f1ff] px-8 py-7">
                    {children}
                </main>
            </div>

            <footer className="flex h-[40px] shrink-0 items-center bg-[#eedeff] px-14 text-[12px] text-[#260936]">
                <div className="w-[170px] text-[16px] font-bold text-[#752fbb]">
                    LOGO
                </div>

                <div className="flex flex-1 items-center justify-around">
                    <span>{"Conditions d'utilisation"}</span>
                    <span>Mentions l&eacute;gales</span>
                    <span>Coordonn&eacute;es association</span>
                </div>

                <div className="w-[86px] rounded-full bg-white px-2 py-1 text-center text-[9px] font-semibold text-[#bc96e6]">
                    R&eacute;seaux
                </div>
            </footer>
        </div>
    );
}
