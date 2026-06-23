import React from 'react';
import Link from 'next/link';
import IntervenantSideMenu from '@/components/IntervenantSideMenu';
import { deconnexionUtilisateur } from '@/app/auth/auth';
import { BadgeCheck, LogOut, Menu, Sparkles, X } from 'lucide-react';

export default function IntervenantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f7f1ff] text-slate-900">
            <header className="sticky top-0 z-40 shrink-0 border-b border-[#eedeff] bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link href="/intervenant" className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eedeff] text-[#752fbb] shadow-sm">
                            <Sparkles className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                            <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-[#bc96e6]">
                                Espace intervenant
                            </span>
                            <span className="block text-base font-black leading-tight text-[#260936]">
                                Animation et suivi
                            </span>
                        </span>
                    </Link>

                    <div className="hidden items-center gap-3 md:flex">
                        <div className="inline-flex items-center gap-2 rounded-xl border border-[#eedeff] bg-[#fdfbff] px-4 py-2 text-sm font-semibold text-[#752fbb] shadow-sm">
                            <BadgeCheck className="h-4 w-4 text-[#bc96e6]" />
                            Compte Intervenant
                        </div>

                        <form action={deconnexionUtilisateur}>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-[#f7f1ff] hover:text-[#752fbb]"
                            >
                                <LogOut className="h-4 w-4" />
                                Déconnexion
                            </button>
                        </form>
                    </div>

                    <details className="group relative md:hidden">
                        <summary
                            className="list-none inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-[#eedeff] bg-white text-[#752fbb] shadow-sm transition hover:bg-[#f7f1ff]"
                            aria-label="Ouvrir le menu"
                        >
                            <Menu className="h-5 w-5 group-open:hidden" />
                            <X className="hidden h-5 w-5 group-open:block" />
                        </summary>

                        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(86vw,320px)] overflow-hidden rounded-[28px] border border-[#eedeff] bg-white shadow-[0_24px_60px_rgba(38,9,54,0.18)]">
                            <div className="px-5 py-5">
                                <div className="flex items-center gap-3 border-b border-[#f0e4ff] pb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#752fbb] text-sm font-bold text-white shadow-[0_10px_18px_rgba(117,47,187,0.22)]">
                                        I
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-[#260936]">Espace intervenant</p>
                                        <p className="text-[11px] font-medium text-[#bc96e6]">Animation et suivi</p>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <IntervenantSideMenu />
                                </div>

                                <div className="mt-6 border-t border-[#f0e4ff] pt-4">
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fdfbff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#752fbb]">
                                        <BadgeCheck className="h-3.5 w-3.5 text-[#bc96e6]" />
                                        Compte actif
                                    </div>

                                    <form action={deconnexionUtilisateur}>
                                        <button
                                            type="submit"
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#752fbb] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(117,47,187,0.18)] transition hover:bg-[#6427a1]"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Déconnexion
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </details>
                </div>
            </header>

            <div className="flex min-h-0 flex-1">
                <aside className="hidden w-[280px] shrink-0 border-r border-[#eedeff] bg-white px-5 py-6 shadow-[0_18px_40px_rgba(117,47,187,0.06)] md:flex md:flex-col">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 border-b border-[#f0e4ff] pb-5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#752fbb] text-sm font-bold text-white shadow-[0_10px_18px_rgba(117,47,187,0.22)]">
                                I
                            </div>

                            <div className="min-w-0">
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
                                <span className="truncate">Déconnexion</span>
                            </button>
                        </form>
                    </div>
                </aside>

                <main className="min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
                    {children}
                </main>
            </div>

            <footer className="hidden h-[40px] shrink-0 items-center bg-[#eedeff] px-14 text-[12px] text-[#260936] md:flex">
                <div className="w-[170px] text-[16px] font-bold text-[#752fbb]">
                    LOGO
                </div>

                <div className="flex flex-1 items-center justify-around">
                    <span>{"Conditions d'utilisation"}</span>
                    <span>Mentions légales</span>
                    <span>Coordonnées association</span>
                </div>

                <div className="w-[86px] rounded-full bg-white px-2 py-1 text-center text-[9px] font-semibold text-[#bc96e6]">
                    Réseaux
                </div>
            </footer>
        </div>
    );
}
