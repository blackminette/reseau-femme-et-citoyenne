// * src/app/(dashboard-adultes)/membre/modules/page.tsx
import React from 'react';
import Link from 'next/link';
import { BookOpen, Laptop, Cpu, Languages, Landmark, Leaf, ArrowLeft } from "lucide-react";
import { obtenirModulesAdulteDepuisDB } from "../actions";

export const metadata = {
    title: "Mes modules",
    description: "Explorez vos modules d'apprentissage et suivez votre progression.",
};

const METADATA_MAP: Record<string, { Icon: React.ComponentType<{ className?: string }>; from: string; to: string }> = {
    lecture: { Icon: BookOpen, from: "#66bb6a", to: "#2e7d32" },
    numerique: { Icon: Laptop, from: "#42a5f5", to: "#0d47a1" },
    robotique: { Icon: Cpu, from: "#9b8cff", to: "#6d5ba8" },
    anglais: { Icon: Languages, from: "#ec407a", to: "#880e4f" },
    civique: { Icon: Landmark, from: "#ffa726", to: "#e65100" },
    eco: { Icon: Leaf, from: "#26a69a", to: "#00695c" },
    communication: { Icon: BookOpen, from: "#7c4dff", to: "#4a148c" },
    juridique: { Icon: Landmark, from: "#ff7043", to: "#bf360c" },
};

export default async function ModulesAdultePage() {
    const modulesRes = await obtenirModulesAdulteDepuisDB();

    const listModules = modulesRes && modulesRes.modules && modulesRes.modules.length > 0
        ? modulesRes.modules.map(mod => {
            const meta = METADATA_MAP[mod.slug as keyof typeof METADATA_MAP] || { Icon: BookOpen, from: "#6d5ba8", to: "#5b4a98" };
            return { ...mod, Icon: meta.Icon, from: meta.from, to: meta.to };
          })
        : [];

    return (
        <div className="text-violet-900">

            {/* Retour au dashboard */}
            <Link
                href="/membre"
                className="group mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 transition-colors hover:text-violet-800"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Retour au tableau de bord
            </Link>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-violet-950">
                Mes modules
            </h1>
            <p className="mt-1 text-sm text-violet-600 mb-6">
                Explorez vos modules d&apos;apprentissage et suivez votre progression.
            </p>

            {listModules.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {listModules.map(({ id, label, Icon, progression, from, to }) => (
                        <Link
                            href={`/membre/modules/${id}`}
                            key={id}
                            className="flex flex-col justify-between rounded-2xl p-6 text-white shadow-[0_4px_16px_rgba(109,91,168,0.12)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-violet-300 min-h-[160px]"
                            style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
                        >
                            <div>
                                <Icon className="h-8 w-8" aria-hidden />
                                <div className="mt-3 text-base font-bold leading-tight">{label}</div>
                            </div>
                            <div className="mt-6">
                                <div className="text-3xl font-extrabold">{progression}%</div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/30">
                                    <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${progression}%` }} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 bg-white p-16 text-center">
                    <BookOpen className="h-12 w-12 text-violet-300 animate-pulse" />
                    <h3 className="mt-4 text-lg font-bold text-violet-950">Aucun module disponible</h3>
                    <p className="mt-2 max-w-sm text-sm text-violet-500">
                        Les modules pour adultes seront bientôt disponibles. Revenez plus tard !
                    </p>
                </div>
            )}
        </div>
    );
}
