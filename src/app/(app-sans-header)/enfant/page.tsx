// * src/app/(app-sans-header)/enfant/page.tsx
import { Target, Award, TrendingUp } from "lucide-react";
import { ENFANT, MODULES, BADGES, DERNIER_BADGE, RESULTATS, ACTIVITE } from "@/lib/enfant-data";

export const metadata = {
    title: "Mon espace",
    description: "Suis ta progression, tes modules et tes badges.",
};

export default function EnfantDashboard() {
    // Nombre de badges débloqués (dérivé des données, cohérent avec la page « Mes badges »).
    const nbBadgesObtenus = BADGES.filter((b) => b.obtenu).length;

    return (
        <div className="text-violet-900">

            {/* ─── Barre du haut : titre + chip enfant ─── */}
            <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                    <h1 className="text-[26px] font-bold tracking-tight text-violet-950">Bonjour {ENFANT.prenom} !</h1>
                    <p className="text-[13px] text-violet-600">Tu as {ENFANT.age} ans — continue comme ça, tu fais des progrès incroyables !</p>
                </div>
                <div className="flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 shadow-[0_2px_12px_rgba(109,91,168,0.07)]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                        {ENFANT.initiales}
                    </div>
                    <div className="leading-tight">
                        <div className="text-[13px] font-bold text-violet-950">{ENFANT.prenom} {ENFANT.nom}</div>
                        <div className="text-[11px] text-violet-500">{ENFANT.age} ans</div>
                    </div>
                </div>
            </div>

            {/* ─── Mission du jour ─── */}
            <section className="relative mt-6 flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[20px] bg-gradient-to-br from-violet-500 to-purple-600 p-7 text-white">
                <div className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full bg-white/[0.07]" aria-hidden />
                <div className="pointer-events-none absolute right-32 -bottom-20 h-36 w-36 rounded-full bg-white/5" aria-hidden />
                <div className="relative flex-1">
                    <h2 className="mb-1 flex items-center gap-2 text-[26px] font-bold">
                        <Target className="h-6 w-6" aria-hidden /> Mission du jour
                    </h2>
                    <p className="text-sm opacity-90">Termine une activité dans un module et continue à progresser !</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold">
                        <Award className="h-4 w-4" aria-hidden /> {nbBadgesObtenus} badge{nbBadgesObtenus > 1 ? "s" : ""} obtenu{nbBadgesObtenus > 1 ? "s" : ""}
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
            </section>

            {/* ─── Mes modules ─── */}
            <section id="modules" className="mt-8 scroll-mt-6">
                <h3 className="text-lg font-semibold tracking-tight text-violet-800">Mes modules</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
                    {MODULES.map(({ id, label, Icon, progression, from, to }) => (
                        <div
                            key={id}
                            className="flex flex-col justify-between rounded-2xl p-5 text-white shadow-[0_4px_16px_rgba(109,91,168,0.12)]"
                            style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
                        >
                            <div>
                                <Icon className="h-7 w-7" aria-hidden />
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
                    {RESULTATS.map(({ id, Icon, titre, date, score, parfait }) => (
                        <div key={id} className="flex items-center gap-3 border-b border-violet-100 py-2.5 last:border-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                                <Icon className="h-[18px] w-[18px]" aria-hidden />
                            </div>
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
                        {BADGES.slice(0, 4).map(({ label, Icon, desc, obtenu }) => (
                            <div
                                key={label}
                                title={desc}
                                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center ${obtenu ? "border-violet-200 bg-violet-50" : "border-slate-100 bg-slate-50 opacity-60"}`}
                            >
                                <Icon className={`h-7 w-7 ${obtenu ? "text-amber-500" : "text-slate-300"}`} aria-hidden />
                                <span className={`text-[11px] font-semibold ${obtenu ? "text-violet-900" : "text-slate-400"}`}>{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Bandeau dernier badge débloqué */}
                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-amber-500">
                            <DERNIER_BADGE.Icon className="h-[18px] w-[18px]" aria-hidden />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[12px] font-bold text-amber-700">Badge : {DERNIER_BADGE.label}</div>
                            <div className="truncate text-[11px] text-amber-600/80">{DERNIER_BADGE.desc}</div>
                        </div>
                    </div>
                </div>

                {/* Activité récente */}
                <div id="progres" className="rounded-2xl border border-violet-200 bg-white p-5 shadow-xs scroll-mt-6">
                    <div className="mb-3.5 flex items-center gap-1.5 text-[15px] font-bold text-violet-950">
                        <TrendingUp className="h-4 w-4 text-violet-600" aria-hidden /> Activité récente
                    </div>
                    {ACTIVITE.map(({ id, Icon, titre, module, date, score, parfait }) => (
                        <div key={id} className="flex items-center gap-3 border-b border-violet-100 py-2.5 last:border-0">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${parfait ? "bg-amber-50 text-amber-500" : "bg-violet-50 text-violet-600"}`}>
                                <Icon className="h-[18px] w-[18px]" aria-hidden />
                            </div>
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
