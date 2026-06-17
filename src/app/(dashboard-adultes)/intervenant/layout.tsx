import React from 'react';
import Link from 'next/link';
import { deconnexionUtilisateur } from '@/app/auth/auth';
import IntervenantSideMenu from '@/components/IntervenantSideMenu';

export default function IntervenantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-[9999] flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900">
            <header className="flex h-[54px] shrink-0 items-center border-b border-slate-200 bg-white px-8 text-[17px] shadow-sm">
                <div className="w-[120px] text-[20px] font-bold tracking-tight text-slate-900">
                    LOGO
                </div>

                <nav className="flex flex-1 items-center justify-center gap-10">
                    <Link href="/" className="font-medium text-slate-600 hover:text-indigo-600">
                        Accueil
                    </Link>

                    <Link href="/ateliers" className="font-medium text-slate-600 hover:text-indigo-600">
                        Nos Ateliers
                    </Link>

                    <Link href="/actualites" className="font-medium text-slate-600 hover:text-indigo-600">
                        Actualit&eacute;s
                    </Link>

                    <Link href="/a-propos" className="font-medium text-slate-600 hover:text-indigo-600">
                        A propos
                    </Link>

                    <Link href="/don" className="font-medium text-slate-600 hover:text-indigo-600">
                        Don
                    </Link>

                    <Link href="/contact" className="font-medium text-slate-600 hover:text-indigo-600">
                        Contact
                    </Link>
                </nav>

                <div className="flex w-[220px] justify-center">
                    <div className="inline-flex min-w-[180px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 shadow-sm">
                        Compte Intervenant
                    </div>
                </div>
            </header>

            <div className="flex min-h-0 flex-1">
                <aside className="flex w-1/6 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-5">
                    <div className="flex flex-col gap-6">
                        <div className="mb-2 flex items-center gap-2.5 border-b border-slate-100 px-3 py-2 pb-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                                I
                            </div>

                            <div className="truncate">
                                <h2 className="truncate text-sm font-bold leading-none text-slate-800">
                                    Espace intervenant
                                </h2>
                                <span className="mt-0.5 block text-[10px] font-medium text-slate-400">
                                    Animation et suivi
                                </span>
                            </div>
                        </div>

                        <IntervenantSideMenu />
                    </div>

                    <div className="mt-auto border-t border-slate-100 pt-4">
                        <form action={deconnexionUtilisateur}>
                            <button
                                type="submit"
                                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600"
                            >
                                <span className="truncate">D&eacute;connexion</span>
                            </button>
                        </form>
                    </div>
                </aside>

                <main className="min-w-0 flex-1 overflow-y-auto bg-slate-50 px-8 py-7">
                    {children}
                </main>
            </div>

            <footer className="flex h-[40px] shrink-0 items-center bg-slate-200 px-14 text-[12px] text-slate-700">
                <div className="w-[170px] text-[16px] font-bold text-slate-900">
                    LOGO
                </div>

                <div className="flex flex-1 items-center justify-around">
                    <span>{"Conditions d'utilisation"}</span>
                    <span>Mentions l&eacute;gales</span>
                    <span>Coordonn&eacute;es association</span>
                </div>

                <div className="w-[86px] rounded-full bg-white px-2 py-1 text-center text-[9px] font-semibold text-slate-500">
                    R&eacute;seaux
                </div>
            </footer>
        </div>
    );
}
