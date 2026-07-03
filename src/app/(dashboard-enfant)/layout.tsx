import React from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSupabaseServer } from '@/lib/supabase';
import EnfantNavbar from '@/components/EnfantNavbar';
import { deconnexionUtilisateur } from '@/app/auth/auth';
import ChildMobileNav from '@/components/ChildMobileNav';
import DynamicChildAvatar from '@/components/DynamicChildAvatar';

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
    let childAvatar = "🦊 bg-[#b6e3f4]";
    try {
        const supabase = await getSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const dbUser = await prisma.utilisateur.findUnique({
                where: { id: user.id }
            });
            if (dbUser) {
                childName = dbUser.prenom;
                if (dbUser.avatar) {
                    childAvatar = dbUser.avatar;
                }
            }
        }
    } catch (e) {
        console.warn("[EnfantLayout] Impossible de récupérer le profil utilisateur:", e);
    }

    return (
        <div className="min-h-screen bg-[#f6f8fc] flex flex-col font-sans">

            {/* ─── NAVIGATION MOBILE ─── */}
            <div className="sticky top-0 z-50 md:hidden">
                <ChildMobileNav />
            </div>

            {/* ─── BARRE DE NAVIGATION HORIZONTALE SUPÉRIEURE (DESKTOP) ─── */}
            <header className="hidden bg-white border-b border-slate-100 px-6 py-3 md:flex items-center justify-between sticky top-0 z-50 shadow-xs">
                
                {/* Logo & Brand */}
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700 font-black text-sm">
                        AK
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-indigo-950 leading-none">AtelierKids</h1>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">Plateforme Pédagogique</span>
                    </div>
                </div>

                {/* Tabs Menu Central (calqué sur la maquette) */}
                <EnfantNavbar />

                {/* Profil utilisateur & bouton Déconnexion */}
                <div className="flex items-center gap-4">
                    <DynamicChildAvatar initialName={childName} initialAvatar={childAvatar} />

                    <form action={deconnexionUtilisateur}>
                        <button
                            type="submit"
                            className="bg-[#eb5757] hover:bg-[#e04f4f] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            Déconnexion
                            <LogOut className="h-3.5 w-3.5" />
                        </button>
                    </form>
                </div>
            </header>

            {/* ─── CORPS DE LA PAGE ─── */}
            <main className="flex-grow p-4 sm:p-6 md:p-8 pb-20 md:pb-8">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>

        </div>
    );
}
