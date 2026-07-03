import React from 'react';
import Link from 'next/link';
import { BookOpen, Laptop, Cpu, Languages, Landmark, Leaf } from 'lucide-react';
import { ENFANT as MOCK_ENFANT } from '@/lib/enfant-data';
import { obtenirProfilEnfant, obtenirParcoursStats } from './actions';
import ParcoursGridFull from '@/components/ParcoursGridFull';

export const metadata = {
    title: 'Mes parcours - Espace Enfant',
    description: 'Découvre tous tes parcours et progresse à ton rythme !',
};

const METADATA_MAP = {
    lecture: { label: "Lecture & compréhension", from: "#66bb6a", to: "#2e7d32", img: "/images/enfants/lecture_decouvrir.png" },
    numerique: { label: "Numérique", from: "#42a5f5", to: "#0d47a1", img: "/images/enfants/numerique_decouvrir.png" },
    robotique: { label: "Robotique", from: "#9b8cff", to: "#6d5ba8", img: "/images/enfants/quiz_robot.png" },
    anglais: { label: "Anglais", from: "#ec407a", to: "#880e4f", img: "/images/enfants/anglais_decouvrir.png" },
    civique: { label: "Éducation civique", from: "#ffa726", to: "#e65100", img: "/images/enfants/civique_decouvrir.png" },
    eco: { label: "Éco-citoyenneté", from: "#26a69a", to: "#00695c", img: "/images/enfants/eco_decouvrir.png" },
};

export default async function EnfantModulesPage() {
    const profile = await obtenirProfilEnfant();
    const stats = await obtenirParcoursStats();

    const enfant = profile || MOCK_ENFANT;
    
    const listModules = Object.entries(METADATA_MAP).map(([slug, meta]) => {
        return {
            id: slug,
            label: meta.label,
            progression: stats[slug] || 0,
            from: meta.from,
            to: meta.to,
            img: meta.img
        };
    });

    return (
        <div className="text-violet-900">
            {/* ─── Barre du haut : titre ─── */}
            <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                    <h1 className="flex items-center gap-2 text-[26px] font-bold tracking-tight text-violet-950">
                        <BookOpen className="h-6 w-6 text-violet-600" aria-hidden /> Mes parcours
                    </h1>
                    <p className="text-[13px] text-violet-600">Choisis un parcours pour t'amuser, faire des exercices et gagner des badges !</p>
                </div>
            </div>

            {/* ─── En-tête d'encouragement ─── */}
            <section className="relative mt-6 overflow-hidden rounded-[20px] bg-gradient-to-br from-violet-500 to-purple-600 p-7 text-white shadow-md">
                <div className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full bg-white/[0.07]" aria-hidden />
                <div className="pointer-events-none absolute right-32 -bottom-20 h-36 w-36 rounded-full bg-white/5" aria-hidden />
                <div className="relative z-10 max-w-2xl">
                    <h2 className="mb-1 flex items-center gap-2 text-xl font-bold">
                        <span className="animate-pulse">✨</span> Prêt(e) pour une nouvelle aventure ?
                    </h2>
                    <p className="text-sm opacity-90 leading-relaxed">
                        Chaque parcours te propose des quiz interactifs et des leçons amusantes. Termine-les pour obtenir un score de 100% et débloquer des récompenses uniques !
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold">
                        <span>🏆</span> Tu as déjà validé {enfant.progression}% de ton parcours !
                    </div>
                </div>
            </section>

            {/* ─── Liste des parcours en grille ─── */}
            <section className="mt-8 mb-6">
                <ParcoursGridFull initialModules={listModules} />
            </section>
        </div>
    );
}

