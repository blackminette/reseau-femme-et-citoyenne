// * src/app/(app-sans-header)/enfant/page.tsx
import { ENFANT, MODULES, BADGES, DERNIER_BADGE, RESULTATS, ACTIVITE } from "@/lib/enfant-data";
import EnfantHeader from "@/components/EnfantHeader";
import HeroBanner from "@/components/HeroBanner";
import EmojiBadge, { TONE_CYCLE, type Tone } from "@/components/EmojiBadge";

export const metadata = {
    title: "Mon espace",
    description: "Suis ta progression, tes modules et tes badges.",
};

export default function EnfantDashboard() {
    // Statistiques dérivées des données (cohérentes avec les autres pages).
    const nbBadgesObtenus = BADGES.filter((b) => b.obtenu).length;
    const nbModulesCommences = MODULES.filter((m) => m.progression > 0).length;
    const nbQuizParfaits = RESULTATS.filter((r) => r.parfait).length;

    // 4 cartes de stats (emoji coloré + chiffre + libellé).
    const STATS: { emoji: string; tone: Tone; valeur: string; label: string; sous: string }[] = [
        { emoji: "📚", tone: "blue", valeur: `${nbModulesCommences}`, label: "Modules commencés", sous: `sur ${MODULES.length} disponibles` },
        { emoji: "📈", tone: "green", valeur: `${ENFANT.progression}%`, label: "Progression globale", sous: "Continue comme ça !" },
        { emoji: "⭐", tone: "violet", valeur: `${nbQuizParfaits}`, label: "Quiz parfaits", sous: `${RESULTATS.length} quiz réalisés` },
        { emoji: "🏆", tone: "amber", valeur: `${nbBadgesObtenus}`, label: "Badges obtenus", sous: `sur ${BADGES.length} à débloquer` },
    ];

    return (
        <div className="text-violet-900">

            {/* ─── Barre du haut : titre + chip enfant ─── */}
            <EnfantHeader
                titre={`Bonjour ${ENFANT.prenom} !`}
                sousTitre={`Tu as ${ENFANT.age} ans — continue comme ça, tu fais des progrès incroyables !`}
            />

            {/* ─── Mission du jour ─── */}
            <HeroBanner>
                <div className="relative flex-1">
                    <h2 className="mb-1 flex items-center gap-2.5 text-[26px] font-bold">
                        <span className="text-3xl leading-none" aria-hidden>🎯</span>
                        Mission du jour
                    </h2>
                    <p className="text-sm opacity-90">Termine une activité dans un module et continue à progresser !</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold">
                        <span aria-hidden>🏅</span> {nbBadgesObtenus} badge{nbBadgesObtenus > 1 ? "s" : ""} obtenu{nbBadgesObtenus > 1 ? "s" : ""}
                    </div>
                </div>
                <div className="relative z-10 min-w-[220px] rounded-2xl bg-white/15 p-4 backdrop-blur">
                    <div className="mb-2 text-[11px] font-medium opacity-90">Progression globale</div>
                    <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/25">
                            <div className="h-full rounded-full bg-white" style={{ width: `${ENFANT.progression}%` }} />
                        </div>
                        <div className="text-lg font-extrabold">{ENFANT.progression}%</div>
                    </div>
                </div>
            </HeroBanner>

            {/* ─── Cartes de stats (emoji coloré + chiffre) ─── */}
            <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {STATS.map(({ emoji, tone, valeur, label, sous }) => (
                    <div key={label} className="group flex items-center gap-4 rounded-2xl border border-violet-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-md">
                        <EmojiBadge emoji={emoji} tone={tone} size="lg" />
                        <div className="min-w-0">
                            <div className="text-2xl font-extrabold tracking-tight text-violet-950">{valeur}</div>
                            <div className="truncate text-[13px] font-semibold text-violet-700">{label}</div>
                            <div className="truncate text-[11px] text-violet-400">{sous}</div>
                        </div>
                    </div>
                ))}
            </section>

            {/* ─── Mes modules ─── */}
            <section id="modules" className="mt-8 scroll-mt-6">
                <h3 className="text-lg font-semibold tracking-tight text-violet-800">Mes modules</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
                    {MODULES.map(({ id, label, emoji, progression, from, to }) => (
                        <div
                            key={id}
                            className="group flex cursor-pointer flex-col justify-between rounded-3xl p-5 text-white shadow-[0_4px_16px_rgba(109,91,168,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_30px_rgba(109,91,168,0.3)]"
                            style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
                        >
                            <div>
                                <span className="inline-block text-5xl leading-none drop-shadow-md transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6" aria-hidden>
                                    {emoji}
                                </span>
                                <div className="mt-3 text-sm font-bold leading-tight">{label}</div>
                            </div>
                            <div className="mt-6">
                                <div className="text-2xl font-extrabold">{progression}%</div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/30">
                                    <div className="h-full rounded-full bg-white" style={{ width: `${progression}%` }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── 3 panneaux : résultats / badges / activité ─── */}
            <section className="mt-8 mb-4 grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Mes derniers résultats */}
                <div id="resultats" className="rounded-2xl border border-violet-200 bg-white p-5 shadow-xs scroll-mt-6">
                    <div className="mb-3.5 text-[15px] font-bold text-violet-950">Mes derniers résultats</div>
                    {RESULTATS.map(({ id, emoji, titre, date, score, parfait }, i) => (
                        <div key={id} className="group -mx-2 flex items-center gap-3 rounded-xl border-b border-violet-100 px-2 py-2.5 transition-colors last:border-0 hover:bg-violet-50">
                            <EmojiBadge emoji={emoji} tone={TONE_CYCLE[i % TONE_CYCLE.length]} size="sm" />
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-[13px] font-semibold text-violet-900">{titre}</div>
                                <div className="text-[11px] text-violet-500">{date}</div>
                            </div>
                            <div className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${parfait ? "bg-emerald-50 text-emerald-600" : "bg-violet-50 text-violet-600"}`}>
                                {score}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mes badges */}
                <div className="rounded-2xl border border-violet-200 bg-white p-5 shadow-xs">
                    <div className="mb-3.5 text-[15px] font-bold text-violet-950">Mes badges</div>
                    <div className="grid grid-cols-2 gap-3">
                        {BADGES.slice(0, 4).map(({ label, emoji, desc, obtenu }) => (
                            <div
                                key={label}
                                title={desc}
                                className={`group flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm ${obtenu ? "border-violet-200 bg-violet-50" : "border-slate-100 bg-slate-50 opacity-50 grayscale"}`}
                            >
                                <span className="text-3xl leading-none transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6" aria-hidden>{emoji}</span>
                                <span className={`text-[11px] font-semibold ${obtenu ? "text-violet-900" : "text-slate-400"}`}>{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Bandeau dernier badge débloqué */}
                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xl leading-none" aria-hidden>
                            {DERNIER_BADGE.emoji}
                        </span>
                        <div className="min-w-0">
                            <div className="text-[12px] font-bold text-amber-700">Badge : {DERNIER_BADGE.label}</div>
                            <div className="truncate text-[11px] text-amber-600/80">{DERNIER_BADGE.desc}</div>
                        </div>
                    </div>
                </div>

                {/* Activité récente */}
                <div id="progres" className="rounded-2xl border border-violet-200 bg-white p-5 shadow-xs scroll-mt-6">
                    <div className="mb-3.5 flex items-center gap-1.5 text-[15px] font-bold text-violet-950">
                        <span aria-hidden>📊</span> Activité récente
                    </div>
                    {ACTIVITE.map(({ id, emoji, titre, module, date, score, parfait }) => (
                        <div key={id} className="group -mx-2 flex items-center gap-3 rounded-xl border-b border-violet-100 px-2 py-2.5 transition-colors last:border-0 hover:bg-violet-50">
                            <EmojiBadge emoji={emoji} tone={parfait ? "amber" : "violet"} size="sm" />
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-[13px] font-semibold text-violet-900">{titre}</div>
                                <div className="truncate text-[11px] text-violet-500">{module} • {date}</div>
                            </div>
                            <div className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${parfait ? "bg-emerald-50 text-emerald-600" : "bg-violet-50 text-violet-600"}`}>
                                {score}
                            </div>
                        </div>
                    ))}
                </div>

            </section>
        </div>
    );
}
