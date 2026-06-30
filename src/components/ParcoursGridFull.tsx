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
    label: string;
    progression: number;
    from: string;
    to: string;
    img: string;
}

interface ParcoursGridFullProps {
    initialModules: ParcoursMeta[];
}

export default function ParcoursGridFull({ initialModules }: ParcoursGridFullProps) {
    const [modules, setModules] = useState<ParcoursMeta[]>(initialModules);

    useEffect(() => {
        async function hydrateRealProgress() {
            try {
                const dbRes = await obtenirModulesDepuisDB();
                if (dbRes && dbRes.source === 'db' && dbRes.modules) {
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

                    setModules((prev) => prev.map((m) => {
                        const progressInfo = parcoursProgress[m.id];
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
                console.error(err);
            }
        }

        hydrateRealProgress();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map(({ id, label, progression, from, to, img }) => {
                const Icon = ICON_MAP[id] || HelpCircle;
                return (
                    <Link
                        key={id}
                        href={`/enfant/modules/${id}`}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-300"
                    >
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
                );
            })}
        </div>
    );
}
