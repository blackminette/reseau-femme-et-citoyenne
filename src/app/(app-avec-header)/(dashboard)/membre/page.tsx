// * src/app/(app-avec-header)/(dashboard)/membre/page.tsx
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
    Users,
    CalendarCheck,
    CalendarPlus,
    TrendingUp,
    Award,
    Star,
    Clock,
    Calendar,
    Flame,
    Target,
    BookOpen,
    Calculator,
    Palette,
    CheckCircle2,
    AlertTriangle,
    Lightbulb,
    ArrowUpRight,
} from "lucide-react";

export const metadata = {
    title: "Mon espace membre",
    description: "Suivez la progression de vos enfants et gérez vos réservations.",
};

// ─── Données simulées (visuel uniquement — pas de base de données) ───
const STATS: { Icon: LucideIcon; valeur: string; label: string; accent: "violet" | "amber" }[] = [
    { Icon: Users, valeur: "2", label: "Enfants suivis", accent: "violet" },
    { Icon: CalendarCheck, valeur: "3", label: "Réservations", accent: "amber" },
    { Icon: TrendingUp, valeur: "37%", label: "Progression moyenne", accent: "amber" },
    { Icon: Award, valeur: "6", label: "Badges obtenus", accent: "violet" },
];

const ACTIONS: { href: string; Icon: LucideIcon; titre: string; texte: string }[] = [
    { href: "/membre/enfants", Icon: Users, titre: "Mes enfants", texte: "Voir et ajouter" },
    { href: "/membre/reserver", Icon: CalendarPlus, titre: "Réserver un atelier", texte: "Inscrire un enfant" },
    { href: "/membre/reservations", Icon: CalendarCheck, titre: "Mes réservations", texte: "Consulter & gérer" },
];

// Détail par enfant : "difficulte" = null si tout va bien, sinon liste de modules.
const ENFANTS: {
    prenom: string; nom: string; age: number; username: string; initiales: string; couleur: string;
    progression: number; ModuleIcon: LucideIcon; modulePref: string;
    temps: string; derniere: string; serie: number; quizReussis: number; quizTotal: number;
    difficulte: string[] | null;
}[] = [
    {
        prenom: "Lina", nom: "Martin", age: 10, username: "lina_martin", initiales: "L", couleur: "from-indigo-400 to-purple-500",
        progression: 73, ModuleIcon: BookOpen, modulePref: "Lecture & compréhension",
        temps: "1h12", derniere: "22/05/2026", serie: 0, quizReussis: 5, quizTotal: 7, difficulte: null,
    },
    {
        prenom: "Adam", nom: "Martin", age: 7, username: "adam_martin", initiales: "A", couleur: "from-rose-400 to-pink-500",
        progression: 48, ModuleIcon: Calculator, modulePref: "Logique & calcul",
        temps: "42 min", derniere: "19/05/2026", serie: 0, quizReussis: 2, quizTotal: 4, difficulte: ["Lecture & compréhension"],
    },
];

const ACTIVITES: { enfant: string; Icon: LucideIcon; action: string; module: string; date: string; score: string; parfait: boolean }[] = [
    { enfant: "Lina", Icon: BookOpen, action: "a terminé le quiz", module: "Lecture & compréhension", date: "Hier", score: "8/8", parfait: true },
    { enfant: "Adam", Icon: Calculator, action: "a fait l'exercice", module: "Logique & calcul", date: "Il y a 2 jours", score: "5/7", parfait: false },
    { enfant: "Lina", Icon: Palette, action: "a fait l'exercice", module: "Arts créatifs", date: "Il y a 3 jours", score: "6/6", parfait: true },
];

export default function MembreDashboard() {
    return (
        <div className="text-violet-900">

            {/* ─── En-tête ─── */}
            <div className="flex flex-col gap-1 border-b border-violet-200 pb-5">
                <h1 className="text-3xl font-bold tracking-tight text-violet-950">Mon espace membre</h1>
                <p className="text-sm text-violet-600">Suivez la progression de vos enfants et gérez vos réservations.</p>
            </div>

            {/* ─── Vue d'ensemble : statistiques ─── */}
            <section className="mt-8">
                <h3 className="text-lg font-semibold tracking-tight text-violet-800">Vue d&apos;ensemble</h3>
                <div className="mt-4 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {STATS.map(({ Icon, valeur, label, accent }) => (
                        <div key={label} className="flex items-center gap-4 rounded-2xl border border-violet-200 bg-white p-6 shadow-xs">
                            <div className={`rounded-xl p-3 ${accent === "amber" ? "bg-amber-50 text-amber-600" : "bg-violet-50 text-violet-600"}`}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold tracking-tight text-violet-950">{valeur}</span>
                                <p className="text-sm font-medium text-violet-600">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Actions rapides ─── */}
            <section className="mt-8">
                <h3 className="text-lg font-semibold tracking-tight text-violet-800">Actions rapides</h3>
                <div className="mt-4 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {ACTIONS.map(({ href, Icon, titre, texte }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group block rounded-2xl border border-violet-200 bg-white p-6 shadow-xs transition-all duration-200 hover:border-violet-500 hover:shadow-lg hover:shadow-violet-100"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 transition-colors duration-200 group-hover:bg-violet-600 group-hover:text-white">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-violet-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-500" />
                            </div>
                            <h4 className="text-lg font-bold text-violet-950 transition-colors group-hover:text-violet-600">{titre}</h4>
                            <p className="mt-1 text-sm text-violet-600">{texte}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ─── Suivi de mes enfants ─── */}
            <section className="mt-8">
                <h3 className="text-lg font-semibold tracking-tight text-violet-800">Suivi de mes enfants</h3>
                <div className="mt-4 grid max-w-5xl gap-6">
                    {ENFANTS.map((c) => (
                        <div key={c.username} className="rounded-2xl border border-violet-200 bg-white p-6 shadow-xs">

                            {/* En-tête enfant */}
                            <div className="mb-4 flex items-center gap-3.5 border-b border-violet-100 pb-4">
                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${c.couleur} text-base font-bold text-white`}>
                                    {c.initiales}
                                </div>
                                <div className="flex-1">
                                    <div className="text-[15px] font-bold text-violet-950">{c.prenom} {c.nom}</div>
                                    <div className="text-xs text-violet-500">{c.age} ans · @{c.username}</div>
                                </div>
                                <Link
                                    href="/membre/enfants"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-violet-600 transition-colors hover:bg-violet-50"
                                >
                                    Voir le profil <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            {/* Métriques */}
                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-xl bg-violet-50 p-3.5">
                                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-500">
                                        <TrendingUp className="h-3.5 w-3.5" /> Progression globale
                                    </div>
                                    <div className="text-2xl font-extrabold text-violet-700">{c.progression}%</div>
                                    <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-violet-200">
                                        <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600" style={{ width: `${c.progression}%` }} />
                                    </div>
                                </div>

                                <div className="rounded-xl bg-violet-50 p-3.5">
                                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-500">
                                        <Star className="h-3.5 w-3.5" /> Module préféré
                                    </div>
                                    <div className="flex items-center gap-2 text-[15px] font-bold text-violet-950">
                                        <c.ModuleIcon className="h-5 w-5 text-violet-600" />
                                        <span>{c.modulePref}</span>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-violet-50 p-3.5">
                                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-500">
                                        <Clock className="h-3.5 w-3.5" /> Temps passé
                                    </div>
                                    <div className="text-xl font-extrabold text-violet-950">{c.temps}</div>
                                    <div className="mt-0.5 text-[11px] text-violet-500">estimé sur les activités</div>
                                </div>

                                <div className="rounded-xl bg-violet-50 p-3.5">
                                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-500">
                                        <Calendar className="h-3.5 w-3.5" /> Dernière activité
                                    </div>
                                    <div className="text-[15px] font-bold text-violet-950">{c.derniere}</div>
                                </div>

                                <div className="rounded-xl bg-amber-50 p-3.5">
                                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600">
                                        <Flame className="h-3.5 w-3.5" /> Série actuelle
                                    </div>
                                    <div className="text-2xl font-extrabold text-amber-600">
                                        {c.serie} <span className="text-[13px] font-semibold">jour{c.serie > 1 ? "s" : ""}</span>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-emerald-50 p-3.5">
                                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                                        <Target className="h-3.5 w-3.5" /> Quizz réussis
                                    </div>
                                    <div className="text-2xl font-extrabold text-emerald-600">
                                        {c.quizReussis}<span className="text-sm font-semibold text-violet-400">/{c.quizTotal}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Difficultés / aucune difficulté */}
                            {c.difficulte ? (
                                <div className="mt-3.5 rounded-xl border-l-4 border-rose-500 bg-rose-50 px-4 py-3.5">
                                    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
                                        <AlertTriangle className="h-4 w-4" /> Difficultés détectées
                                    </div>
                                    <div className="text-[13px] leading-relaxed text-violet-700">
                                        {c.difficulte.map((d) => (
                                            <span key={d} className="mr-1 mt-1 inline-block rounded-full bg-white px-2.5 py-0.5 font-semibold text-rose-600">{d}</span>
                                        ))}
                                    </div>
                                    <div className="mt-2 flex items-center gap-1.5 text-[11.5px] text-violet-500">
                                        <Lightbulb className="h-3.5 w-3.5" /> Encouragez {c.prenom} à refaire les leçons de ces modules.
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3.5 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3.5">
                                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                                        <CheckCircle2 className="h-4 w-4" /> Aucune difficulté détectée
                                    </div>
                                    <div className="text-[12.5px] text-violet-700">{c.prenom} progresse bien sur l&apos;ensemble des modules. Continuez ainsi !</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Activité récente ─── */}
            <section className="mt-8 mb-4">
                <h3 className="text-lg font-semibold tracking-tight text-violet-800">Activité récente</h3>
                <div className="mt-4 max-w-5xl rounded-2xl border border-violet-200 bg-white p-5 shadow-xs">
                    {ACTIVITES.map((a, i) => (
                        <div key={i} className="flex items-center gap-3 border-b border-violet-100 py-2.5 last:border-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                                <a.Icon className="h-[18px] w-[18px]" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-[13px] font-semibold text-violet-900">{a.enfant} {a.action}</div>
                                <div className="truncate text-[11px] text-violet-500">{a.module} • {a.date}</div>
                            </div>
                            <div className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${a.parfait ? "bg-emerald-50 text-emerald-600" : "bg-violet-50 text-violet-600"}`}>
                                {a.score}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
