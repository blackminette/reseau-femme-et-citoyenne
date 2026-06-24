// * src/app/(dashboard-enfant)/enfant/modules/page.tsx
import React from 'react';
import Link from 'next/link';
import { 
    BookOpen, Laptop, Cpu, Languages, Landmark, Leaf, 
    Sparkles, Trophy, type LucideIcon 
} from 'lucide-react';
import { ENFANT as MOCK_ENFANT, MODULES as MOCK_MODULES } from '@/lib/enfant-data';
import { obtenirProfilEnfant, obtenirModulesDepuisDB } from './actions';

export const metadata = {
    title: 'Mes modules - Espace Enfant',
    description: 'Découvre tous tes modules et progresse à ton rythme !',
};

const METADATA_MAP: Record<string, { Icon: LucideIcon; from: string; to: string; img: string }> = {
    lecture: { Icon: BookOpen, from: "#66bb6a", to: "#2e7d32", img: "/images/enfants/lecture_decouvrir.png" },
    numerique: { Icon: Laptop, from: "#42a5f5", to: "#0d47a1", img: "/images/enfants/numerique_decouvrir.png" },
    robotique: { Icon: Cpu, from: "#9b8cff", to: "#6d5ba8", img: "/images/enfants/quiz_robot.png" },
    anglais: { Icon: Languages, from: "#ec407a", to: "#880e4f", img: "/images/enfants/anglais_decouvrir.png" },
    civique: { Icon: Landmark, from: "#ffa726", to: "#e65100", img: "/images/enfants/civique_decouvrir.png" },
    eco: { Icon: Leaf, from: "#26a69a", to: "#00695c", img: "/images/enfants/eco_decouvrir.png" },
};

export default async function EnfantModulesPage() {
    const profile = await obtenirProfilEnfant();
    const modulesRes = await obtenirModulesDepuisDB();

    const enfant = profile || MOCK_ENFANT;
    const listModules = modulesRes && modulesRes.modules && modulesRes.modules.length > 0 
        ? modulesRes.modules.map(mod => {
            const slug = mod.slug || 'lecture';
            const meta = METADATA_MAP[slug] || { Icon: BookOpen, from: "#6d5ba8", to: "#5b4a98", img: "/images/enfants/lecture_decouvrir.png" };
            return {
                id: mod.id,
                label: mod.label,
                Icon: meta.Icon,
                progression: mod.progression,
                from: meta.from,
                to: meta.to,
                img: meta.img
            };
          })
        : MOCK_MODULES.map(mod => {
            const meta = METADATA_MAP[mod.id] || { Icon: BookOpen, from: "#6d5ba8", to: "#5b4a98", img: "/images/enfants/lecture_decouvrir.png" };
            return {
                ...mod,
                img: meta.img
            };
        });

    return (
        <div className="text-violet-900">
            {/* ─── Barre du haut : titre + chip enfant ─── */}
            <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                    <h1 className="flex items-center gap-2 text-[26px] font-bold tracking-tight text-violet-950">
                        <BookOpen className="h-6 w-6 text-violet-600" aria-hidden /> Mes modules
                    </h1>
                    <p className="text-[13px] text-violet-600">Choisis une matière pour t'amuser, faire des exercices et gagner des badges !</p>
                </div>
                <div className="flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 shadow-[0_2px_12px_rgba(109,91,168,0.07)]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                        {enfant.initiales}
                    </div>
                    <div className="leading-tight">
                        <div className="text-[13px] font-bold text-violet-950">{enfant.prenom} {enfant.nom}</div>
                        <div className="text-[11px] text-violet-500">{enfant.age} ans</div>
                    </div>
                </div>
            </div>

            {/* ─── En-tête d'encouragement ─── */}
            <section className="relative mt-6 overflow-hidden rounded-[20px] bg-gradient-to-br from-violet-500 to-purple-600 p-7 text-white shadow-md">
                <div className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full bg-white/[0.07]" aria-hidden />
                <div className="pointer-events-none absolute right-32 -bottom-20 h-36 w-36 rounded-full bg-white/5" aria-hidden />
                <div className="relative z-10 max-w-2xl">
                    <h2 className="mb-1 flex items-center gap-2 text-xl font-bold">
                        <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" aria-hidden /> Prêt(e) pour une nouvelle aventure ?
                    </h2>
                    <p className="text-sm opacity-90 leading-relaxed">
                        Chaque module te propose des quiz interactifs et des leçons amusantes. Termine-les pour obtenir un score de 100% et débloquer des récompenses uniques !
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold">
                        <Trophy className="h-4 w-4 text-amber-300" aria-hidden /> Tu as déjà validé {enfant.progression}% de ton parcours !
                    </div>
                </div>
            </section>

            {/* ─── Liste des modules en grille ─── */}
            <section className="mt-8 mb-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {listModules.map(({ id, label, Icon, progression, from, to, img }) => (
                        <Link
                            key={id}
                            href={`/enfant/modules/${id}`}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-300"
                        >
                            {/* Illustration Top area with module gradient background */}
                            <div 
                                className="h-44 flex items-center justify-center relative overflow-hidden transition-all group-hover:opacity-95"
                                style={{ backgroundImage: `linear-gradient(135deg, ${from}dd, ${to}dd)` }}
                            >
                                <div className="absolute top-3 left-3 h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white flex backdrop-blur-xs">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <img 
                                    src={img} 
                                    alt={label} 
                                    className="max-h-[120px] object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            {/* Label & Progress */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-base font-extrabold leading-tight text-violet-950 tracking-wide">{label}</h3>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center justify-between text-xs font-bold text-violet-500">
                                        <span>Progression</span>
                                        <span>{progression}%</span>
                                    </div>
                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div 
                                            className="h-full rounded-full transition-all duration-500" 
                                            style={{ 
                                                width: `${progression}%`,
                                                backgroundImage: `linear-gradient(90deg, ${from}, ${to})`
                                            }} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

