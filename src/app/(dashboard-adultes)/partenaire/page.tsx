// * src/app/(dashboard-adultes)/partenaire/page.tsx
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
    Handshake,
    ClipboardList,
    CheckCircle2,
    Clock,
    MessagesSquare,
    CalendarPlus,
    CalendarDays,
    ArrowUpRight,
} from "lucide-react";
import { PARTENAIRE, DEMANDES, STATS } from "@/lib/partenaire-data";
import DemandeCard from "@/components/DemandeCard";

export const metadata = {
    title: "Espace partenaire",
    description: "Suivez vos demandes de réservation d'ateliers et échangez avec l'équipe.",
};

export default function PartenaireDashboard() {
    const STAT_CARDS: { Icon: LucideIcon; valeur: number; label: string; accent: "violet" | "emerald" | "amber" }[] = [
        { Icon: ClipboardList, valeur: STATS.total, label: "Mes demandes", accent: "violet" },
        { Icon: CheckCircle2, valeur: STATS.validees, label: "Validées", accent: "emerald" },
        { Icon: Clock, valeur: STATS.enAttente, label: "En attente", accent: "amber" },
        { Icon: MessagesSquare, valeur: STATS.messages, label: "Messages", accent: "violet" },
    ];

    const ACTIONS: { href: string; Icon: LucideIcon; titre: string; texte: string }[] = [
        { href: "/partenaire/ateliers/ajouter", Icon: CalendarPlus, titre: "Nouvelle demande", texte: "Réserver un atelier" },
        { href: "/partenaire/messagerie", Icon: MessagesSquare, titre: "Messagerie", texte: "Échanger avec l'équipe" },
        { href: "/partenaire/planning", Icon: CalendarDays, titre: "Voir le planning", texte: "Créneaux disponibles" },
    ];

    return (
        <div className="text-violet-900">

            {/* ─── En-tête : salutation + chip organisation ─── */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-violet-200 pb-5">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-violet-950">Bonjour {PARTENAIRE.contact}</h1>
                    <p className="text-sm text-violet-600">{PARTENAIRE.organisation} — {PARTENAIRE.type}.</p>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl border border-violet-200 bg-white py-1.5 pl-1.5 pr-4 shadow-xs">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                        {PARTENAIRE.initiales}
                    </div>
                    <div className="leading-tight">
                        <div className="text-[13px] font-bold text-violet-950">{PARTENAIRE.organisation}</div>
                        <div className="text-[11px] text-violet-500">Compte partenaire</div>
                    </div>
                </div>
            </div>

            {/* ─── Bandeau d'accueil ─── */}
            <section className="relative mt-6 overflow-hidden rounded-[20px] bg-gradient-to-br from-violet-500 to-purple-600 p-7 text-white">
                <div className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full bg-white/[0.07]" aria-hidden />
                <div className="pointer-events-none absolute right-32 -bottom-20 h-36 w-36 rounded-full bg-white/5" aria-hidden />
                <h2 className="relative mb-1 flex items-center gap-2 text-[26px] font-bold">
                    <Handshake className="h-7 w-7" aria-hidden /> Espace partenaire
                </h2>
                <p className="relative max-w-2xl text-sm opacity-90">
                    Depuis cet espace, vous pouvez faire une demande de réservation d&apos;atelier pour vos bénéficiaires,
                    échanger avec l&apos;équipe et suivre vos collaborations.
                </p>
            </section>

            {/* ─── Statistiques ─── */}
            <section className="mt-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {STAT_CARDS.map(({ Icon, valeur, label, accent }) => (
                        <div key={label} className="flex items-center gap-4 rounded-2xl border border-violet-200 bg-white p-6 shadow-xs">
                            <div className={`rounded-xl p-3 ${
                                accent === "emerald" ? "bg-emerald-50 text-emerald-600"
                                : accent === "amber" ? "bg-amber-50 text-amber-600"
                                : "bg-violet-50 text-violet-600"
                            }`}>
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
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

            {/* ─── Mes dernières demandes ─── */}
            <section className="mt-8 mb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight text-violet-800">Mes dernières demandes</h3>
                    <Link
                        href="/partenaire/ateliers"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 transition-colors hover:text-violet-800"
                    >
                        Tout voir <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </Link>
                </div>
                <div className="mt-4 grid gap-4">
                    {DEMANDES.map((demande) => (
                        <DemandeCard key={demande.id} demande={demande} />
                    ))}
                </div>
            </section>
        </div>
    );
}
