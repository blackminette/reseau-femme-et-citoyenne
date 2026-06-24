// * src/app/(dashboard-enfant)/layout.tsx
import React from 'react';
import Link from 'next/link';
import { BookOpen, TrendingUp, Home } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSupabaseServer } from '@/lib/supabase';

export const metadata = {
    title: 'AtelierKids - Espace Enfant',
    description: 'Plateforme Pédagogique AtelierKids',
};

export default async function EnfantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Récupérer le prénom de l'enfant connecté
    let childName = "Alex";
    try {
        const supabase = await getSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const dbUser = await prisma.utilisateur.findUnique({
                where: { id: user.id }
            });
            if (dbUser) {
                childName = dbUser.prenom;
            }
        }
    } catch (e) {
        console.warn("[EnfantLayout] Impossible de récupérer le profil utilisateur:", e);
    }

    return (
        <div className="min-h-screen bg-[#f6f8fc] flex flex-col font-sans">
            
            {/* ─── BARRE DE NAVIGATION HORIZONTALE SUPÉRIEURE (HEADER) ─── */}
            <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-xs">
                
                {/* Logo & Brand */}
                <div className="flex items-center gap-3">
                    <div className="bg-[#0b132b] text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm">
                        <span className="text-[10px] uppercase font-black tracking-wider opacity-75">Vitrine</span>
                        <span className="font-extrabold text-indigo-400 text-xs">RFC 06</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-indigo-950 leading-none">AtelierKids</h1>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 block">Plateforme Pédagogique</span>
                    </div>
                </div>

                {/* Tabs Menu Central (calqué sur la maquette) */}
                <nav className="flex items-center gap-2 md:gap-4">
                    <Link 
                        href="/enfant" 
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-black text-slate-500 hover:text-violet-600 rounded-xl hover:bg-slate-50 transition-all"
                    >
                        <Home className="h-4 w-4" /> Accueil
                    </Link>
                    <Link 
                        href="/enfant/modules" 
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-black text-slate-500 hover:text-violet-600 rounded-xl hover:bg-slate-50 transition-all"
                    >
                        <BookOpen className="h-4 w-4" /> Mes modules
                    </Link>
                    <Link 
                        href="/enfant#progres" 
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-black text-slate-500 hover:text-violet-600 rounded-xl hover:bg-slate-50 transition-all"
                    >
                        <TrendingUp className="h-4 w-4" /> Mes progrès
                    </Link>
                </nav>

                {/* Profil utilisateur & bouton Déconnexion */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 border border-orange-200">
                            👦
                        </div>
                        <div className="text-left hidden sm:block">
                            <div className="text-[9px] text-slate-400 font-bold leading-none">Bonjour !</div>
                            <div className="text-xs font-extrabold text-slate-800 mt-0.5">{childName}</div>
                        </div>
                    </div>

                    <Link 
                        href="/api/auth/signout" 
                        prefetch={false}
                        className="bg-[#e63946] hover:bg-[#d90429] text-white px-4 py-2 rounded-xl text-xs font-black shadow-xs hover:shadow-md transition-all"
                    >
                        Déconnexion
                    </Link>
                </div>
            </header>

            {/* ─── CORPS DE LA PAGE ─── */}
            <main className="flex-grow p-4 sm:p-6 md:p-8">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>

        </div>
    );
}
