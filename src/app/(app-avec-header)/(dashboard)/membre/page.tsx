// * src/app/(app-avec-header)/(dashboard)/membre/page.tsx
import Link from "next/link";

export const metadata = {
    title: "Mon compte parent",
    description: "Suivez la progression de vos enfants et gérez leur compte.",
};

// ─── Données simulées (visuel uniquement — pas de base de données) ───
const PARENT = { prenom: "Sophie", nom: "Martin" };

const STATS = [
    { icon: "👨‍👩", valeur: "2", label: "Enfants suivis", sub: "profils actifs", bg: "bg-[#f4f1fb]", couleur: "text-[#6d5ba8]" },
    { icon: "📈", valeur: "37%", label: "Progression moyenne", sub: "tous enfants confondus", bg: "bg-[#f0fff4]", couleur: "text-[#00b894]" },
    { icon: "📝", valeur: "9", label: "Activités réalisées", sub: "depuis le début", bg: "bg-[#e8f4ff]", couleur: "text-[#2196F3]" },
    { icon: "🏆", valeur: "6", label: "Badges obtenus", sub: "total famille", bg: "bg-[#fff8e8]", couleur: "text-[#d68910]" },
];

// Détail par enfant : "difficulte" = null si tout va bien, sinon liste de modules.
const ENFANTS = [
    {
        prenom: "Léa", nom: "Martin", age: 9, username: "lea_martin", avatar: "🦊",
        progression: 73, modulePref: { icon: "📖", label: "Lecture & compréhension" },
        temps: "1h12", derniere: "22/05/2026", serie: 0, quizReussis: 5, quizTotal: 7,
        difficulte: null as string[] | null,
        // Carte récap "Mes enfants"
        activites: 6, badges: 4,
    },
    {
        prenom: "Adam", nom: "Martin", age: 7, username: "adam_martin", avatar: "🧒",
        progression: 48, modulePref: { icon: "🔢", label: "Logique & calcul" },
        temps: "42 min", derniere: "19/05/2026", serie: 0, quizReussis: 2, quizTotal: 4,
        difficulte: ["Lecture & compréhension"],
        activites: 3, badges: 2,
    },
];

// Activité récente simulée.
const ACTIVITES = [
    { enfant: "Léa", icon: "📖", action: "a terminé le quiz", module: "Lecture & compréhension", date: "Hier", score: "8/8", parfait: true },
    { enfant: "Adam", icon: "🔢", action: "a fait l'exercice", module: "Logique & calcul", date: "Il y a 2 jours", score: "5/7", parfait: false },
    { enfant: "Léa", icon: "🎨", action: "a fait l'exercice", module: "Arts créatifs", date: "Il y a 3 jours", score: "6/6", parfait: true },
];

// Conseils & astuces.
const CONSEILS = [
    { icon: "📖", bg: "bg-[#f0fff4]", titre: "Encourager la lecture quotidienne", desc: "10 minutes de lecture par jour développent grandement le vocabulaire." },
    { icon: "🌙", bg: "bg-[#fff8e8]", titre: "Routine du soir sereine", desc: "Limiter les écrans 1h avant le coucher pour mieux dormir." },
    { icon: "🧠", bg: "bg-[#fff0fa]", titre: "Concentration & écrans", desc: "Aider votre enfant à se concentrer en alternant écran et papier." },
];

// Style réutilisé pour les petits boutons de carte enfant.
const BTN = "rounded-lg border border-[#d4cef0] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#6d5ba8] transition-colors hover:bg-[#f4f1fb]";

export default function MembreDashboard() {
    return (
        <div className="space-y-7">

            {/* ─── Barre du haut : titre + chip utilisateur ─── */}
            <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                    <h1 className="text-[26px] font-bold text-[#2c2c3a]">Mon compte parent</h1>
                    <p className="text-[13px] text-slate-500">Suivez la progression de vos enfants et gérez leur compte.</p>
                </div>
                <div className="flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 shadow-[0_2px_12px_rgba(109,91,168,0.07)]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#9b8cff] to-[#6d5ba8] text-sm font-bold text-white">
                        {PARENT.prenom[0]}{PARENT.nom[0]}
                    </div>
                    <div className="leading-tight">
                        <div className="text-[13px] font-bold text-slate-800">{PARENT.prenom} {PARENT.nom}</div>
                        <div className="text-[11px] text-slate-500">Compte parent</div>
                    </div>
                </div>
            </div>

            {/* ─── Bandeau de bienvenue ─── */}
            <section className="relative flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#6d5ba8] to-[#9b8cff] p-7 text-white">
                <div className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full bg-white/[0.07]" aria-hidden />
                <div className="pointer-events-none absolute right-32 -bottom-20 h-36 w-36 rounded-full bg-white/5" aria-hidden />
                <div className="relative flex-1">
                    <h2 className="mb-1 text-[26px] font-bold">Bonjour {PARENT.prenom} ! 👋</h2>
                    <p className="text-sm opacity-90">Suivez les progrès de vos enfants et accompagnez-les dans leurs apprentissages.</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold">
                        🏅 6 badges remportés en famille
                    </div>
                </div>
                <div className="relative z-10 min-w-[220px] rounded-2xl bg-white/15 p-4 backdrop-blur">
                    <div className="mb-2 text-[11px] font-medium opacity-90">Progression moyenne</div>
                    <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/25">
                            <div className="h-full rounded-full bg-white" style={{ width: "37%" }} />
                        </div>
                        <div className="text-lg font-extrabold">37%</div>
                    </div>
                </div>
            </section>

            {/* ─── Statistiques globales ─── */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {STATS.map(({ icon, valeur, label, sub, bg, couleur }) => (
                    <div key={label} className="flex items-center gap-3.5 rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(109,91,168,0.05)]">
                        <div className={`flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-xl text-[22px] ${bg} ${couleur}`}>
                            {icon}
                        </div>
                        <div className="min-w-0">
                            <div className="text-2xl font-extrabold leading-none text-[#2c2c3a]">{valeur}</div>
                            <div className="mt-1 text-xs text-slate-500">{label}</div>
                            <div className="mt-0.5 text-[10.5px] text-slate-400">{sub}</div>
                        </div>
                    </div>
                ))}
            </section>

            {/* ─── Progression détaillée par enfant ─── */}
            <section id="progression-detail" className="space-y-3.5 scroll-mt-20">
                <h3 className="text-lg font-bold text-[#2c2c3a]">📊 Progression détaillée</h3>
                <div className="grid gap-4">
                    {ENFANTS.map((c) => (
                        <div key={c.username} className="rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgba(109,91,168,0.06)]">

                            {/* En-tête enfant */}
                            <div className="mb-4 flex items-center gap-3.5 border-b border-[#f0ecf8] pb-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9b8cff] to-[#6d5ba8] text-xl text-white">
                                    {c.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="text-[15px] font-bold text-slate-800">{c.prenom} {c.nom}</div>
                                    <div className="text-xs text-slate-500">{c.age} ans · @{c.username}</div>
                                </div>
                                <Link href="/membre/enfants" className={BTN}>Voir le profil complet →</Link>
                            </div>

                            {/* Métriques */}
                            <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-xl bg-[#faf8ff] p-3.5">
                                    <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9b8cff]">📈 Progression globale</div>
                                    <div className="text-2xl font-extrabold text-[#6d5ba8]">{c.progression}%</div>
                                    <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-[#e8e2f8]">
                                        <div className="h-full rounded-full bg-gradient-to-r from-[#9b8cff] to-[#6d5ba8]" style={{ width: `${c.progression}%` }} />
                                    </div>
                                </div>

                                <div className="rounded-xl bg-[#faf8ff] p-3.5">
                                    <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9b8cff]">⭐ Module préféré</div>
                                    <div className="flex items-center gap-2 text-[15px] font-bold text-slate-800">
                                        <span className="text-[22px]">{c.modulePref.icon}</span>
                                        <span>{c.modulePref.label}</span>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-[#faf8ff] p-3.5">
                                    <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9b8cff]">⏱️ Temps passé</div>
                                    <div className="text-xl font-extrabold text-slate-800">{c.temps}</div>
                                    <div className="mt-0.5 text-[11px] text-slate-500">estimé sur les activités</div>
                                </div>

                                <div className="rounded-xl bg-[#faf8ff] p-3.5">
                                    <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9b8cff]">📅 Dernière activité</div>
                                    <div className="text-[15px] font-bold text-slate-800">{c.derniere}</div>
                                </div>

                                <div className="rounded-xl bg-[#fff8e8] p-3.5">
                                    <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#d68910]">🔥 Série actuelle</div>
                                    <div className="text-2xl font-extrabold text-[#d68910]">
                                        {c.serie} <span className="text-[13px] font-semibold">jour{c.serie > 1 ? "s" : ""}</span>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-[#f0fff4] p-3.5">
                                    <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00b894]">🎯 Quizz réussis</div>
                                    <div className="text-2xl font-extrabold text-[#00b894]">
                                        {c.quizReussis}<span className="text-sm font-semibold text-slate-500">/{c.quizTotal}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Difficultés / aucune difficulté */}
                            {c.difficulte ? (
                                <div className="rounded-xl border-l-4 border-[#d63031] bg-[#fff3f3] px-4 py-3.5">
                                    <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-[#d63031]">⚠️ Difficultés détectées</div>
                                    <div className="text-[13px] leading-relaxed text-slate-600">
                                        {c.difficulte.map((d) => (
                                            <span key={d} className="mr-1 mt-1 inline-block rounded-full bg-white px-2.5 py-0.5 font-semibold text-[#d63031]">{d}</span>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-[11.5px] text-slate-500">💡 Encouragez {c.prenom} à refaire les leçons et exercices de ces modules.</div>
                                </div>
                            ) : (
                                <div className="rounded-xl border-l-4 border-[#00b894] bg-[#f0fff4] px-4 py-3.5">
                                    <div className="mb-1 text-xs font-bold uppercase tracking-wider text-[#00b894]">✅ Aucune difficulté détectée</div>
                                    <div className="text-[12.5px] text-slate-600">{c.prenom} progresse bien sur l&apos;ensemble des modules. Continuez ainsi !</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── 3 panneaux : Mes enfants / Activité récente / Conseils ─── */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                {/* Mes enfants */}
                <div id="enfants" className="rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(109,91,168,0.05)] scroll-mt-20">
                    <div className="mb-3.5 flex items-center justify-between">
                        <div className="text-[15px] font-bold text-[#2c2c3a]">Mes enfants</div>
                        <Link href="/membre/enfants/ajouter" className="text-[11px] font-semibold text-[#9b8cff] hover:text-[#6d5ba8]">+ Ajouter</Link>
                    </div>

                    {ENFANTS.map((c) => (
                        <div key={c.username} className="mb-3 rounded-xl bg-[#faf8ff] p-3.5">
                            <div className="mb-2.5 flex items-center gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9b8cff] to-[#6d5ba8] text-xl text-white">
                                    {c.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="text-[13px] font-bold text-slate-800">{c.prenom} {c.nom}</div>
                                    <div className="text-[11px] text-slate-500">{c.age} ans • {c.activites} activités • {c.badges} badge(s)</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="min-w-[78px] text-[11px] text-slate-500">Progression</span>
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e8e2f8]">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#9b8cff] to-[#6d5ba8]" style={{ width: `${c.progression}%` }} />
                                </div>
                                <span className="min-w-[36px] text-right text-xs font-bold text-[#2c2c3a]">{c.progression}%</span>
                            </div>
                            <div className="mt-2.5 flex justify-end gap-1.5">
                                <Link href="/membre/enfants" className={BTN}>📊 Profil</Link>
                                <Link href="/membre/enfants" className={BTN}>✏️ Éditer</Link>
                                <button className="rounded-lg border border-[#fab1a0] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#d63031] transition-colors hover:bg-[#fff3f3]">🗑️</button>
                            </div>
                        </div>
                    ))}

                    <Link
                        href="/membre/enfants/ajouter"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#d4cef0] bg-white py-3 text-[13px] font-semibold text-[#6d5ba8] transition-colors hover:border-[#9b8cff] hover:bg-[#f4f1fb]"
                    >
                        + Ajouter un enfant
                    </Link>
                </div>

                {/* Activité récente */}
                <div id="activite" className="rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(109,91,168,0.05)] scroll-mt-20">
                    <div className="mb-3.5 text-[15px] font-bold text-[#2c2c3a]">Activité récente</div>
                    <div>
                        {ACTIVITES.map((a, i) => (
                            <div key={i} className="flex items-center gap-3 border-b border-[#f0ecf8] py-2.5 last:border-0">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#f4f1fb] text-base">{a.icon}</div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-[13px] font-semibold text-slate-700">{a.enfant} {a.action}</div>
                                    <div className="truncate text-[11px] text-slate-500">{a.module} • {a.date}</div>
                                </div>
                                <div className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${a.parfait ? "bg-[#f0fff4] text-[#00b894]" : "bg-[#f4f1fb] text-[#6d5ba8]"}`}>
                                    {a.score}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conseils & astuces */}
                <div id="conseils" className="rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(109,91,168,0.05)] scroll-mt-20">
                    <div className="mb-3.5 text-[15px] font-bold text-[#2c2c3a]">Conseils &amp; astuces</div>
                    <div className="grid gap-2">
                        {CONSEILS.map(({ icon, bg, titre, desc }) => (
                            <div key={titre} className={`rounded-xl p-3.5 ${bg}`}>
                                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-base">{icon}</div>
                                <div className="mb-1 text-xs font-bold text-[#2c2c3a]">{titre}</div>
                                <div className="text-[10.5px] leading-relaxed text-slate-600">{desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </section>
        </div>
    );
}
