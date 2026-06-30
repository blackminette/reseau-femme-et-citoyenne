'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Laptop, Cpu, Languages, Landmark, Leaf, HelpCircle } from "lucide-react";
import { obtenirModulesDepuisDB, obtenirDetailsModuleDepuisDB } from '@/app/(dashboard-enfant)/enfant/modules/actions';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    lecture: BookOpen,
    numerique: Laptop,
    robotique: Cpu,
    anglais: Languages,
    civique: Landmark,
    eco: Leaf
};

interface ParcoursMeta {
    id: string;
    slug: string;
    label: string;
    progression: number;
    from: string;
    to: string;
}

interface ParcoursGridProps {
    initialModules: Omit<ParcoursMeta, 'Icon'>[];
}

export default function ParcoursGrid({ initialModules }: ParcoursGridProps) {
    const [modules, setModules] = useState<Omit<ParcoursMeta, 'Icon'>[]>(initialModules);

    useEffect(() => {
        async function hydrateRealProgress() {
            try {
                const dbRes = await obtenirModulesDepuisDB();
                if (dbRes && dbRes.source === 'db' && dbRes.modules) {
                    // Group database modules by their parcours slug
                    const parcoursProgress: Record<string, { total: number; completed: number }> = {
                        lecture: { total: 0, completed: 0 },
                        numerique: { total: 0, completed: 0 },
                        robotique: { total: 0, completed: 0 },
                        anglais: { total: 0, completed: 0 },
                        civique: { total: 0, completed: 0 },
                        eco: { total: 0, completed: 0 }
                    };

                    // For each module, check its activities and check localStorage
                    for (const mod of dbRes.modules as any[]) {
                        const slug = mod.slug || 'lecture';
                        const actIds = mod.activiteIds || [];
                        if (parcoursProgress[slug] && actIds.length > 0) {
                            parcoursProgress[slug].total += actIds.length;
                            for (const actId of actIds) {
                                const saved = localStorage.getItem(`rfc_enfant_act_${actId}`);
                                if (saved) {
                                    const parsed = JSON.parse(saved);
                                    if (parsed?.completed) {
                                        parcoursProgress[slug].completed++;
                                    }
                                }
                            }
                        }
                    }

                    // Update modules state with calculated progression
                    setModules((prev) => prev.map((m) => {
                        const progressInfo = parcoursProgress[m.slug];
                        if (progressInfo && progressInfo.total > 0) {
                            return {
                                ...m,
                                progression: Math.round((progressInfo.completed / progressInfo.total) * 100)
                            };
                        }
                        return m;
                    }));
                }
            } catch (err) {
                console.error("Error hydrating parcours stats:", err);
            }
        }

        hydrateRealProgress();
    }, []);

    return (
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            {modules.map(({ id, slug, label, progression, from, to }) => {
                const IconComponent = ICON_MAP[slug] || HelpCircle;
                return (
                    <Link
                        href={`/enfant/modules/${slug || id}`}
                        key={id}
                        className="flex flex-col justify-between rounded-2xl p-5 text-white shadow-[0_4px_16px_rgba(109,91,168,0.12)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-violet-300"
                        style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
                    >
                        <div>
                            <IconComponent className="h-7 w-7" aria-hidden />
                            <div className="mt-3 text-sm font-bold leading-tight">{label}</div>
                        </div>
                        <div className="mt-6">
                            <div className="text-2xl font-extrabold">{progression}%</div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/30">
                                <div className="h-full rounded-full bg-white" style={{ width: `${progression}%` }} />
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
