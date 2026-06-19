// * src/app/(app-sans-header)/enfant/badges/page.tsx
import { Award, Check, Lock } from "lucide-react";
import { BADGES } from "@/lib/enfant-data";
import EnfantHeader from "@/components/EnfantHeader";
import HeroBanner from "@/components/HeroBanner";

export const metadata = {
    title: "Mes badges",
    description: "Collectionne tous les badges en réussissant des activités.",
};

export default function EnfantBadgesPage() {
    const total = BADGES.length;
    const nbEarned = BADGES.filter((b) => b.obtenu).length;
    const pct = Math.round((nbEarned / total) * 100);

    return (
        <div className="text-violet-900">

            {/* ─── Barre du haut : titre + chip enfant ─── */}
            <EnfantHeader
                Icon={Award}
                titre="Mes badges"
                sousTitre="Collectionne-les tous en réussissant des activités !"
            />

            {/* ─── Bannière progression collection ─── */}
            <HeroBanner>
                <div className="relative flex-1">
                    <h2 className="mb-1 text-[26px] font-bold">{nbEarned} badge{nbEarned > 1 ? "s" : ""} sur {total}</h2>
                    <p className="text-sm opacity-90">Continue tes quiz et exercices pour débloquer de nouveaux badges !</p>
                </div>
                <div className="relative z-10 min-w-[220px] rounded-2xl bg-white/15 p-4 backdrop-blur">
                    <div className="mb-2 text-[11px] font-medium opacity-90">Collection complétée</div>
                    <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/25">
                            <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="text-lg font-extrabold">{pct}%</div>
                    </div>
                </div>
            </HeroBanner>

            {/* ─── Grille des badges ─── */}
            <section className="mt-8 mb-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {BADGES.map(({ label, Icon, desc, obtenu, progress }) => {
                    const progPct = progress ? Math.round((progress.cur / progress.max) * 100) : 0;
                    return (
                        <div
                            key={label}
                            className={`relative flex flex-col items-center overflow-hidden rounded-2xl border-2 p-6 text-center shadow-xs ${
                                obtenu ? "border-violet-300 bg-gradient-to-b from-white to-violet-50" : "border-violet-100 bg-white"
                            }`}
                        >
                            {/* Ruban "OBTENU" pour les badges débloqués */}
                            {obtenu && (
                                <div className="absolute -right-9 top-3.5 rotate-45 bg-emerald-500 px-9 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                    Obtenu
                                </div>
                            )}

                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${obtenu ? "bg-amber-50 text-amber-500" : "bg-slate-50 text-slate-300"}`}>
                                <Icon className="h-8 w-8" aria-hidden />
                            </div>

                            <div className={`mt-3 text-[17px] font-extrabold ${obtenu ? "text-violet-950" : "text-slate-500"}`}>{label}</div>
                            <div className="mt-1.5 min-h-[36px] text-[12.5px] leading-snug text-violet-500">{desc}</div>

                            {obtenu ? (
                                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600">
                                    <Check className="h-3.5 w-3.5" aria-hidden /> Débloqué
                                </span>
                            ) : (
                                <div className="mt-3 w-full">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-violet-500">
                                        <Lock className="h-3.5 w-3.5" aria-hidden /> À débloquer
                                    </span>
                                    {progress && (
                                        <>
                                            <div className="mt-3 h-[7px] overflow-hidden rounded-full bg-violet-100">
                                                <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600" style={{ width: `${progPct}%` }} />
                                            </div>
                                            <div className="mt-1.5 text-[11px] text-violet-400">{progress.txt}</div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </section>
        </div>
    );
}
